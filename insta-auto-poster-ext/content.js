chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PING') {
    sendResponse({ status: 'ok' });
    return true;
  }
  
  if (request.action === 'POST_TO_INSTAGRAM') {
    sendResponse({ status: "started" });
    startAutomation(request.imageData, request.caption, request.filename, request.filetype);
    return true;
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findButtonByText(text) {
  const elements = Array.from(document.querySelectorAll('div[role="button"], button, a[role="link"]'));
  return elements.find(el => el.textContent.trim().toLowerCase() === text.toLowerCase());
}

async function startAutomation(base64Data, caption, filename, filetype) {
  console.log("Instagram Auto-Poster: Starting automation...");
  
  // Step 1: Find and click the "Create" (New post) button
  const createSvg = document.querySelector('svg[aria-label="New post"]');
  if (!createSvg) {
    alert("Insta Auto Poster: Could not find the 'New post' button. Make sure you are on the desktop version of Instagram and logged in.");
    return;
  }
  
  // Find the closest clickable container
  let createBtn = createSvg.closest('a') || createSvg.closest('div[role="button"]') || createSvg.closest('div[role="link"]');
  if (createBtn) {
    createBtn.click();
  } else {
    createSvg.parentElement.click();
  }
  
  console.log("Clicked Create");
  await sleep(2500); // Wait for modal to open
  
  // Step 2: Upload the image
  const fileInput = document.querySelector('input[type="file"][accept*="image"]');
  if (!fileInput) {
    alert("Insta Auto Poster: Could not find file input. Please try again.");
    return;
  }
  
  try {
    // Convert base64 to a File object
    const res = await fetch(base64Data);
    const blob = await res.blob();
    const file = new File([blob], filename || 'image.jpg', { type: filetype || 'image/jpeg' });
    
    // Create a DataTransfer object to assign the file to the input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // Dispatch a change event so React registers the file
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Injected Image");
    
  } catch (err) {
    console.error("Error creating file: ", err);
    alert("Insta Auto Poster: Error processing image.");
    return;
  }
  
  await sleep(3000); // Wait for image to load and crop screen to appear
  
  // Step 3: Click "Next" on the crop screen
  let nextBtn = findButtonByText("Next");
  if (nextBtn) {
    nextBtn.click();
    console.log("Clicked Next (1)");
  } else {
    console.log("Next button 1 not found");
  }
  
  await sleep(2500); // Wait for filters screen
  
  // Step 4: Click "Next" on the filters screen
  nextBtn = findButtonByText("Next");
  if (nextBtn) {
    nextBtn.click();
    console.log("Clicked Next (2)");
  } else {
    console.log("Next button 2 not found");
  }
  
  await sleep(3000); // Wait for caption screen
  
  // Step 5: Enter Caption
  // The caption box is a contenteditable div
  const captionBox = document.querySelector('div[aria-label*="caption"][contenteditable="true"]');
  if (captionBox) {
    captionBox.focus();
    // Use execCommand to simulate real typing so React picks it up
    document.execCommand('insertText', false, caption);
    console.log("Inserted Caption");
  } else {
    console.log("Caption box not found");
    alert("Insta Auto Poster: Could not find the caption text box, but you can paste it manually. Press OK to continue to share.");
  }
  
  await sleep(2500);
  
  // Step 6: Click "Share"
  const shareBtn = findButtonByText("Share");
  if (shareBtn) {
    shareBtn.click();
    console.log("Clicked Share!");
    // Optional: Alert the user it's done, but we'll just let Instagram show its "Your post has been shared" toast.
  } else {
    console.log("Share button not found");
    alert("Insta Auto Poster: Could not find the Share button. Please click it manually!");
  }
}
