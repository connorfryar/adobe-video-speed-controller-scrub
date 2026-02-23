# Adobe Video Speed Controller - Chrome Extension

A Chrome extension to control playback speed for Adobe Captivate video players and other HTML5 videos, specifically designed for CSP training videos.

## Features

- 🎯 **One-click speed control** - Set video playback speed with preset buttons (1x, 1.25x, 1.5x, 1.75x, 2x, 2.5x)
- ⚡ **Custom speed input** - Enter any speed between 0.25x and 4x
- 🔄 **Auto-apply on page load** - Automatically set your preferred speed when videos load
- 🎬 **Works with Adobe Captivate** - Specifically handles modulePlayerIframe contexts
- 💾 **Remembers your preference** - Saves your last used speed setting

## Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. Download or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select the `adobe-video-speed-controller` folder
6. The extension icon should now appear in your Chrome toolbar

### Method 2: Create Icons (Optional)

The extension currently references icon files that need to be created. You can:

1. Create simple PNG icons in these sizes: 16x16, 48x48, and 128x128 pixels
2. Name them `icon16.png`, `icon48.png`, and `icon128.png`
3. Place them in the extension folder

Or simply remove the icon references from `manifest.json` if you don't need custom icons.

## Usage

### Basic Usage

1. Navigate to your CSP training video page
2. Click the extension icon in the Chrome toolbar
3. Choose a preset speed (e.g., 1.5x) or enter a custom value
4. Click "Apply" or press Enter

### Auto-Apply Feature

1. Click the extension icon
2. Toggle "Auto-apply on page load" to ON
3. Set your preferred default speed
4. The extension will automatically set this speed whenever you load a video page

### Manual Console Method (Original)

If you prefer the original console method, you can still use:
```javascript
document.querySelector('video').playbackRate = 1.5;
```

But this extension makes it much easier!

## How It Works

The extension:
1. Injects a content script into all web pages
2. Searches for `<video>` elements in the main page and iframes
3. Sets the `playbackRate` property to your chosen speed
4. Monitors for dynamically loaded videos and applies the speed automatically
5. Works across page reloads when auto-apply is enabled

## Troubleshooting

**Video speed not changing?**
- Make sure the video has started playing first
- Try clicking the Apply button again after the video loads
- Check if the video is in an iframe that might block access

**Extension not working on certain sites?**
- Some video players may override playback speed
- The extension works best with standard HTML5 video elements

**Auto-apply not working?**
- Make sure the toggle is ON (green)
- Try refreshing the page after enabling auto-apply
- Some videos may take a few seconds to load

## Privacy

This extension:
- Only stores your speed preference locally in Chrome
- Does not collect or transmit any data
- Does not track your browsing
- Works entirely offline once installed

## Technical Details

- **Manifest Version**: 3
- **Permissions**: storage, activeTab
- **Content Scripts**: Runs on all URLs, in all frames
- **Compatible with**: Chrome, Edge, and other Chromium-based browsers

## Customization

You can modify the preset speeds by editing `popup.html`:
```html
<button class="preset-btn" data-speed="YOUR_SPEED">YOUR_SPEEDx</button>
```

## License

Free to use and modify for personal or educational purposes.

## Support

If you encounter issues, try:
1. Reloading the extension at `chrome://extensions/`
2. Refreshing the video page
3. Checking the browser console (F12) for error messages

---

**Note**: This extension is designed for educational use with CSP training videos and respects all playback controls that content creators have implemented.
