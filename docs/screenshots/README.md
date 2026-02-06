# Screenshots Guide

This folder contains screenshots of the UDSM Research Impact Platform for documentation purposes.

## Required Screenshots

To complete the README documentation, please add the following screenshots:

### 1. globe-view.png
**What to capture**: The main landing page showing the 3D interactive globe
- Navigate to the home page
- Wait for the globe to fully load
- Capture the full screen showing:
  - The 3D globe with data points
  - Country metrics on the side
  - Navigation header
  - Quick stats cards

**Recommended size**: 1920x1080 or 1600x900
**Format**: PNG

---

### 2. dashboard-view.png
**What to capture**: The analytics dashboard with charts and metrics
- Click on "Dashboard" in the navigation
- Wait for all charts to load
- Capture showing:
  - KPI metrics cards at the top
  - Multiple charts (line charts, bar charts)
  - Analytics data
  - Filters and controls

**Recommended size**: 1920x1080 or 1600x900
**Format**: PNG

---

### 3. citation-tracker.png
**What to capture**: The Citation Impact Tracker interface
- Navigate to Dashboard
- Scroll to or open the Citation Impact Tracker section
- Capture showing:
  - List of publications with citation counts
  - Growth rate indicators (trending up/down)
  - Auto-update button
  - Citation trend charts
  - Aggregate statistics

**Recommended size**: 1920x1080 or 1600x900
**Format**: PNG

---

### 4. network-view.png
**What to capture**: The collaboration network visualization
- Click on "Network" in the navigation
- Wait for the network graph to render
- Capture showing:
  - Interactive network graph with nodes and edges
  - Researcher/institution nodes
  - Connection lines showing collaborations
  - Legend or controls

**Recommended size**: 1920x1080 or 1600x900
**Format**: PNG

---

## Additional Optional Screenshots

### 5. globe-feature.png
Close-up of the globe with interactive elements visible

### 6. dashboard-feature.png
Detailed view of specific dashboard charts

### 7. citation-feature.png
Close-up of citation tracking features

### 8. network-feature.png
Detailed network graph with tooltips

---

## How to Take Screenshots

### Windows
1. Press `Windows + Shift + S` to open Snipping Tool
2. Select area to capture
3. Save as PNG in this folder

### Mac
1. Press `Cmd + Shift + 4` to capture area
2. Or `Cmd + Shift + 3` for full screen
3. Save as PNG in this folder

### Linux
1. Use `gnome-screenshot` or `flameshot`
2. Save as PNG in this folder

---

## Screenshot Guidelines

### Quality
- Use high resolution (at least 1600x900)
- Ensure text is readable
- Use PNG format for best quality
- Avoid compression artifacts

### Content
- Show real data (not empty states)
- Include UI elements (headers, navigation)
- Capture interactive elements in action
- Show tooltips or hover states when relevant

### Consistency
- Use the same browser for all screenshots
- Use the same zoom level (100%)
- Use the same theme (light or dark)
- Capture at similar times to show consistent data

---

## Placeholder Images

Until real screenshots are added, you can use placeholder images:

```bash
# Create placeholder images (requires ImageMagick)
convert -size 1920x1080 xc:lightgray -pointsize 72 -draw "text 600,540 'Globe View'" globe-view.png
convert -size 1920x1080 xc:lightgray -pointsize 72 -draw "text 550,540 'Dashboard View'" dashboard-view.png
convert -size 1920x1080 xc:lightgray -pointsize 72 -draw "text 500,540 'Citation Tracker'" citation-tracker.png
convert -size 1920x1080 xc:lightgray -pointsize 72 -draw "text 550,540 'Network View'" network-view.png
```

Or use online placeholder services:
- https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Globe+View
- https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Dashboard+View
- https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Citation+Tracker
- https://via.placeholder.com/1920x1080/CCCCCC/000000?text=Network+View

---

## After Adding Screenshots

1. Verify all images are in this folder
2. Check that filenames match exactly:
   - `globe-view.png`
   - `dashboard-view.png`
   - `citation-tracker.png`
   - `network-view.png`
3. Verify images display correctly in README.md
4. Commit and push to GitHub
5. Check that images appear on GitHub Pages

---

## File Naming Convention

- Use lowercase
- Use hyphens (not underscores or spaces)
- Be descriptive but concise
- Use `.png` extension
- Examples:
  - ✅ `globe-view.png`
  - ✅ `dashboard-analytics.png`
  - ❌ `Globe View.png`
  - ❌ `screenshot_1.png`

---

## Image Optimization

Before committing, optimize images to reduce file size:

### Using TinyPNG (Online)
1. Go to https://tinypng.com
2. Upload your PNG files
3. Download optimized versions

### Using ImageOptim (Mac)
```bash
brew install imageoptim-cli
imageoptim *.png
```

### Using OptiPNG (Linux/Mac)
```bash
optipng -o7 *.png
```

---

## Need Help?

If you need assistance taking or editing screenshots:
1. Check the [Visual Setup Guide](../VISUAL_SETUP_GUIDE.md)
2. Open an issue on GitHub
3. Contact the development team

---

**Remember**: Good screenshots make great documentation! Take your time to capture the best views of the platform.
