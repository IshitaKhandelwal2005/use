import React from 'react';
import styled from 'styled-components';

const PlaceholderContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '120px'};
  background: ${props => props.bgColor || '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
`;

const PlaceholderImage = ({ title, height, bgColor }) => {
  return (
    <PlaceholderContainer height={height} bgColor={bgColor}>
      {title || 'Image'}
    </PlaceholderContainer>
  );
};

export default PlaceholderImage; 