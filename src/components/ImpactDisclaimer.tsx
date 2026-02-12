import { Info, TrendingUp, Users, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImpactDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 mb-8 border-l-4 border-primary"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/20 text-primary flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            About Research Impact Tracking
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This platform tracks <strong>verifiable academic impact</strong> of UDSM research publications 
            through multiple data sources, providing evidence of global visibility and influence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Citation Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Real-time data from CrossRef and Semantic Scholar APIs. Citations are the gold 
                  standard for measuring academic impact - each citation represents confirmed 
                  engagement with the research.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Collaboration Networks</p>
                <p className="text-xs text-muted-foreground">
                  Worldwide research partnerships and co-authorship patterns showing UDSM's 
                  global academic connections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-cyan mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Alternative Metrics</p>
                <p className="text-xs text-muted-foreground">
                  Social media mentions, news coverage, and policy citations via Altmetric 
                  (when available), providing broader impact visibility.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-4 h-4 text-emerald mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Publication Metrics</p>
                <p className="text-xs text-muted-foreground">
                  H-Index, journal quartiles, and publication trends demonstrating research 
                  quality and productivity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Note on Readership Data:</strong> Direct readership tracking requires access to 
              publisher platforms (Nature, PLOS, Elsevier, etc.) where UDSM papers are hosted. 
              Since we don't control these platforms, we use <strong>citations as a reliable proxy</strong> - 
              every citation confirms that the research was read, understood, and built upon by other scholars.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
