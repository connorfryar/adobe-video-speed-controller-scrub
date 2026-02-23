// Load saved settings
chrome.storage.sync.get(['playbackSpeed', 'autoApply'], function(result) {
  const speed = result.playbackSpeed || 1.5;
  const autoApply = result.autoApply !== undefined ? result.autoApply : true;
  
  document.getElementById('speedInput').value = speed;
  
  const toggleSwitch = document.getElementById('toggleSwitch');
  if (autoApply) {
    toggleSwitch.classList.add('active');
  }
  
  // Highlight active preset button
  updatePresetButtons(speed);
});

// Apply speed button
document.getElementById('applyBtn').addEventListener('click', function() {
  const speed = parseFloat(document.getElementById('speedInput').value);
  applySpeed(speed);
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(button => {
  button.addEventListener('click', function() {
    const speed = parseFloat(this.dataset.speed);
    document.getElementById('speedInput').value = speed;
    applySpeed(speed);
  });
});

// Toggle auto-apply
document.getElementById('autoApplyToggle').addEventListener('click', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const isActive = toggleSwitch.classList.toggle('active');
  
  chrome.storage.sync.set({ autoApply: isActive }, function() {
    showStatus('Auto-apply ' + (isActive ? 'enabled' : 'disabled'), 'success');
  });
});

// Apply speed function
function applySpeed(speed) {
  // Save the speed
  chrome.storage.sync.set({ playbackSpeed: speed }, function() {
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'setSpeed',
        speed: speed
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: Could not communicate with page', 'error');
        } else if (response && response.success) {
          showStatus(`Speed set to ${speed}x`, 'success');
          updatePresetButtons(speed);
        } else {
          showStatus('No video found on this page', 'error');
        }
      });
    });
  });
}

// Update preset button highlighting
function updatePresetButtons(speed) {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    if (parseFloat(btn.dataset.speed) === speed) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status ' + type;
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

// Handle Enter key in speed input
document.getElementById('speedInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('applyBtn').click();
  }
});

// Scrub buttons
document.querySelectorAll('.scrub-btn').forEach(button => {
  button.addEventListener('click', function() {
    const seconds = parseFloat(this.dataset.seconds);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'scrub',
        seconds: seconds
      }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: Could not communicate with page', 'error');
        } else if (response && response.success) {
          const dir = seconds > 0 ? 'forward' : 'back';
          showStatus(`Scrubbed ${dir} ${Math.abs(seconds)}s`, 'success');
        } else {
          showStatus('No video found on this page', 'error');
        }
      });
    });
  });
});
