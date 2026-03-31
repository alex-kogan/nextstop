-- Run this in the Supabase SQL editor

-- 1. Create user_stops table
CREATE TABLE IF NOT EXISTS public.user_stops (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stop_id     text NOT NULL,
  stop_name   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, stop_id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_stops ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies — users can only access their own rows
CREATE POLICY "Users can view their own stops"
  ON public.user_stops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stops"
  ON public.user_stops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stops"
  ON public.user_stops FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Index for fast per-user queries
CREATE INDEX IF NOT EXISTS user_stops_user_id_idx ON public.user_stops (user_id);
