require('dotenv').config({ path: '.env.local' });
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function testUpload() {
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });

  try {
    console.log("Attempting upload to bucket:", process.env.R2_BUCKET_NAME);
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'test/test.txt',
      Body: 'Hello World',
      ContentType: 'text/plain',
    });
    
    await r2Client.send(command);
    console.log("✅ R2 Upload SUCCESS!");
  } catch (error) {
    console.log("❌ R2 Upload FAILED:");
    console.log(error);
  }
}

testUpload();
