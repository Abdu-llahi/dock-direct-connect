import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // For development, use ethereal email for testing
      if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        logger.info('Email service initialized with test account', {
          user: testAccount.user,
          pass: testAccount.pass,
          smtp: 'smtp.ethereal.email:587'
        });
        
        this.isConfigured = true;
        return;
      }

      // Production email configuration
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const config: EmailConfig = {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        };

        this.transporter = nodemailer.createTransport(config);
        this.isConfigured = true;
        
        logger.info('Email service initialized with production SMTP');
      } else {
        logger.warn('Email service not configured - missing SMTP environment variables');
      }
    } catch (error) {
      logger.error('Failed to initialize email service', { error });
    }
  }

  private getEmailVerificationTemplate(name: string, verificationUrl: string): EmailTemplate {
    return {
      subject: 'Verify Your DockDirect Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your DockDirect Account</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .title { font-size: 24px; color: #1f2937; margin-bottom: 20px; }
            .content { margin-bottom: 30px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .button:hover { background: #1d4ed8; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
            .verification-code { background: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚚 DockDirect</div>
              <h1 class="title">Verify Your Account</h1>
            </div>
            
            <div class="content">
              <p>Hello ${name},</p>
              
              <p>Thank you for joining DockDirect! To complete your registration and start connecting with trusted logistics partners, please verify your email address.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              
              <p>If the button above doesn't work, copy and paste this link into your browser:</p>
              <div class="verification-code">${verificationUrl}</div>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>Once verified, you'll have access to:</p>
              <ul>
                <li>Post and manage load requests</li>
                <li>Connect with verified drivers and shippers</li>
                <li>Track shipments in real-time</li>
                <li>Access our enterprise-grade logistics platform</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you didn't create an account with DockDirect, please ignore this email.</p>
              <p>Need help? Contact our support team at <a href="mailto:support@dockdirect.com">support@dockdirect.com</a></p>
              <p>&copy; 2024 DockDirect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name},

Thank you for joining DockDirect! To complete your registration and start connecting with trusted logistics partners, please verify your email address.

Verification Link: ${verificationUrl}

This link will expire in 24 hours.

Once verified, you'll have access to:
- Post and manage load requests
- Connect with verified drivers and shippers
- Track shipments in real-time
- Access our enterprise-grade logistics platform

If you didn't create an account with DockDirect, please ignore this email.

Need help? Contact our support team at support@dockdirect.com

© 2024 DockDirect. All rights reserved.
      `
    };
  }

  private getBetaWaitlistTemplate(email: string, confirmationUrl: string): EmailTemplate {
    return {
      subject: 'Welcome to DockDirect Beta - Confirm Your Interest',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DockDirect Beta</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .title { font-size: 24px; color: #1f2937; margin-bottom: 20px; }
            .content { margin-bottom: 30px; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .button:hover { background: #047857; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
            .beta-badge { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚚 DockDirect</div>
              <span class="beta-badge">🌟 Early Access Beta</span>
              <h1 class="title">You're In!</h1>
            </div>
            
            <div class="content">
              <p>Hello,</p>
              
              <p>Congratulations! You've successfully signed up for early access to DockDirect, the next-generation logistics platform that's revolutionizing freight management.</p>
              
              <p>Please confirm your interest and secure your spot in our exclusive beta program:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" class="button">Confirm Beta Access</a>
              </p>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>🎯 <strong>Exclusive Access:</strong> Be among the first to experience our platform</li>
                <li>📧 <strong>Early Updates:</strong> Get notified as soon as beta launches</li>
                <li>💬 <strong>Direct Feedback:</strong> Help shape the future of logistics</li>
                <li>🎁 <strong>Launch Benefits:</strong> Special pricing and premium features</li>
              </ul>
              
              <p>Our beta program launches soon, and confirmed participants will receive priority access and special benefits when we go live.</p>
            </div>
            
            <div class="footer">
              <p>Questions about our beta program? Reply to this email and we'll get back to you promptly.</p>
              <p>&copy; 2024 DockDirect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello,

Congratulations! You've successfully signed up for early access to DockDirect, the next-generation logistics platform that's revolutionizing freight management.

Please confirm your interest and secure your spot in our exclusive beta program:

Confirmation Link: ${confirmationUrl}

What's Next?
- Exclusive Access: Be among the first to experience our platform
- Early Updates: Get notified as soon as beta launches
- Direct Feedback: Help shape the future of logistics
- Launch Benefits: Special pricing and premium features

Our beta program launches soon, and confirmed participants will receive priority access and special benefits when we go live.

Questions about our beta program? Reply to this email and we'll get back to you promptly.

© 2024 DockDirect. All rights reserved.
      `
    };
  }

  async sendVerificationEmail(to: string, name: string, verificationToken: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured - skipping verification email');
      return false;
    }

    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-email?token=${verificationToken}`;
      const template = this.getEmailVerificationTemplate(name, verificationUrl);

      const info = await this.transporter.sendMail({
        from: `"DockDirect" <${process.env.FROM_EMAIL || 'noreply@dockdirect.com'}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      logger.info('Verification email sent', { to, messageId: info.messageId });
      
      // Log test email URL for development
      if (process.env.NODE_ENV === 'development') {
        logger.info('Test email URL', { url: nodemailer.getTestMessageUrl(info) });
      }

      return true;
    } catch (error) {
      logger.error('Failed to send verification email', { to, error });
      return false;
    }
  }

  async sendBetaWaitlistConfirmation(to: string, confirmationToken: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured - skipping beta confirmation email');
      return false;
    }

    try {
      const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/confirm-beta?token=${confirmationToken}`;
      const template = this.getBetaWaitlistTemplate(to, confirmationUrl);

      const info = await this.transporter.sendMail({
        from: `"DockDirect Beta" <${process.env.FROM_EMAIL || 'beta@dockdirect.com'}>`,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      logger.info('Beta confirmation email sent', { to, messageId: info.messageId });
      
      // Log test email URL for development
      if (process.env.NODE_ENV === 'development') {
        logger.info('Test email URL', { url: nodemailer.getTestMessageUrl(info) });
      }

      return true;
    } catch (error) {
      logger.error('Failed to send beta confirmation email', { to, error });
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      logger.warn('Email service not configured - skipping password reset email');
      return false;
    }

    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
      
      const info = await this.transporter.sendMail({
        from: `"DockDirect Security" <${process.env.FROM_EMAIL || 'security@dockdirect.com'}>`,
        to,
        subject: 'Reset Your DockDirect Password',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>You requested a password reset for your DockDirect account. Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        `,
        text: `
Hello ${name},

You requested a password reset for your DockDirect account. 

Reset Link: ${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.
        `,
      });

      logger.info('Password reset email sent', { to, messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error('Failed to send password reset email', { to, error });
      return false;
    }
  }
}

export const emailService = new EmailService();