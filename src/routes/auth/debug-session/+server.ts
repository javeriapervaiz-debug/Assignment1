import { json } from '@sveltejs/kit';
import { getSession } from '$lib/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const session = await getSession(event);
  
  return json({
    hasSession: !!session,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      emailVerifiedAt: session.user.emailVerifiedAt,
    } : null,
    cookies: event.cookies.getAll().map(cookie => ({
      name: cookie.name,
      hasValue: !!cookie.value
    }))
  });
};
