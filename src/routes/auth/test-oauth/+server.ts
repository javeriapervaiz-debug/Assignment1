import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:5173/auth/callback/google')}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('openid email profile')}&` +
    `access_type=offline&` +
    `prompt=select_account`;

  const githubUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:5173/auth/callback/github')}&` +
    `scope=${encodeURIComponent('user:email')}&` +
    `allow_signup=true`;

  return json({
    google_client_id: env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
    github_client_id: env.GITHUB_CLIENT_ID?.substring(0, 10) + '...',
    google_url: googleUrl,
    github_url: githubUrl,
    port: '5173'
  });
};
