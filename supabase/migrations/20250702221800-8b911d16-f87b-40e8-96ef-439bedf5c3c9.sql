-- Insert a test user record for the authenticated user with correct enum value
INSERT INTO users (id, email, name, role, verification_status) 
VALUES (
  'e643919e-4e34-4964-a1a2-90149236c5e2',
  'Abdullahiu99@gmail.com', 
  'Abdullah',
  'shipper',
  'approved'
) ON CONFLICT (id) DO UPDATE SET
  role = 'shipper',
  verification_status = 'approved',
  name = 'Abdullah';