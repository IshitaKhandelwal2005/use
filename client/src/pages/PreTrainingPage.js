import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: #f8f9fa; /* A neutral background */
`;

const ContentBox = styled.div`
  background: #ffffff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 550px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1E3A8A; /* Using a primary color from your theme */
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #495057; /* Darker text for readability */
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const StyledButton = styled.button`
  background: #2B52DD; /* Primary button color */
  color: white;
  border: none;
  padding: 0.9rem 2.8rem;
  border-radius: 8px;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  box-shadow: 0 4px 15px rgba(43, 82, 221, 0.2);

  &:hover {
    background: #1E3BB7; /* Darker shade on hover */
    transform: translateY(-3px); /* Lift effect on hover */
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const PreTrainingPage = () => {
  const { id } = useParams(); // To get the category ID from the URL
  const navigate = useNavigate();

  const handleContinue = () => {
    // This will navigate to the enhanced conversation page with the selected category ID
    navigate(`/enhanced-conversation/${id}`);
  };

  return (
    <PageContainer>
      <ContentBox>
        <Title>Prepare for Training</Title>
        <Message>
          You have selected your area of interest. Click the button below to begin your personalized training session.
        </Message>
        <StyledButton onClick={handleContinue}>
          Start Training Session
        </StyledButton>
      </ContentBox>
    </PageContainer>
  );
};

export default PreTrainingPage; 