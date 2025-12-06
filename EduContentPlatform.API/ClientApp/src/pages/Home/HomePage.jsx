import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import ContentGrid from '../../components/content/ContentGrid/ContentGrid';
import { Button } from '../../components/common/UI/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { contentService } from '../../services/api/content';
import './home.css';

const HomePage = () => {
  const { user } = useAuth();
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const data = await contentService.getFeatured();
      setFeaturedContent(data);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to EduContent Platform
          </h1>
          <p className="hero-subtitle">
            Discover, learn, and share educational resources with educators, scholars, and students worldwide
          </p>
          <div className="hero-buttons">
            <Button variant="primary" size="lg" to="/browse">
              Explore Content
            </Button>
            {user ? (
              <Button
                variant="outline"
                size="lg"
                to="/upload"
                onClick={() => console.debug('Upload click', { token: localStorage.getItem('token'), user: localStorage.getItem('user') })}
              >
                Upload Resources
              </Button>
            ) : (
              <Button variant="outline" size="lg" to="/register">
                Join Now
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">1,000+</h3>
            <p className="stat-label">Educational Resources</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Active Educators</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">200+</h3>
            <p className="stat-label">Scholars</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">10,000+</h3>
            <p className="stat-label">Students</p>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Content</h2>
          <Button variant="link" to="/browse">
            View All →
          </Button>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <ContentGrid content={featuredContent} />
        )}
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Browse & Discover</h3>
            <p className="step-description">
              Explore thousands of educational resources across various subjects and levels
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Create & Upload</h3>
            <p className="step-description">
              Teachers and scholars can upload their educational content and publications
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Review & Publish</h3>
            <p className="step-description">
              Our editorial team ensures quality through a thorough review process
            </p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3 className="step-title">Learn & Engage</h3>
            <p className="step-description">
              Students access quality content and engage with the learning community
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Learning or Sharing?</h2>
          <p className="cta-subtitle">
            Join our growing community of educators and learners today
          </p>
          <div className="cta-buttons">
            <Button variant="primary" size="lg" to={user ? "/upload" : "/register"}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" to="/browse">
              Browse Content
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;