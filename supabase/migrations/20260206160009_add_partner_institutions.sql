-- Create partner_institutions table for tracking research partnerships
CREATE TABLE IF NOT EXISTS partner_institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('university', 'research_center', 'funding_body', 'industry', 'government', 'ngo')),
  country TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create collaboration_partnerships table to link institutions with metrics
CREATE TABLE IF NOT EXISTS collaboration_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_institution_id UUID REFERENCES partner_institutions(id) ON DELETE CASCADE,
  collaboration_count INTEGER DEFAULT 0,
  joint_publications INTEGER DEFAULT 0,
  total_funding DECIMAL(15, 2) DEFAULT 0,
  impact_score DECIMAL(4, 2) DEFAULT 0,
  start_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_partner_institutions_type ON partner_institutions(type);
CREATE INDEX IF NOT EXISTS idx_partner_institutions_country ON partner_institutions(country);
CREATE INDEX IF NOT EXISTS idx_collaboration_partnerships_partner ON collaboration_partnerships(partner_institution_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_partnerships_active ON collaboration_partnerships(is_active);

-- Enable RLS
ALTER TABLE partner_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_partnerships ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Everyone can read, only authenticated users can write
CREATE POLICY "Anyone can view partner institutions"
  ON partner_institutions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert partner institutions"
  ON partner_institutions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update partner institutions"
  ON partner_institutions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view collaboration partnerships"
  ON collaboration_partnerships FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert collaboration partnerships"
  ON collaboration_partnerships FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update collaboration partnerships"
  ON collaboration_partnerships FOR UPDATE
  TO authenticated
  USING (true);

-- Insert some sample partner institutions (optional - remove if you want to start empty)
INSERT INTO partner_institutions (name, type, country, description) VALUES
  ('University of Cape Town', 'university', 'South Africa', 'Leading research university in Africa'),
  ('University of Nairobi', 'university', 'Kenya', 'Premier university in East Africa'),
  ('Oxford University', 'university', 'United Kingdom', 'World-renowned research institution'),
  ('MIT', 'university', 'United States', 'Massachusetts Institute of Technology'),
  ('Tsinghua University', 'university', 'China', 'Top engineering and technology university'),
  ('Gates Foundation', 'funding_body', 'United States', 'Global health and development funding'),
  ('World Bank', 'funding_body', 'International', 'International financial institution'),
  ('WHO', 'government', 'International', 'World Health Organization');

-- Insert sample collaboration data for the partners
INSERT INTO collaboration_partnerships (partner_institution_id, collaboration_count, joint_publications, impact_score)
SELECT 
  id,
  FLOOR(RANDOM() * 80 + 20)::INTEGER,
  FLOOR(RANDOM() * 150 + 30)::INTEGER,
  ROUND((RANDOM() * 2 + 7)::NUMERIC, 2)
FROM partner_institutions;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_institutions_updated_at
  BEFORE UPDATE ON partner_institutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaboration_partnerships_updated_at
  BEFORE UPDATE ON collaboration_partnerships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
