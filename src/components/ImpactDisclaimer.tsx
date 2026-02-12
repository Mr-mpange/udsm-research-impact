import { Info, TrendingUp, Users, Globe, Award, Eye } from 'lucide-react';
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
            This platform tracks <strong>comprehensive research impact</strong> of UDSM publications 
            through multiple data sources, providing complete evidence of global visibility and influence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Eye className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Direct Readership Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Real-time tracking of views, downloads, and geographic reach. Every paper gets 
                  a public URL that records who's reading your research worldwide.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Citation Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Automatic daily updates from CrossRef and Semantic Scholar APIs. Citations 
                  measure long-term academic impact and influence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-cyan mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Collaboration Networks</p>
                <p className="text-xs text-muted-foreground">
                  Worldwide research partnerships and co-authorship patterns showing UDSM's 
                  global academic connections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-emerald mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Alternative Metrics</p>
                <p className="text-xs text-muted-foreground">
                  Social media mentions, news coverage, and policy citations via Altmetric, 
                  providing broader impact visibility beyond academia.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              <strong>Complete Impact Picture:</strong> From initial readership (views & downloads) 
              to long-term influence (citations & collaborations), this platform provides the most 
              comprehensive tracking of UDSM research impact available. All data is collected 
              automatically and updated in real-time.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
