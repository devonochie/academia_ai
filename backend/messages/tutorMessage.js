const welcomeCourseMessage = async (user, curriculum) => ({
  subject: `🌟 Welcome to ${curriculum.topic}! Let's Begin Your Learning Journey`,
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
          border-radius: 12px; 
          box-shadow: 0 4px 24px rgba(0,0,0,0.06); 
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 32px;
        }
        h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
        }
        .course-title {
          font-size: 22px;
          font-weight: 600;
          color: #4f46e5;
          margin: 24px 0;
          font-family: 'Poppins', sans-serif;
        }
        p {
          font-size: 15px;
          margin-bottom: 20px;
        }
        .btn-primary {
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }
        .welcome-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .highlight-box {
          background: #f5f3ff;
          border-left: 4px solid #8b5cf6;
          padding: 16px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        .footer {
          text-align: center;
          padding: 24px;
          font-size: 13px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }
        .user-name {
          font-weight: 600;
          color: #4f46e5;
        }
        .progress-container {
          margin: 28px 0;
        }
        .progress-text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          width: 5%;
          background: linear-gradient(90deg, #4f46e5 0%, #a78bfa 100%);
          border-radius: 4px;
          animation: progressAnimation 1.5s ease-in-out forwards;
        }
        @keyframes progressAnimation {
          from { width: 5%; }
          to { width: 15%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="welcome-icon">🎓</div>
            <h1>Welcome to Your New Course!</h1>
          </div>
          
          <div class="content">
            <p>Dear<span class="user-name">${user?.name ? ` ${user.name}` : ''}</span>,</p>
            
            <p>We're absolutely delighted to welcome you to <strong>${curriculum.topic}</strong>! You've taken the first step toward expanding your knowledge and skills.</p>
            
            <div class="highlight-box">
              <p>Here's what you can expect:</p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Engaging lessons designed by experts</li>
                <li>Practical exercises to reinforce learning</li>
                <li>Support from our community and instructors</li>
              </ul>
            </div>

            <div class="progress-container">
              <div class="progress-text">
                <span>Your Progress</span>
                <span>15%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/curricula/${curriculum._id}" class="btn-primary">
                Continue Your Journey →
              </a>
            </p>
            
            <p>Remember, every expert was once a beginner. We're here to support you every step of the way!</p>
            
            <p>Happy learning,<br>
            <strong>The ${process.env.APP_NAME || 'Academia'} Team</strong></p>
          </div>
          
          <div class="footer">
            <p>Need help? <a href="${process.env.FRONTEND_URL}/support" style="color: #4f46e5; text-decoration: none;">Contact our support team</a></p>
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Academia'}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

module.exports = welcomeCourseMessage;