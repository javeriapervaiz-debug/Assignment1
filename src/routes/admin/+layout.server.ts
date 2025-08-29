import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  // Simple auth check without complex functions
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }
  
  // Simple admin check
  if (locals.user.role !== 'admin') {
    throw redirect(302, '/dashboard');
  }
  
  return {
    user: locals.user
  };
};