import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Spinner,
  Alert,
  Row,
  Col,
  Pagination,
  Modal
} from 'react-bootstrap';
import { FaArrowLeft, FaChartLine, FaClock, FaStar } from 'react-icons/fa';
import { useConversation } from '../context/ConversationContext';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasMore: false
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { getConversationHistory } = useConversation();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for analysis data in location state
  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysisData(location.state.analysis);
      setShowAnalysis(true);
      // Clear the state to prevent showing analysis again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchSessions = async (page = 1) => {
    try {
      console.log('Fetching sessions for page:', page);
      setLoading(true);
      setError('');
      
      const result = await getConversationHistory(page);
      console.log('History API response:', result);
      
      if (result.success) {
        if (!result.data?.conversations) {
          console.error('Invalid response format:', result.data);
          setError('Invalid response format from server');
          return;
        }
        
        console.log('Setting sessions:', result.data.conversations);
        setSessions(result.data.conversations);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to load sessions:', result.error);
        setError(result.error || 'Failed to load session history');
      }
    } catch (err) {
      console.error('Error fetching session history:', err);
      console.error('Full error object:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.response?.data?.message || 'An error occurred while loading your session history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('History component mounted');
    let mounted = true;
    
    const init = async () => {
      try {
        if (mounted) {
          console.log('Initializing history view');
          await fetchSessions(1);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error in history initialization:', err);
          setError('Failed to initialize history view');
        }
      }
    };

    init();

    return () => {
      console.log('History component unmounting');
      mounted = false;
    };
  }, []);

  const handlePageChange = (page) => {
    fetchSessions(page);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScenarioName = (scenario) => {
    const scenarioNames = {
      income: 'Income-Based',
      area: 'Area-Based',
      insurance: 'Insurance',
      credit_score: 'Credit Score'
    };
    return scenarioNames[scenario] || scenario;
  };

  const renderRating = (rating) => {
    if (!rating) return 'N/A';
    
    return (
      <div className="d-flex align-items-center">
        <FaStar className="text-warning me-1" />
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading && sessions.length === 0) {
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Session History</h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Analysis Modal */}
      <Modal 
        show={showAnalysis} 
        onHide={() => setShowAnalysis(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Performance Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {analysisData && (
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              maxHeight: '70vh', 
              overflow: 'auto',
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {(() => {
                try {
                  // If it's already a string, try to parse it
                  const data = typeof analysisData === 'string' 
                    ? JSON.parse(analysisData)
                    : analysisData;

                  // Ensure the data has the exact structure we want
                  const formattedData = {
                    overallScore: data.overallScore || 0,
                    comments: data.comments || "",
                    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
                    areasForImprovement: Array.isArray(data.areasForImprovement) ? data.areasForImprovement : [],
                    performanceMetrics: {
                      salesEffectiveness: {
                        score: data.performanceMetrics?.salesEffectiveness?.score || 0,
                        strengths: Array.isArray(data.performanceMetrics?.salesEffectiveness?.strengths) 
                          ? data.performanceMetrics.salesEffectiveness.strengths 
                          : []
                      },
                      technicalProficiency: {
                        score: data.performanceMetrics?.technicalProficiency?.score || 0,
                        strengths: Array.isArray(data.performanceMetrics?.technicalProficiency?.strengths)
                          ? data.performanceMetrics.technicalProficiency.strengths
                          : []
                      },
                      complianceEthics: {
                        score: data.performanceMetrics?.complianceEthics?.score || 0,
                        strengths: Array.isArray(data.performanceMetrics?.complianceEthics?.strengths)
                          ? data.performanceMetrics.complianceEthics.strengths
                          : []
                      },
                      detailedSuggestions: {
                        conversationFlow: Array.isArray(data.performanceMetrics?.detailedSuggestions?.conversationFlow)
                          ? data.performanceMetrics.detailedSuggestions.conversationFlow
                          : [],
                        productKnowledge: Array.isArray(data.performanceMetrics?.detailedSuggestions?.productKnowledge)
                          ? data.performanceMetrics.detailedSuggestions.productKnowledge
                          : [],
                        communicationStyle: Array.isArray(data.performanceMetrics?.detailedSuggestions?.communicationStyle)
                          ? data.performanceMetrics.detailedSuggestions.communicationStyle
                          : []
                      }
                    }
                  };

                  return JSON.stringify(formattedData, null, 2);
                } catch (e) {
                  console.error('Error formatting analysis data:', e);
                  return JSON.stringify({
                    overallScore: 0,
                    comments: "Error formatting analysis data",
                    suggestions: [],
                    areasForImprovement: [],
                    performanceMetrics: {
                      salesEffectiveness: { score: 0, strengths: [] },
                      technicalProficiency: { score: 0, strengths: [] },
                      complianceEthics: { score: 0, strengths: [] },
                      detailedSuggestions: {
                        conversationFlow: [],
                        productKnowledge: [],
                        communicationStyle: []
                      }
                    }
                  }, null, 2);
                }
              })()}
            </pre>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnalysis(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {sessions.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>No sessions found</h4>
            <p className="text-muted">Start a new conversation to begin training!</p>
            <Button variant="primary" onClick={() => navigate('/intermediate/personal-loan')}>
              Start New Session
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card>
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Scenario</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session._id}>
                    <td>{formatDate(session.createdAt)}</td>
                    <td>{getScenarioName(session.scenario)}</td>
                    <td>
                      <Badge bg={session.isCompleted ? 'success' : 'warning'}>
                        {session.isCompleted ? 'Completed' : 'In Progress'}
                      </Badge>
                    </td>
                    <td>{renderRating(session.feedback?.rating)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/feedback/${session._id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                />
                
                {[...Array(pagination.pages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === pagination.page}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                />
                <Pagination.Last
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.pages)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default History;
