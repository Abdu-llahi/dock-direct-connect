-- Create beta waitlist table
CREATE TABLE public.beta_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for beta waitlist
CREATE POLICY "Anyone can join beta waitlist" 
ON public.beta_waitlist 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view beta waitlist" 
ON public.beta_waitlist 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add index for email lookups
CREATE INDEX idx_beta_waitlist_email ON public.beta_waitlist(email);
CREATE INDEX idx_beta_waitlist_submitted_at ON public.beta_waitlist(submitted_at DESC);