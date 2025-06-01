import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Spinner,
  Alert
} from 'react-bootstrap';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useConversation } from '../context/ConversationContext';

const Conversation = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const messagesEndRef = useRef(null);
  
  const {
    conversation,
    messages = [],
    loading: conversationLoading,
    error,
    startConversation,
    sendMessage: sendMessageToApi,
    endConversation,
    getConversationHistory
  } = useConversation();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Track if we've already initialized the conversation
  const hasInitialized = useRef(false);

  // Start a new conversation when the component mounts or scenarioId changes
  useEffect(() => {
    let isMounted = true;
    
    // Only run this effect once when the component mounts or scenarioId changes
    if (hasInitialized.current) return;
    
    const initConversation = async () => {
      try {
        // Only start a new conversation if we don't have an active one
        if (!conversation || conversation.scenario !== scenarioId) {
          const result = await startConversation(scenarioId);
          
          if (isMounted && !result.success) {
            console.error('Failed to start conversation:', result.error);
            setLocalError(result.error || 'Failed to start conversation');
            return;
          }
        }

        // Only try to fetch conversation history if user is authenticated
        if (isAuthenticated) {
          try {
            const historyResult = await getConversationHistory();
            if (isMounted && !historyResult?.success) {
              console.warn('Failed to load conversation history:', historyResult?.error || 'Unknown error');
              // Don't show error to user for history fetch failure
            }
          } catch (historyError) {
            console.warn('Error fetching conversation history:', historyError);
            // Silently fail - this is not critical functionality
          }
        }
        
        // Mark as initialized
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing conversation:', error);
        if (isMounted) {
          setLocalError('Failed to initialize conversation. Please refresh the page and try again.');
        }
      }
    };
    
    setLocalError('');
    initConversation();
    
    // Clean up when component unmounts
    return () => {
      isMounted = false;
      // Reset initialization when scenario changes
      if (hasInitialized.current) {
        hasInitialized.current = false;
      }
    };
  }, [scenarioId, isAuthenticated]); // Removed conversation and other dependencies to prevent re-runs

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || conversationLoading) return;
    
    try {
      setMessage('');
      setLocalError('');
      const result = await sendMessageToApi(trimmedMessage);
      
      if (!result.success) {
        setLocalError(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setLocalError('Failed to send message. Please try again.');
    }
  };

  const handleEndConversation = async () => {
    if (window.confirm('Are you sure you want to end this conversation?')) {
      await endConversation();
    }
  };

  const getScenarioName = (scenario) => {
    const scenarioNames = {
      income: 'Income-Based Scenario',
      area: 'Area-Based Scenario',
      insurance: 'Insurance Scenario',
      credit_score: 'Credit Score Scenario'
    };
    return scenarioNames[scenario] || 'Training Scenario';
  };

  if (conversationLoading && !messages.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const displayError = localError || error;
  const loading = conversationLoading; // Alias for backward compatibility

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        className="mb-3" 
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        <FaArrowLeft className="me-2" /> Back to Scenarios
      </Button>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{getScenarioName(scenarioId)}</h5>
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleEndConversation}
            disabled={conversationLoading}
          >
            End Conversation
          </Button>
        </Card.Header>
        
        <Card.Body 
          className="p-0" 
          style={{ 
            height: '60vh', 
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div className="d-flex flex-column h-100 p-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`d-flex mb-3 ${msg.sender === 'ai' ? 'justify-content-start' : 'justify-content-end'}`}
              >
                <div 
                  className={`p-3 rounded-3 ${
                    msg.sender === 'ai' ? 'bg-white border' : 'bg-primary text-white'
                  }`}
                  style={{
                    maxWidth: '80%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {msg.content}
                  <div 
                    className={`small mt-1 text-end ${
                      msg.sender === 'ai' ? 'text-muted' : 'text-white-50'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {conversationLoading && messages.length > 0 && (
              <div className="d-flex justify-content-start mb-3">
                <div className="p-3 bg-white border rounded-3">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card.Body>
        
        <Card.Footer className="border-top-0 pt-0">
          <Form onSubmit={handleSubmit}>
            {displayError && (
              <Alert variant="danger" className="mb-3 py-2">
                {displayError}
              </Alert>
            )}
            <div className="d-flex gap-2">
              <Form.Control
                as="textarea"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your response..."
                disabled={conversationLoading}
                style={{ resize: 'none' }}
                className="flex-grow-1"
              />
              <Button 
                variant="primary" 
                type="submit"
                disabled={conversationLoading || !message.trim()}
                className="d-flex align-items-center"
              >
                {conversationLoading ? (
                  <Spinner size="sm" animation="border" role="status">
                    <span className="visually-hidden">Sending...</span>
                  </Spinner>
                ) : (
                  <FaPaperPlane />
                )}
              </Button>
            </div>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Conversation;
