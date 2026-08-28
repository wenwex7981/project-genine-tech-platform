import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { pingGoogleIndexingAPI } from './src/lib/indexing-api.ts';

async function test() {
  const url = 'https://www.graduatenex.online/locations/hyderabad';
  console.log('Testing Google Indexing API ping for:', url);
  const result = await pingGoogleIndexingAPI(url, 'URL_UPDATED');
  console.log('Result:', result);
}

test();
