import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaComments, FaBook, FaUserFriends } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { conversationAPI } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const PageContainer = styled(Container)`
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: #2B2B2B;
    font-weight: 600;
  }
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
`;

const FeedbackSection = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionTitle = styled.h4`
  color: #2B2B2B;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const MetricCard = styled(Card)`
  border: none;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: 100%;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ChartContainer = styled.div`
  width: 180px;
  margin: 0 auto;
  position: relative;
`;

const ChartLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => getScoreColor(props.score || 0)};
`;

const MetricTitle = styled.h5`
  color: #2B2B2B;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const MetricDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  line-height: 1.5;
`;

const OverallScore = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  h3 {
    margin: 1.5rem 0;
    color: ${props => getScoreColor(props.score || 0)};
    font-weight: 600;
  }
`;

const ListContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
`;

const ListItem = styled.li`
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: ${props => props.type === 'suggestion' ? '#F0FDF4' : '#FFF5F5'};
  border-radius: 8px;
  margin-bottom: 1rem;

  svg {
    margin-top: 0.25rem;
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  span {
    font-size: 1rem;
    line-height: 1.5;
    color: #2B2B2B;
  }
`;

const getScoreColor = (score) => {
  // Green shades (70-100)
  if (score >= 90) return '#2E7D32';
  if (score >= 80) return '#43A047';
  if (score >= 70) return '#66BB6A';
  
  // Yellow shades (30-69)
  if (score >= 60) return '#FDD835';
  if (score >= 50) return '#FFEB3B';
  if (score >= 40) return '#FFF176';
  
  // Red shades (10-29)
  if (score >= 20) return '#E53935';
  return '#EF5350';
};

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ErrorMessage = styled(Alert)`
  margin: 2rem 0;
  border-radius: 12px;
`;

const SuggestionSection = styled.div`
  margin-top: 3rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SuggestionBox = styled.div`
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const SuggestionCategory = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h6`
  color: #2B2B2B;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${props => props.color || '#2B2B2B'};
  }
`;

const SuggestionText = styled.p`
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;

  &:before {
    content: "•";
    position: absolute;
    left: 0.5rem;
    color: ${props => props.color || '#2B2B2B'};
  }
`;

const Feedback = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static fallback content
  const staticSuggestions = {
    conversationFlow: [
      "Consider using more open-ended questions to gather detailed customer requirements",
      "Follow up on customer concerns more proactively",
      "Allow more time for customers to express their needs fully"
    ],
    productKnowledge: [
      "Provide more specific details about product features and benefits",
      "Compare different product options to help customer make informed decisions",
      "Include relevant examples of how products can address customer needs"
    ],
    communicationStyle: [
      "Use simpler language when explaining technical terms",
      "Maintain a more consistent pace throughout the conversation",
      "Incorporate more active listening techniques"
    ]
  };

  const staticAreasForImprovement = [
    "Could provide more specific examples",
    "Consider discussing alternative products",
    "Follow up on customer concerns more deeply"
  ];

  const staticKeyStrengths = [
    "Good product knowledge",
    "Effective communication",
    "Professional demeanor"
  ];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await conversationAPI.getConversationAnalysis(conversationId);
        console.log('Server response:', response); // Debug log

        // Prefer backend feedback object if available
        let feedbackFromBackend = response.feedback;
        let analysisData;
        if (feedbackFromBackend) {
          // Use backend feedback (from conversation schema)
          analysisData = feedbackFromBackend;
        } else {
          // Fallback: Parse the analysis string
          try {
            analysisData = typeof response.analysis === 'string'
              ? JSON.parse(response.analysis)
              : response.analysis;
            console.log('Parsed analysis data:', analysisData); // Debug log
          } catch (parseError) {
            console.error('Error parsing analysis data:', parseError);
            analysisData = {};
          }
        }

        // Use backend feedback fields or fallback to static if missing

        // Use score array if present for all chart numbers
        const scoreArr = Array.isArray(analysisData.score) && analysisData.score.length === 4
          ? analysisData.score
          : [
              analysisData.overallScore || 0,
              analysisData.performanceMetrics?.salesEffectiveness?.score || 0,
              analysisData.performanceMetrics?.technicalProficiency?.score || 0,
              analysisData.performanceMetrics?.complianceEthics?.score || 0
            ];

        const feedbackData = {
          overallScore: scoreArr[0],
          comments: analysisData.comments || '',
          suggestions: Array.isArray(analysisData.suggestions) && analysisData.suggestions.length > 0 ? analysisData.suggestions : staticKeyStrengths,
          areasForImprovement: Array.isArray(analysisData.areasForImprovement) && analysisData.areasForImprovement.length > 0 ? analysisData.areasForImprovement : staticAreasForImprovement,
          performanceMetrics: {
            salesEffectiveness: {
              score: scoreArr[1],
              strengths: analysisData.performanceMetrics?.salesEffectiveness?.strengths || []
            },
            technicalProficiency: {
              score: scoreArr[2],
              strengths: analysisData.performanceMetrics?.technicalProficiency?.strengths || []
            },
            complianceEthics: {
              score: scoreArr[3],
              strengths: analysisData.performanceMetrics?.complianceEthics?.strengths || []
            }
          },
          detailedSuggestions: {
            conversationFlow:
              Array.isArray(analysisData.detailedSuggestions?.conversationFlow) && analysisData.detailedSuggestions.conversationFlow.length > 0
                ? analysisData.detailedSuggestions.conversationFlow
                : staticSuggestions.conversationFlow,
            productKnowledge:
              Array.isArray(analysisData.detailedSuggestions?.productKnowledge) && analysisData.detailedSuggestions.productKnowledge.length > 0
                ? analysisData.detailedSuggestions.productKnowledge
                : staticSuggestions.productKnowledge,
            communicationStyle:
              Array.isArray(analysisData.detailedSuggestions?.communicationStyle) && analysisData.detailedSuggestions.communicationStyle.length > 0
                ? analysisData.detailedSuggestions.communicationStyle
                : staticSuggestions.communicationStyle
          }
        };

        console.log('Final feedback data:', feedbackData); // Debug log
        setFeedback(feedbackData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError(err.message || 'Failed to load feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [conversationId]);

  const getChartData = (score) => ({
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [
        getScoreColor(score),
        '#F3F4F6'
      ],
      borderWidth: 0,
      cutout: '80%'
    }],
    labels: ['Score', 'Remaining']
  });

  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: true,
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <h3>Analyzing your performance...</h3>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage variant="danger">
          {error}
        </ErrorMessage>
        <BackButton variant="primary" onClick={() => navigate('/')}>
          <FaArrowLeft /> Return to Home
        </BackButton>
      </PageContainer>
    );
  }

  if (!feedback) {
    return (
      <PageContainer>
        <ErrorMessage variant="warning">
          No feedback data available.
        </ErrorMessage>
        <BackButton variant="primary" onClick={() => navigate('/')}>
          <FaArrowLeft /> Return to Home
        </BackButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h2>Performance Evaluation</h2>
        <BackButton variant="outline-primary" onClick={() => navigate('/')}>
          <FaArrowLeft /> Start New Session
        </BackButton>
      </Header>

      <OverallScore score={feedback.overallScore}>
        <SectionTitle>Overall Performance</SectionTitle>
        <ChartContainer>
          <Doughnut 
            data={getChartData(feedback.overallScore)} 
            options={chartOptions} 
          />
          <ChartLabel score={feedback.overallScore}>{feedback.overallScore}%</ChartLabel>
        </ChartContainer>
        <h3>{feedback.comments}</h3>
      </OverallScore>

      <Row className="mb-5">
        <Col md={4}>
          <MetricCard>
            <MetricTitle>Sales Effectiveness & Customer Engagement</MetricTitle>
            <ChartContainer>
              <Doughnut 
                data={getChartData(feedback.performanceMetrics?.salesEffectiveness?.score || 0)} 
                options={chartOptions} 
              />
              <ChartLabel score={feedback.performanceMetrics?.salesEffectiveness?.score || 0}>
                {feedback.performanceMetrics?.salesEffectiveness?.score || 0}%
              </ChartLabel>
            </ChartContainer>
            <MetricDescription>
              Ability to identify customer needs, engage effectively, and drive conversion.
            </MetricDescription>
          </MetricCard>
        </Col>
        <Col md={4}>
          <MetricCard>
            <MetricTitle>Product & Technical Proficiency</MetricTitle>
            <ChartContainer>
              <Doughnut 
                data={getChartData(feedback.performanceMetrics?.technicalProficiency?.score || 0)} 
                options={chartOptions} 
              />
              <ChartLabel score={feedback.performanceMetrics?.technicalProficiency?.score || 0}>
                {feedback.performanceMetrics?.technicalProficiency?.score || 0}%
              </ChartLabel>
            </ChartContainer>
            <MetricDescription>
              Demonstrates consultative expertise and customizes solutions.
            </MetricDescription>
          </MetricCard>
        </Col>
        <Col md={4}>
          <MetricCard>
            <MetricTitle>Compliance, Ethics & Documentation</MetricTitle>
            <ChartContainer>
              <Doughnut 
                data={getChartData(feedback.performanceMetrics?.complianceEthics?.score || 0)} 
                options={chartOptions} 
              />
              <ChartLabel score={feedback.performanceMetrics?.complianceEthics?.score || 0}>
                {feedback.performanceMetrics?.complianceEthics?.score || 0}%
              </ChartLabel>
            </ChartContainer>
            <MetricDescription>
              Ensures clean, compliant, and audit-ready sales behavior.
            </MetricDescription>
          </MetricCard>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <ListContainer>
            <SectionTitle>Key Strengths</SectionTitle>
            <ul className="list-unstyled">
              {Array.isArray(feedback.suggestions)
                ? feedback.suggestions.map((suggestion, index) => (
                    <ListItem key={index} type="suggestion">
                      <FaCheckCircle color="#22C55E" />
                      <span>{suggestion}</span>
                    </ListItem>
                  ))
                : null}
            </ul>
          </ListContainer>
        </Col>
        <Col lg={6}>
          <ListContainer>
            <SectionTitle>Areas for Improvement</SectionTitle>
            <ul className="list-unstyled">
              {Array.isArray(feedback.areasForImprovement)
                ? feedback.areasForImprovement.map((area, index) => (
                    <ListItem key={index} type="improvement">
                      <FaExclamationTriangle color="#EF4444" />
                      <span>{area}</span>
                    </ListItem>
                  ))
                : null}
            </ul>
          </ListContainer>
        </Col>
      </Row>

      <SuggestionSection>
        <SectionTitle>
          Detailed Improvement Suggestions
        </SectionTitle>
        <SuggestionBox>
          <SuggestionCategory>
            <CategoryTitle color="#3B82F6">
              <FaComments /> Conversation Flow
            </CategoryTitle>
            {Array.isArray(feedback.detailedSuggestions?.conversationFlow)
              ? feedback.detailedSuggestions.conversationFlow.map((suggestion, index) => (
                  <SuggestionText key={index} color="#3B82F6">
                    {suggestion}
                  </SuggestionText>
                ))
              : null}
          </SuggestionCategory>

          <SuggestionCategory>
            <CategoryTitle color="#8B5CF6">
              <FaBook /> Product Knowledge
            </CategoryTitle>
            {Array.isArray(feedback.detailedSuggestions?.productKnowledge)
              ? feedback.detailedSuggestions.productKnowledge.map((suggestion, index) => (
                  <SuggestionText key={index} color="#8B5CF6">
                    {suggestion}
                  </SuggestionText>
                ))
              : null}
          </SuggestionCategory>

          <SuggestionCategory>
            <CategoryTitle color="#10B981">
              <FaUserFriends /> Communication Style
            </CategoryTitle>
            {Array.isArray(feedback.detailedSuggestions?.communicationStyle)
              ? feedback.detailedSuggestions.communicationStyle.map((suggestion, index) => (
                  <SuggestionText key={index} color="#10B981">
                    {suggestion}
                  </SuggestionText>
                ))
              : null}
          </SuggestionCategory>
        </SuggestionBox>
      </SuggestionSection>
    </PageContainer>
  );
};

export default Feedback; 