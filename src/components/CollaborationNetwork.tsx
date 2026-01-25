import { motion } from 'framer-motion';
import { collaborationNetwork } from '@/data/researchData';
import { Building2, Wallet, GraduationCap } from 'lucide-react';

export default function CollaborationNetwork() {
  const nodeTypeColors = {
    institution: '#3b82f6',
    partner: '#06b6d4',
    funding: '#fbbf24'
  };

  const nodeTypeIcons = {
    institution: Building2,
    partner: GraduationCap,
    funding: Wallet
  };

  // Calculate positions for nodes in a circular layout
  const centerX = 400;
  const centerY = 300;
  const radius = 200;

  const nodePositions = collaborationNetwork.nodes.map((node, index) => {
    if (node.id === 'UDSM') {
      return { ...node, x: centerX, y: centerY };
    }
    const angle = ((index - 1) / (collaborationNetwork.nodes.length - 1)) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  const getNodePosition = (id: string) => {
    return nodePositions.find(n => n.id === id) || { x: centerX, y: centerY };
  };

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-1">
          Research Collaboration Network
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          UDSM's global partnership ecosystem
        </p>

        <div className="relative w-full h-[600px] bg-gradient-to-br from-muted/20 to-transparent rounded-xl overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 800 600">
            {/* Draw edges */}
            {collaborationNetwork.edges.map((edge, index) => {
              const source = getNodePosition(edge.source);
              const target = getNodePosition(edge.target);
              const opacity = edge.weight / 100;
              
              return (
                <motion.line
                  key={`edge-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeOpacity={opacity}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: opacity }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}

            {/* Draw nodes */}
            {nodePositions.map((node, index) => {
              const color = nodeTypeColors[node.type as keyof typeof nodeTypeColors];
              const isCenter = node.id === 'UDSM';
              const nodeSize = isCenter ? 50 : node.size;
              
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                >
                  {/* Glow effect */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeSize + 8}
                    fill={color}
                    opacity={0.2}
                  />
                  {/* Main circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeSize}
                    fill={color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + nodeSize + 20}
                    textAnchor="middle"
                    fill="hsl(215 20% 65%)"
                    fontSize={isCenter ? 14 : 11}
                    fontWeight={isCenter ? 600 : 400}
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    {node.label}
                  </text>
                  {/* Center node icon */}
                  {isCenter && (
                    <text
                      x={node.x}
                      y={node.y + 6}
                      textAnchor="middle"
                      fill="white"
                      fontSize={16}
                      fontWeight={700}
                      fontFamily="Space Grotesk, sans-serif"
                    >
                      UDSM
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex gap-4">
            {Object.entries(nodeTypeColors).map(([type, color]) => {
              const Icon = nodeTypeIcons[type as keyof typeof nodeTypeIcons];
              return (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Partner Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Partner Institutions', count: 48, icon: Building2, color: 'primary' },
          { label: 'Funding Bodies', count: 12, icon: Wallet, color: 'secondary' },
          { label: 'Active Collaborations', count: 156, icon: GraduationCap, color: 'cyan' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-panel p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <div className={`p-3 rounded-xl bg-${stat.color}/20`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
            </div>
            <div>
              <p className="metric-value">{stat.count}</p>
              <p className="metric-label">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Collaborators Table */}
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          Top Research Partners
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Institution</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Type</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Collaborations</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Joint Publications</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground font-medium">Impact Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'University of Cape Town', type: 'University', collabs: 67, pubs: 124, score: 8.9 },
                { name: 'University of Nairobi', type: 'University', collabs: 78, pubs: 156, score: 8.7 },
                { name: 'Oxford University', type: 'University', collabs: 52, pubs: 89, score: 9.2 },
                { name: 'Gates Foundation', type: 'Funding', collabs: 29, pubs: 45, score: 8.5 },
                { name: 'MIT', type: 'University', collabs: 45, pubs: 67, score: 9.0 },
              ].map((partner, index) => (
                <motion.tr
                  key={partner.name}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <td className="py-3 px-4 font-medium text-foreground">{partner.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      partner.type === 'University' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {partner.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{partner.collabs}</td>
                  <td className="py-3 px-4 text-muted-foreground">{partner.pubs}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-emerald">{partner.score}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
