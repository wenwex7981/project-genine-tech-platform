document.addEventListener('DOMContentLoaded', () => {
  const postBtn = document.getElementById('postBtn');
  const topicText = document.getElementById('topicText');
  const statusDiv = document.getElementById('status');

  postBtn.addEventListener('click', async () => {
    const topic = topicText.value.trim();
    const fileInput = document.getElementById('imageUpload');

    if (fileInput.files.length === 0) {
      statusDiv.textContent = "Please select an image first.";
      statusDiv.style.color = "red";
      return;
    }

    if (!topic) {
      statusDiv.textContent = "Please enter a topic for the caption.";
      statusDiv.style.color = "red";
      return;
    }

    postBtn.disabled = true;
    
    try {
      // 1. Check if Instagram is active
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.url.includes("instagram.com")) {
        throw new Error("Please open Instagram.com in the current tab first!");
      }

      // Check if content script is ready
      await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { action: 'PING' }, (response) => {
          if (chrome.runtime.lastError) reject(new Error("Please refresh the Instagram page first."));
          else resolve();
        });
      });

      // 2. Read Image File
      statusDiv.textContent = "Processing image...";
      statusDiv.style.color = "#0095f6";
      const file = fileInput.files[0];
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error("Failed to read image."));
        reader.readAsDataURL(file);
      });

      // 3. Generate Caption via Backend
      statusDiv.textContent = "Generating AI caption...";
      
      const captionRes = await fetch('https://www.graduatenex.online/api/generate-insta-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
      });
      
      const captionData = await captionRes.json();
      if (captionData.error) throw new Error("Backend Error: " + captionData.error);
      const generatedCaption = captionData.caption.trim();

      // 4. Send to Instagram
      statusDiv.textContent = "Sending to Instagram...";
      
      chrome.tabs.sendMessage(tab.id, {
        action: 'POST_TO_INSTAGRAM',
        imageData: base64Data,
        caption: generatedCaption,
        filename: file.name,
        filetype: file.type
      }, (response) => {
        if (chrome.runtime.lastError) {
          throw new Error("Communication with Instagram tab failed.");
        } else {
          statusDiv.textContent = "Automation started! Please DO NOT touch the mouse or keyboard.";
          statusDiv.style.color = "green";
          setTimeout(() => window.close(), 3000);
        }
      });

    } catch (err) {
      statusDiv.textContent = err.message;
      statusDiv.style.color = "red";
      postBtn.disabled = false;
    }
  });
});
