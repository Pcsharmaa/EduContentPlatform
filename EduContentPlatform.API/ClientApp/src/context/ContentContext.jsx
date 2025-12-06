import React, { createContext, useState, useContext } from "react";
import { contentService } from "../services/api/content";

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");
      // In a real app, fetch from API
      // const data = await contentService.getAll();
      // setContent(data);

      // Mock data for now
      const mockData = [
        {
          id: 1,
          title: "Introduction to Machine Learning",
          description: "Learn the fundamentals of machine learning",
          type: "course",
          category: "Computer Science",
          author: "Dr. Sarah Johnson",
          price: 49.99,
          rating: 4.8,
          thumbnail: "/images/ml-course.jpg",
        },
      ];
      setContent(mockData);
    } catch (err) {
      setError("Failed to fetch content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitPublication = async (publicationData) => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.submitPublication(publicationData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitVolume = async (publicationId, volumeData) => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.submitVolume(publicationId, volumeData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitArticle = async (publicationId, articleData) => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.submitArticle(
        publicationId,
        articleData
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPendingItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contentService.getPendingItems();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    content,
    loading,
    error,
    fetchContent,
    submitPublication,
    submitVolume,
    submitArticle,
    getPendingItems,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
