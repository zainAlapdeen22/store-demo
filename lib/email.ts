import nodemailer from 'nodemailer';

// Create reusable transporter
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email server configuration error:', error);
        return false;
    }
}

// Send 2FA verification email
export async function send2FAEmail(email: string, token: string, userName?: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-2fa?token=${token}`;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'E-Commerce Store'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'رمز التحقق الثنائي - Two-Factor Authentication Code',
        html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #666;
            margin-bottom: 30px;
          }
          .token-box {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .token {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .security-tips {
            background-color: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .security-tips h3 {
            margin-top: 0;
            color: #1976D2;
          }
          .security-tips ul {
            margin: 10px 0;
            padding-right: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 التحقق الثنائي</h1>
            <p>Two-Factor Authentication</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              مرحباً ${userName || 'عزيزي المستخدم'}،
            </div>
            
            <div class="message">
              لقد تلقينا طلباً لتسجيل الدخول إلى حسابك. لإكمال عملية تسجيل الدخول، يرجى استخدام رمز التحقق التالي:
            </div>
            
            <div class="token-box">
              <div style="font-size: 14px; color: #666; margin-bottom: 10px;">رمز التحقق الخاص بك</div>
              <div class="token">${token}</div>
              <div style="font-size: 12px; color: #999; margin-top: 10px;">صالح لمدة 10 دقائق</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">
                تحقق الآن
              </a>
            </div>
            
            <div class="warning">
              <strong>⚠️ تنبيه أمني:</strong> هذا الرمز صالح لمدة 10 دقائق فقط. إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة وتأمين حسابك فوراً.
            </div>
            
            <div class="security-tips">
              <h3>نصائح أمنية:</h3>
              <ul>
                <li>لا تشارك هذا الرمز مع أي شخص</li>
                <li>تأكد من أنك على الموقع الصحيح قبل إدخال الرمز</li>
                <li>إذا لم تطلب هذا الرمز، قم بتغيير كلمة المرور فوراً</li>
              </ul>
            </div>
            
            <div class="message" style="margin-top: 30px; font-size: 14px;">
              <strong>English:</strong><br>
              We received a request to log in to your account. To complete the login process, please use the verification code above. This code is valid for 10 minutes only.
            </div>
          </div>
          
          <div class="footer">
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها</p>
            <p>This is an automated message, please do not reply</p>
            <p style="margin-top: 10px; color: #999;">
              © ${new Date().getFullYear()} E-Commerce Store. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `
مرحباً ${userName || 'عزيزي المستخدم'},

لقد تلقينا طلباً لتسجيل الدخول إلى حسابك.

رمز التحقق الخاص بك: ${token}

هذا الرمز صالح لمدة 10 دقائق فقط.

أو يمكنك النقر على الرابط التالي للتحقق:
${verificationUrl}

إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.

---

Hello ${userName || 'User'},

We received a request to log in to your account.

Your verification code: ${token}

This code is valid for 10 minutes only.

Or you can click the following link to verify:
${verificationUrl}

If you did not request this code, please ignore this message.
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ 2FA email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending 2FA email:', error);
        return { success: false, error };
    }
}
