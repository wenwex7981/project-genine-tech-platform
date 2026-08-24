const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config({ path: '.env.local' });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const corsCommand = new PutBucketCorsCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: ["*"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3600,
      },
    ],
  },
});

async function run() {
  try {
    const data = await r2Client.send(corsCommand);
    console.log("CORS updated successfully", data);
  } catch (err) {
    console.error("Error setting CORS", err);
  }
}

run();
