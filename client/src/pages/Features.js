import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import styled from 'styled-components';
import { 
  FaRobot, 
  FaChartLine, 
  FaUserGraduate, 
  FaComments, 
  FaClipboardCheck,
  FaUsers,
  FaLightbulb,
  FaShieldAlt
} from 'react-icons/fa';

const PageWrapper = styled.div`
  padding: 4rem 0;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  color: #1a1a1a;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #666666;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border: none;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.iconColor || '#2B52DD'};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  color: #1a1a1a;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const Features = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: "AI-Powered Training",
      description: "Experience realistic customer interactions with our advanced AI system that simulates various customer personalities and scenarios.",
      bgColor: "#e3f2fd",
      iconColor: "#2B52DD"
    },
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics, performance metrics, and personalized improvement suggestions.",
      bgColor: "#e8f5e9",
      iconColor: "#2e7d32"
    },
    {
      icon: <FaUserGraduate />,
      title: "Customized Learning",
      description: "Tailor your training experience with different customer profiles, scenarios, and difficulty levels.",
      bgColor: "#fff3e0",
      iconColor: "#f57c00"
    },
    {
      icon: <FaComments />,
      title: "Real-time Feedback",
      description: "Receive instant feedback on your responses, communication style, and sales techniques.",
      bgColor: "#f3e5f5",
      iconColor: "#7b1fa2"
    },
    {
      icon: <FaClipboardCheck />,
      title: "Scenario Library",
      description: "Access a vast library of pre-built scenarios covering various financial products and customer situations.",
      bgColor: "#e0f2f1",
      iconColor: "#00897b"
    },
    {
      icon: <FaUsers />,
      title: "Customer Profiles",
      description: "Practice with diverse customer profiles including self-employed, working professionals, and entrepreneurs.",
      bgColor: "#fff8e1",
      iconColor: "#ffa000"
    },
    {
      icon: <FaLightbulb />,
      title: "Smart Suggestions",
      description: "Get intelligent product recommendations and cross-selling opportunities based on customer profiles.",
      bgColor: "#fce4ec",
      iconColor: "#c2185b"
    },
    {
      icon: <FaShieldAlt />,
      title: "Compliance Training",
      description: "Stay compliant with built-in regulatory guidelines and best practices for financial consulting.",
      bgColor: "#e8eaf6",
      iconColor: "#3f51b5"
    }
  ];

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Platform Features</Title>
          <Subtitle>
            Discover how our AI-powered platform revolutionizes financial consultant training
            with realistic scenarios, instant feedback, and comprehensive analytics.
          </Subtitle>
        </Header>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <FeatureCard>
                <IconWrapper bgColor={feature.bgColor} iconColor={feature.iconColor}>
                  {feature.icon}
                </IconWrapper>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            </Col>
          ))}
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Features; 