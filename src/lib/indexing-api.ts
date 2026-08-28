import { google } from 'googleapis';

export async function pingGoogleIndexingAPI(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  try {
    // If the environment variable isn't set, we gracefully skip
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      console.warn('Indexing API skipped: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.');
      return { success: false, error: 'Credentials not configured' };
    }

    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    await jwtClient.authorize();

    const indexing = google.indexing({ version: 'v3', auth: jwtClient });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`Successfully pinged Google Indexing API for: ${url}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Failed to ping Google Indexing API for ${url}:`, error.message);
    return { success: false, error: error.message };
  }
}
