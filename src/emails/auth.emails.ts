export const forgotPasswordRequestEmail = (name:string, otp:string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header {
      background-color: #4f46e5;
      padding: 32px 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 600;
    }
    .content {
      padding: 40px;
      color: #333333;
    }
    .content p {
      margin: 0 0 16px 0;
      font-size: 15px;
    }
    .greeting {
      font-weight: 500;
      color: #1a1a1a;
    }
    .otp-section {
      text-align: center;
      margin: 32px 0;
    }
    .otp-label {
      font-size: 13px;
      color: #666666;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    .otp {
      display: inline-block;
      padding: 16px 32px;
      font-size: 28px;
      font-weight: 600;
      color: #4f46e5;
      background-color: #f0f0ff;
      border: 2px solid #e0e0ff;
      border-radius: 8px;
      letter-spacing: 8px;
    }
    .validity {
      margin-top: 12px;
      font-size: 13px;
      color: #666666;
    }
    .signature {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
    }
    .signature p {
      margin: 4px 0;
    }
    .footer {
      background-color: #fafafa;
      padding: 24px 40px;
      text-align: center;
      font-size: 13px;
      color: #666666;
      border-top: 1px solid #e5e5e5;
    }
    .footer p {
      margin: 8px 0;
    }
    a {
      color: #4f46e5;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media screen and (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .header {
        padding: 24px 20px;
      }
      .content {
        padding: 32px 20px;
      }
      .otp {
        font-size: 24px;
        padding: 14px 24px;
        letter-spacing: 6px;
      }
      .footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p class="greeting">Hi ${name},</p>
      <p>We received a request to reset your password. Please use the verification code below to complete the process.</p>
      
      <div class="otp-section">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp">${otp}</div>
        <div class="validity">Valid for 10 minutes</div>
      </div>
      
      <p>If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
      
      <div class="signature">
        <p>Best regards,</p>
        <p><strong>Akinur Rahman</strong></p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Akinur Rahman. All rights reserved.</p>
      <p>Questions? <a href="mailto:contact@akinurrahman.com">Contact Support</a></p>
    </div>
  </div>
</body>
</html>
  `;
};
