# Real Data Implementation Plan

## Overview
Connect all dashboards to real Supabase data and implement working prediction algorithms.

## Current State

### Available Tables:
1. **profiles** - User profiles with h_index, citations, publications count
2. **researcher_publications** - Publications with citations, DOI, year, journal
3. **citation_snapshots** - Historical citation data for tracking growth
4. **user_roles** - User role assignments (admin, researcher, etc.)
5. **research_teams** - Research team information
6. **team_members** - Team membership data
7. **collaboration_requests** - Collaboration invitations
8. **notifications** - User notifications
9. **chat_history** - AI advisor chat history
10. **saved_dashboards** - Saved dashboard configurations

### Components Using Mock Data:
1. **AnalyticsCharts** - Uses hardcoded demo data
2. **CollaborationNetwork** - Uses static network data
3. **PredictiveAnalytics** - Uses fake predictions
4. **KPIMetrics** - Uses demo metrics
5. **Dashboard Overview Stats** - Partially uses real data

## Implementation Steps

### Phase 1: Dashboard Real Data (Priority: HIGH)

#### 1.1 Personal Dashboard Stats
**File**: `src/pages/Dashboard.tsx`
- ✅ Already using real data from profile
- H-Index, Citations, Publications from `profiles` table
- Co-Authors count needs calculation from `researcher_publications.co_authors`

#### 1.2 Analytics Charts Component
**File**: `src/components/AnalyticsCharts.tsx`
**Changes Needed**:
- Fetch publications by year from `researcher_publications`
- Calculate citations by year from `citation_snapshots`
- Show h-index growth over time
- Display journal distribution

**Query**:
```typescript
// Publications by year
const { data: pubs } = await supabase
  .from('researcher_publications')
  .select('year, citations, journal')
  .eq('user_id', user.id)
  .order('year');

// Citation snapshots for growth
const { data: snapshots } = await supabase
  .from('citation_snapshots')
  .select('*')
  .in('publication_id', pubIds)
  .order('snapshot_date');
```

#### 1.3 Collaboration Network
**File**: `src/components/CollaborationNetwork.tsx`
**Changes Needed**:
- Extract co-authors from `researcher_publications.co_authors`
- Build network graph from collaboration data
- Show institutions from `profiles.institution`
- Calculate collaboration strength (number of joint publications)

**Query**:
```typescript
// Get all publications with co-authors
const { data: pubs } = await supabase
  .from('researcher_publications')
  .select('co_authors, year')
  .eq('user_id', user.id);

// Parse co-authors and build network
```

### Phase 2: Predictive Analytics (Priority: HIGH)

#### 2.1 Citation Growth Prediction
**File**: `src/components/PredictiveAnalytics.tsx`
**Algorithm**:
```typescript
// Linear regression on citation growth
function predictCitationGrowth(snapshots: CitationSnapshot[]) {
  // Calculate growth rate from historical data
  const growthRates = calculateGrowthRates(snapshots);
  const avgGrowth = mean(growthRates);
  
  // Project next 12 months
  const predictions = [];
  let currentCitations = snapshots[snapshots.length - 1].citations;
  
  for (let month = 1; month <= 12; month++) {
    currentCitations += avgGrowth;
    predictions.push({
      month: addMonths(new Date(), month),
      predicted_citations: Math.round(currentCitations)
    });
  }
  
  return predictions;
}
```

#### 2.2 H-Index Prediction
**Algorithm**:
```typescript
function predictHIndex(publications: Publication[]) {
  // Sort by citations
  const sorted = publications.sort((a, b) => b.citations - a.citations);
  
  // Current h-index
  let currentH = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].citations >= i + 1) {
      currentH = i + 1;
    }
  }
  
  // Predict growth based on citation velocity
  const avgCitationGrowth = calculateAvgCitationGrowth(publications);
  
  // Simulate future h-index
  const futurePublications = publications.map(p => ({
    ...p,
    citations: p.citations + (avgCitationGrowth * 12) // 12 months
  }));
  
  return calculateHIndex(futurePublications);
}
```

#### 2.3 Collaboration Recommendations
**Algorithm**:
```typescript
function recommendCollaborators(userPubs: Publication[], allPubs: Publication[]) {
  // Find researchers with similar research interests
  const userKeywords = extractKeywords(userPubs);
  
  // Score other researchers by keyword overlap
  const scores = allPubs
    .filter(p => p.user_id !== currentUserId)
    .map(p => ({
      user_id: p.user_id,
      score: calculateSimilarity(userKeywords, extractKeywords([p]))
    }));
  
  // Group by user and aggregate scores
  const aggregated = groupBy(scores, 'user_id');
  
  return topN(aggregated, 10);
}
```

#### 2.4 Publication Impact Prediction
**Algorithm**:
```typescript
function predictPublicationImpact(pub: Publication) {
  // Factors:
  // - Journal impact factor
  // - Author h-index
  // - Number of co-authors
  // - Recency
  // - Citation velocity in first 6 months
  
  const journalScore = getJournalImpactFactor(pub.journal);
  const authorScore = pub.author_h_index / 100;
  const coAuthorScore = Math.min(pub.co_authors.length / 10, 1);
  const recencyScore = calculateRecencyScore(pub.year);
  const velocityScore = calculateCitationVelocity(pub);
  
  const predictedCitations = (
    journalScore * 0.3 +
    authorScore * 0.2 +
    coAuthorScore * 0.1 +
    recencyScore * 0.2 +
    velocityScore * 0.2
  ) * 100;
  
  return Math.round(predictedCitations);
}
```

### Phase 3: Admin Dashboard Real Data

#### 3.1 University-wide Analytics
**File**: `src/components/admin/AdminAnalytics.tsx`
**Changes Needed**:
- Aggregate all researchers' data
- Show institutional trends
- Department comparisons
- Top performers

**Queries**:
```typescript
// Total institutional stats
const { data: profiles } = await supabase
  .from('profiles')
  .select('h_index, total_citations, total_publications, department');

// All publications
const { data: pubs } = await supabase
  .from('researcher_publications')
  .select('*');

// Calculate aggregates
const totalCitations = sum(profiles.map(p => p.total_citations));
const avgHIndex = mean(profiles.map(p => p.h_index));
```

### Phase 4: Real-time Updates

#### 4.1 Citation Auto-Update
**File**: `supabase/functions/citation-updater/index.ts`
- Already implemented
- Runs periodically to update citations from external APIs
- Uses Crossref and Semantic Scholar

#### 4.2 Notification System
- Notify users when citations increase
- Alert on collaboration requests
- Notify about trending publications

## Implementation Priority

### Week 1:
1. ✅ Analytics Charts with real data
2. ✅ Collaboration Network with real data
3. ✅ Dashboard stats calculations

### Week 2:
1. ✅ Citation growth prediction
2. ✅ H-Index prediction
3. ✅ Publication impact prediction

### Week 3:
1. ✅ Collaboration recommendations
2. ✅ Admin analytics with real data
3. ✅ Real-time updates and notifications

## Testing Strategy

1. **Unit Tests**: Test prediction algorithms with sample data
2. **Integration Tests**: Test database queries
3. **E2E Tests**: Test full user flows
4. **Performance Tests**: Ensure queries are optimized

## Next Steps

1. Start with Analytics Charts component
2. Implement prediction algorithms
3. Test with real user data
4. Optimize queries for performance
5. Add caching where appropriate
