
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('shipper', 'driver', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE load_status AS ENUM ('posted', 'driver_assigned', 'in_transit', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE transaction_type AS ENUM ('payment', 'payout', 'platform_fee', 'insurance_fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('bid_received', 'bid_accepted', 'load_assigned', 'message', 'verification_update', 'payment');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  status user_status DEFAULT 'pending',
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles with location and verification data
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  address TEXT,
  license_number TEXT, -- For drivers
  company_name TEXT, -- For shippers
  profile_photo_url TEXT,
  verification_documents JSONB DEFAULT '[]', -- Array of document URLs/metadata
  location GEOGRAPHY(POINT, 4326), -- PostGIS point for lat/lng
  home_base_location GEOGRAPHY(POINT, 4326), -- Driver's preferred area
  search_radius INTEGER DEFAULT 100, -- Miles
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loads table
CREATE TABLE public.loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipper_id UUID REFERENCES public.users(id) NOT NULL,
  origin_address TEXT NOT NULL,
  origin_location GEOGRAPHY(POINT, 4326) NOT NULL,
  destination_address TEXT NOT NULL,
  destination_location GEOGRAPHY(POINT, 4326) NOT NULL,
  pallets INTEGER NOT NULL CHECK (pallets > 0),
  weight TEXT NOT NULL,
  rate DECIMAL(10,2) NOT NULL CHECK (rate > 0),
  urgent BOOLEAN DEFAULT FALSE,
  status load_status DEFAULT 'posted',
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_driver_id UUID REFERENCES public.users(id),
  pickup_time TIMESTAMPTZ,
  delivery_deadline TIMESTAMPTZ,
  tracking_info JSONB DEFAULT '{}',
  documents JSONB DEFAULT '{"contract": null, "bol": null, "pod": null}',
  insurance_opt_in BOOLEAN DEFAULT FALSE,
  insurance_fee DECIMAL(8,2) DEFAULT 0,
  platform_fee DECIMAL(8,2) DEFAULT 0,
  distance_miles INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bids table
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID REFERENCES public.loads(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.users(id),
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  bid_status bid_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(load_id, driver_id) -- One bid per driver per load
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  load_id UUID REFERENCES public.loads(id),
  amount DECIMAL(10,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID REFERENCES public.loads(id),
  shipper_id UUID REFERENCES public.users(id),
  driver_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(load_id, shipper_id, driver_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to check if user is verified
CREATE OR REPLACE FUNCTION public.is_user_verified(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT verification_status = 'approved' AND status = 'active' 
  FROM public.users WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for user_profiles table
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for loads table
CREATE POLICY "Anyone can view posted loads" ON public.loads
  FOR SELECT USING (status = 'posted' OR auth.uid() = shipper_id OR auth.uid() = assigned_driver_id);

CREATE POLICY "Verified shippers can insert loads" ON public.loads
  FOR INSERT WITH CHECK (
    auth.uid() = shipper_id AND 
    public.get_user_role(auth.uid()) = 'shipper' AND 
    public.is_user_verified(auth.uid())
  );

CREATE POLICY "Shippers can update their own loads" ON public.loads
  FOR UPDATE USING (auth.uid() = shipper_id);

CREATE POLICY "Admins can manage all loads" ON public.loads
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for bids table
CREATE POLICY "Users can view bids for their loads/bids" ON public.bids
  FOR SELECT USING (
    auth.uid() = driver_id OR 
    auth.uid() IN (SELECT shipper_id FROM public.loads WHERE id = load_id) OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Verified drivers can place bids" ON public.bids
  FOR INSERT WITH CHECK (
    auth.uid() = driver_id AND 
    public.get_user_role(auth.uid()) = 'driver' AND 
    public.is_user_verified(auth.uid())
  );

CREATE POLICY "Drivers can update their own bids" ON public.bids
  FOR UPDATE USING (auth.uid() = driver_id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for conversations table
CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = shipper_id OR auth.uid() = driver_id);

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = shipper_id OR auth.uid() = driver_id);

-- RLS Policies for messages table
CREATE POLICY "Participants can view messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    auth.uid() IN (
      SELECT shipper_id FROM public.conversations WHERE id = conversation_id
      UNION
      SELECT driver_id FROM public.conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION public.calculate_distance(
  point1 GEOGRAPHY,
  point2 GEOGRAPHY
) RETURNS NUMERIC AS $$
BEGIN
  RETURN ST_Distance(point1, point2) * 0.000621371; -- Convert meters to miles
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find loads within radius
CREATE OR REPLACE FUNCTION public.get_loads_within_radius(
  driver_location GEOGRAPHY,
  radius_miles INTEGER DEFAULT 100
) RETURNS SETOF public.loads AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.loads
  WHERE status = 'posted'
    AND ST_DWithin(origin_location, driver_location, radius_miles * 1609.34); -- Convert miles to meters
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.loads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Set up updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_user_profiles BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_loads BEFORE UPDATE ON public.loads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_bids BEFORE UPDATE ON public.bids FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_transactions BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_updated_at_conversations BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
