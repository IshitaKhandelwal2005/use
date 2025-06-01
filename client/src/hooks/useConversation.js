import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useApi from './useApi';
import config from '../config';
import { formatDate } from '../utils/helpers';

/**
 * Custom hook for managing conversation state and interactions
 * @param {string} scenarioId - The ID of the current scenario
 * @returns {Object} Conversation state and methods
 */
const useConversation = (scenarioId) => {
  const navigate = useNavigate();
  const api = useApi();
  const { conversationId: urlConversationId } = useParams();
  
  // Refs
  const messageEndRef = useRef(null);
  const conversationIdRef = useRef(urlConversationId);
  
  // State
  const [conversation, setConversation] = useState({
    id: conversationIdRef.current || uuidv4(),
    scenarioId,
    messages: [],
    status: 'idle', // 'idle' | 'loading' | 'active' | 'ended' | 'error'
    startedAt: null,
    endedAt: null,
    customerInfo: {},
    feedback: null,
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  
  // Update conversation ID ref when URL changes
  useEffect(() => {
    if (urlConversationId && urlConversationId !== conversationIdRef.current) {
      conversationIdRef.current = urlConversationId;
      loadConversation(urlConversationId);
    }
  }, [urlConversationId]);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);
  
  // Initialize conversation when scenarioId changes
  useEffect(() => {
    if (scenarioId && !urlConversationId) {
      initializeConversation(scenarioId);
    }
  }, [scenarioId, urlConversationId]);
  
  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  /**
   * Initialize a new conversation
   * @param {string} scenarioId - The ID of the scenario to start
   */
  const initializeConversation = useCallback(async (scenarioId) => {
    if (!scenarioId) return;
    
    try {
      setConversation(prev => ({
        ...prev,
        status: 'loading',
        scenarioId,
        startedAt: new Date().toISOString(),
      }));
      
      // Call API to start a new conversation
      const response = await api.post(config.api.endpoints.conversations.start, {
        scenarioId,
      });
      
      const { conversationId, initialMessage, customerInfo } = response.data;
      
      // Update URL with new conversation ID
      navigate(`/conversation/${conversationId}`, { replace: true });
      conversationIdRef.current = conversationId;
      
      // Add initial AI message
      const aiMessage = {
        id: uuidv4(),
        sender: 'ai',
        content: initialMessage,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      
      setConversation(prev => ({
        ...prev,
        id: conversationId,
        status: 'active',
        messages: [aiMessage],
        customerInfo,
      }));
      
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err.response?.data?.message || 'Failed to start conversation');
      setConversation(prev => ({
        ...prev,
        status: 'error',
      }));
    }
  }, [api, navigate]);
  
  /**
   * Load an existing conversation
   * @param {string} conversationId - The ID of the conversation to load
   */
  const loadConversation = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    try {
      setConversation(prev => ({
        ...prev,
        status: 'loading',
      }));
      
      // Call API to get conversation details
      const response = await api.get(`${config.api.endpoints.conversations.base}/${conversationId}`);
      const { messages, scenario, status, startedAt, endedAt, feedback, customerInfo } = response.data;
      
      setConversation({
        id: conversationId,
        scenarioId: scenario?._id || scenarioId,
        messages: messages || [],
        status: status || 'active',
        startedAt,
        endedAt,
        feedback,
        customerInfo: customerInfo || {},
      });
      
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError(err.response?.data?.message || 'Failed to load conversation');
      setConversation(prev => ({
        ...prev,
        status: 'error',
      }));
    }
  }, [api]);
  
  /**
   * Send a message to the AI
   * @param {string} content - The message content
   * @param {string} type - The message type (e.g., 'text', 'option')
   */
  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!content || conversation.status !== 'active') return;
    
    const userMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      type,
    };
    
    // Optimistically add user message
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    
    setIsTyping(true);
    
    try {
      // Call API to get AI response
      const response = await api.post(
        config.api.endpoints.conversations.message(conversation.id),
        { content, type }
      );
      
      const { content: aiContent, type: aiType = 'text', isComplete = false } = response.data;
      
      const aiMessage = {
        id: uuidv4(),
        sender: 'ai',
        content: aiContent,
        timestamp: new Date().toISOString(),
        type: aiType,
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        status: isComplete ? 'ended' : 'active',
        ...(isComplete && { endedAt: new Date().toISOString() }),
      }));
      
      // If conversation is complete, get feedback
      if (isComplete) {
        await getConversationFeedback(conversation.id);
      }
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  }, [api, conversation.id, conversation.status]);
  
  /**
   * Get feedback for the conversation
   * @param {string} conversationId - The ID of the conversation
   */
  const getConversationFeedback = useCallback(async (conversationId) => {
    try {
      const response = await api.get(
        config.api.endpoints.conversations.feedback(conversationId)
      );
      
      setConversation(prev => ({
        ...prev,
        feedback: response.data,
      }));
      
      return response.data;
    } catch (err) {
      console.error('Failed to get conversation feedback:', err);
      return null;
    }
  }, [api]);
  
  /**
   * End the current conversation
   */
  const endConversation = useCallback(async () => {
    if (conversation.status !== 'active') return;
    
    try {
      setConversation(prev => ({
        ...prev,
        status: 'ending',
      }));
      
      await api.post(
        config.api.endpoints.conversations.end(conversation.id)
      );
      
      const feedback = await getConversationFeedback(conversation.id);
      
      setConversation(prev => ({
        ...prev,
        status: 'ended',
        endedAt: new Date().toISOString(),
        feedback,
      }));
      
      return feedback;
    } catch (err) {
      console.error('Failed to end conversation:', err);
      setError(err.response?.data?.message || 'Failed to end conversation');
      return null;
    }
  }, [api, conversation.id, conversation.status, getConversationFeedback]);
  
  /**
   * Save the conversation (useful for drafts or pausing)
   */
  const saveConversation = useCallback(async () => {
    try {
      await api.put(
        `${config.api.endpoints.conversations.base}/${conversation.id}`,
        {
          messages: conversation.messages,
          status: conversation.status,
          customerInfo: conversation.customerInfo,
        }
      );
      return true;
    } catch (err) {
      console.error('Failed to save conversation:', err);
      return false;
    }
  }, [api, conversation]);
  
  return {
    conversation,
    messages: conversation.messages,
    status: conversation.status,
    isTyping,
    error,
    messageEndRef,
    sendMessage,
    endConversation,
    saveConversation,
    loadConversation: () => loadConversation(conversation.id),
  };
};

export default useConversation;
