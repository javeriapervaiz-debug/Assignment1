import type { PageServerLoad, Actions } from './$types';
import { resetPasswordByCode, verifyPasswordResetCode } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');
  
  return {
    email
  };
};

export const actions: Actions = {
  verify: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email') || '').trim();
    let code = String(data.get('code') || '').trim();
    const backupCode = String(data.get('verification_code') || '').trim();

    // Use backup code if main code is empty
    if (!code && backupCode) {
      code = backupCode;
    }

    if (!email || !code) {
      return fail(400, { 
        error: 'Email and verification code are required',
        email: email || '',
        code: code || ''
      });
    }

    const result = await verifyPasswordResetCode(email, code);
    
    if (!result.success) {
      return fail(400, { 
        error: result.error || 'Invalid or expired verification code',
        email,
        code
      });
    }

    return { 
      success: true, 
      verified: true,
      email,
      code
    };
  },

  reset: async ({ request }) => {
    const data = await request.formData();
    const email = String(data.get('email') || '').trim();
    const code = String(data.get('code') || '').trim();
    let password = String(data.get('password') || '');
    let confirmPassword = String(data.get('confirmPassword') || '');
    const backupPassword = String(data.get('backup_password') || '');
    const backupConfirmPassword = String(data.get('backup_confirmPassword') || '');

    // Use backup passwords if main passwords are empty
    if (!password && backupPassword) {
      password = backupPassword;
    }
    if (!confirmPassword && backupConfirmPassword) {
      confirmPassword = backupConfirmPassword;
    }

    if (!email || !code || !password || !confirmPassword) {
      return fail(400, { 
        error: 'All fields are required',
        email,
        code,
        verified: true
      });
    }

    if (password !== confirmPassword) {
      return fail(400, { 
        error: 'Passwords do not match',
        email,
        code,
        verified: true
      });
    }

    if (password.length < 8) {
      return fail(400, { 
        error: 'Password must be at least 8 characters long',
        email,
        code,
        verified: true
      });
    }

    const result = await resetPasswordByCode(email, code, password);
    
    if (!result.success) {
      return fail(400, { 
        error: 'error' in result ? result.error : 'Password reset failed',
        email,
        code,
        verified: true
      });
    }

    // Redirect to login with success message
    throw redirect(302, '/auth/login?reset=success');
  }
};