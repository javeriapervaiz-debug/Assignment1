import { destroySession } from '$lib/auth';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
  await destroySession(event);
  throw redirect(302, '/');
};
