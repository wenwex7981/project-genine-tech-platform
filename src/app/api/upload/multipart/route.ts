import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { r2Client } from '@/lib/r2';
import { 
  CreateMultipartUploadCommand, 
  UploadPartCommand, 
  CompleteMultipartUploadCommand 
} from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    
    if (action === 'START') {
      const filename = formData.get('filename') as string;
      const folder = formData.get('folder') as string || 'uploads';
      const key = `${folder}/${crypto.randomUUID()}-${filename}`;
      
      const cmd = new CreateMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        ContentType: 'application/pdf',
      });
      const res = await r2Client.send(cmd);
      return NextResponse.json({ uploadId: res.UploadId, key });
    } 
    else if (action === 'UPLOAD') {
      const uploadId = formData.get('uploadId') as string;
      const key = formData.get('key') as string;
      const partNumber = parseInt(formData.get('partNumber') as string);
      const file = formData.get('file') as File;
      
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const cmd = new UploadPartCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: buffer,
      });
      const res = await r2Client.send(cmd);
      return NextResponse.json({ ETag: res.ETag });
    }
    else if (action === 'COMPLETE') {
      const uploadId = formData.get('uploadId') as string;
      const key = formData.get('key') as string;
      const partsStr = formData.get('parts') as string;
      const parts = JSON.parse(partsStr);
      
      const cmd = new CompleteMultipartUploadCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      });
      await r2Client.send(cmd);
      
      const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
      return NextResponse.json({ url: publicUrl });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("Multipart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
