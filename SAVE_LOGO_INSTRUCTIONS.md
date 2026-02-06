# 🎨 How to Save the UDSM Logo

## Quick Instructions

You have the UDSM logo image. Here's how to save it to the project:

### Method 1: Save from Browser (Easiest)

1. **Right-click on the logo image** you shared
2. **Select "Save image as..."**
3. **Navigate to**: `D:\udsm\udsm-research-impact\public\`
4. **Save as**: `udsm-logo.png`
5. **Done!** The logo is now in the correct location

### Method 2: Copy Existing File

If you already have the logo file saved somewhere:

1. **Copy the logo file**
2. **Paste it into**: `D:\udsm\udsm-research-impact\public\`
3. **Rename it to**: `udsm-logo.png`
4. **Done!**

### Method 3: Download from UDSM Website

1. Go to https://udsm.ac.tz
2. Find the official UDSM logo
3. Right-click and save as `udsm-logo.png`
4. Move to `D:\udsm\udsm-research-impact\public\`

---

## Verify Logo is Saved

Check that the file exists at:
```
D:\udsm\udsm-research-impact\public\udsm-logo.png
```

You can verify by running:
```cmd
dir public\udsm-logo.png
```

You should see the file listed.

---

## Logo Requirements

### File Specifications
- **Format**: PNG (with transparent background preferred)
- **Size**: 200-500px width recommended
- **Quality**: High resolution for clarity
- **Background**: Transparent or white

### Current Logo Details
The UDSM logo you shared shows:
- Oval shape with blue waves
- Red torch/flame in center
- Open book at bottom
- "HEKIMA NI UHURU" banner
- Gold/yellow border

This is perfect for the platform!

---

## After Saving the Logo

1. **Verify it displays**: Run `npm run dev` and check the README
2. **Commit the file**:
   ```bash
   git add public/udsm-logo.png
   git commit -m "Add UDSM official logo"
   ```
3. **Push to GitHub**:
   ```bash
   git push
   ```

---

## Logo Usage in the Project

The logo appears in:
- `README.md` - Top of documentation (200px width)
- `README.md` - Bottom footer (100px width)
- `index.html` - Open Graph meta tag (for social sharing)

All references use: `public/udsm-logo.png`

---

## Alternative: Use Base64 Encoding

If you can't save the file directly, you can convert the logo to base64 and embed it:

1. Go to https://www.base64-image.de/
2. Upload your logo
3. Copy the base64 string
4. Replace `public/udsm-logo.png` in README with the base64 string

Example:
```markdown
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="UDSM Logo" width="200"/>
```

But saving as a file is much better!

---

## Need Help?

If you're having trouble saving the logo:
1. Make sure the `public` folder exists
2. Check you have write permissions
3. Try saving to desktop first, then moving to `public` folder
4. Contact the development team for assistance

---

**Once the logo is saved, you're one step closer to deployment!** 🚀
