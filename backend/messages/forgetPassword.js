const forgetPasswordEmail = (user, resetUrl) => ({
  subject: '🔒 Password Reset Request - Action Required',
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
          background-color: #f9fafb;
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
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          padding: 32px;
          text-align: center;
          color: white;
        }
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.15);
          padding: 8px 16px;
          border-radius: 20px;
          margin-top: 16px;
          font-size: 14px;
          font-weight: 500;
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
          color: #1d4ed8;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 24px 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
          transition: all 0.2s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
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
        .instruction-list {
          margin: 20px 0;
          padding-left: 20px;
        }
        .instruction-list li {
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1 style="color: white;">Password Reset</h1>
            <div class="security-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M12 3V5M17.2 7.2L16 6M20 12H18M17.2 16.8L16 18M12 19V21M7.2 16.8L8 18M4 12H6M7.2 7.2L8 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              SECURE REQUEST
            </div>
          </div>
          
          <div class="content">
            <h1>Hello <span class="user-name">${user.name}</span>,</h1>
            
            <p>We received a request to reset your password. To complete the process, please click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="cta-button">
                Reset My Password
              </a>
            </div>
            
            <div class="warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V11M12 15H12.01M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21Z" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>This link will expire in 1 hour. Do not share it with anyone.</span>
            </div>
            
            <p>For your security:</p>
            <ul class="instruction-list">
              <li>Never share your password or this link</li>
              <li>Make sure you're on a secure network</li>
              <li>Check that the website URL begins with "https://"</li>
            </ul>
            
            <p>If you didn't request this change, please secure your account immediately by changing your password and enabling two-factor authentication.</p>
          </div>
          
          <div class="footer">
            <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #3b82f6;">${resetUrl}</p>
            <p style="margin-top: 16px;">© ${new Date().getFullYear()} ${process.env.APP_NAME || 'YourApp'}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

module.exports = forgetPasswordEmail;