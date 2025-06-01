import React, { createContext, useContext, useState } from 'react';
import { conversationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ConversationContext = createContext(null);

export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  // Start a new conversation
  const startConversation = async (scenario, customerProfile) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting conversation with scenario:', scenario);
      console.log('Customer profile:', customerProfile);
      
      const response = await conversationAPI.startConversation(scenario, customerProfile);
      const { conversationId, messages: initialMessages } = response.data;
      
      setConversation({ id: conversationId });
      setMessages(initialMessages || []);
      
      return { success: true };
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(err.message || 'Failed to start conversation');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Send a message in the current conversation
  const sendMessage = async (content) => {
    if (!conversation) {
      const errorMsg = 'No active conversation. Please start a new conversation.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      const errorMsg = 'Message cannot be empty';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Add agent message to UI immediately
      const agentMessage = { 
        sender: 'agent', 
        content: content.trim(), 
        timestamp: new Date() 
      };
      
      // Update UI with agent message
      setMessages(prev => [...prev, agentMessage]);
      
      // Send to API and get customer (AI) response
      const response = await conversationAPI.sendMessage(conversation.id, content.trim());
      
      if (!response.data || !Array.isArray(response.data.messages) || response.data.messages.length < 2) {
        throw new Error('Invalid response from server');
      }
      
      const [savedAgentMessage, customerMessage] = response.data.messages;
      
      // Update messages with customer (AI) response
      setMessages(prev => {
        // Find the last agent message and update it with the server's version
        const updatedMessages = [...prev];
        const lastAgentMsgIndex = updatedMessages.findLastIndex(m => m.sender === 'agent');
        
        if (lastAgentMsgIndex !== -1) {
          updatedMessages[lastAgentMsgIndex] = {
            ...updatedMessages[lastAgentMsgIndex],
            ...savedAgentMessage
          };
        }
        
        // Add the customer (AI) response
        return [...updatedMessages, customerMessage];
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
      
      // Revert the UI if there was an error
      setMessages(prev => prev.filter(m => m.content !== content.trim()));
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // End the current conversation and get feedback
  const endConversation = async () => {
    if (!conversation) return { success: false, error: 'No active conversation' };
    
    try {
      setLoading(true);
      setError(null);
      console.log('Ending conversation:', conversation?.id);

      const response = await conversationAPI.endConversation(conversation.id);
      console.log('End conversation response:', response);

      // Clear the conversation state
      setConversation(null);
      setMessages([]);

      // Navigate to feedback page
      navigate(`/feedback/${conversation.id}`);

      return {
        success: true,
        data: {
          conversationId: conversation.id,
          feedback: response.data.feedback
        }
      };
    } catch (err) {
      console.error('Error ending conversation:', err);
      setError(err.message || 'Failed to end conversation');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get conversation history
  const getConversationHistory = async (page = 1, limit = 10) => {
    try {
      console.log('ConversationContext: Fetching history', { page, limit });
      setLoading(true);
      setError('');
      
      const response = await conversationAPI.getConversationHistory(page, limit);
      console.log('ConversationContext: History API response:', response.data);
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('ConversationContext: Error fetching history:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch conversation history';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear the current conversation
  const clearConversation = () => {
    setConversation(null);
    setMessages([]);
    setFeedback(null);
    setError('');
  };

  return (
    <ConversationContext.Provider
      value={{
        conversation,
        messages,
        loading,
        error,
        feedback,
        startConversation,
        sendMessage,
        endConversation,
        getConversationHistory,
        clearConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

export default ConversationContext;
