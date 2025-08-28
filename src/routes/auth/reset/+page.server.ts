import type { PageServerLoad, Actions } from './$types';
import { resetPasswordByToken } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const token = url.searchParams.get('token') || undefined;
  return { token };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const token = String(data.get('token') || '');
    const password = String(data.get('password') || '');
    if (!token || !password) return fail(400, { message: 'Missing data' });
    try {
      await resetPasswordByToken(token, password);
    } catch (e: any) {
      return fail(400, { message: e?.message || 'Reset failed' });
    }
    throw redirect(302, '/auth/login');
  }
};


