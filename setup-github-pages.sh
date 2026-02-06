#!/bin/bash

# UDSM Research Impact Platform - GitHub Pages Setup Script
# This script helps configure the project for GitHub Pages deployment

echo "🚀 UDSM Research Impact Platform - GitHub Pages Setup"
echo "======================================================"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

# Get repository name
read -p "Enter your repository name (default: udsm-research-impact): " repo_name
repo_name=${repo_name:-udsm-research-impact}

echo ""
echo "Configuration:"
echo "  GitHub Username: $github_username"
echo "  Repository Name: $repo_name"
echo "  Site URL: https://$github_username.github.io/$repo_name/"
echo ""
read -p "Is this correct? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Setup cancelled."
    exit 1
fi

echo ""
echo "📝 Updating configuration files..."

# Update vite.config.ts
sed -i.bak "s|base: mode === 'production' ? '/udsm-research-impact/' : '/',|base: mode === 'production' ? '/$repo_name/' : '/',|g" vite.config.ts
echo "✓ Updated vite.config.ts"

# Update package.json
sed -i.bak "s|your-username|$github_username|g" package.json
sed -i.bak "s|udsm-research-impact|$repo_name|g" package.json
echo "✓ Updated package.json"

# Update index.html
sed -i.bak "s|your-username|$github_username|g" index.html
sed -i.bak "s|udsm-research-impact|$repo_name|g" index.html
echo "✓ Updated index.html"

# Update README.md
sed -i.bak "s|your-username|$github_username|g" README.md
sed -i.bak "s|udsm-research-impact|$repo_name|g" README.md
echo "✓ Updated README.md"

# Clean up backup files
rm -f vite.config.ts.bak package.json.bak index.html.bak README.md.bak

echo ""
echo "✅ Configuration complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub named: $repo_name"
echo "2. Run these commands:"
echo ""
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit: UDSM Research Impact Platform'"
echo "   git remote add origin https://github.com/$github_username/$repo_name.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages in repository settings"
echo "4. Your site will be live at: https://$github_username.github.io/$repo_name/"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo ""
