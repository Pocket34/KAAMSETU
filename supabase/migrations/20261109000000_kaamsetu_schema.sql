-- ====================================================================
-- KAAMSETU MASTER DATABASE SCHEMA
-- "Talent deserves an opportunity"
-- PostgreSQL Migration with Row Level Security (RLS) and Constraints
-- ====================================================================

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    profile_photo_url TEXT,
    location_city TEXT,
    location_state TEXT,
    location_pincode TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'hi' CHECK (preferred_language IN ('hi', 'en', 'hinglish')),
    education_level TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    employment_preferences TEXT[] DEFAULT '{}',
    profile_visibility BOOLEAN DEFAULT TRUE,
    phone_consent BOOLEAN DEFAULT FALSE,
    phone_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone when visibility is true"
    ON public.profiles FOR SELECT
    USING (profile_visibility = TRUE);

CREATE POLICY "Users can view and update their own full profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- 2. VERIFIED COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    official_website TEXT NOT NULL,
    careers_page_url TEXT NOT NULL,
    public_recruitment_contact TEXT,
    location TEXT NOT NULL,
    industry TEXT NOT NULL,
    source_url TEXT NOT NULL,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'officially_sourced', 'unverified'))
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by all users" ON public.companies FOR SELECT USING (true);

-- 3. VERIFIED JOB LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    employer_name TEXT NOT NULL,
    title TEXT NOT NULL,
    sector TEXT NOT NULL CHECK (sector IN ('government', 'psu', 'private', 'apprenticeship', 'daily_wage', 'artisan')),
    employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'daily_wage', 'apprenticeship', 'remote')),
    location TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    salary_published TEXT, -- Only when published by official source
    description TEXT NOT NULL,
    application_deadline DATE NOT NULL,
    official_application_url TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    date_checked DATE NOT NULL DEFAULT CURRENT_DATE,
    verification_status TEXT NOT NULL DEFAULT 'not_verified' 
        CHECK (verification_status IN ('verified', 'officially_sourced', 'employer_submitted', 'not_verified', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.job_listings(location);
CREATE INDEX IF NOT EXISTS idx_jobs_sector ON public.job_listings(sector);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.job_listings(verification_status);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs are viewable by all users" ON public.job_listings FOR SELECT USING (true);

-- 4. DIGITAL STOREFRONTS (BUSINESS HUB)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    service_area TEXT NOT NULL,
    description TEXT NOT NULL,
    contact_consent BOOLEAN DEFAULT FALSE,
    public_phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Businesses are viewable by everyone" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Owners can manage their businesses" ON public.businesses FOR ALL USING (auth.uid() = owner_id);

-- 5. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_contact TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Business owners can view their received enquiries"
    ON public.enquiries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses b
            WHERE b.id = enquiries.business_id AND b.owner_id = auth.uid()
        )
    );
CREATE POLICY "Any user can submit an enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);

-- 6. HINDSIGHT LONG-TERM MEMORY TABLE
CREATE TABLE IF NOT EXISTS public.hindsight_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('skill', 'preference', 'application', 'outcome', 'feedback', 'business_idea')),
    memory_key TEXT NOT NULL,
    memory_value TEXT NOT NULL,
    confidence NUMERIC(3, 2) DEFAULT 0.90,
    consent_granted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.hindsight_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users have complete private control over their Hindsight memories"
    ON public.hindsight_memories FOR ALL
    USING (auth.uid() = user_id);

-- 7. AUDIT LOGS FOR VERIFICATION
CREATE TABLE IF NOT EXISTS public.verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_table TEXT NOT NULL,
    target_id UUID NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    verified_by UUID REFERENCES auth.users(id),
    verification_notes TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);
