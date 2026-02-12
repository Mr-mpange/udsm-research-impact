# UDSM Research Impact Intelligence Platform

> **Mission**: Track and visualize UDSM's global academic footprint through real-time citation tracking, publication metrics, and worldwide collaboration networks.

A comprehensive research impact tracking and analytics platform for the University of Dar es Salaam (UDSM). This platform addresses the challenge of evidencing global visibility and impact of UDSM research publications.

## About Impact Tracking

This platform tracks **comprehensive research impact** through:
- **Direct Readership Tracking**: Real-time views and downloads with geographic data
- **Citation Data**: From CrossRef and Semantic Scholar APIs
- **Publication Metrics**: H-Index, journal quartiles, and publication trends
- **Collaboration Networks**: Worldwide research partnerships
- **Altmetric Scores**: Social media mentions, news coverage, and policy citations

**Complete Tracking**: Every paper gets a public URL that tracks views, downloads, and geographic reach in real-time. Combined with citation data, this provides the most comprehensive picture of research impact.

## Features

### 🌍 Global Impact Visualization
- Interactive 3D globe showing worldwide research reach
- Real-time readership tracking (views, downloads, countries)
- Citation tracking from CrossRef and Semantic Scholar APIs
- Country-level engagement metrics with city-level detail
- Alternative metrics via Altmetric (social media, news, policy citations)

### 📊 Comprehensive Impact Tracking
- **Readership Tracking**: Real-time views, downloads, and geographic distribution
- **Citation Data**: Verifiable academic impact through CrossRef/Semantic Scholar
- **Publication Metrics**: H-Index, journal quartiles, publication trends
- **Collaboration Networks**: Worldwide research partnerships visualization
- **Alternative Metrics**: Social media mentions, news coverage, policy citations
- **AI Predictions**: Future citation trends and emerging research topics

### 📊 Role-Based Dashboards
- **Researcher Dashboard**: Personal metrics, publications, H-Index tracking
- **Moderator Dashboard**: System oversight, content moderation
- **Admin Dashboard**: Full system control, user management, analytics

### 🤖 AI Research Advisor
- Powered by Google Gemini AI
- Real-time research guidance
- Contextual advice based on actual data

### 📈 Analytics & Insights
- H-Index growth tracking
- Citation impact analysis
- Collaboration network visualization
- Predictive analytics for research trends

### 🔐 Authentication & Permissions
- Role-based access control (Admin, Moderator, Researcher, User)
- Secure profile management
- Permission-based settings editing

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: Google Gemini API
- **Charts**: Recharts
- **3D**: Three.js (via react-three-fiber)

## Data Sources & APIs

### Citation Tracking
- **CrossRef API**: Real-time citation counts and metadata for DOI-registered publications
- **Semantic Scholar API**: Academic citation data and paper relationships
- **Auto-update**: Daily citation count updates via Supabase Edge Functions

### Alternative Metrics
- **Altmetric API**: Social media mentions, news coverage, policy citations, and Wikipedia references
- **ORCID Integration**: Researcher profiles and publication verification

### Readership Tracking System

Every paper uploaded to the platform gets a **public URL** that tracks:

1. **Views**: Total views and unique visitors with session tracking
2. **Downloads**: PDF download counts with geographic data
3. **Geographic Reach**: Country and city-level tracking via IP geolocation
4. **Real-Time Statistics**: Live updates on paper pages and dashboards

Combined with citation data from CrossRef/Semantic Scholar and Altmetric scores, this provides **complete, verifiable evidence** of global research impact - from initial readership to long-term academic influence.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd udsm-research-impact
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Set up Supabase:
```bash
npx supabase link --project-ref your_project_ref
npx supabase db push
```

5. Deploy edge functions:
```bash
npx supabase functions deploy research-advisor
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

6. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── chat/           # AI chatbot components
│   ├── citations/      # Citation tracking
│   ├── dashboard/      # Dashboard components
│   ├── export/         # Data export
│   ├── globe/          # 3D globe visualization
│   ├── notifications/  # Notification system
│   ├── profile/        # User profile components
│   ├── publications/   # Publication management
│   ├── teams/          # Research teams
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # Supabase integration
├── pages/              # Page components
├── services/           # Business logic services
└── data/               # Static data

supabase/
├── functions/          # Edge functions
│   ├── research-advisor/  # AI chatbot backend
│   ├── citation-updater/  # Citation tracking
│   └── orcid-sync/        # ORCID integration
└── migrations/         # Database migrations
```

## User Roles

### Researcher
- View personal dashboard
- Track publications and citations
- Edit name, ORCID, biography
- Access AI advisor

### Moderator
- All researcher permissions
- System-wide oversight
- Edit department information
- Content moderation tools

### Admin
- All moderator permissions
- User management
- Edit all profile fields including institution
- Full system control

## Database Schema

### Main Tables
- `profiles` - User profiles and research metrics
- `user_roles` - Role-based access control
- `researcher_publications` - Publication tracking
- `paper_views` - Real-time readership tracking (views)
- `paper_downloads` - Download tracking with geographic data
- `partner_institutions` - Collaboration partners
- `collaboration_partnerships` - Partnership details
- `research_teams` - Team management
- `chat_history` - AI conversation history

## Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel/Netlify
The project is configured for static hosting. Simply connect your repository and deploy.

### Supabase Edge Functions
```bash
npx supabase functions deploy
```

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

Supabase secrets (set via CLI):
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-configured
- `SUPABASE_URL` - Auto-configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: admin-udsm@gmail.com

## Acknowledgments

- University of Dar es Salaam
- Supabase for backend infrastructure
- Google Gemini for AI capabilities
- Lovable.dev for development tools
