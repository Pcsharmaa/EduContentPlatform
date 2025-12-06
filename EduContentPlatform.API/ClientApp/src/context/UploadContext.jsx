import React, { createContext, useState, useContext } from "react";
import { teacherService } from "../services/api/teacher";

const UploadContext = createContext();

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

export const UploadProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createCourse = async (courseData) => {
    try {
      setUploading(true);
      setProgress(0);
      setError("");
      setSuccess("");

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const data = await teacherService.createCourse(courseData);

      clearInterval(interval);
      setProgress(100);
      setSuccess("Course created successfully!");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const createChapter = async (courseId, chapterData) => {
    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = await teacherService.createChapter(courseId, chapterData);
      setSuccess("Chapter created successfully!");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const uploadFile = async (uploadData) => {
    try {
      setUploading(true);
      setProgress(0);
      setError("");
      setSuccess("");

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const data = await teacherService.uploadFile(uploadData);

      clearInterval(interval);
      setProgress(100);
      setSuccess("File uploaded successfully!");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const value = {
    uploading,
    progress,
    error,
    success,
    createCourse,
    createChapter,
    uploadFile,
    clearMessages,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};
