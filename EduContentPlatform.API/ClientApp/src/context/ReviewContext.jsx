import React, { createContext, useState, useContext } from "react";
import { reviewService } from "../services/api/review";

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getReviewQueue = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reviewService.getReviewQueue();
      setReviews(data.data || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (reviewData) => {
    try {
      setLoading(true);
      setError("");
      const data = await reviewService.submitReview(reviewData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReviewHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await reviewService.getReviewHistory();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reviews,
    loading,
    error,
    getReviewQueue,
    submitReview,
    getReviewHistory,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};
