const { S3Client, CreateMultipartUploadCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config({ path: '.env.local' });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

async function run() {
  try {
    const key = `uploads/${crypto.randomUUID()}-test.pdf`;
    const cmd = new CreateMultipartUploadCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: 'application/pdf',
    });
    console.log("Sending CreateMultipartUploadCommand...");
    const res = await r2Client.send(cmd);
    console.log("Success! UploadId:", res.UploadId);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
