import React, { createContext, useState, useContext } from "react";
import { editorialService } from "../services/api/editorial";

const EditorialContext = createContext();

export const useEditorial = () => {
  const context = useContext(EditorialContext);
  if (!context) {
    throw new Error("useEditorial must be used within an EditorialProvider");
  }
  return context;
};

export const EditorialProvider = ({ children }) => {
  const [editorialData, setEditorialData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getEditorialDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await editorialService.getEditorialDashboard();
      setEditorialData(data.data || {});
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContentQueue = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await editorialService.getContentQueue();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignReviewer = async (assignmentData) => {
    try {
      setLoading(true);
      setError("");
      const data = await editorialService.assignReviewer(assignmentData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveContent = async (approvalData) => {
    try {
      setLoading(true);
      setError("");
      const data = await editorialService.approveContent(approvalData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    editorialData,
    loading,
    error,
    getEditorialDashboard,
    getContentQueue,
    assignReviewer,
    approveContent,
  };

  return (
    <EditorialContext.Provider value={value}>
      {children}
    </EditorialContext.Provider>
  );
};
