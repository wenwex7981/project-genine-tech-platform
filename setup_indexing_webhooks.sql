-- Enable the pg_net extension for asynchronous HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.ping_google_indexing_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_url text := 'https://www.graduatenex.online/api/admin/ping-indexing';
  page_url text;
BEGIN
  -- Determine the URL based on the table that triggered this
  IF TG_TABLE_NAME = 'projects' THEN
    page_url := 'https://www.graduatenex.online/projects/' || NEW.id;
  
  ELSIF TG_TABLE_NAME = 'blogs' OR TG_TABLE_NAME = 'blog' THEN
    -- Assuming blog uses slug. If it only uses ID, change NEW.slug to NEW.id
    page_url := 'https://www.graduatenex.online/blog/' || COALESCE(NEW.slug, NEW.id::text);
  
  ELSIF TG_TABLE_NAME = 'hackathons' THEN
    page_url := 'https://www.graduatenex.online/hackathons/' || NEW.id;
  
  END IF;

  -- If we successfully built a URL, send the asynchronous POST request to our Next.js API
  IF page_url IS NOT NULL THEN
    PERFORM net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'url', page_url,
        'type', 'URL_UPDATED'
      )::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Clean up any existing triggers to avoid duplicates
DROP TRIGGER IF EXISTS on_project_insert_ping_google ON public.projects;
DROP TRIGGER IF EXISTS on_blog_insert_ping_google ON public.blogs;
DROP TRIGGER IF EXISTS on_hackathon_insert_ping_google ON public.hackathons;

-- Attach the trigger to the projects table (Triggers on new projects or edits)
CREATE TRIGGER on_project_insert_ping_google
  AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.ping_google_indexing_webhook();

-- Attach the trigger to the blogs table
CREATE TRIGGER on_blog_insert_ping_google
  AFTER INSERT OR UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.ping_google_indexing_webhook();

-- Attach the trigger to the hackathons table
CREATE TRIGGER on_hackathon_insert_ping_google
  AFTER INSERT OR UPDATE ON public.hackathons
  FOR EACH ROW EXECUTE FUNCTION public.ping_google_indexing_webhook();
