-- Mucore Care Database Schema
-- Version: 1.0.0
-- Description: Initial database schema for patient care management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenancy & profiles
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY,        -- maps to auth.users.id
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner','caregiver','viewer')) NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  national_id TEXT,
  dob DATE,
  sex TEXT CHECK (sex IN ('erkek', 'kadın', 'diğer')),
  diagnoses TEXT,
  allergies TEXT,
  chronic TEXT,
  devices JSONB,
  care_notes TEXT,
  timezone TEXT DEFAULT 'Europe/Istanbul',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (thresholds)
CREATE TABLE settings (
  patient_id UUID PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
  bp_high_sys INTEGER DEFAULT 160,
  bp_high_dia INTEGER DEFAULT 100,
  bp_emergency_sys INTEGER DEFAULT 180,
  bp_emergency_dia INTEGER DEFAULT 110,
  glucose_high INTEGER DEFAULT 250,
  glucose_low INTEGER DEFAULT 70,
  temp_high NUMERIC(4,1) DEFAULT 37.5,
  temp_low NUMERIC(4,1) DEFAULT 35.0,
  pulse_high INTEGER DEFAULT 100,
  pulse_low INTEGER DEFAULT 60,
  spo2_low INTEGER DEFAULT 95,
  med_reminder_ahead_min INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vitals
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  ts_utc TIMESTAMPTZ NOT NULL,
  bp_sys INTEGER,
  bp_dia INTEGER,
  glucose INTEGER,
  temp NUMERIC(4,1),
  pulse INTEGER,
  spo2 INTEGER,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care logs
CREATE TABLE care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  ts_utc TIMESTAMPTZ NOT NULL,
  intake_ml INTEGER,
  urine_count INTEGER,
  stool TEXT CHECK (stool IN ('normal', 'yumuşak', 'sert', 'ishal', 'kabızlık')),
  feeding TEXT,
  wound BOOLEAN DEFAULT FALSE,
  wound_note TEXT,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Neuro logs
CREATE TABLE neuro_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  ts_utc TIMESTAMPTZ NOT NULL,
  consciousness TEXT CHECK (consciousness IN ('uyanık', 'uyuşuk', 'stupor', 'koma')),
  speech TEXT CHECK (speech IN ('normal', 'yavaş', 'anlaşılmaz', 'yok')),
  motor_left TEXT CHECK (motor_left IN ('normal', 'zayıf', 'yok')),
  motor_right TEXT CHECK (motor_right IN ('normal', 'zayıf', 'yok')),
  pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
  pain_note TEXT,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medications
CREATE TABLE meds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT NOT NULL,
  route TEXT CHECK (route IN ('oral', 'iv', 'im', 'subkutan', 'topikal', 'inhalasyon')),
  with_food BOOLEAN DEFAULT FALSE,
  times TEXT[] NOT NULL,
  stock_count INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  note TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planned / actual administrations
CREATE TABLE med_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  med_id UUID REFERENCES meds(id) ON DELETE CASCADE,
  ts_planned_utc TIMESTAMPTZ NOT NULL,
  ts_given_utc TIMESTAMPTZ,
  given BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors & Appointments
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT,
  phone TEXT,
  hospital TEXT,
  address TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  start_utc TIMESTAMPTZ NOT NULL,
  end_utc TIMESTAMPTZ,
  location TEXT,
  note TEXT,
  remind_min INTEGER DEFAULT 120,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'missed')) DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices (push notifications)
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  onesignal_pid TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('web', 'android', 'ios')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, onesignal_pid)
);

-- Indexes for better performance
CREATE INDEX idx_patients_tenant_id ON patients(tenant_id);
CREATE INDEX idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX idx_vitals_ts_utc ON vitals(ts_utc);
CREATE INDEX idx_care_logs_patient_id ON care_logs(patient_id);
CREATE INDEX idx_care_logs_ts_utc ON care_logs(ts_utc);
CREATE INDEX idx_neuro_logs_patient_id ON neuro_logs(patient_id);
CREATE INDEX idx_neuro_logs_ts_utc ON neuro_logs(ts_utc);
CREATE INDEX idx_meds_patient_id ON meds(patient_id);
CREATE INDEX idx_med_logs_patient_id ON med_logs(patient_id);
CREATE INDEX idx_med_logs_ts_planned ON med_logs(ts_planned_utc);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_start_utc ON appointments(start_utc);

-- Row Level Security (RLS) Policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meds ENABLE ROW LEVEL SECURITY;
ALTER TABLE med_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (simplified for MVP)
-- Users can only access data from their tenant

-- Profiles policy
CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Tenants policy  
CREATE POLICY "Users can view own tenant" ON tenants
  FOR ALL USING (id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));

-- Patients policy
CREATE POLICY "Users can view patients from own tenant" ON patients
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));

-- Apply similar policies to other tables
CREATE POLICY "Users can access vitals from own tenant" ON vitals
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access care_logs from own tenant" ON care_logs
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access neuro_logs from own tenant" ON neuro_logs
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access meds from own tenant" ON meds
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access med_logs from own tenant" ON med_logs
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access doctors from own tenant" ON doctors
  FOR ALL USING (tenant_id IN (
    SELECT tenant_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can access appointments from own tenant" ON appointments
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access settings from own tenant" ON settings
  FOR ALL USING (patient_id IN (
    SELECT p.id FROM patients p 
    JOIN profiles pr ON p.tenant_id = pr.tenant_id 
    WHERE pr.id = auth.uid()
  ));

CREATE POLICY "Users can access own devices" ON devices
  FOR ALL USING (user_id = auth.uid());

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meds_updated_at BEFORE UPDATE ON meds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
