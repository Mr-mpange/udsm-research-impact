import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Loader2, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PublicationFormData {
  title: string;
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  quartile: string;
  keywords: string;
  co_authors: string;
  pdf_url: string;
}

interface PublicationUploadProps {
  onSuccess?: () => void;
}

export default function PublicationUpload({ onSuccess }: PublicationUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PublicationFormData>({
    title: '',
    journal: '',
    year: new Date().getFullYear(),
    doi: '',
    abstract: '',
    quartile: 'Q1',
    keywords: '',
    co_authors: '',
    pdf_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to upload publications.",
      });
      return;
    }

    if (!formData.title || !formData.journal) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Title and journal are required.",
      });
      return;
    }

    setIsSubmitting(true);

    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const coAuthorsArray = formData.co_authors
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    const { error } = await supabase
      .from('researcher_publications')
      .insert({
        user_id: user.id,
        title: formData.title,
        journal: formData.journal,
        year: formData.year,
        doi: formData.doi || null,
        abstract: formData.abstract || null,
        quartile: formData.quartile || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        co_authors: coAuthorsArray.length > 0 ? coAuthorsArray : null,
        pdf_url: formData.pdf_url || null,
        citations: 0,
      });

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Publication added",
        description: "Your publication has been successfully uploaded.",
      });
      setFormData({
        title: '',
        journal: '',
        year: new Date().getFullYear(),
        doi: '',
        abstract: '',
        quartile: 'Q1',
        keywords: '',
        co_authors: '',
        pdf_url: '',
      });
      setIsOpen(false);
      onSuccess?.();
    }
  };

  const handleInputChange = (field: keyof PublicationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Publication
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Add New Publication
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Publication title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="journal">Journal *</Label>
            <Input
              id="journal"
              placeholder="Journal name"
              value={formData.journal}
              onChange={(e) => handleInputChange('journal', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="quartile">Quartile</Label>
              <Select
                value={formData.quartile}
                onValueChange={(value) => handleInputChange('quartile', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quartile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Q1</SelectItem>
                  <SelectItem value="Q2">Q2</SelectItem>
                  <SelectItem value="Q3">Q3</SelectItem>
                  <SelectItem value="Q4">Q4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              placeholder="10.1000/example"
              value={formData.doi}
              onChange={(e) => handleInputChange('doi', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="pdf_url">PDF URL</Label>
            <Input
              id="pdf_url"
              placeholder="https://..."
              value={formData.pdf_url}
              onChange={(e) => handleInputChange('pdf_url', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              placeholder="Publication abstract..."
              rows={4}
              value={formData.abstract}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="climate, machine learning, data science"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="co_authors">Co-Authors (comma-separated)</Label>
            <Input
              id="co_authors"
              placeholder="Dr. Jane Smith, Prof. John Doe"
              value={formData.co_authors}
              onChange={(e) => handleInputChange('co_authors', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload Publication
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
