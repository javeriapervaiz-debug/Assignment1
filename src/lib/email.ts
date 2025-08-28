// src/lib/email.ts
import * as nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

// Email configuration from environment variables
const SMTP_HOST = env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(env.SMTP_PORT || '587');
const SMTP_USER = env.SMTP_USER || '';
const SMTP_PASS = env.SMTP_PASS || '';
const FROM_EMAIL = env.FROM_EMAIL || SMTP_USER;

// Create transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Send verification email
export async function sendVerificationEmail(email: string, verificationCode: string, firstName?: string) {
  try {
    // Check if SMTP is configured
    if (!SMTP_USER || !SMTP_PASS) {
      console.log('\n=== EMAIL VERIFICATION (SMTP not configured) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify your email address`);
      console.log(`Body: Your verification code is: ${verificationCode}`);
      console.log(`==========================\n`);
      console.log('To enable real email sending, configure these environment variables:');
      console.log('SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL');
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CelesteAI" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address - CelesteAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CelesteAI</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome to CelesteAI, ${firstName || 'there'}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for creating an account with CelesteAI. To complete your registration, 
              please verify your email address using the verification code below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border: 2px solid #667eea;">
                <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your Verification Code:</p>
                <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">
                  ${verificationCode}
                </div>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Enter this code on the verification page to complete your registration. 
              This code will expire in 24 hours.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              If you didn't create an account with CelesteAI, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 CelesteAI. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        Welcome to CelesteAI, ${firstName || 'there'}!
        
        Thank you for creating an account. To complete your registration, please verify your email address using this verification code:
        
        ${verificationCode}
        
        Enter this code on the verification page to complete your registration. This code will expire in 24 hours.
        
        If you didn't create an account with CelesteAI, you can safely ignore this email.
        
        Best regards,
        The CelesteAI Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info.messageId);
    
  } catch (error) {
    console.error('Failed to send verification email:', error);
    
    // Fallback to console logging if email fails
    console.log('\n=== EMAIL VERIFICATION (Fallback) ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your email address`);
    console.log(`Body: Your verification code is: ${verificationCode}`);
    console.log(`==========================\n`);
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    // Check if SMTP is configured
    if (!SMTP_USER || !SMTP_PASS) {
      console.log('\n=== PASSWORD RESET EMAIL (SMTP not configured) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Reset your password`);
      console.log(`Body: Click this link to reset your password: ${resetLink}`);
      console.log(`==========================\n`);
      return;
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CelesteAI" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your password - CelesteAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CelesteAI</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You requested to reset your password for your CelesteAI account. 
              Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              If the button above doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; word-break: break-all; color: #666; font-family: monospace;">
              ${resetLink}
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              This reset link will expire in 1 hour. If you didn't request a password reset, 
              you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 CelesteAI. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        Reset Your Password - CelesteAI
        
        You requested to reset your password. Click the link below to create a new password:
        
        ${resetLink}
        
        This reset link will expire in 1 hour.
        
        If you didn't request a password reset, you can safely ignore this email.
        
        Best regards,
        The CelesteAI Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    
    // Fallback to console logging if email fails
    console.log('\n=== PASSWORD RESET EMAIL (Fallback) ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your password`);
    console.log(`Body: Click this link to reset your password: ${resetLink}`);
    console.log(`==========================\n`);
  }
}
