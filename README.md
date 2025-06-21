# 🤖 TENZAI Express.js Backend with MCP Integration

> **Advanced Backend API for TENZAI Purchasing System with AI-Powered Features**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0+-purple.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Overview

TENZAI Express.js Backend is a comprehensive, production-ready API server for the TENZAI Purchasing System. Built with modern Node.js technologies and enhanced with **Model Context Protocol (MCP)** integration for AI-powered features.

### ✨ Key Features

- 🔐 **Authentication & Authorization** - JWT-based security
- 👥 **User Management** - Complete user lifecycle management
- 🏢 **Supplier Management** - Supplier data and relationship management
- 📦 **Material Management** - Inventory and material tracking
- 📋 **Purchase Order Management** - Complete PO lifecycle
- 🤖 **AI Integration (MCP)** - Advanced AI capabilities with context management
- 📊 **Data Analysis & Reporting** - AI-powered insights and analytics
- 🔧 **Tool Execution** - Automated workflows and data processing
- 📈 **Real-time Monitoring** - Performance and health monitoring
- 🛡️ **Security First** - Comprehensive security measures
- 📝 **Comprehensive Logging** - Detailed request/response logging
- 🧪 **Testing Ready** - Jest testing framework included

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Mobile App    │    │   Third Party   │
│   (React/Vue)   │    │   (React Native)│    │   Integrations  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Express.js Backend      │
                    │   (Port 3000)             │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   🤖 MCP Service          │
                    │   (Port 3001)             │
                    │   • AI Integration        │
                    │   • Context Management    │
                    │   • Tool Execution        │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│   PostgreSQL      │  │   Redis Cache     │  │   File Storage    │
│   Database        │  │   (Sessions)      │  │   (Uploads)       │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## 🤖 MCP (Model Context Protocol) Integration

This backend includes advanced **Model Context Protocol (MCP)** integration, providing:

### 🧠 AI Capabilities
- **Multi-Provider Support**: OpenAI, Anthropic, Local LLMs
- **Context Management**: Persistent conversation context
- **Memory System**: Long-term interaction memory
- **Tool Integration**: Automated data analysis and processing

### 🛠️ Available Tools
- **Data Analysis**: Trend analysis, pattern recognition
- **Report Generation**: Automated business reports
- **Trend Prediction**: ML-powered forecasting
- **Inventory Optimization**: Smart inventory management
- **Data Validation**: Quality assurance automation

### 📊 Context Management
- **Session Persistence**: Maintain conversation context
- **Memory Retention**: Long-term interaction storage
- **Context Window**: Configurable context size limits
- **History Tracking**: Complete interaction history

## 🛠️ Technology Stack

### Core Technologies
- **Node.js** (v18+) - Runtime environment
- **Express.js** (v4.18+) - Web framework
- **PostgreSQL** (v14+) - Primary database
- **Redis** - Caching and sessions
- **Prisma** - Database ORM

### AI & MCP Technologies
- **Model Context Protocol** - AI integration standard
- **OpenAI API** - GPT-4 integration
- **Anthropic API** - Claude integration
- **Local LLMs** - On-premise AI models

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Winston** - Logging
- **Nodemon** - Development server

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/tenzaitech/express-v1.git
   cd express-v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb tenzai_purchasing
   
   # Run migrations (when Prisma is set up)
   npx prisma migrate dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tenzai_purchasing"

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# MCP Configuration
MCP_ENABLED=true
MCP_PORT=3001
AI_PROVIDER=openai
AI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-4

# Security
MCP_API_KEY=your-mcp-api-key-here
MCP_RATE_LIMIT_ENABLED=true
```

### MCP Configuration

```bash
# AI Provider Settings
AI_PROVIDER=openai          # openai, anthropic, local
AI_MODEL=gpt-4             # Model name
AI_MAX_TOKENS=4000         # Max response tokens
AI_TEMPERATURE=0.7         # Response creativity

# Context Management
MAX_CONTEXT_SIZE=10000     # Max context size in characters
CONTEXT_WINDOW=8000        # Context window size
ENABLE_MEMORY=true         # Enable long-term memory
MEMORY_RETENTION=24        # Memory retention in hours

# Tool Configuration
ENABLE_TOOLS=true          # Enable tool execution
TOOL_TIMEOUT=30000         # Tool execution timeout
```

## 🚀 API Endpoints

### Core Endpoints
```
GET    /                    # API information
GET    /health             # Health check
POST   /api/auth/login     # User login
POST   /api/auth/register  # User registration
GET    /api/users          # Get users
GET    /api/suppliers      # Get suppliers
GET    /api/materials      # Get materials
GET    /api/purchase-orders # Get purchase orders
```

### 🤖 MCP Endpoints
```
GET    /api/mcp/status     # MCP service status
POST   /api/mcp/chat       # AI chat with context
POST   /api/mcp/tools/execute # Execute AI tools
GET    /api/mcp/tools      # List available tools
GET    /api/mcp/prompts    # List prompt templates
GET    /api/mcp/context/:sessionId # Get context
POST   /api/mcp/context    # Create/update context
DELETE /api/mcp/context/:sessionId # Clear context
GET    /api/mcp/resources  # List available resources
POST   /api/mcp/health     # MCP health check
```

## 🤖 MCP Usage Examples

### AI Chat with Context
```bash
curl -X POST http://localhost:3000/api/mcp/chat \
  -H "Content-Type: application/json" \
  -H "X-MCP-API-Key: your-api-key" \
  -d '{
    "message": "Analyze our purchasing trends for the last month",
    "sessionId": "user123",
    "options": {
      "executeTools": true,
      "maxTokens": 2000
    }
  }'
```

### Tool Execution
```bash
curl -X POST http://localhost:3000/api/mcp/tools/execute \
  -H "Content-Type: application/json" \
  -H "X-MCP-API-Key: your-api-key" \
  -d '{
    "toolName": "analyzeData",
    "parameters": {
      "source": "purchaseOrders",
      "analysis": "trends",
      "filters": {
        "dateRange": "last30days"
      }
    }
  }'
```

### Context Management
```bash
# Get context
curl -X GET http://localhost:3000/api/mcp/context/user123 \
  -H "X-MCP-API-Key: your-api-key"

# Update context
curl -X POST http://localhost:3000/api/mcp/context \
  -H "Content-Type: application/json" \
  -H "X-MCP-API-Key: your-api-key" \
  -d '{
    "sessionId": "user123",
    "data": {
      "preferences": {
        "reportFormat": "pdf",
        "analysisDepth": "detailed"
      }
    }
  }'
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=authRoutes.test.js
```

### Test MCP Features
```bash
# Test MCP service
npm test -- --testPathPattern=mcpService.test.js

# Test MCP routes
npm test -- --testPathPattern=mcpRoutes.test.js
```

## 📊 Monitoring & Logging

### Health Checks
```bash
# Main API health
curl http://localhost:3000/health

# MCP service health
curl -X POST http://localhost:3000/api/mcp/health
```

### Logs
- **Application logs**: `logs/app.log`
- **Error logs**: `logs/error.log`
- **Access logs**: `logs/access.log`

### Metrics
- Request/response times
- Error rates
- AI usage statistics
- Tool execution metrics

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Session management
- API key validation

### MCP Security
- MCP API key authentication
- Rate limiting
- Input validation
- Context isolation
- Memory encryption

### Data Protection
- Input sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet.js security headers

## 🚀 Deployment

### Production Setup
```bash
# Build for production
npm run build

# Start production server
npm start

# Using PM2
pm2 start ecosystem.config.js
```

### Docker Deployment
```bash
# Build Docker image
docker build -t tenzai-express-backend .

# Run container
docker run -p 3000:3000 -p 3001:3001 tenzai-express-backend
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=8080
HOST=0.0.0.0
DATABASE_URL=your-production-database-url
REDIS_URL=your-production-redis-url
JWT_SECRET=your-production-jwt-secret
MCP_API_KEY=your-production-mcp-api-key
AI_API_KEY=your-production-ai-api-key
```

## 📚 Documentation

### API Documentation
- **Swagger/OpenAPI**: Available at `/api/docs` (when implemented)
- **Postman Collection**: Available in `/docs/postman/`
- **API Examples**: See `/docs/examples/`

### MCP Documentation
- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **Tool Schemas**: Available via `/api/mcp/tools/:toolName/schema`
- **Prompt Templates**: Available via `/api/mcp/prompts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@tenzaitech.com

### Community
- **GitHub**: [github.com/tenzaitech/express-v1](https://github.com/tenzaitech/express-v1)
- **Discord**: Join our Discord server
- **Blog**: [blog.tenzaitech.com](https://blog.tenzaitech.com)

## 🙏 Acknowledgments

- **Express.js Team** - For the amazing web framework
- **MCP Community** - For the Model Context Protocol
- **OpenAI & Anthropic** - For AI capabilities
- **PostgreSQL Team** - For the reliable database
- **All Contributors** - For making this project better

---

**Made with ❤️ by TENZAI Tech Team**

*Empowering businesses with intelligent purchasing solutions* 