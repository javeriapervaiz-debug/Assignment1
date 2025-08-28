import { fail, type Actions } from '@sveltejs/kit';
import { createPasswordResetToken, generateResetLink } from '$lib/auth';

export const actions: Actions = {
  default: async ({ request, url }) => {
    const data = await request.formData();
    const email = String(data.get('email') || '');
    if (!email) return fail(400, { message: 'Email is required' });
    const res = await createPasswordResetToken(email);
    if (res) {
      const link = generateResetLink(url.origin, res.token);
      console.log('Reset link:', link);
    }
    return { message: 'If that account exists, a reset link has been sent.' };
  }
};


