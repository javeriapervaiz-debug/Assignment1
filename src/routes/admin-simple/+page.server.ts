import type { PageServerLoad } from './$types';
import { getUserStats, requireAdmin } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Check authentication
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }
  
  // Check admin role
  try {
    requireAdmin(locals.user);
  } catch (error) {
    throw redirect(302, '/dashboard');
  }
  
  // Get stats
  const stats = await getUserStats();
  
  return {
    user: locals.user,
    stats
  };
};
