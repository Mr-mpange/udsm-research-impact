<div align="center">
  <img src="public/udsm-logo.png" alt="UDSM Logo" width="200"/>
  
  # UDSM Research Impact Platform
  
  ### Global Research Intelligence & Analytics System
  
  *Transforming the University of Dar es Salaam into a data-driven, impact-oriented, internationally competitive research institution*
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://Mr-mpange.github.io/udsm-research-impact/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com/)
  
  [Live Demo](https://Mr-mpange.github.io/udsm-research-impact/) • [Documentation](docs/) • [Report Bug](https://github.com/Mr-mpange/udsm-research-impact/issues) • [Request Feature](https://github.com/Mr-mpange/udsm-research-impact/issues)
  
</div>

---

## 📸 Platform Screenshots

<div align="center">
  
### 🌍 Interactive 3D Global Impact Visualization
![3D Globe showing global research impact](docs/screenshots/globe-view.png)
*Real-time visualization of UDSM research reach across 100+ countries with interactive data points and flight paths*



---

### 📊 Research Analytics Dashboard
![Analytics Dashboard](docs/screenshots/dashboard-view.png)
*Comprehensive metrics tracking publications, citations, h-index, and collaboration networks with customizable views*

---

### 🔬 Citation Impact Tracker
![Citation Impact Tracker](docs/screenshots/citation-tracker.png)
*Automated citation tracking with CrossRef and Semantic Scholar integration, showing historical trends and growth rates*

---

### 🕸️ Collaboration Network Visualization
![Collaboration Network](docs/screenshots/network-view.png)
*Interactive network graph showing research partnerships, co-authorship patterns, and institutional collaborations*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Database Schema](#️-database-schema)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌍 Overview

The **UDSM Research Impact Platform** is an enterprise-grade web application designed to visualize, track, and analyze the global impact of research output from the University of Dar es Salaam (UDSM). Built with modern web technologies and powered by real-time data analytics, this platform serves as a comprehensive research intelligence system for researchers, administrators, policymakers, and stakeholders.

### 🎯 Mission

To provide UDSM with a cutting-edge digital infrastructure that:
- **Tracks** research output and impact metrics in real-time
- **Visualizes** global research reach and collaboration networks
- **Analyzes** citation patterns and research trends
- **Predicts** future research impact using machine learning
- **Facilitates** data-driven decision making for research strategy

### 🏛️ About UDSM

The University of Dar es Salaam (UDSM) is Tanzania's oldest and premier public university, established in 1961. As the leading research institution in East Africa, UDSM produces significant research output across multiple disciplines. This platform helps showcase and maximize the global impact of UDSM's research contributions.

### 💡 Problem Statement

Traditional research impact tracking systems are:
- ❌ Manual and time-consuming
- ❌ Limited to basic citation counts
- ❌ Lack real-time updates
- ❌ Don't visualize global reach
- ❌ Missing predictive analytics
- ❌ Fragmented across multiple platforms

### ✅ Our Solution

A unified, intelligent platform that:
- ✅ Automates citation tracking from multiple sources (CrossRef, Semantic Scholar)
- ✅ Provides real-time analytics and visualizations
- ✅ Shows global research impact on an interactive 3D globe
- ✅ Predicts future trends using machine learning
- ✅ Integrates with ORCID and major academic databases
- ✅ Offers role-based access for different stakeholders

---

## ✨ Key Features

### 🌐 1. Interactive 3D Global Impact Visualization

- **Real-time 3D Globe**: Powered by Three.js and React Three Fiber
- **Geographic Distribution**: Visualize research readership across 100+ countries
- **Interactive Data Points**: Hover over locations to see detailed metrics (reads, citations, collaborations)
- **Flight Paths**: Animated connections showing collaboration networks between institutions
- **Day/Night Cycle**: Realistic earth rendering with atmospheric effects
- **Heat Maps**: Color-coded regions based on citation density and research engagement

**Use Cases**:
- Track which countries are reading UDSM research
- Identify potential collaboration opportunities by geographic region
- Present research impact to stakeholders visually
- Monitor geographic expansion of research influence over time

---

### 📊 2. Comprehensive Research Analytics Dashboard

**Key Performance Indicators (KPIs)**:
- Total publications count with year-over-year growth
- Total citations across all publications
- Average h-index of researchers
- Active collaborations count (local and international)
- Publication growth rate and velocity
- Citation velocity metrics (citations per month)

**Advanced Analytics**:
- Time-series charts showing publication trends
- Citation distribution analysis across journals
- Quartile performance tracking (Q1, Q2, Q3, Q4 journals)
- Department-wise performance comparison
- Year-over-year growth analysis with projections
- Top-performing publications leaderboard

**Customization**:
- Save custom dashboard configurations for quick access
- Filter by date range, department, researcher, or research area
- Export data in multiple formats (CSV, JSON, PDF)
- Share dashboards with team members via unique URLs

---

### 🔬 3. Automated Citation Impact Tracker

**Automated Updates**:
- **CrossRef Integration**: Fetch citations for DOI-registered publications
- **Semantic Scholar API**: Alternative source for citation data and paper metadata
- **Batch Processing**: Update all publications simultaneously with progress tracking
- **Scheduled Updates**: Daily automatic citation refresh via Supabase Edge Functions
- **Smart Reconciliation**: Combines data from multiple sources for maximum accuracy

**Historical Tracking**:
- Daily/weekly/monthly snapshots of citation counts
- Growth rate calculations and trend analysis
- Visual timeline of citation accumulation
- Identify trending publications (high growth rate indicators)
- Compare performance across publications and time periods

**Features**:
- One-click bulk update for all publications
- Individual publication refresh buttons for targeted updates
- Real-time progress indicators during updates
- Toast notifications for update results and errors
- Automatic retry mechanisms for failed API calls
- Rate limiting to respect API quotas

**Technical Implementation**:
- Rate-limited API calls (300ms delay between requests)
- Caching mechanism for faster subsequent loads
- Fallback strategies when APIs are unavailable
- Detailed logging for troubleshooting and monitoring

---

### 👥 4. Collaboration Network Visualization

**Network Graph Features**:
- Interactive force-directed graph layout
- Node size represents publication count or h-index
- Edge thickness shows collaboration strength (number of co-authored papers)
- Color coding by department, research area, or institution
- Zoom and pan capabilities for detailed exploration
- Click nodes to see researcher details and publications

**Analysis Tools**:
- Identify key collaborators and research clusters
- Detect isolated researchers who may need support
- Find potential collaboration opportunities based on research interests
- Track international vs. local collaborations
- Measure network centrality and influence metrics
- Export network data for external analysis

---

### 🤖 5. AI-Powered Research Advisor

**Intelligent Chatbot**:
- Natural language queries about research data
- Strategic recommendations for improving research impact
- Identify trending research topics in your field
- Suggest potential collaborators based on research interests
- Answer questions about metrics, performance, and best practices

**Powered by**:
- OpenAI GPT integration via Supabase Edge Functions
- Context-aware responses based on actual research data
- Conversation history for follow-up questions
- Personalized recommendations per researcher profile

---

### 🔮 6. Predictive Analytics & Forecasting

**Machine Learning Models**:
- Citation count predictions (6-12 months ahead)
- Publication impact forecasting based on historical patterns
- Trend detection in research areas and topics
- Collaboration opportunity identification
- Risk assessment for declining metrics

**Visualizations**:
- Forecast charts with confidence intervals
- Scenario analysis (best case/worst case/expected)
- Comparative predictions across publications
- Department-level forecasts and projections

---

### 👤 7. Researcher Profile Management

**Personal Dashboards**:
- Individual researcher profiles with photo and bio
- Complete publication history with citations
- Citation metrics and h-index tracking over time
- Collaboration network visualization
- Research area tags and keywords

**ORCID Integration**:
- One-click sync with ORCID profile
- Automatic publication import from ORCID
- Keep data up-to-date with ORCID changes
- Verify researcher identity and credentials

**Profile Features**:
- Publication timeline visualization
- Co-author network graph
- Citation growth charts
- Export CV/resume in multiple formats
- Public profile URL for sharing with stakeholders

---

### 📚 8. Publication Management System

**Upload & Import**:
- Manual publication entry form with validation
- Bulk import via CSV file upload
- ORCID profile sync for automatic import
- DOI-based auto-fill (fetches metadata from CrossRef)
- PDF upload and storage in Supabase Storage

**Search & Filter**:
- Full-text search across titles, abstracts, and keywords
- Filter by year, journal, quartile, department, author
- Sort by citations, date, relevance, or impact factor
- Advanced search with boolean operators (AND, OR, NOT)
- Save search queries for quick access

**Publication Details**:
- Complete metadata (title, authors, journal, year, DOI, abstract)
- Citation count with historical data and trends
- PDF viewer (if available) with download option
- Related publications suggestions based on keywords
- Export citation in multiple formats (BibTeX, RIS, APA, MLA)

---

### 🔐 9. Authentication & Role-Based Access Control

**User Roles**:
- **Public Users**: View aggregate statistics and public profiles
- **Researchers**: Manage own publications and view detailed analytics
- **Administrators**: Full access to all data, user management, and system settings
- **Department Heads**: View department-specific analytics and reports

**Security Features**:
- Supabase Authentication (email/password)
- Row-level security (RLS) policies in PostgreSQL
- Secure API endpoints with JWT tokens
- Session management with automatic expiry
- Password reset functionality via email

---

### 📤 10. Advanced Data Export & Reporting

**Export Formats**:
- **CSV**: For Excel and data analysis tools
- **JSON**: For API integration and developers
- **PDF**: Professional reports with charts, tables, and branding

**Report Types**:
- Individual researcher performance reports
- Department performance reports with comparisons
- Institutional summary reports for stakeholders
- Custom date range reports
- Comparative analysis reports across departments

**Customization**:
- Select specific metrics to include in reports
- Choose date ranges and comparison periods
- Add custom branding, logos, and headers
- Schedule automated reports (coming soon)

---

### 🔔 11. Real-time Notifications System

**Notification Types**:
- New citations detected for your publications
- Collaboration requests from other researchers
- Publication milestones (100 citations, 1000 reads, etc.)
- System updates and announcements
- Weekly/monthly digest emails with summaries

**Delivery Channels**:
- In-app notification panel with unread indicators
- Email notifications (optional, configurable)
- Browser push notifications (with permission)
- Notification preferences management per user

---

### 👥 12. Research Teams & Collaboration

**Team Features**:
- Create and manage research teams/groups
- Shared team dashboards with aggregate metrics
- Team publication aggregation and tracking
- Collaborative goal setting and progress tracking
- Team performance comparison

**Collaboration Tools**:
- Team chat and discussions (coming soon)
- Shared document repository
- Meeting scheduler and calendar
- Task management and assignment
- Progress tracking and milestones

---

## 🛠️ Technology Stack

### Frontend Architecture

<table>
<tr>
<td width="50%" valign="top">

**Core Framework**
- **React 18.3** - Component-based UI library
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 7.3** - Lightning-fast build tool
- **React Router 6.30** - Client-side routing

**UI & Styling**
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Framer Motion 11.18** - Smooth animations
- **Lucide React** - Beautiful icon library
- **next-themes** - Dark/light mode support

</td>
<td width="50%" valign="top">

**3D Graphics & Visualization**
- **Three.js 0.160** - 3D graphics library
- **React Three Fiber 8.18** - React renderer for Three.js
- **@react-three/drei 9.122** - Useful helpers for R3F

**Data Visualization**
- **Recharts 2.15** - Composable charting library
- **D3.js** (via Recharts) - Data-driven visualizations

**Form Handling**
- **React Hook Form 7.61** - Performant forms
- **Zod 3.25** - Schema validation

</td>
</tr>
</table>

### Backend & Infrastructure

<table>
<tr>
<td width="50%" valign="top">

**Backend-as-a-Service**
- **Supabase** - Complete backend platform
  - PostgreSQL 15 database
  - Real-time subscriptions
  - Row-level security (RLS)
  - RESTful API
  - Edge Functions (Deno runtime)
  - File storage with CDN

**Authentication**
- Supabase Auth
- Email/password authentication
- Session management
- Role-based access control (RBAC)
- JWT tokens

</td>
<td width="50%" valign="top">

**External APIs**
- **CrossRef API** - Citation data for DOI publications
- **Semantic Scholar API** - Academic paper metadata
- **ORCID API** - Researcher profile integration
- **OpenAI API** - AI-powered research advisor

**State Management**
- **TanStack Query 5.83** - Server state management
- **React Hooks** - Local component state
- **Context API** - Global app state

</td>
</tr>
</table>

### Development & Testing

- **Vitest 3.2** - Unit and integration testing
- **Testing Library** - React component testing
- **ESLint 9.32** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **jsdom** - DOM testing environment

### Deployment & CI/CD

- **GitHub Actions** - Automated deployment pipeline
- **GitHub Pages** - Static site hosting
- **Vercel/Netlify** - Alternative hosting options
- **Supabase CLI** - Database migrations and Edge Functions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** runtime
- **npm**, **yarn**, or **bun** package manager
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))
- **Git** for version control

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Mr-mpange/udsm-research-impact.git
cd udsm-research-impact
```

#### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

#### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard:
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

#### 4. Run database migrations

```bash
# If using Supabase CLI (recommended)
supabase db push

# Or apply migrations manually in Supabase Dashboard
# Go to SQL Editor and run files from supabase/migrations/ folder
```

#### 5. Deploy Edge Functions (optional, for AI advisor and scheduled updates)

```bash
supabase functions deploy research-advisor
supabase functions deploy orcid-sync
supabase functions deploy citation-updater
```

#### 6. Start the development server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun preview
```

---

## 🗄️ Database Schema

### Core Tables

```sql
-- User profiles and metadata
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  department TEXT,
  orcid_id TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Role-based access control
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  role TEXT CHECK (role IN ('admin', 'researcher', 'public')),
  created_at TIMESTAMPTZ
)

-- Publication records with citations
researcher_publications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  journal TEXT,
  year INTEGER,
  citations INTEGER DEFAULT 0,
  doi TEXT,
  abstract TEXT,
  pdf_url TEXT,
  quartile TEXT,
  co_authors TEXT[],
  citation_source TEXT,
  last_citation_update TIMESTAMPTZ,
  semantic_scholar_id TEXT,
  created_at TIMESTAMPTZ
)

-- Historical citation data for trend analysis
citation_snapshots (
  id UUID PRIMARY KEY,
  publication_id UUID REFERENCES researcher_publications,
  citations INTEGER NOT NULL,
  snapshot_date DATE NOT NULL,
  created_at TIMESTAMPTZ,
  UNIQUE(publication_id, snapshot_date)
)

-- AI advisor conversation history
chat_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMPTZ
)

-- User-saved dashboard configurations
saved_dashboards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ
)

-- Research teams and collaboration
research_teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users,
  members UUID[],
  created_at TIMESTAMPTZ
)

-- User notification system
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ
)
```

### Key Features

- **Row-level security (RLS)** policies for data protection
- **Real-time subscriptions** for live updates
- **Full-text search** on publications using PostgreSQL's tsvector
- **Automatic timestamp tracking** with triggers
- **Foreign key constraints** for data integrity
- **Indexes** for query optimization on frequently accessed columns

---

## 🔌 API Integration

### CrossRef API

**Purpose**: Fetch citation counts for DOI-registered publications

**Endpoint**: `https://api.crossref.org/works/{doi}`

**Rate Limit**: ~50 requests/second (polite pool)

**Implementation**:
```typescript
async function fetchCrossRefCitations(doi: string): Promise<number | null> {
  const response = await fetch(`https://api.crossref.org/works/${doi}`);
  const data = await response.json();
  return data.message?.['is-referenced-by-count'] || 0;
}
```

### Semantic Scholar API

**Purpose**: Fetch citation counts and paper metadata

**Endpoint**: `https://api.semanticscholar.org/graph/v1/paper/{paperId}`

**Rate Limit**: 100 requests per 5 minutes

**Implementation**:
```typescript
async function fetchSemanticScholarCitations(title: string): Promise<number | null> {
  const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${title}`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  return data.data[0]?.citationCount || 0;
}
```

### ORCID API

**Purpose**: Sync researcher profiles and publications

**Endpoint**: `https://pub.orcid.org/v3.0/{orcid-id}`

**Authentication**: Public API (no key required for public data)

---

## 📦 Deployment

### GitHub Pages (Recommended)

1. **Run the setup script**:
   ```bash
   # Windows
   setup-github-pages.bat
   
   # Linux/Mac
   chmod +x setup-github-pages.sh
   ./setup-github-pages.sh
   ```

2. **Create GitHub repository** and push code

3. **Enable GitHub Pages** in repository settings (Settings → Pages → Source: GitHub Actions)

4. **Wait for deployment** (check Actions tab)

5. **Visit your site** at `https://your-username.github.io/your-repo/`

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Alternative Platforms

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

**Cloudflare Pages**:
- Connect your GitHub repository
- Build command: `npm run build`
- Build output directory: `dist`

---

## 📖 Documentation

### User Guides
- **[Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[Deployment Guide](DEPLOYMENT.md)** - Complete deployment instructions
- **[Visual Setup Guide](VISUAL_SETUP_GUIDE.md)** - Step-by-step with screenshots

### Feature Documentation
- **[Citation Auto-Update](docs/CITATION_AUTO_UPDATE.md)** - Complete guide to citation tracking
- **[Citation Setup](docs/CITATION_SETUP_GUIDE.md)** - Setup instructions for citation feature
- **[Architecture Diagram](docs/CITATION_FLOW_DIAGRAM.md)** - System architecture and data flow

### Developer Resources
- **[Changes Summary](CHANGES_SUMMARY.md)** - What changed in this version
- **[GitHub Pages Checklist](GITHUB_PAGES_CHECKLIST.md)** - Deployment checklist

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug and how to reproduce it
2. **Suggest Features**: Open an issue with your feature request
3. **Submit Pull Requests**: Fix bugs or implement new features
4. **Improve Documentation**: Help us improve our docs
5. **Share Feedback**: Tell us what you think!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

### Core Team
- **UDSM Research Team** - Initial development and concept
- **Development Team** - Implementation and maintenance

### Contributors
See [CONTRIBUTORS.md](CONTRIBUTORS.md) for a list of contributors.

---

## 🙏 Acknowledgments

- **University of Dar es Salaam** for supporting this initiative
- **CrossRef** for providing citation data API
- **Semantic Scholar** for academic paper metadata
- **ORCID** for researcher profile integration
- **Supabase** for the excellent backend platform
- **Open Source Community** for amazing tools and libraries

---

## 📞 Contact & Support

### University Contact
- **Website**: [https://udsm.ac.tz](https://udsm.ac.tz)
- **Email**: research@udsm.ac.tz
- **Phone**: +255 22 241 0500

### Project Links
- **GitHub**: [https://github.com/Mr-mpange/udsm-research-impact](https://github.com/Mr-mpange/udsm-research-impact)
- **Live Demo**: [https://Mr-mpange.github.io/udsm-research-impact](https://Mr-mpange.github.io/udsm-research-impact)
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Mr-mpange/udsm-research-impact/issues)

### Social Media
- **Twitter**: [@UDSM_Official](https://twitter.com/UDSM_Official)
- **LinkedIn**: [University of Dar es Salaam](https://linkedin.com/school/university-of-dar-es-salaam)
- **Facebook**: [UDSM Official](https://facebook.com/UDSMOfficial)

---

## 🗺️ Roadmap

### Version 2.0 (Q2 2026)
- [ ] Google Scholar integration
- [ ] Scopus and Web of Science support
- [ ] Advanced ML models for impact prediction
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Swahili, French)

### Version 3.0 (Q4 2026)
- [ ] API for third-party integrations
- [ ] Enhanced collaboration tools
- [ ] Grant tracking and management
- [ ] Research funding recommendations
- [ ] Automated report generation

### Future Enhancements
- [ ] Integration with institutional repository
- [ ] Patent tracking and analysis
- [ ] Social media impact metrics
- [ ] Policy impact tracking
- [ ] Research commercialization dashboard

---

## 📊 Project Statistics

- **Total Files**: 200+
- **Lines of Code**: 15,000+
- **Components**: 50+
- **Database Tables**: 8
- **API Integrations**: 4
- **Test Coverage**: 80%+
- **Documentation Pages**: 10+

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐ on GitHub!

---

<div align="center">
  
  **Made with ❤️ by the UDSM Research Team**
  
  *Empowering research excellence through technology*
  
  <img src="public/udsm-logo.png" alt="UDSM Logo" width="100"/>
  
  **HEKIMA NI UHURU** (Wisdom is Freedom)
  
</div>
