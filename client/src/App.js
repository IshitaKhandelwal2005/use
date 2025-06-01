import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ConversationProvider } from './context/ConversationContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Conversation from './pages/Conversation';
import Training from './components/Training';
import Feedback from './pages/Feedback';
import History from './pages/History';
import NotFound from './pages/NotFound';
import Features from './pages/Features';
import EnhancedConversation from './pages/EnhancedConversation';
import ProductCategory from './components/ProductCategory';
import PreTrainingPage from './pages/PreTrainingPage'; // Or './pages/PreTrainingPage.jsx'
import IntermediatePage from './pages/IntermediatePage';

function App() {
  return (
    <AuthProvider>
      <ConversationProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          
          <main className="flex-grow-1 py-4">
            <Container>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/features" element={<Features />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/intermediate/:scenarioId"
                  element={
                    <PrivateRoute>
                      <IntermediatePage />
                    </PrivateRoute>
                  }
                />
                <Route 
                  path="/conversation/:scenarioId" 
                  element={
                    <PrivateRoute>
                      <Conversation />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/enhanced-conversation/:scenarioId" 
                  element={
                    <PrivateRoute>
                      <EnhancedConversation />
                    </PrivateRoute>
                  } 
                />

                {/* <Route 
                  path="/pre-training/:scenarioId" 
                  element={
                    <PrivateRoute>
                      <PreTraining />
                    </PrivateRoute>
                  } 
                /> */}
                
                <Route 
                  path="/training/:type/:category/:scenarioId" 
                  element={
                    <PrivateRoute>
                      <Training />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/feedback/:conversationId" 
                  element={
                    <PrivateRoute>
                      <Feedback />
                    </PrivateRoute>
                  } 
                />
                
                <Route 
                  path="/history" 
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  } 
                />

                {/* 404 - Not Found */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Container>
          </main>
          
          <footer className="bg-light py-4 mt-5">
            <Container>
              <div className="text-center text-muted">
                <p className="mb-0">© {new Date().getFullYear()} Loan Agent Trainer. All rights reserved.</p>
              </div>
            </Container>
          </footer>
          
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </ConversationProvider>
    </AuthProvider>
  );
}

export default App;
