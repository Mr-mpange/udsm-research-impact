-- Create storage bucket for publication PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('publications', 'publications', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload PDFs
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'publications' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to PDFs
CREATE POLICY "Anyone can view publication PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'publications');

-- Allow users to update their own PDFs
CREATE POLICY "Users can update their own PDFs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'publications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own PDFs
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'publications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);