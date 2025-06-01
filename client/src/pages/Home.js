import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaCreditCard, FaCoins, FaPiggyBank, FaChartLine, 
  FaSeedling, FaArrowLeft, FaGraduationCap, FaUserTie,
  FaFemale, FaUsers, FaHome, FaStar, FaChartBar,
  FaUserCheck, FaClipboardCheck, FaChevronDown
} from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import CustomerCategory from '../components/CustomerCategory';
import ProductCategory from '../components/ProductCategory';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GromoGuru from '../components/GromoGuru';
import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const PageWrapper = styled.div`
  background: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1E3A8A 0%, #2B52DD 100%);
  color: white;
  padding: 6rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -20%;
    width: 80%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%);
    transform: rotate(-20deg);
    pointer-events: none;
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 10%;

  @media (max-width: 768px) {
    justify-content: center;
    padding-right: 0;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  max-width: 800px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    letter-spacing: -0.02em;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const PrimaryButton = styled.button`
  background: #2B52DD;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(43, 82, 221, 0.2);

  &:hover {
    background: #1E3BB7;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(43, 82, 221, 0.3);
  }
`;

const InterestButton = styled(PrimaryButton)`
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #1E3A8A;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-2px);
    background: #ffffff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ProductOptionsContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ProductOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductOption = styled.button`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
`;

const HeroText = styled.div`
  max-width: 600px;

  @media (max-width: 992px) {
    margin: 0 auto;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #E0E7FF;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const HeroImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: none;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  color: #1A1A1A;
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: 1.6rem;
  position: relative;
  padding-bottom: 0.5rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: #2B52DD;
    border-radius: 2px;
  }
`;

const SectionDescription = styled.p`
  color: #666666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const CategoryWrapper = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  scroll-margin-top: 80px;
`;

const PerformanceSection = styled.div`
  padding: 2rem 0;
  background: #f8f9fa;
  margin-bottom: 2rem;
`;

const PerformanceContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const PerformanceCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;

  &:first-child {
    flex: 0.8;
  }

  &:last-child {
    flex: 1.2;
  }
`;

const DonutChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled.div`
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 150px;
  margin: 0 auto;
  position: relative;
`;

const ChartLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.color};
`;

const MetricTitle = styled.h5`
  color: #2B2B2B;
  margin: 1rem 0;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
`;

const TrendChart = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ImprovementList = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ImprovementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ImprovementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: ${props => props.bgColor || '#F0F9FF'};
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  svg {
    color: ${props => props.iconColor || '#2B52DD'};
    font-size: 1.25rem;
    margin-top: 0.25rem;
  }
`;

const ImprovementText = styled.div`
  flex: 1;

  h6 {
    margin: 0 0 0.25rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background: ${props => props.bgColor || '#F0F9FF'};
  padding: 1rem;
  border-radius: 8px;
  text-align: center;

  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.textColor || '#2B52DD'};
    margin: 0.5rem 0;
  }

  p {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }

  svg {
    color: ${props => props.textColor || '#2B52DD'};
    font-size: 1.25rem;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  opacity: 0.1;
  background-image: linear-gradient(45deg, #ffffff 25%, transparent 25%),
    linear-gradient(-45deg, #ffffff 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ffffff 75%),
    linear-gradient(-45deg, transparent 75%, #ffffff 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProductOptions, setShowProductOptions] = useState(false);
  const [showGromoGuruMessage, setShowGromoGuruMessage] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [skipConfiguration, setSkipConfiguration] = useState(false);
  const [preConfiguredProfile, setPreConfiguredProfile] = useState(null);
  const productOptionsRef = useRef(null);

  useEffect(() => {
    if (showProductOptions && productOptionsRef.current) {
      productOptionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showProductOptions]);

  const productCategories = {
    cardsAndLoans: [
      {
        id: 'credit-card',
        title: 'Credit Card',
        icon: <FaCreditCard />,
        description: 'Choose from 100+ credit cards of leading brands',
        bgColor: '#F8F9FF',
        accentColor: '#2B52DD'
      },
      {
        id: 'personal-loan',
        title: 'Personal Loan',
        icon: <FaCoins />,
        description: 'Get loans with same day disbursals starting @ just 9.99% p.a.',
        bgColor: '#FFF9F0',
        accentColor: '#FF8C00'
      },
      {
        id: 'business-loan',
        title: 'Business Loan',
        icon: <FaSeedling />,
        description: 'Get the best loan recommendations curated to boost your business',
        bgColor: '#F0FFF4',
        accentColor: '#38A169'
      }
    ],
    savingsAndInvestments: [
      {
        id: 'savings',
        title: 'Savings A/c',
        icon: <FaPiggyBank />,
        description: 'Open your zero balance savings account',
        bgColor: '#F0F9FF',
        accentColor: '#3182CE'
      },
      {
        id: 'demat',
        title: 'Demat A/c',
        icon: <FaChartLine />,
        description: 'Open Free* Demat account in 2 minutes',
        bgColor: '#FFF5F5',
        accentColor: '#E53E3E'
      },
      {
        id: 'investment',
        title: 'Investment',
        icon: <FaSeedling />,
        description: 'Invest in FD, Gold, Tax saver mutual funds',
        bgColor: '#F0F4FF',
        accentColor: '#4C51BF'
      }
    ]
  };

  const customerCategories = [
    {
      id: 'self-employed',
      title: 'Self-Employed Professionals',
      description: 'Training scenarios for independent professionals and business owners',
      bgColor: '#F8F9FF',
      icon: <FaUserTie />
    },
    {
      id: 'working-professionals',
      title: 'Working Professionals',
      description: 'Training scenarios for corporate employees and working professionals',
      bgColor: '#FFF9F0',
      icon: <FaUsers />
    },
    {
      id: 'women-entrepreneurs',
      title: 'Women Entrepreneurs',
      description: 'Specialized scenarios for women-led businesses and ventures',
      bgColor: '#FFF0F7',
      icon: <FaFemale />
    },
    {
      id: 'students',
      title: 'Students and Early Career',
      description: 'Training for young professionals and students entering the workforce',
      bgColor: '#F0F9FF',
      icon: <FaGraduationCap />
    },
    {
      id: 'rural',
      title: 'Rural and Semi-Urban',
      description: 'Scenarios focused on semi-urban and rural customer needs',
      bgColor: '#F0FFF4',
      icon: <FaHome />
    },
    {
      id: 'hni',
      title: 'High Net-Worth Individuals',
      description: 'Premium customer scenarios with complex financial needs',
      bgColor: '#FFF5F5',
      icon: <FaStar />
    }
  ];

  // Mock performance data (to be replaced with actual data)
  const performanceData = {
    overall: {
      current: 85,
      color: '#2B52DD'
    },
    sales: {
      current: 78,
      color: '#38A169'
    },
    technical: {
      current: 92,
      color: '#805AD5'
    }
  };

  const getChartData = (score, color) => ({
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [color, '#F3F4F6'],
      borderWidth: 0,
      cutout: '80%'
    }]
  });

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    maintainAspectRatio: true,
    responsive: true
  };

  // Mock trend data
  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Performance Trend',
        data: [65, 72, 78, 82, 85],
        borderColor: '#2B52DD',
        backgroundColor: 'rgba(43, 82, 221, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 }
      }
    }
  };

  const handleStartTraining = () => {
    const productSection = document.getElementById('product-categories');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInterestClick = () => {
    setShowProductOptions(true);
    setShowGromoGuruMessage(true);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: "100%" }}
            >
              <WelcomeMessage>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Welcome {user.username} to the Gromo Learning Platform
                </motion.h2>
              </WelcomeMessage>
            </motion.div>
          )}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{ width: "100%" }}
            >
              <ButtonContainer>
                <InterestButton onClick={handleInterestClick}>
                  Customize your training journey 
                </InterestButton>
              </ButtonContainer>
            </motion.div>
          )}
        </HeroContent>
      </HeroSection>

      <AnimatePresence>
        {showProductOptions && (
          <ProductOptionsContainer
            ref={productOptionsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-center mb-4">Choose Your Interest</h3>
            <ProductOptionGrid>
              {Object.entries(productCategories).map(([category, items]) => (
                items.map((item) => (
                  <ProductOption
                    key={item.id}
                    onClick={() => {
                      navigate(`/intermediate/${item.id}`);
                      setShowProductOptions(false);
                      setShowGromoGuruMessage(false);
                    }}
                  >
                    {item.icon}
                    <div>
                      <div className="title">{item.title}</div>
                      <div className="description">{item.description}</div>
                    </div>
                  </ProductOption>
                ))
              ))}
            </ProductOptionGrid>
          </ProductOptionsContainer>
        )}
      </AnimatePresence>

      <GromoGuru showSuggestion={showProductOptions} forceShow={showGromoGuruMessage} />

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={isSessionStarted ? () => setSettingsOpen(false) : undefined}
        maxWidth="lg" 
        fullWidth
        disableEscapeKeyDown={!isSessionStarted}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          position: 'relative',
          '& .close-button': {
            position: 'absolute',
            right: 8,
            top: 8,
          }
        }}>
          {isSessionStarted && (
            <IconButton
              onClick={() => setSettingsOpen(false)}
              className="close-button"
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            {isSessionStarted ? 'Update Customer Profile' : 
             (skipConfiguration && preConfiguredProfile) ? 'Customer Profile (Pre-configured)' :
             'Configure Your Training Session'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSessionStarted 
              ? 'Update the customer profile for this session'
              : (skipConfiguration && preConfiguredProfile)
                ? 'Your customer profile has been pre-configured from the customer category selection'
                : 'Choose the customer profile to practice with realistic scenarios'
            }
          </Typography>
        </DialogTitle>
      </Dialog>
    </PageWrapper>
  );
};

export default Home;
