const { z } = require('zod')


const userValidators = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters"),
    
  email: z.string()
    .min(6, "Email must be at least 6 characters long")
    .email("Invalid email address"),
    
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
    
  // role: z.enum(['admin', 'user', 'moderator']).optional().default('user')
});

module.exports = userValidators