import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { conversationAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  Autorenew as AutorenewIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';


const EnhancedConversation = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const chatContainerRef = useRef(null);

  // Retrieve difficulty from location state
  const initialDifficulty = location.state?.difficulty || 'easy'; // Default to 'medium'

  // Check if we have pre-configured customer profile from navigation state
  const preConfiguredProfile = location.state?.customerProfile;
  const skipConfiguration = location.state?.skipConfiguration;

  // State management
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [conversationState, setConversationState] = useState('idle');
  const [autoMode, setAutoMode] = useState(false);
  const [state, setState] = useState('idle');
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Add refs to track instances and timeouts
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Session configuration
  const [sessionConfig, setSessionConfig] = useState({
    difficultyLevel: initialDifficulty, // Initialize with passed difficulty
    additionalInfo: '',
    selectedPdfs: []
  });

  // Difficulty levels for AI behavior
  const difficultyLevels = [
    { value: 'easy', label: 'Easy (Friendly and cooperative customer)' },
    { value: 'medium', label: 'Medium (Balanced interaction with some challenges)' },
    { value: 'hard', label: 'Hard (Challenging customer with specific concerns)' },
    { value: 'expert', label: 'Expert (Complex scenarios with multiple objections)' }
  ];

  // Available PDFs for learning (to be populated based on product category)
  const [availablePdfs, setAvailablePdfs] = useState([]);

  // Voice features
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [langOption, setLangOption] = useState('en');

  // Sarvam API Key (move to env in production)
  const SARVAM_API_KEY = '0375e862-02a6-4d11-8ffd-fa1fd5e9c37c';

  // Customer categories and scenarios
  const customerCategories = [
    { value: 'salaried-professional', label: 'Salaried Professional', description: 'IT professionals, corporate employees' },
    { value: 'women-entrepreneur', label: 'Women Entrepreneur', description: 'Business owners, startup founders' },
    { value: 'senior-citizen', label: 'Senior Citizen', description: 'Retirees, pension holders' },
    { value: 'student', label: 'Student', description: 'College students, young adults' },
    { value: 'self-employed', label: 'Self Employed', description: 'Consultants, freelancers, contractors' },
    { value: 'small-business-owner', label: 'Small Business Owner', description: 'Shop owners, local business operators' },
    { value: 'homemaker', label: 'Homemaker', description: 'Stay-at-home parents, family managers' },
    { value: 'young-professional', label: 'Young Professional', description: 'Recent graduates, entry-level employees' }
  ];

  const ageGroups = [
    { value: '18-22', label: '18-22 years (Fresh Graduate)' },
    { value: '23-28', label: '23-28 years (Young Professional)' },
    { value: '29-35', label: '29-35 years (Established Professional)' },
    { value: '36-45', label: '36-45 years (Mid-Career)' },
    { value: '46-55', label: '46-55 years (Senior Professional)' },
    { value: '56-65', label: '56-65 years (Pre-Retirement)' },
    { value: '65+', label: '65+ years (Senior Citizen)' }
  ];

  const incomeRanges = [
    { value: '1L-3L', label: '₹1L - ₹3L per year (Entry Level)' },
    { value: '3L-5L', label: '₹3L - ₹5L per year (Lower Middle)' },
    { value: '5L-8L', label: '₹5L - ₹8L per year (Middle Class)' },
    { value: '8L-12L', label: '₹8L - ₹12L per year (Upper Middle)' },
    { value: '12L-18L', label: '₹12L - ₹18L per year (Professional)' },
    { value: '18L-25L', label: '₹18L - ₹25L per year (Senior Professional)' },
    { value: '25L-40L', label: '₹25L - ₹40L per year (Executive Level)' },
    { value: '40L+', label: '₹40L+ per year (High Income)' }
  ];

  // Additional optional configuration
  const experienceLevels = [
    { value: 'first-time', label: 'First-time customer (No prior banking experience)' },
    { value: 'basic', label: 'Basic (Limited banking knowledge)' },
    { value: 'moderate', label: 'Moderate (Some banking experience)' },
    { value: 'experienced', label: 'Experienced (Good banking knowledge)' },
    { value: 'expert', label: 'Expert (Extensive financial knowledge)' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low (Just exploring options)' },
    { value: 'medium', label: 'Medium (Planning within few months)' },
    { value: 'high', label: 'High (Need solution within weeks)' },
    { value: 'urgent', label: 'Urgent (Immediate requirement)' }
  ];

  const communicationStyles = [
    { value: 'friendly', label: 'Friendly & Open (Easy to engage)' },
    { value: 'professional', label: 'Professional & Formal (Business-like)' },
    { value: 'cautious', label: 'Cautious & Skeptical (Needs convincing)' },
    { value: 'detail-oriented', label: 'Detail-oriented (Asks many questions)' },
    { value: 'quick-decision', label: 'Quick Decision Maker (Wants fast solutions)' }
  ];

  const locationTypes = [
    { value: 'urban', label: 'Urban (City dweller)' },
    { value: 'suburban', label: 'Suburban (Town resident)' },
    { value: 'rural', label: 'Rural (Village/countryside)' },
    { value: 'metro', label: 'Metro (Major metropolitan area)' }
  ];

  const familyStatuses = [
    { value: '', label: 'Not specified' },
    { value: 'single', label: 'Single' },
    { value: 'married-no-kids', label: 'Married, no children' },
    { value: 'married-with-kids', label: 'Married with children' },
    { value: 'single-parent', label: 'Single parent' },
    { value: 'joint-family', label: 'Joint family setup' }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Show configuration dialog by default when first arriving, or auto-start if pre-configured
  useEffect(() => {
    if (scenarioId && user && !isSessionStarted) {
      if (skipConfiguration && preConfiguredProfile) {
        // Auto-start with pre-configured data
        const autoStartSession = async () => {
          if (!scenarioId) {
            setError('No scenario specified');
            return;
          }

          setLoading(true);
          setError('');

          try {
            const response = await conversationAPI.start({
              scenario: scenarioId,
              difficultyLevel: sessionConfig.difficultyLevel,
              additionalInfo: sessionConfig.additionalInfo
            });

            setConversationId(response.data.conversationId);
            setSessionInfo(response.data.sessionInfo);
            setIsSessionStarted(true);
            setChat(response.data.messages || []);

            toast.success('Training session started! Begin the conversation.');

          } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to start session. Please check if LM Studio is running.';
            setError(errorMessage);
            toast.error(errorMessage);
          } finally {
            setLoading(false);
          }
        };
        
        autoStartSession();
      } else {
        // Show configuration dialog
        setSettingsOpen(true);
      }
    }
  }, [scenarioId, user, isSessionStarted, skipConfiguration, preConfiguredProfile, sessionConfig]);

  // Add this useEffect to handle automatic state transitions
  useEffect(() => {
    if (!autoMode) return;

    const handleComputerFinishedSpeaking = () => {
      setConversationState('userSpeaking');
      startListening();
    };

    const handleUserFinishedSpeaking = () => {
      setConversationState('computerSpeaking');
      // The computer will start speaking when the response is received
    };

    if (conversationState === 'computerSpeaking') {
      // Set up event listener for when computer finishes speaking
      window.speechSynthesis.onend = handleComputerFinishedSpeaking;
    }

    return () => {
      window.speechSynthesis.onend = null;
    };
  }, [conversationState, autoMode]);

  // Add voice selection logic
  useEffect(() => {
    function populateVoiceList() {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Try to select en-IN or hi-IN by default
      let defaultVoice = voices.find(v => v.lang === 'en-IN') || 
                        voices.find(v => v.lang === 'hi-IN') ||
                        voices[0];
      setSelectedVoice(defaultVoice);
    }

    if (typeof speechSynthesis !== 'undefined') {
      populateVoiceList();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
      }
    }
  }, []);

  // Modified speak function with Promise
  const speak = async (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Add slight pause between sentences
        utterance.onboundary = (event) => {
          if (event.name === 'sentence') {
            // Small pause at sentence boundaries
            utterance.pause = 500;
          }
        };
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          setState('computerTalking');
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          // Add a small delay before starting to listen
          setTimeout(() => {
            setState('userTalking');
            startListening();
          }, 1000);
          resolve();
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setState('userTalking');
          startListening();
          resolve();
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Add cleanup function
  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition stop error:', e);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // Modified listen function with Promise
  const listen = async () => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window)) {
        toast.error('Speech recognition not supported in this browser.');
        resolve('');
        return;
      }

      // Clean up any existing recognition instance
      cleanupRecognition();

      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.lang = langMap[langOption] || 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = true;

      let finalTranscript = '';
      let isEndedByUser = false;
      
      // Clear any existing timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      recognition.onstart = () => {
        setIsListening(true);
        setState('userTalking');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          const userMessage = {
            sender: 'agent',
            content: finalTranscript + interimTranscript,
            interim: true
          };
          setChat(prev => {
            if (prev.length > 0 && prev[prev.length - 1].interim) {
              return [...prev.slice(0, -1), userMessage];
            }
            return [...prev, userMessage];
          });
        }

        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          if (!isEndedByUser && finalTranscript) {
            cleanupRecognition();
            isEndedByUser = true;
          }
        }, 2000);
      };

      recognition.onend = () => {
        cleanupRecognition();
        if (finalTranscript) {
          const userMessage = {
            sender: 'agent',
            content: finalTranscript.trim(),
            interim: false
          };
          setChat(prev => {
            const withoutInterim = prev.filter(msg => !msg.interim);
            return [...withoutInterim, userMessage];
          });
          resolve(finalTranscript);
          sendMessage(finalTranscript);
        } else {
          if (!isEndedByUser) {
            listen(); // Restart listening if ended unexpectedly
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          if (!isEndedByUser) {
            listen(); // Restart listening on no-speech error
          }
        } else {
          cleanupRecognition();
          setState('computerTalking');
          resolve('[Could not recognize speech]');
        }
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Recognition start error:', error);
        cleanupRecognition();
        setState('idle');
      }
    });
  };

  // Modified sendMessage function
  const sendMessage = async (transcript = null) => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const messageContent = transcript || chat[chat.length - 1].content;
      const response = await conversationAPI.sendMessage(conversationId, {
        content: messageContent,
        difficulty: sessionConfig.difficultyLevel, // Pass difficultyLevel as 'difficulty'
        additionalInfo: sessionConfig.additionalInfo // Pass additionalInfo
      });

      if (response.data.messages && response.data.messages.length > 0) {
        const aiMessage = response.data.messages[response.data.messages.length - 1];
        setChat(prev => {
          // Remove any interim messages before adding AI response
          const withoutInterim = prev.filter(msg => !msg.interim);
          return [...withoutInterim, aiMessage];
        });
        
        // Speak the AI's response
        if (aiMessage.sender === 'ai') {
          setState('computerTalking');
          await speak(aiMessage.content);
        }
      }

      if (response.data.sessionInfo) {
        setSessionInfo(prev => ({
          ...prev,
          ...response.data.sessionInfo
        }));
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setState('computerTalking');
    } finally {
      setLoading(false);
    }
  };

  // Modified getAnalysis function
  const getAnalysis = async () => {
    if (!conversationId || chat.length < 2) {
      setError('Please have a conversation before requesting analysis.');
      return;
    }

    // Cleanup any ongoing processes
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    cleanupRecognition();
    setState('analyzing');

    setLoading(true);
    setError('');

    try {
      const response = await conversationAPI.analyze(conversationId);
      setAnalysis(response.data.analysis);
      setAnalysisOpen(true);
      toast.success('Performance analysis generated!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate analysis. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setState('idle');
    }
  };

  // End conversation
  const endConversation = async () => {
    if (!conversationId) {
      navigate('/history');
      return;
    }

    try {
      // 1. First, stop any ongoing speech synthesis
      if ('speechSynthesis' in window) {
        // Force stop all speech synthesis
        window.speechSynthesis.cancel();
        // Remove any pending utterances
        const synth = window.speechSynthesis;
        synth.cancel();
      }
      
      // 2. Stop any ongoing speech recognition
      if (recognitionRef.current) {
        try {
          // Remove all event listeners first
          const recognition = recognitionRef.current;
          recognition.onresult = null;
          recognition.onend = null;
          recognition.onerror = null;
          recognition.onnomatch = null;
          recognition.onsoundend = null;
          recognition.onsoundstart = null;
          recognition.onspeechend = null;
          recognition.onspeechstart = null;
          recognition.onstart = null;
          
          // Then stop recognition
          recognition.stop();
          recognitionRef.current = null;
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
      
      // 3. Clear any pending timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      // 4. Update state to reflect stopped state
      setIsSpeaking(false);
      setIsListening(false);
      setState('idle');
      
      // 5. End the conversation with the server
      const response = await conversationAPI.end(conversationId);
      
      // 6. Get analysis before navigating
      try {
        const analysisResponse = await conversationAPI.analyze(conversationId);
        
        // Navigate to history with analysis data
        navigate('/history', { 
          state: { 
            analysis: analysisResponse.data.analysis,
            sessionStats: analysisResponse.data.sessionStats,
            conversationId: conversationId
          },
          replace: true
        });
      } catch (analysisErr) {
        console.error('Error getting analysis:', analysisErr);
        // Still navigate even if analysis fails
        navigate('/history', { 
          state: { 
            conversationId: conversationId,
            error: 'Could not generate analysis'
          },
          replace: true 
        });
      }
      
    } catch (err) {
      console.error('Error ending conversation:', err);
      
      // Ensure everything is cleaned up even if there was an error
      if (recognitionRef.current) {
        try {
          const recognition = recognitionRef.current;
          recognition.onresult = null;
          recognition.onend = null;
          recognition.onerror = null;
          recognition.stop();
        } catch (e) {
          console.log('Error in final cleanup:', e);
        }
        recognitionRef.current = null;
      }
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      setIsSpeaking(false);
      setIsListening(false);
      setState('idle');
      
      // Navigate to history even if there was an error
      navigate('/history', { 
        state: { 
          error: 'Session ended with errors',
          conversationId: conversationId
        },
        replace: true 
      });
    }
  };

  // Update session context
  const updateContext = async () => {
    if (!conversationId) return;

    setLoading(true);
    try {
      // For now, we'll restart the session with new configuration
      await startSession();
      setSettingsOpen(false);
      toast.success('Session updated with new configuration!');
    } catch (err) {
      setError('Failed to update session.');
      toast.error('Failed to update session.');
    } finally {
      setLoading(false);
    }
  };

  // Reset session
  const resetSession = () => {
    setConversationId(null);
    setIsSessionStarted(false);
    setChat([]);
    setAnalysis('');
    setSessionInfo(null);
    setError('');
    stopSpeaking();
    startSession();
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start new session
  const startSession = async () => {
    if (!scenarioId) {
      setError('No scenario specified');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await conversationAPI.start({
        scenario: scenarioId,
        difficultyLevel: sessionConfig.difficultyLevel,
        additionalInfo: sessionConfig.additionalInfo
      });

      setConversationId(response.data.conversationId);
      setSessionInfo(response.data.sessionInfo);
      setIsSessionStarted(true);
      setChat(response.data.messages || []);
      setSettingsOpen(false);

      toast.success('Training session started! Begin the conversation.');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to start session. Please check if LM Studio is running.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Map UI language codes to Sarvam API language codes
  const langMap = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'mr': 'mr-IN',
    'od': 'od-IN',
    'pa': 'pa-IN',
    'ta': 'ta-IN',
    'te': 'te-IN'
  };

  // Start listening function
  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    await listen();
  };

  // Effect to start conversation when session starts
  useEffect(() => {
    if (isSessionStarted && chat.length > 0) {
      const aiMessage = chat[0];
      if (aiMessage.sender === 'ai') {
        speak(aiMessage.content);
      }
    }
  }, [isSessionStarted]);

  // Enhanced cleanup effect for component unmount
  useEffect(() => {
    // Store the current recognition instance in a local variable
    const currentRecognition = recognitionRef.current;
    
    return () => {
      // Stop any ongoing speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      
      // Stop any ongoing speech recognition
      if (currentRecognition) {
        try {
          currentRecognition.stop();
        } catch (e) {
          console.log('Error stopping recognition on unmount:', e);
        }
      }
      
      // Clear any pending timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      
      // Reset states
      setIsSpeaking(false);
      setIsListening(false);
      setState('idle');
    };
  }, []);

  // Handle analysis dialog close
  const handleAnalysisClose = () => {
    setAnalysisOpen(false);
    // Resume conversation from the last AI message
    if (isSessionStarted && conversationId) {
      const lastAiMessage = chat.findLast(msg => msg.sender === 'ai');
      if (lastAiMessage) {
        speak(lastAiMessage.content);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <ChatIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1" color="primary">
              Loan Agent Training - {scenarioId?.replace('-', ' ').toUpperCase()}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Session Settings">
              <IconButton onClick={() => setSettingsOpen(true)} color="primary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {isSessionStarted && (
              <>
                <Tooltip title="Reset Session">
                  <IconButton onClick={resetSession} color="secondary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="End Session">
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={async () => {
                      if (!conversationId) {
                        setError('No active conversation to end.');
                        return;
                      }

                      setLoading(true);
                      setError('');

                      try {
                        // Get analysis first
                        const response = await conversationAPI.analyze(conversationId);
                        
                        // Parse the analysis if it's a string 
                        const analysisData = typeof response.data.analysis === 'string' 
                          ? JSON.parse(response.data.analysis)
                          : response.data.analysis;
                        
                        // Stop any ongoing speech synthesis
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        
                        // Stop any ongoing speech recognition
                        if (recognitionRef.current) {
                          try {
                            recognitionRef.current.stop();
                          } catch (e) {
                            console.log('Error stopping recognition:', e);
                          }
                          recognitionRef.current = null;
                        }
                        
                        // Update state to reflect stopped state
                        setIsSpeaking(false);
                        setIsListening(false);
                        setState('idle');
                        
                        // Clear any pending timeouts
                        if (this.silenceTimeout) {
                          clearTimeout(this.silenceTimeout);
                          this.silenceTimeout = null;
                        }
                        
                        // End the conversation with the server
                        await conversationAPI.end(conversationId);
                        
                        // Navigate to history with analysis data
                        navigate('/history', { 
                          state: { 
                            analysis: analysisData,
                            sessionStats: response.data.sessionStats
                          },
                          replace: true
                        });
                      } catch (err) {
                        console.error('Error ending session:', err);
                        const errorMessage = err.response?.data?.message || 'Failed to end session properly.';
                        setError(errorMessage);
                        toast.error(errorMessage);
                        setLoading(false);
                        
                        // Ensure clean up even on error
                        if (recognitionRef.current) {
                          try {
                            recognitionRef.current.stop();
                          } catch (e) {
                            console.log('Error in error cleanup:', e);
                          }
                          recognitionRef.current = null;
                        }
                        
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        
                        setIsSpeaking(false);
                        setIsListening(false);
                        setState('idle');
                      }
                    }}
                    startIcon={<StopIcon />}
                    size="medium"
                    disabled={loading}
                  >
                    {loading ? 'Ending...' : 'End Session'}
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Session Info */}
        {isSessionStarted && sessionInfo && (
          <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Training Session
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Scenario:</Typography>
                  <Typography variant="body1">{scenarioId?.replace('-', ' ').toUpperCase()}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Difficulty Level:</Typography>
                  <Typography variant="body1">
                    {difficultyLevels.find(level => level.value === sessionConfig.difficultyLevel)?.label}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Typography variant="body1">
                    {sessionInfo.messageCount} messages exchanged
                  </Typography>
                </Grid>
                {sessionConfig.additionalInfo && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Additional Context:</Typography>
                    <Typography variant="body1">
                      {sessionConfig.additionalInfo}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        {isSessionStarted ? (
          <Grid container spacing={3}>
            {/* Chat Messages */}
            <Grid item xs={12}>
              <Paper 
                ref={chatContainerRef}
                sx={{ 
                  height: 400, 
                  overflow: 'auto', 
                  p: 2, 
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                {chat.length === 0 ? (
                  <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Typography color="text.secondary">
                      The AI customer is waiting. Starting conversation...
                    </Typography>
                  </Box>
                ) : (
                  chat.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        maxWidth: '80%',
                        ...(message.sender === 'agent' ? {
                          bgcolor: 'primary.main',
                          color: 'white',
                          ml: 'auto',
                          textAlign: 'right'
                        } : message.sender === 'ai' ? {
                          bgcolor: 'secondary.50',
                          color: 'secondary.main',
                          mr: 'auto'
                        } : {
                          bgcolor: 'info.50',
                          color: 'info.main',
                          textAlign: 'center',
                          maxWidth: '100%'
                        })
                      }}
                    >
                      <Typography variant="caption" display="block" sx={{ opacity: 0.8, mb: 0.5 }}>
                        {message.sender === 'agent' ? 'You (Loan Agent)' : 
                         message.sender === 'ai' ? 'Customer' : 'System'}
                      </Typography>
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* Status Bar */}
            <Grid item xs={12}>
              <Box sx={{ 
                mt: 2,
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
              }}>
                {/* Status Indicator */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%',
                    bgcolor: state === 'computerTalking' ? 'primary.main' : 
                             state === 'userTalking' ? 'success.main' : 
                             'grey.400'
                  }} />
                  <Typography variant="body1" color="text.secondary">
                    {state === 'computerTalking' ? 'AI is speaking...' :
                     state === 'userTalking' ? 'Listening to you...' :
                     'Initializing...'}
                  </Typography>
                </Box>

                {/* Control Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* End Session Button */}
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={async () => {
                      if (!conversationId) {
                        setError('No active conversation to end.');
                        return;
                      }

                      setLoading(true);
                      setError('');

                      try {
                        // Get analysis first
                        const response = await conversationAPI.analyze(conversationId);
                        
                        // Then end the conversation
                        await conversationAPI.end(conversationId);
                        
                        // Navigate to history with analysis data
                        navigate('/history', { 
                          state: { 
                            analysis: response.data.analysis,
                            sessionStats: response.data.sessionStats
                          }
                        });
                      } catch (err) {
                        const errorMessage = err.response?.data?.message || 'Failed to end session properly.';
                        setError(errorMessage);
                        toast.error(errorMessage);
                        setLoading(false);
                      }
                    }}
                    startIcon={<StopIcon />}
                    size="medium"
                  >
                    End Session
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          /* Session Setup */
          <Box textAlign="center" sx={{ py: 8 }}>
            {skipConfiguration && preConfiguredProfile ? (
              // Pre-configured session setup
              <>
                <Typography variant="h4" gutterBottom color="primary">
                  Setting Up Your Training Session
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
                  {scenarioId?.replace('-', ' ').toUpperCase()} Scenario
                </Typography>

                <Card sx={{ maxWidth: 700, mx: 'auto', mb: 4, p: 3, bgcolor: 'success.50' }}>
                  <Typography variant="h6" gutterBottom color="success.main">
                    ✅ Training Configuration Ready
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Difficulty Level:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {difficultyLevels.find(level => level.value === sessionConfig.difficultyLevel)?.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Status:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        Ready to start
                      </Typography>
                    </Grid>
                    {sessionConfig.additionalInfo && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Additional Context:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {sessionConfig.additionalInfo}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Card>

                {loading ? (
                  <Box>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body1">Starting your AI training session...</Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Your session will start automatically...
                  </Typography>
                )}
              </>
            ) : (
              // Regular configuration setup
              <>
                <Typography variant="h4" gutterBottom color="primary">
                  Welcome to AI-Powered Training
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
                  {scenarioId?.replace('-', ' ').toUpperCase()} Scenario
                </Typography>
                
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="h2" sx={{ mb: 1 }}>🎯</Typography>
                      <Typography variant="h6" gutterBottom>Choose Your Customer</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select from different customer profiles including professionals, entrepreneurs, students, and seniors
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="h2" sx={{ mb: 1 }}>🤖</Typography>
                      <Typography variant="h6" gutterBottom>AI-Powered Conversations</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Experience realistic interactions with our advanced AI that responds like real customers
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="h2" sx={{ mb: 1 }}>📊</Typography>
                      <Typography variant="h6" gutterBottom>Get Feedback</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive detailed performance analysis and suggestions to improve your skills
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Card sx={{ maxWidth: 600, mx: 'auto', mb: 4, p: 3, bgcolor: 'primary.50' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Ready to Start Training?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Configure your customer profile to begin a realistic training session. Choose the customer type, age group, and income range to practice with scenarios tailored to your selection.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💡 <strong>Tip:</strong> Try different customer profiles to experience various conversation styles and challenges.
                  </Typography>
                </Card>

                {loading ? (
                  <Box>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body1">Preparing your training session...</Typography>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setSettingsOpen(true)}
                    startIcon={<SettingsIcon />}
                    sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
                  >
                    Configure Customer Profile & Start
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
      </Paper>

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={isSessionStarted ? () => setSettingsOpen(false) : undefined}
        maxWidth={false}
        fullWidth
        PaperProps={{ sx: { width: '100vw', maxWidth: '100vw', m: 0 } }}
        disableEscapeKeyDown={!isSessionStarted}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            {isSessionStarted ? 'Update Training Configuration' : 'Configure Your Training Session'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSessionStarted 
              ? 'Update the training configuration for this session'
              : 'Configure your training session settings'
            }
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={0} direction="column" sx={{ mt: 1, alignItems: 'flex-start', width: '100%' }}>
            {/* Difficulty Level Section */}
            <Grid item xs={12} sx={{ mb: 2, width: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" align="left" sx={{ mb: 1 }}>
                Difficulty Level
              </Typography>
              <Card sx={{
                p: 2,
                textAlign: 'left',
                width: 'fit-content',
                minWidth: 300,
                border: '1px solid #d1d5db',
                borderRadius: 2
              }}>
                <Typography variant="body2" color="text.secondary" paragraph align="left">
                  Set the difficulty level of the AI customer. This determines how challenging the conversation will be.
                </Typography>
                <FormControl fullWidth sx={{ textAlign: 'left', minWidth: 220 }}>
                  <InputLabel align="left">Difficulty Level</InputLabel>
                  <Select
                    value={sessionConfig.difficultyLevel}
                    onChange={(e) => setSessionConfig(prev => ({ ...prev, difficultyLevel: e.target.value }))}
                    label="Difficulty Level"
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value} sx={{ textAlign: 'left' }}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>

            {/* Learn Section */}
            <Grid item xs={12} sx={{ mb: 2, width: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" align="left" sx={{ mb: 1 }}>
                Learn Section
              </Typography>
              <Card sx={{
                p: 2,
                textAlign: 'left',
                width: 'fit-content',
                minWidth: 300,
                border: '1px solid #d1d5db',
                borderRadius: 2
              }}>
                <Typography variant="body2" color="text.secondary" paragraph align="left">
                  Revise product details for the selected category: <b>{scenarioId?.replace('-', ' ').toUpperCase()}</b>
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto', textAlign: 'left', p: 0, minWidth: 220 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} align="left">
                    [PDFs related to {scenarioId?.replace('-', ' ').toUpperCase()} will be listed here. e.g., Product Brochure.pdf, T&C.pdf]
                  </Typography>
                  {availablePdfs.length > 0 && availablePdfs.map((pdf) => (
                    <Box key={pdf.id} sx={{ mb: 1, textAlign: 'left' }}>
                      <Button
                        variant="text"
                        sx={{ pl: 0, justifyContent: 'flex-start' }}
                        onClick={() => window.open(pdf.url, '_blank')}
                      >
                        {pdf.name}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>

            {/* Additional Information Section */}
            <Grid item xs={12} sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary" align="left" sx={{ mb: 1 }}>
                Additional Information for AI
              </Typography>
              <Card sx={{
                p: 0,
                textAlign: 'left',
                width: '70%',
                border: '1px solid #d1d5db',
                borderRadius: 2
              }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={sessionConfig.additionalInfo}
                  onChange={(e) => setSessionConfig(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Provide specific instructions or context for the AI customer's behavior..."
                  variant="outlined"
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    '& .MuiInputBase-root': {
                      width: '100%',
                      textarea: {
                        overflow: 'auto',
                        resize: 'vertical',
                        minHeight: '72px',
                        maxHeight: '120px'
                      }
                    }
                  }}
                  InputProps={{ style: { textAlign: 'left' } }}
                />
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {!isSessionStarted && (
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={isSessionStarted ? updateContext : startSession}
            disabled={loading}
          >
            {isSessionStarted ? 'Update Configuration' : 'Start Training Session'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog 
        open={analysisOpen} 
        onClose={handleAnalysisClose}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Performance Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              You can continue the conversation after closing this dialog
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minHeight: 300 }}>
            {analysis ? (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {analysis}
              </Typography>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnalysisClose} variant="contained">
            Continue Conversation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EnhancedConversation;