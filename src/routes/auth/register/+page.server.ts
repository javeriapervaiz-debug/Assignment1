import { fail, redirect, type Actions } from '@sveltejs/kit';
import { createUserAccount, createVerificationCode } from '$lib/auth';
import { sendVerificationEmail } from '$lib/email';

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const firstName = (data.get('firstName') as string) || null;
    const lastName = (data.get('lastName') as string) || null;
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');

    console.log('Registration attempt for:', email);

    // Validate that passwords match
    if (password !== confirmPassword) {
      return fail(400, { message: 'Passwords do not match' });
    }

    // Validate password length
    if (password.length < 6) {
      return fail(400, { message: 'Password must be at least 6 characters long' });
    }

    try {
      console.log('Creating user account...');
      // Create the user account first
      const user = await createUserAccount(firstName, lastName, email, password);
      console.log('User account created successfully:', user.id);
      
      console.log('Creating verification code...');
      // Create verification code
      const code = await createVerificationCode(user.id);
      console.log('Verification code generated:', code);
      
      console.log('Sending verification email...');
      // Send verification email
      try {
        await sendVerificationEmail(email, code, firstName || 'User');
        console.log('Verification email sent successfully');
        
        // Return success response instead of redirecting
        return {
          success: true,
          email,
          message: 'Account created successfully! Please check your email for the verification code.'
        };
        
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        
        // If email fails, still show the code on screen as fallback
        return {
          success: true,
          code,
          email,
          message: 'Account created successfully! Email sending failed, but here\'s your verification code:',
          emailFailed: true
        };
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific errors
      if (err.message === 'Email already in use') {
        return fail(400, { message: 'An account with this email already exists. Please try logging in instead.' });
      }
      
      const message = (err && (err.message || err.code || err.detail)) ? (err.message || err.code || err.detail) : typeof err === 'string' ? err : 'Registration failed';
      return fail(400, { message });
    }
  }
};
