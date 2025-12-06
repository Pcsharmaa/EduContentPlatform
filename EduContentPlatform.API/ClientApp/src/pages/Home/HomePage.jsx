import React, { useEffect, useState } from "react";
import MainLayout from "../../components/common/Layout/MainLayout";
import { Button } from "../../components/common/UI/Button/Button";
import { useAuth } from "../../context/AuthContext";
import "../../components/content/ContentCard/Cards.css"

// Import Card Components
import BookCard from "../../components/content/ContentCard/BookCard";
import VideoCard from "../../components/content/ContentCard/VideoCard";
import DocumentCard from "../../components/content/ContentCard/DocumentCard";
import ContentCard from "../../components/content/ContentCard/ContentCard";

import "./home.css";

const HomePage = () => {
  const { user } = useAuth();

  const [featuredContent, setFeaturedContent] = useState({
    books: [],
    videos: [],
    articles: [],
    content: []
  });

  const [loading, setLoading] = useState(true);

  // Dummy Data
  const dummyData = {
    books: [
      {
        id: 1,
        title: "Introduction to Physics",
        author: "James Maxwell",
        coverImage: "https://picsum.photos/150/220?random=1",
        description: "Learn the basics of Physics with simple explanations and real-life examples.",
        pages: 320,
        publisher: "Science Press",
        publishDate: "2023-05-12",
        price: 29.99,
        rating: 4.5,
        reviews: 12,
        categories: ["Science", "Physics"]
      },
      {
        id: 2,
        title: "Advanced Chemistry",
        author: "Lina Charles",
        coverImage: "https://picsum.photos/150/220?random=2",
        description: "Dive deep into chemical reactions, compounds, and lab experiments.",
        pages: 410,
        publisher: "Chem World",
        publishDate: "2022-11-23",
        price: 35.5,
        rating: 4,
        reviews: 8,
        categories: ["Science", "Chemistry"]
      },
      {
        id: 3,
        title: "World History Overview",
        author: "Sarah Lee",
        coverImage: "https://picsum.photos/150/220?random=3",
        description: "A comprehensive guide to major events in world history.",
        pages: 450,
        publisher: "History House",
        publishDate: "2021-08-15",
        price: 28.0,
        rating: 4.2,
        reviews: 15,
        categories: ["History", "Education"]
      },
      {
        id: 4,
        title: "Introduction to Programming",
        author: "Alan Turing",
        coverImage: "https://picsum.photos/150/220?random=4",
        description: "Learn programming fundamentals with hands-on examples.",
        pages: 300,
        publisher: "CodeBooks",
        publishDate: "2023-02-01",
        price: 32.5,
        rating: 4.8,
        reviews: 20,
        categories: ["Computer Science", "Programming"]
      },
      {
        id: 5,
        title: "Basics of Algebra",
        author: "John Doe",
        coverImage: "https://picsum.photos/150/220?random=5",
        description: "Understand algebraic concepts and problem-solving techniques.",
        pages: 220,
        publisher: "Math World",
        publishDate: "2020-12-10",
        price: 25.0,
        rating: 4,
        reviews: 10,
        categories: ["Mathematics"]
      },
      {
        id: 6,
        title: "English Literature",
        author: "Emily Bronte",
        coverImage: "https://picsum.photos/150/220?random=6",
        description: "Explore classic works of English literature from various authors.",
        pages: 380,
        publisher: "Lit Press",
        publishDate: "2019-09-05",
        price: 30.0,
        rating: 4.3,
        reviews: 14,
        categories: ["Literature", "English"]
      },
      {
        id: 7,
        title: "Introduction to Biology",
        author: "Charles Darwin",
        coverImage: "https://picsum.photos/150/220?random=7",
        description: "Basics of biology and evolutionary concepts explained clearly.",
        pages: 360,
        publisher: "Bio Press",
        publishDate: "2021-06-20",
        price: 28.5,
        rating: 4.6,
        reviews: 18,
        categories: ["Science", "Biology"]
      },
      {
        id: 8,
        title: "Art of Photography",
        author: "Ansel Adams",
        coverImage: "https://picsum.photos/150/220?random=8",
        description: "Learn the techniques of photography and visual storytelling.",
        pages: 240,
        publisher: "PhotoBooks",
        publishDate: "2022-03-12",
        price: 27.0,
        rating: 4.1,
        reviews: 9,
        categories: ["Art", "Photography"]
      },
      {
        id: 9,
        title: "Economics for Beginners",
        author: "Adam Smith",
        coverImage: "https://picsum.photos/150/220?random=9",
        description: "Understand basic economic principles and market dynamics.",
        pages: 300,
        publisher: "Econ Press",
        publishDate: "2020-10-01",
        price: 26.5,
        rating: 4.2,
        reviews: 11,
        categories: ["Economics", "Finance"]
      },
      {
        id: 10,
        title: "World Geography",
        author: "Michael Palin",
        coverImage: "https://picsum.photos/150/220?random=10",
        description: "Explore the continents, countries, and geographical phenomena.",
        pages: 400,
        publisher: "GeoWorld",
        publishDate: "2021-04-15",
        price: 29.0,
        rating: 4.4,
        reviews: 13,
        categories: ["Geography", "Education"]
      },
    ],

    videos: [
      {
        id: 1,
        title: "React Basics Tutorial",
        description: "Learn React from scratch with practical examples",
        duration: 900, // 15 minutes in seconds
        thumbnail: "https://picsum.photos/300/168?random=11",
        author: "React Master",
        views: 12500,
        uploadDate: "2024-01-15",
        price: 0,
      },
      {
        id: 2,
        title: "How Photosynthesis Works",
        description: "Understanding the science behind photosynthesis",
        duration: 720, // 12 minutes
        thumbnail: "https://picsum.photos/300/168?random=12",
        author: "Bio Explorer",
        views: 8900,
        uploadDate: "2024-02-20",
        price: 4.99,
      },
      {
        id: 3,
        title: "Introduction to AI",
        description: "A beginner's guide to artificial intelligence",
        duration: 1200, // 20 minutes
        thumbnail: "https://picsum.photos/300/168?random=13",
        author: "AI Guru",
        views: 21500,
        uploadDate: "2024-03-10",
        price: 9.99,
      },
      {
        id: 4,
        title: "Learning JavaScript",
        description: "Master JavaScript fundamentals in one video",
        duration: 1080, // 18 minutes
        thumbnail: "https://picsum.photos/300/168?random=14",
        author: "Code Wizard",
        views: 18700,
        uploadDate: "2024-01-30",
        price: 0,
      },
      {
        id: 5,
        title: "History of Space Exploration",
        description: "From Sputnik to Mars rovers",
        duration: 1320, // 22 minutes
        thumbnail: "https://picsum.photos/300/168?random=15",
        author: "Space Historian",
        views: 15600,
        uploadDate: "2024-02-25",
        price: 6.99,
      },
      {
        id: 6,
        title: "Basic Algebra Tricks",
        description: "Quick math tricks for algebra problems",
        duration: 600, // 10 minutes
        thumbnail: "https://picsum.photos/300/168?random=16",
        author: "Math Pro",
        views: 11200,
        uploadDate: "2024-03-05",
        price: 0,
      },
      {
        id: 7,
        title: "English Grammar Essentials",
        description: "Master English grammar rules easily",
        duration: 840, // 14 minutes
        thumbnail: "https://picsum.photos/300/168?random=17",
        author: "Grammar Expert",
        views: 9800,
        uploadDate: "2024-02-15",
        price: 3.99,
      },
      {
        id: 8,
        title: "Photography Techniques",
        description: "Professional photography tips for beginners",
        duration: 960, // 16 minutes
        thumbnail: "https://picsum.photos/300/168?random=18",
        author: "Photo Master",
        views: 13400,
        uploadDate: "2024-03-12",
        price: 7.99,
      },
    ],

    articles: [
      {
        id: 1,
        title: "Introduction to Physics",
        description: "Comprehensive guide to physics principles",
        author: "James Maxwell",
        type: "pdf",
        pages: 45,
        fileSize: 2048576,
        downloads: 1250,
        uploadDate: "2024-01-10",
        price: 0,
        thumbnail: "https://picsum.photos/300/200?random=21",
      },
      {
        id: 2,
        title: "Advanced Chemistry Research",
        description: "Latest discoveries in chemical science",
        author: "Lina Charles",
        type: "docx",
        pages: 32,
        fileSize: 1572864,
        downloads: 890,
        uploadDate: "2024-02-18",
        price: 5.99,
        thumbnail: "https://picsum.photos/300/200?random=22",
      },
      {
        id: 3,
        title: "World History Timeline",
        description: "Complete historical timeline from ancient to modern",
        author: "Sarah Lee",
        type: "pdf",
        pages: 60,
        fileSize: 3145728,
        downloads: 2100,
        uploadDate: "2024-01-25",
        price: 8.99,
        thumbnail: "https://picsum.photos/300/200?random=23",
      },
      {
        id: 4,
        title: "Programming Best Practices",
        description: "Industry standards for clean code",
        author: "Alan Turing",
        type: "pdf",
        pages: 28,
        fileSize: 1048576,
        downloads: 1870,
        uploadDate: "2024-03-01",
        price: 0,
        thumbnail: "https://picsum.photos/300/200?random=24",
      },
      {
        id: 5,
        title: "Algebra Study Guide",
        description: "Complete algebra study material with exercises",
        author: "John Doe",
        type: "pdf",
        pages: 52,
        fileSize: 2621440,
        downloads: 1560,
        uploadDate: "2024-02-05",
        price: 4.99,
        thumbnail: "https://picsum.photos/300/200?random=25",
      },
      {
        id: 6,
        title: "English Literature Analysis",
        description: "In-depth analysis of classic literature",
        author: "Emily Bronte",
        type: "docx",
        pages: 38,
        fileSize: 2097152,
        downloads: 1120,
        uploadDate: "2024-01-20",
        price: 6.99,
        thumbnail: "https://picsum.photos/300/200?random=26",
      },
    ],

    content: [
      {
        id: 1,
        title: "Complete Web Development Course",
        description: "From beginner to full-stack developer",
        type: "course",
        category: "Programming",
        author: "Tech Academy",
        price: 49.99,
        rating: 4.7,
        thumbnail: "https://picsum.photos/300/200?random=31",
        students: 1250,
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        title: "Data Science Fundamentals",
        description: "Learn data analysis and visualization",
        type: "course",
        category: "Data Science",
        author: "Data Pro",
        price: 39.99,
        rating: 4.5,
        thumbnail: "https://picsum.photos/300/200?random=32",
        students: 890,
        createdAt: "2024-02-10",
      },
      {
        id: 3,
        title: "Digital Marketing Strategy",
        description: "Modern marketing techniques for businesses",
        type: "course",
        category: "Marketing",
        author: "Marketing Guru",
        price: 29.99,
        rating: 4.3,
        thumbnail: "https://picsum.photos/300/200?random=33",
        students: 1560,
        createdAt: "2024-01-25",
      },
      {
        id: 4,
        title: "UX/UI Design Principles",
        description: "Create beautiful and functional designs",
        type: "course",
        category: "Design",
        author: "Design Studio",
        price: 34.99,
        rating: 4.8,
        thumbnail: "https://picsum.photos/300/200?random=34",
        students: 2100,
        createdAt: "2024-02-20",
      },
      {
        id: 5,
        title: "Business Management Basics",
        description: "Essential skills for modern managers",
        type: "course",
        category: "Business",
        author: "Business Expert",
        price: 44.99,
        rating: 4.4,
        thumbnail: "https://picsum.photos/300/200?random=35",
        students: 980,
        createdAt: "2024-03-05",
      },
    ]
  };

  useEffect(() => {
    loadDummyFeatured();
  }, []);

  const loadDummyFeatured = () => {
    setTimeout(() => {
      setFeaturedContent(dummyData);
      setLoading(false);
    }, 800);
  };

  // Skeleton Loading Component
  const CardSkeleton = ({ type = 'book' }) => (
    <div className={`card card-${type} card-skeleton`}>
      <div className="card-image-container" style={{ height: '220px' }} />
      <div className="card-body">
        <div className="card-title" style={{ height: '20px', background: '#e5e7eb' }} />
        <div className="card-subtitle" style={{ height: '16px', background: '#f3f4f6', width: '70%' }} />
        <div className="card-description" style={{ height: '32px', background: '#f3f4f6' }} />
      </div>
      <div className="card-footer" style={{ background: '#f9fafb' }}>
        <div style={{ height: '16px', background: '#e5e7eb', width: '60%' }} />
      </div>
    </div>
  );

  // Content Section Component
  const ContentSection = ({ title, link, loading, items, card: CardComponent, type = 'book' }) => (
    <div className="home-section">
      <div className="section-header">
        <h2>{title}</h2>
        <Button variant="link" to={link} className="view-all-btn">
          View All →
        </Button>
      </div>

      {loading ? (
        <div className="grid-container">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} type={type} />
          ))}
        </div>
      ) : (
        <div className="grid-container">
          {items.length ? items.map(item => (
            <CardComponent key={item.id} {...{[type]: item}} />
          )) : (
            <div className="empty-state">
              <p>No {type} content available</p>
              <Button variant="outline" size="sm" to={link}>
                Browse All {type}s
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EduContent Platform</h1>
          <p className="hero-subtitle">
            Discover, learn, and share resources uploaded by students,
            teachers, publishers, and experts.
          </p>

          <div className="hero-buttons">
            <Button variant="primary" size="lg" to="/browse" className="hero-btn">
              Explore Content
            </Button>

            {user ? (
              <Button variant="outline" size="lg" to="/upload" className="hero-btn">
                Upload Resources
              </Button>
            ) : (
              <Button variant="outline" size="lg" to="/register" className="hero-btn">
                Join Now
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <h3>1,000+</h3>
            <p>Resources</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👩‍🏫</div>
            <h3>500+</h3>
            <p>Educators</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔬</div>
            <h3>200+</h3>
            <p>Researchers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>
            <h3>10,000+</h3>
            <p>Students</p>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="home-content-sections">
        <ContentSection
          title="📚 Featured Books"
          link="/browse?type=book"
          loading={loading}
          items={featuredContent.books}
          card={BookCard}
          type="book"
        />

        <ContentSection
          title="🎥 Popular Videos"
          link="/browse?type=video"
          loading={loading}
          items={featuredContent.videos}
          card={VideoCard}
          type="video"
        />

        <ContentSection
          title="📝 Latest Articles"
          link="/browse?type=article"
          loading={loading}
          items={featuredContent.articles}
          card={DocumentCard}
          type="document"
        />

        <ContentSection
          title="🎓 Top Courses"
          link="/browse?type=course"
          loading={loading}
          items={featuredContent.content}
          card={ContentCard}
          type="content"
        />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning or Sharing?</h2>
          <p>Join our community of educators, students, and publishers.</p>

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