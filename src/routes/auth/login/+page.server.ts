import { fail, redirect, type Actions } from '@sveltejs/kit';
import { signInWithEmail } from '$lib/auth';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    try {
      await signInWithEmail(event, email, password);
      throw redirect(302, '/dashboard');
    } catch (err: any) {
      return fail(400, { message: err?.message || 'Invalid credentials' });
    }
  }
};
