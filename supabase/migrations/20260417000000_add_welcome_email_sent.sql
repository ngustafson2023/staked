ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS welcome_email_sent boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pro_email_sent boolean DEFAULT false;
