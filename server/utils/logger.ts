import winston from 'winston';

// Configure Winston logger for enterprise logging
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'dockdirect-api' },
  transports: [
    // Write all logs to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // In production, you'd also add file transports
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Audit log specific functions
export const auditLog = {
  userSignup: (userId: string, email: string, ip?: string) => {
    logger.info('User signup', { 
      action: 'user_signup', 
      userId, 
      email, 
      ip,
      timestamp: new Date().toISOString() 
    });
  },
  
  userLogin: (userId: string, email: string, ip?: string) => {
    logger.info('User login', { 
      action: 'user_login', 
      userId, 
      email, 
      ip,
      timestamp: new Date().toISOString() 
    });
  },
  
  adminAccess: (userId: string, action: string, ip?: string) => {
    logger.warn('Admin access', { 
      action: 'admin_access', 
      userId, 
      adminAction: action,
      ip,
      timestamp: new Date().toISOString() 
    });
  },
  
  securityEvent: (event: string, details: any, ip?: string) => {
    logger.error('Security event', { 
      action: 'security_event', 
      event,
      details,
      ip,
      timestamp: new Date().toISOString() 
    });
  },
  
  userAction: (userId: string, action: string, ip?: string) => {
    logger.info('User action', { 
      action: 'user_action', 
      userId, 
      userAction: action,
      ip,
      timestamp: new Date().toISOString() 
    });
  }
};

export default logger;