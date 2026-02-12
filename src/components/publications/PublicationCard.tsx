import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Edit2, Trash2, Save, X, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { fetchAltmetricData, type AltmetricData } from '@/services/altmetricService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Publication {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  citations: number | null;
  quartile: string | null;
  doi: string | null;
  abstract: string | null;
  pdf_url: string | null;
  keywords: string[] | null;
  co_authors: string[] | null;
}

interface PublicationCardProps {
  publication: Publication;
  index: number;
  onUpdate: () => void;
}

export default function PublicationCard({ publication, index, onUpdate }: PublicationCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    title: publication.title,
    journal: publication.journal || '',
    year: publication.year || new Date().getFullYear(),
    doi: publication.doi || '',
    abstract: publication.abstract || '',
    quartile: publication.quartile || 'Q1',
    keywords: publication.keywords?.join(', ') || '',
    co_authors: publication.co_authors?.join(', ') || '',
  });

  const getQuartileColor = (q: string | null) => {
    switch (q) {
      case 'Q1': return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'Q2': return 'bg-primary/20 text-primary border-primary/30';
      case 'Q3': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    const keywordsArray = editData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const coAuthorsArray = editData.co_authors
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    const { error } = await supabase
      .from('researcher_publications')
      .update({
        title: editData.title,
        journal: editData.journal || null,
        year: editData.year,
        doi: editData.doi || null,
        abstract: editData.abstract || null,
        quartile: editData.quartile || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        co_authors: coAuthorsArray.length > 0 ? coAuthorsArray : null,
      })
      .eq('id', publication.id);

    setIsSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Publication updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Delete PDF from storage if exists
    if (publication.pdf_url) {
      const urlParts = publication.pdf_url.split('/publications/');
      if (urlParts.length > 1) {
        await supabase.storage
          .from('publications')
          .remove([urlParts[1]]);
      }
    }

    const { error } = await supabase
      .from('researcher_publications')
      .delete()
      .eq('id', publication.id);

    setIsDeleting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Publication deleted",
        description: "The publication has been removed.",
      });
      onUpdate();
    }
  };

  if (isEditing) {
    return (
      <motion.div
        className="glass-panel p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-3">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Title"
            className="font-medium"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={editData.journal}
              onChange={(e) => setEditData({ ...editData, journal: e.target.value })}
              placeholder="Journal"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                value={editData.year}
                onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) })}
                placeholder="Year"
                className="w-24"
              />
              <Select
                value={editData.quartile}
                onValueChange={(value) => setEditData({ ...editData, quartile: value })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
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
          <Input
            value={editData.doi}
            onChange={(e) => setEditData({ ...editData, doi: e.target.value })}
            placeholder="DOI"
          />
          <Textarea
            value={editData.abstract}
            onChange={(e) => setEditData({ ...editData, abstract: e.target.value })}
            placeholder="Abstract"
            rows={3}
          />
          <Input
            value={editData.keywords}
            onChange={(e) => setEditData({ ...editData, keywords: e.target.value })}
            placeholder="Keywords (comma-separated)"
          />
          <Input
            value={editData.co_authors}
            onChange={(e) => setEditData({ ...editData, co_authors: e.target.value })}
            placeholder="Co-authors (comma-separated)"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-panel p-4 hover:bg-muted/50 transition-colors group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm line-clamp-2">
            {publication.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {publication.journal || 'Unknown journal'} • {publication.year || 'Year unknown'}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {publication.quartile && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getQuartileColor(publication.quartile)}`}>
                {publication.quartile}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {publication.citations || 0} citations
            </span>
            {publication.doi && (
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                DOI <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {publication.pdf_url && (
              <a
                href={publication.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan hover:underline flex items-center gap-1"
              >
                PDF <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          
          {/* View Paper Button */}
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/paper/${publication.id}`)}
              className="gap-2 w-full sm:w-auto"
            >
              <Eye className="w-4 h-4" />
              View Paper & Statistics
            </Button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Publication?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{publication.title}" and any associated PDF files.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : null}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
