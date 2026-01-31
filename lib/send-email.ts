import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOTPEmail(email: string, code: string) {
    try {
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME || 'E-Commerce Store'}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'رمز التحقق الخاص بك - Your Verification Code',
            html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 20px;">متجر إلكتروني</h1>
            <h2 style="color: #555; text-align: center; margin-bottom: 30px;">رمز التحقق الخاص بك</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: white; font-size: 16px; margin-bottom: 15px;">رمز التحقق:</p>
              <div style="background-color: white; border-radius: 8px; padding: 20px; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${code}</span>
              </div>
            </div>
            
            <p style="color: #666; text-align: center; margin-top: 30px; font-size: 14px;">
              هذا الرمز صالح لمدة <strong>5 دقائق</strong> فقط
            </p>
            <p style="color: #666; text-align: center; font-size: 14px;">
              إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div dir="ltr" style="text-align: center;">
              <h2 style="color: #555; margin-bottom: 20px;">Your Verification Code</h2>
              <p style="color: #666; font-size: 14px;">
                This code is valid for <strong>5 minutes</strong> only
              </p>
              <p style="color: #666; font-size: 14px;">
                If you didn't request this code, please ignore this email
              </p>
            </div>
          </div>
          
          <p style="color: #999; text-align: center; margin-top: 20px; font-size: 12px;">
            © ${new Date().getFullYear()} متجر إلكتروني. All rights reserved.
          </p>
        </div>
      `,
            text: `
رمز التحقق الخاص بك: ${code}

هذا الرمز صالح لمدة 5 دقائق فقط.
إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

---

Your Verification Code: ${code}

This code is valid for 5 minutes only.
If you didn't request this code, please ignore this email.
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent:', info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        return { success: false, error };
    }
}
