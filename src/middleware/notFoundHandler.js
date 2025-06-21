/**
 * 🚫 Not Found Handler Middleware
 * Handles 404 errors for undefined routes
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Middleware to handle requests to undefined routes
 */

const { logger } = require('../utils/logger');

/**
 * Not Found Handler Middleware
 * Handles requests to undefined routes and returns a 404 response
 */
const notFoundHandler = (req, res, next) => {
  // Log the 404 request
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Check if the request expects JSON
  const acceptsJson = req.accepts('json');
  
  if (acceptsJson) {
    // Return JSON response for API requests
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENDPOINT_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
        details: [
          'The requested endpoint does not exist',
          'Please check the API documentation for available endpoints',
          'Ensure you are using the correct HTTP method',
          'Verify the URL path is correct'
        ]
      },
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      availableEndpoints: [
        'GET /health',
        'GET /api/v1/docs',
        'POST /api/v1/auth/login',
        'POST /api/v1/auth/register',
        'GET /api/v1/users',
        'GET /api/v1/suppliers',
        'GET /api/v1/materials',
        'GET /api/v1/purchase-orders',
        'GET /api/v1/inventory',
        'GET /api/v1/analytics',
        'GET /api/mcp/status',
        'POST /api/mcp/chat',
        'GET /api/mcp/tools',
        'POST /api/mcp/tools/execute'
      ]
    });
  }

  // Return HTML response for browser requests
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .container {
                text-align: center;
                max-width: 600px;
                padding: 2rem;
            }
            .error-code {
                font-size: 8rem;
                font-weight: bold;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .error-message {
                font-size: 1.5rem;
                margin: 1rem 0;
                opacity: 0.9;
            }
            .error-details {
                font-size: 1rem;
                margin: 2rem 0;
                opacity: 0.8;
                line-height: 1.6;
            }
            .back-link {
                display: inline-block;
                margin-top: 2rem;
                padding: 1rem 2rem;
                background: rgba(255,255,255,0.2);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                transition: all 0.3s ease;
            }
            .back-link:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            .api-info {
                margin-top: 2rem;
                padding: 1rem;
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
                font-size: 0.9rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="error-code">404</h1>
            <h2 class="error-message">Page Not Found</h2>
            <p class="error-details">
                The page you're looking for doesn't exist.<br>
                Please check the URL and try again.
            </p>
            <a href="/health" class="back-link">Go to Health Check</a>
            <div class="api-info">
                <strong>TENZAI Express.js Backend API</strong><br>
                For API documentation, visit: <a href="/api/v1/docs" style="color: #fff;">/api/v1/docs</a>
            </div>
        </div>
    </body>
    </html>
  `);
};

module.exports = {
  notFoundHandler
}; 