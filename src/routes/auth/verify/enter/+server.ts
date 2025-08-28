import { json, type RequestHandler } from '@sveltejs/kit';
import { verifyEmailCode } from '$lib/auth';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return json({ message: 'Verification code is required' }, { status: 400 });
    }
    
    // Verify the code
    await verifyEmailCode(code);
    
    return json({ message: 'Email verified successfully' });
    
  } catch (error: any) {
    console.error('Verification error:', error);
    
    return json({ 
      message: error.message || 'Verification failed' 
    }, { status: 400 });
  }
};
