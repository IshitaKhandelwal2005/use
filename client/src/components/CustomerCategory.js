import React, { useState } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaUser, FaMoneyBillWave, FaInfoCircle, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PlaceholderImage from './PlaceholderImage';

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
  color: #2B52DD;
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
  margin-bottom: 0;
`;

const DetailCard = styled(Card)`
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const CategoryInfo = styled.div`
  padding: 2rem;
  background-color: ${props => props.bgcolor || '#F8F9FA'};
  border-radius: 0.5rem;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => `url(${props.bgpattern})`};
    background-size: cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const InfoContent = styled.div`
  position: relative;
  z-index: 1;
`;

const InfoTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  color: #1A1A1A;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
`;

const InfoText = styled.p`
  color: #666666;
  font-size: 1rem;
  line-height: 1.6;
`;

const RangeSlider = styled.input`
  width: 100%;
  height: 6px;
  background: #E2E8F0;
  border-radius: 1rem;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #2B52DD;
    border-radius: 50%;
    cursor: pointer;
    transition: all .15s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: #2B52DD;
    border-radius: 50%;
    cursor: pointer;
    border: 0;
    transition: all .15s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const SliderValue = styled.div`
  text-align: center;
  color: #1A1A1A;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #F8F9FA;
  border-radius: 0.5rem;
`;

const CharacteristicItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateX(4px);
    background: rgba(255, 255, 255, 0.9);
  }

  .check {
    color: #2B52DD;
    font-size: 1.2rem;
  }
`;

const StyledButton = styled(Button)`
  background: #2B52DD;
  border-color: #2B52DD;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #1E3FAA;
    border-color: #1E3FAA;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CustomerCategory = ({ title, description, icon, bgColor, onClick }) => {
  return (
    <StyledCard onClick={onClick} bgcolor={bgColor}>
      <Card.Body className="p-4">
        <IconWrapper>
          {icon}
        </IconWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Card.Body>
    </StyledCard>
  );
};

const CategoryDetail = ({ category }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 30,
    income: 8,
    occupation: '',
    additionalInfo: '',
    scenario: 'business-loan'
  });

  const scenarioOptions = [
    { value: 'credit-card', label: 'Credit Card Application' },
    { value: 'personal-loan', label: 'Personal Loan Consultation' },
    { value: 'business-loan', label: 'Business Loan Discussion' },
    { value: 'savings', label: 'Savings Account Opening' },
    { value: 'demat', label: 'Demat Account & Investment' },
    { value: 'investment', label: 'Investment Planning' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAgeLabel = (age) => {
    if (age >= 18 && age <= 22) return '18-22';
    if (age >= 23 && age <= 28) return '23-28';
    if (age >= 29 && age <= 35) return '29-35';
    if (age >= 36 && age <= 45) return '36-45';
    if (age >= 46 && age <= 55) return '46-55';
    if (age >= 56 && age <= 65) return '56-65';
    return '65+';
  };

  const getIncomeLabel = (income) => {
    if (income <= 3) return '1L-3L';
    if (income <= 5) return '3L-5L';
    if (income <= 8) return '5L-8L';
    if (income <= 12) return '8L-12L';
    if (income <= 18) return '12L-18L';
    if (income <= 25) return '18L-25L';
    if (income <= 40) return '25L-40L';
    return '40L+';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Navigate to enhanced conversation with pre-configured profile
    const customerProfileData = {
      age: getAgeLabel(formData.age),
      income: getIncomeLabel(formData.income),
      category: category.id,
      occupation: formData.occupation,
      additionalInfo: formData.additionalInfo,
      // Additional context from category
      experience: 'moderate',
      urgency: 'medium',
      primaryNeed: formData.additionalInfo,
      communicationStyle: 'friendly',
      location: 'urban',
      familyStatus: '',
      specificConcerns: '',
      previousBankingExperience: formData.additionalInfo
    };

    // Navigate to enhanced conversation with the scenario and profile
    navigate(`/enhanced-conversation/${formData.scenario}`, {
      state: {
        customerProfile: customerProfileData,
        skipConfiguration: true
      }
    });
  };

  return (
    <Row className="g-4">
      <Col md={5}>
        <CategoryInfo bgcolor={category.bgColor} bgpattern={category.bgPattern}>
          <InfoContent>
            <InfoTitle>About {category.title}</InfoTitle>
            <InfoText>{category.description}</InfoText>
            
            <div className="mt-4">
              <InfoTitle>Key Characteristics</InfoTitle>
              <ul className="list-unstyled">
                {category.id === 'self-employed' && (
                  <>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Variable income patterns</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Business-focused financial needs</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Tax planning requirements</span>
                    </CharacteristicItem>
                  </>
                )}
                {category.id === 'working-professionals' && (
                  <>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Fixed income structure</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Corporate benefits and policies</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Career growth-based planning</span>
                    </CharacteristicItem>
                  </>
                )}
                {category.id === 'women-entrepreneurs' && (
                  <>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Special business loan schemes</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Government incentive eligibility</span>
                    </CharacteristicItem>
                    <CharacteristicItem>
                      <span className="check">✓</span>
                      <span>Work-life balance considerations</span>
                    </CharacteristicItem>
                  </>
                )}
              </ul>
            </div>
          </InfoContent>
        </CategoryInfo>
      </Col>

      <Col md={7}>
        <DetailCard>
          <Card.Body className="p-4">
            <Title>Customize Training Scenario</Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaUser /> Age
                </Form.Label>
                <RangeSlider
                  type="range"
                  name="age"
                  min="18"
                  max="70"
                  value={formData.age}
                  onChange={handleInputChange}
                />
                <SliderValue>{getAgeLabel(formData.age)}</SliderValue>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaMoneyBillWave /> Annual Income
                </Form.Label>
                <RangeSlider
                  type="range"
                  name="income"
                  min="1"
                  max="45"
                  value={formData.income}
                  onChange={handleInputChange}
                />
                <SliderValue>{getIncomeLabel(formData.income)}</SliderValue>
              </Form.Group>

              {category.id === 'working-professionals' && (
                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaBriefcase /> Occupation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="Enter your occupation/designation"
                    className="p-3"
                    style={{
                      borderRadius: '0.5rem',
                      border: '1px solid #E2E8F0'
                    }}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaInfoCircle /> Additional Context
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Add any specific details or context for the training scenario..."
                  className="p-3"
                  style={{
                    borderRadius: '0.5rem',
                    border: '1px solid #E2E8F0',
                    resize: 'none'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaInfoCircle /> Scenario
                </Form.Label>
                <Form.Select
                  value={formData.scenario}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    scenario: e.target.value
                  }))}
                >
                  {scenarioOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <StyledButton type="submit" size="lg" className="w-100">
                Start Training Scenario
              </StyledButton>
            </Form>
          </Card.Body>
        </DetailCard>
      </Col>
    </Row>
  );
};

CustomerCategory.Detail = CategoryDetail;

export default CustomerCategory; 