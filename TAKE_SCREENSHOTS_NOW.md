# 📸 Take Screenshots Now - Step by Step

Your dev server is running at: **http://localhost:8081/**

Follow these steps to take the 4 required screenshots:

---

## Screenshot 1: Globe View (Home Page)

### Steps:
1. Open your browser and go to: **http://localhost:8081/**
2. Wait for the 3D globe to fully load (about 3-5 seconds)
3. Make sure you can see:
   - The rotating 3D globe with blue data points
   - Country statistics on the right side
   - Navigation header at the top
   - Quick stats cards showing metrics

### Take Screenshot:
- **Windows**: Press `Windows + Shift + S`, select area, save as `globe-view.png`
- **Mac**: Press `Cmd + Shift + 4`, select area, save as `globe-view.png`

### Save Location:
```
D:\udsm\udsm-research-impact\docs\screenshots\globe-view.png
```

---

## Screenshot 2: Dashboard View

### Steps:
1. Click on **"Dashboard"** in the navigation menu
2. Wait for all charts to load (about 2-3 seconds)
3. Make sure you can see:
   - KPI metric cards at the top
   - Multiple charts (line charts, bar charts)
   - Analytics data
   - The full dashboard layout

### Take Screenshot:
- **Windows**: Press `Windows + Shift + S`, select area, save as `dashboard-view.png`
- **Mac**: Press `Cmd + Shift + 4`, select area, save as `dashboard-view.png`

### Save Location:
```
D:\udsm\udsm-research-impact\docs\screenshots\dashboard-view.png
```

---

## Screenshot 3: Citation Impact Tracker

### Steps:
1. Stay on the **Dashboard** page
2. Scroll down to find the **Citation Impact Tracker** section
   - OR look for a section showing publications with citation counts
3. Make sure you can see:
   - List of publications
   - Citation counts for each publication
   - Growth rate indicators (arrows showing trends)
   - The "Auto-Update All" button
   - Aggregate statistics

### Take Screenshot:
- **Windows**: Press `Windows + Shift + S`, select area, save as `citation-tracker.png`
- **Mac**: Press `Cmd + Shift + 4`, select area, save as `citation-tracker.png`

### Save Location:
```
D:\udsm\udsm-research-impact\docs\screenshots\citation-tracker.png
```

---

## Screenshot 4: Collaboration Network

### Steps:
1. Click on **"Network"** in the navigation menu
2. Wait for the network graph to render (about 2-3 seconds)
3. Make sure you can see:
   - Interactive network graph with nodes (circles)
   - Connection lines between nodes
   - The full network visualization
   - Any legends or controls

### Take Screenshot:
- **Windows**: Press `Windows + Shift + S`, select area, save as `network-view.png`
- **Mac**: Press `Cmd + Shift + 4`, select area, save as `network-view.png`

### Save Location:
```
D:\udsm\udsm-research-impact\docs\screenshots\network-view.png
```

---

## After Taking All Screenshots

### 1. Verify Files Exist
Check that all 4 files are in the correct location:
```
D:\udsm\udsm-research-impact\docs\screenshots\
├── globe-view.png
├── dashboard-view.png
├── citation-tracker.png
└── network-view.png
```

### 2. Verify in File Explorer
Open File Explorer and navigate to:
```
D:\udsm\udsm-research-impact\docs\screenshots\
```

You should see all 4 PNG files.

### 3. Add to Git
Open terminal in the project folder and run:
```bash
git add docs/screenshots/*.png
git commit -m "Add platform screenshots"
```

---

## Screenshot Tips

### Quality
- Use **full screen** or maximize browser window
- Set browser zoom to **100%**
- Use **1920x1080** resolution if possible
- Make sure all elements are visible

### Content
- Wait for everything to load completely
- Show real data (not loading screens)
- Include the navigation header
- Capture the full interface

### Format
- Save as **PNG** (not JPG)
- Use descriptive filenames
- Don't compress or resize

---

## Quick Checklist

- [ ] Server running at http://localhost:8081/
- [ ] Browser open and ready
- [ ] Screenshot tool ready (Windows + Shift + S or Cmd + Shift + 4)
- [ ] Folder `docs\screenshots\` exists
- [ ] Take Screenshot 1: Globe View
- [ ] Take Screenshot 2: Dashboard View
- [ ] Take Screenshot 3: Citation Tracker
- [ ] Take Screenshot 4: Network View
- [ ] Verify all 4 files saved correctly
- [ ] Add to git and commit

---

## Need Help?

### Can't find the Citation Tracker?
- It might be on a separate page or tab
- Check the Dashboard page thoroughly
- Look for sections with publication lists

### Screenshots too large?
- That's okay! Git can handle them
- Optionally compress with TinyPNG.com later

### Wrong resolution?
- Any resolution above 1280x720 is fine
- Higher is better for documentation

---

## After Screenshots Are Added

The README will automatically display them! No code changes needed.

Just commit and push:
```bash
git add docs/screenshots/*.png
git commit -m "Add platform screenshots"
git push
```

---

**Ready? Open http://localhost:8081/ and start taking screenshots!** 📸
