import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const BotContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`;

const BotImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const MessageBubble = styled(motion.div)`
  position: absolute;
  bottom: 100px;
  right: 0;
  background: #e0f2fe;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin-bottom: 1rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 30px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #e0f2fe;
  }
`;

const GromoGuru = ({ showSuggestion, forceShow }) => {
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsMessageVisible(true);
    }
  }, [forceShow]);

  const toggleMessage = () => {
    setIsMessageVisible(!isMessageVisible);
  };

  return (
    <BotContainer>
      <AnimatePresence>
        {showSuggestion && (isMessageVisible || forceShow) && (
          <MessageBubble
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Let's unlock your skills! Pick an area below that excites you the most. Confused? Why not give the 'Credit Card' scenario a spin? It's a brilliant way to get started and has a stellar track record for engagement!
          </MessageBubble>
        )}
      </AnimatePresence>
      <BotImage
        src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?semt=ais_hybrid&w=740"
        alt="GromoGuru"
        onClick={toggleMessage}
      />
    </BotContainer>
  );
};

export default GromoGuru;
