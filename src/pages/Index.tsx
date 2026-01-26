import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Globe3D from '@/components/Globe3D';
import KPIMetrics from '@/components/KPIMetrics';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import CollaborationNetwork from '@/components/CollaborationNetwork';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import AIAdvisor from '@/components/AIAdvisor';
import AuthModal from '@/components/auth/AuthModal';
import ResearcherProfile from '@/components/profile/ResearcherProfile';
import DataExport from '@/components/export/DataExport';
import { countryMetrics } from '@/data/researchData';
import { MapPin, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState('globe');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const totalReads = countryMetrics.reduce((acc, c) => acc + c.reads, 0);
  const totalCitations = countryMetrics.reduce((acc, c) => acc + c.citations, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenExport={() => setShowExport(true)}
      />

      <main className="relative pt-28 pb-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'globe' && (
              <motion.div
                key="globe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hero Section */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                      Global Research{' '}
                      <span className="text-gradient-primary">Intelligence</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      Real-time visualization of UDSM's worldwide research impact, 
                      collaboration networks, and academic influence.
                    </p>
                  </motion.div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Countries Reached', value: countryMetrics.length, icon: MapPin, color: 'primary' },
                    { label: 'Global Reads', value: `${(totalReads / 1000).toFixed(0)}K+`, icon: BookOpen, color: 'cyan' },
                    { label: 'Total Citations', value: `${(totalCitations / 1000).toFixed(0)}K+`, icon: TrendingUp, color: 'secondary' },
                    { label: 'Partner Universities', value: '48', icon: Users, color: 'emerald' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="glass-panel p-4 flex items-center gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                      </div>
                      <div>
                        <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 3D Globe */}
                <motion.div
                  className="glass-panel p-4 mb-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div>
                      <h2 className="font-display font-semibold text-lg text-foreground">
                        Global Impact Map
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Interactive 3D visualization • Hover over points to explore
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Readership</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-muted-foreground">UDSM Hub</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-background to-muted/20">
                    <Globe3D />
                  </div>
                </motion.div>

                {/* Country Leaderboard */}
                <motion.div
                  className="glass-panel p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                    Top Countries by Research Engagement
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryMetrics.slice(0, 6).map((country, index) => (
                      <motion.div
                        key={country.code}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <span className="text-3xl">{country.flag}</span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{country.name}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>{country.reads.toLocaleString()} reads</span>
                            <span>{country.citations.toLocaleString()} citations</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-display font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Research Analytics <span className="text-gradient-gold">Dashboard</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Comprehensive metrics and performance insights
                  </p>
                </div>
                <KPIMetrics />
                <AnalyticsCharts />
              </motion.div>
            )}

            {activeTab === 'network' && (
              <motion.div
                key="network"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Collaboration <span className="text-gradient-primary">Network</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Visualizing UDSM's global research partnerships
                  </p>
                </div>
                <CollaborationNetwork />
              </motion.div>
            )}

            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Predictive <span className="text-gradient-gold">Analytics</span>
                  </h1>
                  <p className="text-muted-foreground">
                    ML-powered forecasts and strategic recommendations
                  </p>
                </div>
                <PredictiveAnalytics />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                <span className="text-white text-xs font-bold">U</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  University of Dar es Salaam
                </p>
                <p className="text-xs text-muted-foreground">
                  Global Research Intelligence Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Transforming UDSM from a data publisher into a data-driven, impact-oriented, 
              internationally competitive research powerhouse.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Advisor */}
      <AIAdvisor />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ResearcherProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <DataExport isOpen={showExport} onClose={() => setShowExport(false)} />
    </div>
  );
}
