import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { findOrCreateOAuthUser, signInOAuthUser } from '$lib/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, ...event }) => {
  const code = url.searchParams.get('code');
  
  if (!code) {
    throw redirect(302, '/auth/login?error=oauth_failed');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173/auth/callback/google',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();
    console.log('Google OAuth success:', userData);

    // Find or create user in database
    const user = await findOrCreateOAuthUser(
      userData.email,
      userData.given_name || null,
      userData.family_name || null,
      userData.picture || null
    );

    // Sign in the user (create session and set cookie)
    console.log('Signing in OAuth user...');
    await signInOAuthUser(event, user);
    console.log('User signed in successfully, user ID:', user.id);

    console.log('OAuth completed, redirecting to dashboard...');

  } catch (error) {
    console.error('Google OAuth error:', error);
    throw redirect(302, '/auth/login?error=oauth_failed');
  }

  // Redirect to dashboard with OAuth success indicator (outside try-catch)
  throw redirect(302, '/dashboard?oauth=google&welcome=1');
};
