const fs = require('fs');
let code = fs.readFileSync('c:/projectgenietechsolutions/insta-auto-poster-ext/content_reddit.js', 'utf8');

const robustCollect = `async function collectRedditPostLinks(timeout) {
  timeout = timeout || 4000;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const seen = new Set(), links = [];
    
    document.querySelectorAll('a[href*="/comments/"]').forEach(a => {
      let href = a.getAttribute('href');
      if (!href) return;
      let isAd = a.closest('[promoted]') || a.closest('.promotedlink');
      if (isAd) return;
      if (href.match(/\\/r\\/[^\\/]+\\/comments\\/[a-z0-9]+\\//i)) {
        const fullUrl = href.startsWith('http') ? href : 'https://www.reddit.com' + href;
        try {
          const urlObj = new URL(fullUrl);
          const parts = urlObj.pathname.split('/').filter(Boolean);
          if (parts.length >= 4 && parts[2] === 'comments') {
            let canonicalUrl = 'https://www.reddit.com/' + parts.slice(0, 5).join('/') + '/';
            if (!seen.has(canonicalUrl)) { seen.add(canonicalUrl); links.push(canonicalUrl); }
          }
        } catch(e) {}
      }
    });

    if (links.length >= 2) return links;
    await _sleep(200);
    window.scrollBy(0, 500);
  }
  return [];
}`;

code = code.replace(/async function collectRedditPostLinks\([\s\S]*?return \[\];\r?\n\}/, robustCollect);

// Fix 2: Navigation freezing
code = code.replace(/window\.location\.href = 'https:\/\/www\.reddit\.com\/r\/' \+ subreddit \+ '\/new\/';/, `const targetUrl = 'https://www.reddit.com/r/' + subreddit + '/new/';
    if (window.location.href.split('?')[0].toLowerCase() === targetUrl.toLowerCase()) {
      handleRedditSubredditPage(s);
    } else {
      window.location.href = targetUrl;
    }`);

code = code.replace(/window\.location\.href = remaining\[0\];/, `const nextTarget = remaining[0];
    if (window.location.href.split('?')[0].toLowerCase() === nextTarget.toLowerCase()) {
      handleRedditPostPage(ns);
    } else {
      window.location.href = nextTarget;
    }`);

code = code.replace(/window\.location\.href = ns\.pendingPosts\[0\];/, `const firstPost = ns.pendingPosts[0];
  if (window.location.href.split('?')[0].toLowerCase() === firstPost.toLowerCase()) {
    handleRedditPostPage(ns);
  } else {
    window.location.href = firstPost;
  }`);

fs.writeFileSync('c:/projectgenietechsolutions/insta-auto-poster-ext/content_reddit.js', code);
