const resetPasswordConfirmationEmail = (user, loginUrl) => ({
  subject: `🔐 Password Updated Successfully | ${process.env.APP_NAME || 'Your Account'}`,
  text: `Password Reset Confirmation

Hello ${user.name},

Your password has been successfully updated. If you didn't make this change, please contact our support team immediately at ${process.env.SUPPORT_EMAIL || 'support@example.com'}.

You can now log in to your account using your new password:
${loginUrl}

For your security:
- Always create a strong, unique password
- Never share your password with anyone
- Enable two-factor authentication for extra security

Best regards,
The ${process.env.APP_NAME || 'Account'} Team`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          color: #111827;
        }
        .container {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
        }
        .card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 32px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 32px;
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #111827;
        }
        .user-name {
          font-weight: 600;
          color: #059669;
        }
        .success-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        .security-tips {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          padding: 16px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 24px 0;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
          transition: all 0.2s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }
        .footer {
          text-align: center;
          padding: 24px;
          font-size: 13px;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
        }
        .warning {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          padding: 12px;
          border-radius: 8px;
          margin: 24px 0;
          color: #b91c1c;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1 style="color: white;">Password Updated Successfully</h1>
          </div>
          
          <div class="content">
            <h1>Hello <span class="user-name">${user.name}</span>,</h1>
            
            <p>Your account password was successfully updated on ${new Date().toLocaleString()}.</p>
            
            <div class="security-tips">
              <h3 style="margin-top: 0; color: #065f46;">Security Recommendations:</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Use a unique password for this account</li>
                <li>Consider enabling two-factor authentication</li>
                <li>Never share your password with anyone</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="cta-button">
                Log In to Your Account
              </a>
            </div>
            
            <div class="warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V11M12 15H12.01M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>If you didn't make this change, please <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@example.com'}" style="color: #b91c1c; font-weight: 600;">contact us immediately</a>.</span>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Our Service'}. All rights reserved.</p>
            <p style="margin-top: 8px;">
              <a href="${process.env.FRONTEND_URL || '#'}/security" style="color: #059669; text-decoration: none;">Security Center</a> | 
              <a href="${process.env.FRONTEND_URL || '#'}/support" style="color: #059669; text-decoration: none;">Help Center</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

module.exports = resetPasswordConfirmationEmail;