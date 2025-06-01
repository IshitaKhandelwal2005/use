# Loan Agent Trainer

A MERN stack application designed to help loan agents practice and improve their customer interaction skills through AI-powered simulations using LM Studio for realistic conversations.

## Features

- **User Authentication**: Secure login and registration system
- **Interactive Scenarios**: Practice with various customer scenarios
- **LM Studio Integration**: Powered by local LLM for realistic customer interactions
- **Real-time Feedback**: Get instant feedback on your performance using AI analysis
- **Enhanced Chat Interface**: Modern Material-UI interface with voice features
- **Session History**: Track your progress over time
- **Responsive Design**: Works on desktop and mobile devices
- **Customer Profiles**: Different customer categories (students, professionals, seniors, etc.)

## Tech Stack

- **Frontend**: React, React Router, Material-UI (MUI), React Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: LM Studio (Local LLM)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Material-UI with custom CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- **LM Studio** (for AI-powered conversations)

## LM Studio Setup

1. **Download and Install LM Studio**
   - Visit [LM Studio](https://lmstudio.ai/) and download the application
   - Install and launch LM Studio

2. **Download a Model**
   - In LM Studio, go to the "Discover" tab
   - Search for and download a model (recommended: Meta-Llama-3.1-8B-Instruct-GGUF)
   - Wait for the model to download completely

3. **Start the Local Server**
   - In LM Studio, go to the "Local Server" tab
   - Load your downloaded model
   - Click "Start Server"
   - Note the server URL (usually http://localhost:1234)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/loan-agent-trainer.git
   cd loan-agent-trainer
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the server directory:
     ```
     PORT=5002
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     
     # LM Studio Configuration
     LLM_ENDPOINT=http://localhost:1234/v1/chat/completions
     LLM_MODEL=lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF
     ```
   - Create a `.env` file in the client directory:
     ```
     REACT_APP_API_URL=http://localhost:5002
     ```

5. **Start the development servers**
   - Ensure LM Studio is running with a loaded model
   - In the server directory:
     ```bash
     npm run dev
     ```
   - In the client directory (new terminal):
     ```bash
     npm start
     ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - API Server: http://localhost:5002
   - LM Studio: http://localhost:1234

## Usage

### Enhanced Chat Interface

The application now includes an enhanced chat interface powered by LM Studio:

1. **Access Enhanced Chat**: Navigate to `/enhanced-conversation/{scenario}` for the new Material-UI interface
2. **Configure Customer Profile**: Choose customer type, age, and income range
3. **Start Training**: The AI will act as a realistic customer based on the profile
4. **Practice Conversations**: Engage in natural conversations with AI-powered responses
5. **Get Analysis**: Request detailed performance analysis using AI feedback
6. **Voice Features**: Use text-to-speech and voice input capabilities

### Available Scenarios

- `credit-card` - Credit card inquiries and applications
- `personal-loan` - Personal loan consultations
- `business-loan` - Business financing discussions
- `savings` - Savings account and investment options
- `demat` - Stock market and demat account guidance
- `investment` - Investment product recommendations

### Customer Profiles

- **Salaried Professional**: IT professionals, corporate employees
- **Women Entrepreneur**: Business owners, startup founders
- **Senior Citizen**: Retirees, pension holders
- **Student**: College students, young adults
- **Self Employed**: Consultants, freelancers

## Project Structure

```
loan-agent-trainer/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/      # Reusable components
│       ├── context/         # React context providers
│       ├── pages/           # Page components
│       │   └── EnhancedConversation.js  # New Material-UI chat interface
│       ├── services/        # API services
│       └── utils/           # Utility functions
└── server/                 # Backend Node.js/Express application
    ├── config/             # Configuration files
    │   └── lmstudio.js     # LM Studio configuration
    ├── controllers/        # Route controllers
    │   └── conversationController.js  # Updated with LM Studio integration
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    └── utils/              # Utility functions
```

## API Endpoints

### New LM Studio-Powered Endpoints

- `POST /api/conversations/start` - Start conversation with LM Studio
- `POST /api/conversations/:id/message` - Send message (LM Studio response)
- `POST /api/conversations/:id/analyze` - Get AI-powered performance analysis
- `POST /api/conversations/:id/end` - End conversation session
- `GET /api/conversations/history` - Get conversation history

## Troubleshooting

### LM Studio Connection Issues

1. **Ensure LM Studio is running**: Check that the local server is active
2. **Check the endpoint**: Verify LLM_ENDPOINT in your .env file matches LM Studio's server URL
3. **Model loading**: Make sure a model is loaded in LM Studio before starting conversations
4. **Firewall**: Ensure port 1234 (or your LM Studio port) is not blocked

### Common Error Messages

- **"LM Studio server is not running"**: Start LM Studio and load a model
- **"Failed to start session"**: Check LM Studio configuration and network connection
- **"Analysis temporarily unavailable"**: LM Studio connection issue, will fall back to basic analysis

## Available Scripts

### Server
- `npm run dev` - Start the server in development mode with nodemon
- `npm start` - Start the server in production mode
- `npm test` - Run tests

### Client
- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [LM Studio](https://lmstudio.ai/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Icons](https://react-icons.github.io/react-icons/)
