import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledCard = styled(motion.create(Card))`
  border: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  background: ${props => props.bgcolor};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${props => props.accentcolor};
  transition: transform 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${StyledCard}:hover & {
    transform: scale(1.1);
  }
`;

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  color: #666666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: ${props => props.accentcolor};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${props => `${props.accentcolor}10`};
  transition: all 0.2s ease;
  border: 1px solid ${props => `${props.accentcolor}20`};
  text-align: center;

  &:hover {
    color: ${props => props.accentcolor};
    background: ${props => `${props.accentcolor}15`};
    transform: translateX(4px);
  }

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

const EnhancedChatLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${props => props.accentcolor};
  transition: all 0.2s ease;
  border: none;
  text-align: center;

  &:hover {
    color: #ffffff;
    background: ${props => `${props.accentcolor}dd`};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '🤖';
    font-size: 0.9rem;
  }
`;

const ProductCategory = ({ title, description, icon, bgColor, accentColor, id }) => {
  return (
    <StyledCard bgcolor={bgColor}>
      <Card.Body className="p-4">
        <IconWrapper accentcolor={accentColor}>
          {icon}
        </IconWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ButtonsContainer>
          <EnhancedChatLink to={`/enhanced-conversation/${id}`} accentcolor={accentColor}>
            AI Chat Training
          </EnhancedChatLink>
        </ButtonsContainer>
      </Card.Body>
    </StyledCard>
  );
};

export default ProductCategory;