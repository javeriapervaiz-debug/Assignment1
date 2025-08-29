import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  // Redirect to GitHub OAuth
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:5173/auth/callback/github')}&` +
    `scope=${encodeURIComponent('user:email')}&` +
    `allow_signup=true`;

  throw redirect(302, githubAuthUrl);
};
