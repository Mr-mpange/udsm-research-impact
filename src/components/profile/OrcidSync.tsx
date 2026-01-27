import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Link2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface OrcidSyncProps {
  currentOrcidId: string | null;
  onSyncComplete: () => void;
}

export default function OrcidSync({ currentOrcidId, onSyncComplete }: OrcidSyncProps) {
  const [orcidId, setOrcidId] = useState(currentOrcidId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    imported: number;
    skipped: number;
    message: string;
  } | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSync = async () => {
    if (!orcidId.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your ORCID ID'
      });
      return;
    }

    setIsLoading(true);
    setSyncResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/orcid-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ orcid_id: orcidId.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync ORCID');
      }

      setSyncResult({
        success: true,
        imported: data.imported,
        skipped: data.skipped,
        message: data.message
      });

      toast({
        title: 'Sync Complete',
        description: data.message
      });

      onSyncComplete();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setSyncResult({
        success: false,
        imported: 0,
        skipped: 0,
        message
      });
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
          <Link2 className="w-5 h-5 text-emerald" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            ORCID Integration
          </h3>
          <p className="text-xs text-muted-foreground">
            Import your publications automatically from ORCID
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="0000-0000-0000-0000"
            value={orcidId}
            onChange={(e) => setOrcidId(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSync}
            disabled={isLoading || !orcidId.trim()}
            className="bg-gradient-to-r from-emerald to-cyan hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Enter your ORCID iD (e.g., 0000-0002-1825-0097) or full URL
        </p>

        {syncResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              syncResult.success ? 'bg-emerald/10 border border-emerald/30' : 'bg-destructive/10 border border-destructive/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {syncResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${syncResult.success ? 'text-emerald' : 'text-destructive'}`}>
                  {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {syncResult.message}
                </p>
                {syncResult.success && (
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-emerald">{syncResult.imported} imported</span>
                    <span className="text-muted-foreground">{syncResult.skipped} skipped (duplicates)</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentOrcidId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-emerald" />
            <span>Linked to ORCID: {currentOrcidId}</span>
          </div>
        )}
      </div>
    </div>
  );
}
