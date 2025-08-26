import { fail, redirect, type Actions } from '@sveltejs/kit';
import { registerAndSignIn } from '$lib/auth';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const firstName = (data.get('firstName') as string) || null;
    const lastName = (data.get('lastName') as string) || null;
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    try {
      await registerAndSignIn(event, firstName, lastName, email, password);
    } catch (err: any) {
      const message = (err && (err.message || err.code || err.detail)) ? (err.message || err.code || err.detail) : typeof err === 'string' ? err : 'Registration failed';
      return fail(400, { message });
    }

    throw redirect(302, '/dashboard');
  }
};
