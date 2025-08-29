import { fail, type Actions } from '@sveltejs/kit';
import { createPasswordResetToken } from '$lib/auth';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email') || '').trim();

    if (!email) {
      return fail(400, { error: 'Email is required', email: '' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { error: 'Please enter a valid email address', email });
    }

    const result = await createPasswordResetToken(email);
    
    if (!result.success) {
      // Don't reveal if email exists or not for security
      return { 
        success: true, 
        message: 'If an account with this email exists, you will receive password reset instructions shortly.',
        email
      };
    }

    return { 
      success: true, 
      message: 'Password reset code sent to your email. Please check your inbox.',
      email
    };
  }
};