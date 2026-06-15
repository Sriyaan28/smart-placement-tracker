import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { getProfile, updateProfile } from '../api/userApi';
import { viewResume, uploadResume, deleteResume } from '../api/resumeApi';
import { useAuth } from '../hooks/useAuth';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Profile State
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  // Resume State
  const [resume, setResume] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  const lastFetchedProfileRef = useRef(null);
  const lastFetchedResumeRef = useRef(null);

  // --- Profile Methods ---
  const fetchProfile = useCallback(async (force = false) => {
    if (!user) return;
    
    const now = Date.now();
    if (!force && lastFetchedProfileRef.current && (now - lastFetchedProfileRef.current < 5 * 60 * 1000) && profile) {
      if (now - lastFetchedProfileRef.current > 10000) backgroundFetchProfile();
      return;
    }

    setLoadingProfile(true);
    await backgroundFetchProfile();
  }, [profile, user]);

  const backgroundFetchProfile = async () => {
    try {
      setProfileError('');
      const res = await getProfile();
      if (res.success) {
        setProfile(res.payload);
        lastFetchedProfileRef.current = Date.now();
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (!profile) setProfileError("Failed to load user profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateProfile = async (userData) => {
    try {
      const res = await updateProfile(userData);
      if (res.success) {
        await backgroundFetchProfile(); // Refresh immediately
        return { success: true, message: res.message };
      }
      return { success: false, message: "Update failed" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update profile" };
    }
  };

  // --- Resume Methods ---
  const fetchResume = useCallback(async (force = false) => {
    if (!user) return;
    
    const now = Date.now();
    if (!force && lastFetchedResumeRef.current && (now - lastFetchedResumeRef.current < 5 * 60 * 1000) && resume !== undefined) {
      if (now - lastFetchedResumeRef.current > 10000) backgroundFetchResume();
      return;
    }

    setLoadingResume(true);
    await backgroundFetchResume();
  }, [resume, user]);

  const backgroundFetchResume = async () => {
    try {
      setResumeError('');
      const res = await viewResume();
      if (res.success) {
        setResume(res.payload); // will be null if no resume exists, which is correct
        lastFetchedResumeRef.current = Date.now();
      }
    } catch (err) {
      console.error("Failed to fetch resume:", err);
      if (resume === undefined) setResumeError("Failed to load resume.");
    } finally {
      setLoadingResume(false);
    }
  };

  const handleUploadResume = async (formData) => {
    try {
      const res = await uploadResume(formData);
      if (res.success) {
        setUploadedResume(res.payload); // { resumeUrl, resumeText }
        return { success: true, payload: res.payload };
      }
      return { success: false, message: "Upload failed" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to upload resume" };
    }
  };

  const handleAnalyzeResume = async (resumeText) => {
    try {
      setIsAnalyzing(true);
      const { analyzeResume } = await import('../api/resumeApi');
      const res = await analyzeResume(resumeText);
      if (res.success) {
        setParsedResume(res.payload); // { resumeData, atsScore }
        return { success: true };
      }
      return { success: false, message: "Analysis failed" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to analyze resume" };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveResume = async (reviewedData) => {
    try {
      // reviewedData is { resumeUrl, resumeData, atsScore }
      const { saveResume } = await import('../api/resumeApi');
      const res = await saveResume(reviewedData);
      if (res.success) {
        setParsedResume(null);
        setUploadedResume(null);
        await backgroundFetchResume();
        return { success: true };
      }
      return { success: false, message: res.message || "Failed to save resume" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to save resume" };
    }
  };

  const handleDeleteResume = async () => {
    try {
      const { deleteResume } = await import('../api/resumeApi');
      const res = await deleteResume();
      if (res.success) {
        setResume(null);
        return { success: true };
      }
      return { success: false, message: "Deletion failed" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to delete resume" };
    }
  };

  const handleDiscardResume = async (resumeUrl) => {
    try {
      if (resumeUrl) {
        const { discardResume } = await import('../api/resumeApi');
        await discardResume(resumeUrl);
      }
      setParsedResume(null);
      setUploadedResume(null);
      return { success: true };
    } catch (err) {
      console.error("Failed to discard resume from cloud:", err);
      // Still clear frontend state even if cloud deletion fails
      setParsedResume(null);
      setUploadedResume(null);
      return { success: false };
    }
  };

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchProfile();
      fetchResume();
    } else if (!user) {
      setProfile(null);
      setResume(null);
      setParsedResume(null);
      setUploadedResume(null);
      lastFetchedProfileRef.current = null;
      lastFetchedResumeRef.current = null;
    }
  }, [user, fetchProfile, fetchResume]);

  return (
    <ProfileContext.Provider value={{ 
      profile, loadingProfile, profileError, fetchProfile, handleUpdateProfile,
      resume, uploadedResume, setUploadedResume, parsedResume, setParsedResume, isAnalyzing, loadingResume, resumeError, fetchResume, handleUploadResume, handleAnalyzeResume, handleSaveResume, handleDeleteResume, handleDiscardResume
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
