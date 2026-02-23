// Function to find and set video speed
function setVideoSpeed(speed) {
  let videoFound = false;
  
  // Try to find video in current context
  const videos = document.querySelectorAll('video');
  if (videos.length > 0) {
    videos.forEach(video => {
      video.playbackRate = speed;
      videoFound = true;
      console.log(`Video speed set to ${speed}x in main frame`);
    });
  }
  
  // Try to find video in iframes (for Adobe Captivate player)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeVideos = iframe.contentWindow.document.querySelectorAll('video');
      if (iframeVideos.length > 0) {
        iframeVideos.forEach(video => {
          video.playbackRate = speed;
          videoFound = true;
          console.log(`Video speed set to ${speed}x in iframe`);
        });
      }
    } catch (e) {
      // Cross-origin iframe, can't access
      console.log('Cannot access cross-origin iframe');
    }
  });
  
  return videoFound;
}

// Function to monitor for new videos
function monitorForVideos(speed) {
  const observer = new MutationObserver((mutations) => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.playbackRate !== speed) {
        video.playbackRate = speed;
        console.log(`Auto-applied speed ${speed}x to new video`);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Function to scrub video by a given number of seconds (positive or negative)
function scrubVideo(seconds) {
  let videoFound = false;

  // Try main frame first
  const videos = document.querySelectorAll('video');
  if (videos.length > 0) {
    videos.forEach(video => {
      video.currentTime += seconds;
      videoFound = true;
      console.log(`Scrubbed video by ${seconds}s in main frame`);
    });
  }

  // Try iframes (Adobe pfplayer_frame lives here)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeVideos = iframe.contentWindow.document.querySelectorAll('video');
      if (iframeVideos.length > 0) {
        iframeVideos.forEach(video => {
          video.currentTime += seconds;
          videoFound = true;
          console.log(`Scrubbed video by ${seconds}s in iframe`);
        });
      }
    } catch (e) {
      console.log('Cannot access cross-origin iframe for scrub');
    }
  });

  return videoFound;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setSpeed') {
    const success = setVideoSpeed(request.speed);
    sendResponse({ success: success });
  } else if (request.action === 'scrub') {
    const success = scrubVideo(request.seconds);
    sendResponse({ success: success });
  }
  return true; // Keep message channel open for async response
});

// Auto-apply speed on page load if enabled
chrome.storage.sync.get(['playbackSpeed', 'autoApply'], function(result) {
  if (result.autoApply) {
    const speed = result.playbackSpeed || 1.5;
    
    // Try immediately
    setTimeout(() => {
      setVideoSpeed(speed);
    }, 1000);
    
    // Try again after a delay for lazy-loaded videos
    setTimeout(() => {
      setVideoSpeed(speed);
    }, 3000);
    
    // Monitor for dynamically added videos
    monitorForVideos(speed);
    
    // Listen for video events to reapply speed
    document.addEventListener('play', (e) => {
      if (e.target.tagName === 'VIDEO') {
        e.target.playbackRate = speed;
      }
    }, true);
  }
});

// Additional: Handle videos in modulePlayerIframe specifically
function handleModulePlayerIframe() {
  chrome.storage.sync.get(['playbackSpeed', 'autoApply'], function(result) {
    if (result.autoApply) {
      const speed = result.playbackSpeed || 1.5;
      
      // Check if we're in an iframe context
      if (window.name.includes('modulePlayerIframe') || 
          window.location.href.includes('captivate') ||
          window.location.href.includes('adobe')) {
        
        const checkForVideo = setInterval(() => {
          const videos = document.querySelectorAll('video');
          if (videos.length > 0) {
            videos.forEach(video => {
              video.playbackRate = speed;
              console.log(`Speed set in Adobe player iframe: ${speed}x`);
            });
            clearInterval(checkForVideo);
          }
        }, 500);
        
        // Stop checking after 30 seconds
        setTimeout(() => clearInterval(checkForVideo), 30000);
      }
    }
  });
}

// Run the iframe handler
handleModulePlayerIframe();
