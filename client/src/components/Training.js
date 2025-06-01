import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useConversation } from '../context/ConversationContext';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const ChatContainer = styled(Card)`
  height: calc(100vh - 200px);
  margin: 20px 0;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled(Card.Body)`
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8f9fa;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  margin: ${props => props.isAgent ? '0.5rem 0 0.5rem auto' : '0.5rem auto 0.5rem 0'};
  padding: 1rem;
  border-radius: ${props => props.isAgent ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0'};
  background: ${props => props.isAgent ? '#2B52DD' : '#ffffff'};
  color: ${props => props.isAgent ? '#ffffff' : '#1A1A1A'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CustomerContext = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CategoryBadge = styled(Badge)`
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
`;

const Training = () => {
  const { scenarioId, type, category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const {
    conversation,
    messages,
    loading,
    error,
    startConversation,
    sendMessage,
    endConversation
  } = useConversation();

  // Customer profile state based on URL parameters or navigation state
  const [customerProfile, setCustomerProfile] = useState(() => {
    return location.state?.customerProfile || {
      category: category || 'general',
      age: '25',
      income: '5L-10L',
      context: ''
    };
  });

  const [loadingEndTraining, setLoading] = useState(false);
  const [errorEndTraining, setError] = useState('');

  useEffect(() => {
    const initializeTraining = async () => {
      // Check authentication first
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login...');
        navigate('/login', { 
          state: { 
            from: `/training/${type}/${category}/${scenarioId}`,
            message: 'Please log in to start training.'
          } 
        });
        return;
      }

      if (!conversation) {
        console.log('Starting training with scenario:', scenarioId);
        const result = await startConversation(scenarioId, customerProfile);
        if (!result.success) {
          console.error('Failed to start training:', result.error);
          if (result.error.includes('401') || result.error.includes('unauthorized')) {
            navigate('/login', { 
              state: { 
                from: `/training/${type}/${category}/${scenarioId}`,
                message: 'Your session has expired. Please log in again.'
              } 
            });
          } else {
            navigate('/');
          }
        }
      }
    };

    initializeTraining();
  }, [conversation, scenarioId, type, category, startConversation, navigate, isAuthenticated, customerProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const result = await sendMessage(message);
    if (result.success) {
      setMessage('');
    }
  };

  const handleEndTraining = async () => {
    try {
      if (window.confirm('Are you sure you want to end this training session?')) {
        console.log('Ending conversation...');
        setLoading(true);
        
        const result = await endConversation();
        console.log('End conversation result:', result);
        
        if (result.success && result.data) {
          const { conversationId } = result.data;
          console.log('Navigating to feedback page for conversation:', conversationId);
          // Redirect to feedback page with conversation data
          navigate(`/feedback/${conversationId}`, {
            state: {
              customerProfile,
              scenario: scenarioId,
              category: category
            }
          });
        } else {
          console.error('Failed to end conversation:', result.error);
          setError('Failed to end training session. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error ending training:', err);
      setError('An error occurred while ending the training session.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'women-entrepreneur': 'Women Entrepreneur',
      'salaried-professional': 'Salaried Professional',
      'senior-citizen': 'Senior Citizen',
      'student': 'Student',
      'self-employed': 'Self-Employed'
    };
    return labels[category] || 'General Customer';
  };

  const getScenarioName = (scenario) => {
    const scenarioNames = {
      'business-loan': 'Business Loan',
      'personal-loan': 'Personal Loan',
      'home-loan': 'Home Loan',
      'working-capital': 'Working Capital',
      'credit-card': 'Credit Card',
      'savings-account': 'Savings Account',
      'fixed-deposit': 'Fixed Deposit',
      'education-loan': 'Education Loan'
    };
    return scenarioNames[scenario] || 'Training Scenario';
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{getScenarioName(scenarioId)}</h2>
          <div className="mt-2">
            <CategoryBadge bg="primary">{getCategoryLabel(category)}</CategoryBadge>
            <span className="text-muted">Age: {customerProfile.age} • Income: ₹{customerProfile.income}</span>
          </div>
        </div>
        <Button variant="outline-primary" onClick={handleEndTraining}>
          End Training
        </Button>
      </div>

      {errorEndTraining && (
        <Alert variant="danger" className="mb-4">
          {errorEndTraining}
        </Alert>
      )}

      {customerProfile.context && (
        <CustomerContext>
          <h6 className="mb-2">Additional Context:</h6>
          <p className="mb-0">{customerProfile.context}</p>
        </CustomerContext>
      )}

      <ChatContainer>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              isAgent={msg.sender === 'agent'}
            >
              {msg.content}
            </MessageBubble>
          ))}
        </MessagesContainer>

        <Card.Footer className="bg-white border-top-0">
          <Form onSubmit={handleSubmit}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your response as a loan agent..."
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!message.trim() || loading}
              >
                Send
              </Button>
            </div>
          </Form>
        </Card.Footer>
      </ChatContainer>
    </Container>
  );
};

export default Training; 