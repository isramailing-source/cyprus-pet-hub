# Google AdSense Setup Instructions

## Current Status
✅ AdSense script properly loaded with your Publisher ID: `ca-pub-4659190065021043`
✅ Auto ads enabled for automatic ad placement
✅ Site verification meta tag added
✅ ads.txt file created for verification
✅ Ad components ready with placeholder slots

## Next Steps to Complete Setup

### 1. Get Real Ad Slot IDs from Google AdSense
1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Navigate to **Ads** → **By ad unit**
3. Click **"+ New ad unit"** for each type you need:
   - **Display ads** (for banner placements)
   - **In-feed ads** (for content integration)
   - **In-article ads** (for sidebar/content)

### 2. Replace Placeholder Slot IDs
Currently using demo slots that show placeholders. Replace these in your code:

**Current placeholders to replace:**
- `1234567890` → Replace with real banner slot ID
- `2345678901` → Replace with real banner slot ID
- `8901234567` → Replace with real in-feed slot ID
- `9012345678` → Replace with real in-feed slot ID
- `0123456789` → Replace with real sidebar slot ID

### 3. Site Verification
1. Add your domain to AdSense
2. Verify ownership through one of these methods:
   - Upload ads.txt file (already created in /public/ads.txt)
   - Add HTML meta tag (already added)
   - Connect Google Analytics
   - Add HTML file

### 4. AdSense Review Process
1. Ensure your site has quality content
2. Add privacy policy and terms of service
3. Make sure site navigation is clear
4. Wait for Google review (can take 24-48 hours)

### 5. Testing and Optimization
Once approved:
- Test ads on different devices
- Monitor performance in AdSense dashboard
- Adjust ad placements based on performance
- Consider enabling auto ads for better optimization

## Technical Implementation Details

### Auto Ads Enabled
Auto ads will automatically place optimized ads throughout your site based on Google's machine learning.

### Manual Ad Placements
- **Header/Footer banners**: High visibility areas
- **In-feed ads**: Between content listings (natural integration)
- **Sidebar ads**: Complementary placements on desktop

### Performance Features
- Responsive design for all screen sizes
- Lazy loading for better site speed
- Proper AdSense initialization to prevent errors

## Troubleshooting
If ads don't appear:
1. Check browser console for errors
2. Verify slot IDs are correct
3. Ensure site domain is approved in AdSense
4. Wait for AdSense review completion
5. Check that ads.txt file is accessible at: yourdomain.com/ads.txt