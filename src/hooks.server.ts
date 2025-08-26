import type { Handle } from '@sveltejs/kit';
import { getSession } from '$lib/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const session = await getSession(event);
  event.locals.user = session?.user ?? null;

  // Protect /dashboard routes
  if (event.url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/auth/login' }
      });
    }
  }

  return resolve(event);
};
