const welcomeEmail = (user) => ({
  subject: `🎉 Welcome to ${process.env.APP_NAME || 'Our Community'}, ${user.name.split(' ')[0]}!`,
  text: `Welcome ${user.name}!

We're absolutely thrilled to have you join ${process.env.APP_NAME || 'our community'}! Here's what you can do next:

1. Complete your profile to personalize your experience
2. Explore our features and services
3. Join our community forums

If you have any questions, our support team is always here to help.

Happy exploring!
The ${process.env.APP_NAME || 'Our Team'} Team`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Open+Sans:wght@400;600&display=swap');
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          background: #f8fafc;
          margin: 0;
          padding: 0;
          color: #334155;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 32px;
        }
        h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
        }
        .welcome-icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-20px);}
          60% {transform: translateY(-10px);}
        }
        .user-name {
          font-weight: 600;
          color: #6366f1;
        }
        .next-steps {
          background: #f5f3ff;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .step-number {
          background: #8b5cf6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          font-size: 14px;
          font-weight: 600;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
        }
        .footer {
          text-align: center;
          padding: 24px;
          font-size: 13px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="welcome-icon">🎉</div>
            <h1>Welcome, <span class="user-name">${user.name.split(' ')[0]}</span>!</h1>
            <p style="opacity: 0.9; margin-top: 8px;">We're thrilled to have you join ${process.env.APP_NAME || 'our community'}</p>
          </div>
          
          <div class="content">
            <p>Thank you for registering with ${process.env.APP_NAME || 'us'}. We've prepared everything to ensure you have an amazing experience.</p>
            
            <div class="next-steps">
              <h3 style="margin-top: 0; color: #6366f1;">Here's what you can do next:</h3>
              
              <div class="step">
                <div class="step-number">1</div>
                <div>Complete your profile to personalize your experience</div>
              </div>
              
              <div class="step">
                <div class="step-number">2</div>
                <div>Explore our features and services</div>
              </div>
              
              <div class="step">
                <div class="step-number">3</div>
                <div>Join our community forums</div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || '#'}" class="cta-button">
                Get Started
              </a>
            </div>
            
            <p>If you have any questions, our support team is always here to help at <a href="mailto:support@${process.env.EMAIL_DOMAIN || 'example.com'}" style="color: #6366f1; text-decoration: none;">support@${process.env.EMAIL_DOMAIN || 'example.com'}</a>.</p>
            
            <p>Happy exploring!<br>
            <strong>The ${process.env.APP_NAME || 'Our Team'} Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Our Company'}. All rights reserved.</p>
            <p style="margin-top: 8px;">
              <a href="${process.env.FRONTEND_URL || '#'}" style="color: #6366f1; text-decoration: none;">Home</a> | 
              <a href="${process.env.FRONTEND_URL || '#'}/support" style="color: #6366f1; text-decoration: none;">Support</a> | 
              <a href="${process.env.FRONTEND_URL || '#'}/community" style="color: #6366f1; text-decoration: none;">Community</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

module.exports = { welcomeEmail };