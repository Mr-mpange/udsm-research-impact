import { motion } from 'framer-motion';
import { Users, MapPin, Building2 } from 'lucide-react';

// Mock collaboration data
const collaborators = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    institution: 'MIT',
    country: 'USA',
    papers: 8,
    flag: '🇺🇸',
  },
  {
    id: '2',
    name: 'Prof. Hans Mueller',
    institution: 'ETH Zurich',
    country: 'Switzerland',
    papers: 6,
    flag: '🇨🇭',
  },
  {
    id: '3',
    name: 'Dr. Aisha Patel',
    institution: 'University of Cape Town',
    country: 'South Africa',
    papers: 12,
    flag: '🇿🇦',
  },
  {
    id: '4',
    name: 'Prof. Kenji Tanaka',
    institution: 'University of Tokyo',
    country: 'Japan',
    papers: 5,
    flag: '🇯🇵',
  },
  {
    id: '5',
    name: 'Dr. Emma Williams',
    institution: 'University of Oxford',
    country: 'UK',
    papers: 9,
    flag: '🇬🇧',
  },
  {
    id: '6',
    name: 'Prof. Jean-Pierre Dubois',
    institution: 'Sorbonne University',
    country: 'France',
    papers: 4,
    flag: '🇫🇷',
  },
];

const countryStats = [
  { country: 'USA', papers: 23, institutions: 5, flag: '🇺🇸' },
  { country: 'UK', papers: 18, institutions: 4, flag: '🇬🇧' },
  { country: 'South Africa', papers: 15, institutions: 3, flag: '🇿🇦' },
  { country: 'Kenya', papers: 12, institutions: 2, flag: '🇰🇪' },
  { country: 'Germany', papers: 10, institutions: 3, flag: '🇩🇪' },
  { country: 'Japan', papers: 8, institutions: 2, flag: '🇯🇵' },
];

export default function CollaborationMap() {
  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Collaboration Network
        </h3>
        
        {/* Simple network visualization */}
        <div className="relative h-64 flex items-center justify-center">
          {/* Center node (researcher) */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-primary-foreground font-bold z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            YOU
          </motion.div>
          
          {/* Connection lines and collaborator nodes */}
          {collaborators.map((collab, index) => {
            const angle = (index / collaborators.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={collab.id}
                className="absolute"
                style={{ 
                  left: `calc(50% + ${x}px - 20px)`,
                  top: `calc(50% + ${y}px - 20px)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Connection line */}
                <svg
                  className="absolute"
                  style={{
                    left: '20px',
                    top: '20px',
                    width: `${Math.abs(x)}px`,
                    height: `${Math.abs(y)}px`,
                    overflow: 'visible',
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2={-x}
                    y2={-y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="4 4"
                  />
                </svg>
                
                {/* Node */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary/30 flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform">
                    {collab.flag}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    <p className="font-medium text-sm">{collab.name}</p>
                    <p className="text-xs text-muted-foreground">{collab.institution}</p>
                    <p className="text-xs text-primary">{collab.papers} papers</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Country Stats */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Collaborations by Country
        </h3>
        <div className="space-y-3">
          {countryStats.map((stat, index) => (
            <motion.div
              key={stat.country}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-2xl">{stat.flag}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{stat.country}</span>
                  <span className="text-xs text-muted-foreground">{stat.papers} papers</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-cyan rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.papers / 23) * 100}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Institution Partners */}
      <div className="glass-panel p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Key Co-Authors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collaborators.slice(0, 4).map((collab, index) => (
            <motion.div
              key={collab.id}
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{collab.flag}</span>
                <div>
                  <p className="font-medium text-sm">{collab.name}</p>
                  <p className="text-xs text-muted-foreground">{collab.institution}</p>
                  <p className="text-xs text-primary mt-1">{collab.papers} joint publications</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
