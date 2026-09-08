import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get country from Vercel or Cloudflare headers
  const country = request.headers.get('x-vercel-ip-country') || 
                  request.headers.get('cf-ipcountry') || 
                  'IN'; // Default to India if not found

  // Create a new response to allow mutating headers
  const response = NextResponse.next();

  // Set the country code as a header for downstream server components
  response.headers.set('x-user-country', country);

  // If the user hasn't explicitly set a country cookie/localStorage, we could set a cookie here
  // For now we just pass it in headers.
  return response;
}

export const config = {
  matcher: [
    // Apply only to main routes, skip static assets and api
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
