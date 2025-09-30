import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
require('dotenv').config()


const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    background: #000;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: #000;
  padding: 0;
  margin: 0;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease;
  background: ${props => props.scrolled ? 'rgba(30, 30, 30, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  border-radius: ${props => props.scrolled ? '30px' : '0'};
  box-shadow: ${props => props.scrolled ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none'};
  margin: ${props => props.scrolled ? '1rem auto' : '0'};
  width: ${props => props.scrolled ? '95dvw' : '100%'};
  left: ${props => props.scrolled ? '50%' : '0'};
  transform: ${props => props.scrolled ? 'translateX(-50%)' : 'none'};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  margin-right: 1rem;

  @media (max-width: 768px) {
    height: 32px;
    margin-right: 0.5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
`;

const LogoTextBlue = styled.span`
  color: #007bff;
`;

const LogoTextWhite = styled.span`
  color: #fff;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 300px;

  @media (max-width: 768px) {
    gap: 1rem;
    min-width: auto;
  }
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    max-width: 80px;
  }

  &:hover {
    color: #007bff;
  }
`;

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4));
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const AnalyzerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
`;

const TextArea = styled.textarea`
  width: 75dvw;
  min-height: 200px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 2px solid #444;
  border-radius: 12px;
  font-size: 1rem;
  background: #111;
  color: #fff;
  transition: all 0.3s ease;
  line-height: 1.6;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
  }
  
  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Section = styled.section`
  padding: 3.5rem 2rem;
  background: ${props => props.alternate ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterLogo = styled.img`
  height: 40px;
  width: auto;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.isHuman ? 'rgba(33, 150, 243, 0.1)' : 'rgba(245, 0, 87, 0.1)'};
  border: 1px solid ${props => props.isHuman ? 'rgba(33, 150, 243, 0.3)' : 'rgba(245, 0, 87, 0.3)'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 75dvw;
`;

const ResultTitle = styled.h3`
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
`;

const PercentageDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
  color: ${props => props.isGPT ? '#f50057' : '#2196f3'};
  text-shadow: 0 0 10px ${props => props.isGPT ? 'rgba(245, 0, 87, 0.3)' : 'rgba(33, 150, 243, 0.3)'};
`;

const ConfidenceBar = styled.div`
  height: 20px;
  background: rgba(33, 150, 243, 0.2);
  border-radius: 10px;
  margin: 1rem 0;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, #ff4081, #f50057);
  transition: width 0.5s ease-in-out;
  box-shadow: 0 0 10px rgba(245, 0, 87, 0.5);
`;

const RemainingFill = styled.div`
  height: 100%;
  flex-grow: 1;
  background: linear-gradient(90deg, #2196f3, #64b5f6);
  transition: all 0.5s ease-in-out;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #fff;
`;

const LegendBox = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${props => props.isHuman ? '#2196f3' : '#f50057'};
`;

const HighlightedText = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.56);
  border-radius: 12px;
  line-height: 1.6;
  font-size: 1.1rem;
  outline: 0.5px solid white;
  text-align: left;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const HighlightedSentence = styled.span`
  background: ${props => props.isGPT ? 'rgba(245, 0, 86, 0.39)' : 'transparent'};
  border-left: ${props => props.isGPT ? '3px solid #f50057' : 'none'};
  padding-left: ${props => props.isGPT ? '0.25rem' : '0'};
  margin-left: ${props => props.isGPT ? '0.1rem' : '0'};
  color: #fff;
  display: inline;
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FAQQuestion = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FAQAnswer = styled.div`
  padding: ${props => props.isOpen ? '1.5rem' : '0 1.5rem'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  border-top: ${props => props.isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
`;

const ArrowIcon = styled.span`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s ease;
  color: #007bff;
  font-size: 1.2rem;
`;

const ModelSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  label {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  select {
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #fff;
    padding: 0.8rem 2.5rem 0.8rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.5em;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    option {
      background: #1a1a1a;
      color: #fff;
      padding: 1rem;
    }
  }
`;

const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('svm');
  const [modelData, setModelData] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const minWords = 30;
  const [error, setError] = useState(null);
  const [confidenceLevel, setLevel] = useState("null");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/model_weights.json')
      .then(response => response.json())
      .then(data => setModelData(data))
      .catch(error => console.error('Error loading model:', error));
  }, []);
  

  const analyzeText = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('https://ai-detector-api-pyta.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.REACT_APP_SECRET_KEY
        },
        body: JSON.stringify({
          text: text,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const data = await response.json();
      let conf = data.confidence;

      if (conf == 50) {
        setLevel("Inconclusive");
      }
      else if (conf <= 75) {
        setLevel("Probably " + data.prediction);
      }
      else {
        setLevel("Most Likely " + data.prediction);
      }
      
      console.log('API Response:', data);
      setResult(data);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error analyzing text. Please try again.');
    } finally {
      setLoading(false);
    }
    
  };


  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Global styles={globalStyles} />
      <PageContainer>
        <Header scrolled={scrolled}>
          <LogoContainer>
            <LogoText>
              <LogoTextBlue>AI</LogoTextBlue>
              <LogoTextWhite>dentify</LogoTextWhite>
            </LogoText>
          </LogoContainer>
          <Nav>
            <NavLink onClick={() => scrollToSection('about')}>About</NavLink>
            <NavLink onClick={() => scrollToSection('mission')}>Mission</NavLink>
            <NavLink onClick={() => scrollToSection('research')}>Research</NavLink>
            <NavLink onClick={() => scrollToSection('faq')}>FAQ</NavLink>
          </Nav>
        </Header>

        <Hero>
          <Title>
            <span style={{ color: '#007bff' }}>AI</span>dentify
          </Title>
          <Subtitle>
            Advanced AI text detection powered by machine learning and millions of data points.
            Analyze any text to determine if it was written by AI or human.
          </Subtitle>
          <AnalyzerContainer>
            <ModelSelector>
              <label>Select Model:</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="svm">SVM Model</option>
                <option value="xgb">XGBoost Model</option>
              </select>
            </ModelSelector>

            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze..."
            />

            <Button 
              onClick={analyzeText} 
              disabled={loading}
              className="analyze-button"
            >
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </Button>

            {text.trim().split(/\s+/).length < minWords && (
              <div style={{ color: '#f50057', marginTop: '0.5rem', textAlign: 'center' }}>
                Please enter at least 30 words to analyze.
              </div>
            )}

            {error && (
              <div style={{ color: '#f50057', marginTop: '0.5rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {result && (
              <ResultContainer isHuman={result.prediction === 'Human'}>
                <ResultTitle>
                  Analysis Results: {confidenceLevel}
                </ResultTitle>
                <PercentageDisplay isGPT={result.prediction === 'GPT'}>
                  {result.prediction === 'GPT' ? result.confidence.toFixed(2) : (100 - result.confidence).toFixed(2)}% GPT 
                </PercentageDisplay>
                <Legend>
                  <LegendItem>
                    <LegendBox isHuman={false} />
                    <span>GPT</span>
                  </LegendItem>
                  <LegendItem>
                    <LegendBox isHuman={true} />
                    <span>Human</span>
                  </LegendItem>
                </Legend>
                <ConfidenceBar>
                  <ConfidenceFill 
                    percentage= {result.prediction === 'GPT' ? result.confidence : (100 - result.confidence)}
                  />
                  <RemainingFill />
                </ConfidenceBar>

                <HighlightedText>
                  {result && result.sentence_predictions && Array.isArray(result.sentence_predictions) ? (
                    result.sentence_predictions.map((prediction, index) => (
                      <HighlightedSentence 
                        key={index} 
                        isGPT={prediction.is_gpt}
                      >
                        {prediction.sentence.trim()}
                      </HighlightedSentence>
                    ))
                  ) : (
                    <div>No sentence analysis available</div>
                  )}
                </HighlightedText>
              </ResultContainer>
            )}
          </AnalyzerContainer>
        </Hero>

        <Section id="about">
          <SectionTitle>About</SectionTitle>
          <Container>
            <p>Our AI detection system, <span style={{ color: '#007bff' }}>AIdentify</span>, uses advanced machine learning algorithms to analyze text patterns and determine whether content was generated by AI or written by a human. With millions of training examples, we've achieved remarkable accuracy in distinguishing between human and AI-generated text.</p>
          </Container>
        </Section>

        <Section id="mission" alternate>
          <SectionTitle>Our Mission</SectionTitle>
          <Container>
            <p>At <span style={{ color: '#007bff' }}>AIdentify</span>, we're committed to promoting transparency in AI-generated content. Our goal is to help maintain the integrity of written content while embracing the benefits of AI technology. We believe in responsible AI usage and want to help users make informed decisions about the content they consume and create.</p>
          </Container>
        </Section>

        <Section id="research">
          <SectionTitle>Research & Data</SectionTitle>
          <Container>
            <Grid>
              <Card>
                <h3>Millions of Examples</h3>
                <p>Trained on a vast dataset of both human and AI-generated text to ensure accurate detection.</p>
              </Card>
              <Card>
                <h3>Advanced Algorithms</h3>
                <p>Utilizing state-of-the-art machine learning models for precise analysis.</p>
              </Card>
              <Card>
                <h3>Continuous Updates</h3>
                <p>Regularly updated to keep pace with evolving AI text generation capabilities.</p>
              </Card>
            </Grid>
          </Container>
        </Section>

        <Section id="faq" alternate>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <Container>
            <FAQContainer>
              <FAQItem>
                <FAQQuestion onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}>
                  <h3>How accurate is AIdentify's detection?</h3>
                  <ArrowIcon isOpen={openFAQ === 0}>▼</ArrowIcon>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === 0}>
                  <p>AIdentify achieves high accuracy through extensive training on millions of diverse text samples. Our advanced, research-backed machine learning algorithms analyze multiple linguistic patterns to provide reliable detection results.</p>
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}>
                  <h3>What types of text can AIdentify analyze?</h3>
                  <ArrowIcon isOpen={openFAQ === 1}>▼</ArrowIcon>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === 1}>
                  <p>AIdentify can analyze any text content, from short paragraphs to longer documents. Our system is optimized to handle various writing styles and formats while maintaining high accuracy.</p>
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}>
                  <h3>How does AIdentify work?</h3>
                  <ArrowIcon isOpen={openFAQ === 2}>▼</ArrowIcon>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === 2}>
                  <p>AIdentify uses advanced machine learning algorithms to analyze various linguistic patterns, including sentence structure, vocabulary usage, and writing style. Our system compares these patterns against our extensive database of human and AI-generated text to determine the likelihood of AI generation.</p>
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}>
                  <h3>Is AIdentify regularly updated?</h3>
                  <ArrowIcon isOpen={openFAQ === 3}>▼</ArrowIcon>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === 3}>
                  <p>Yes, AIdentify is continuously updated to keep pace with evolving AI text generation capabilities. Our team regularly incorporates new training data and improves our algorithms to maintain high detection accuracy.</p>
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQQuestion onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}>
                  <h3>How can AIdentify help maintain content integrity?</h3>
                  <ArrowIcon isOpen={openFAQ === 4}>▼</ArrowIcon>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === 4}>
                  <p>AIdentify helps maintain content integrity by providing transparency in AI-generated content. Our tool enables users to make informed decisions about the content they consume and create, promoting responsible AI usage and maintaining trust in written communication.</p>
                </FAQAnswer>
              </FAQItem>
            </FAQContainer>
          </Container>
        </Section>

        <Footer>
          <FooterLogo src="/favicon_io (7)/android-chrome-192x192.png" alt="AI Detector Logo" />
        </Footer>
      </PageContainer>
    </>
  );
};

export default TextAnalyzer;
