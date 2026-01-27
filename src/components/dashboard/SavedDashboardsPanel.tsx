import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Trash2, Save, Clock, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { SavedDashboard, DashboardConfig } from '@/hooks/useSavedDashboards';
import { formatDistanceToNow } from 'date-fns';

interface SavedDashboardsPanelProps {
  dashboards: SavedDashboard[];
  currentConfig: DashboardConfig;
  onLoadDashboard: (config: DashboardConfig) => void;
  onSaveDashboard: (name: string, config: DashboardConfig) => void;
  onDeleteDashboard: (id: string) => void;
  isLoading: boolean;
}

export default function SavedDashboardsPanel({
  dashboards,
  currentConfig,
  onLoadDashboard,
  onSaveDashboard,
  onDeleteDashboard,
  isLoading
}: SavedDashboardsPanelProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const handleSave = () => {
    if (newDashboardName.trim()) {
      onSaveDashboard(newDashboardName.trim(), currentConfig);
      setNewDashboardName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <>
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Saved Views
          </h3>
          <Button
            onClick={() => setShowSaveDialog(true)}
            size="sm"
            className="bg-gradient-to-r from-primary to-cyan hover:opacity-90"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Current
          </Button>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Loading saved dashboards...
              </div>
            ) : dashboards.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No saved dashboards yet. Customize your view and click "Save Current" to save it.
              </div>
            ) : (
              dashboards.map((dashboard) => (
                <motion.div
                  key={dashboard.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onLoadDashboard(dashboard.config)}
                  >
                    <p className="text-sm font-medium text-foreground">
                      {dashboard.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(dashboard.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onLoadDashboard(dashboard.config)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onDeleteDashboard(dashboard.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Dashboard View</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter dashboard name..."
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!newDashboardName.trim()}
              className="bg-gradient-to-r from-primary to-cyan hover:opacity-90"
            >
              Save Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
