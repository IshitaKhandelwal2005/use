import React from 'react';
import styled from 'styled-components';
import { FaRobot } from 'react-icons/fa';

const BotContainer = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
`;

const BotBubble = styled.div`
  background: #e6f9ec;
  color: #1a7f37;
  border-radius: 18px 18px 4px 18px;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  margin-left: 0.5rem;
  max-width: 320px;
`;

const BotIcon = styled.div`
  background: #1a7f37;
  color: #fff;
  border-radius: 50%;
  padding: 0.6rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AIBotMessage = ({ message }) => (
  <BotContainer>
    <BotIcon>
      <FaRobot />
    </BotIcon>
    <BotBubble>{message}</BotBubble>
  </BotContainer>
);

export default AIBotMessage;
