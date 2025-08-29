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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID!,
        client_secret: env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(`GitHub OAuth error: ${tokenData.error_description}`);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();

    // Get user's email (GitHub might not provide it in the user object)
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    if (!email) {
      throw new Error('No email found in GitHub account');
    }

    console.log('GitHub OAuth success:', { ...userData, email });

    // Parse name from full name or use username
    const fullName = userData.name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || userData.login;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    // Find or create user in database
    const user = await findOrCreateOAuthUser(
      email,
      firstName,
      lastName,
      userData.avatar_url || null
    );

    // Sign in the user (create session and set cookie)
    await signInOAuthUser(event, user);

    console.log('OAuth completed, redirecting to dashboard...');

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    throw redirect(302, '/auth/login?error=oauth_failed');
  }

  // Redirect to dashboard with OAuth success indicator (outside try-catch)
  throw redirect(302, '/dashboard?oauth=github&welcome=1');
};
