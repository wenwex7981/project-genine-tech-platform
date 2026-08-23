const https = require('https');

const options = {
  hostname: 'api.groq.com',
  path: '/openai/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const models = JSON.parse(data);
    if (models.data) {
      console.log("AVAILABLE GROQ MODELS:");
      models.data.forEach(m => console.log(m.id));
    } else {
      console.log("ERROR:", data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
