import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { contentService } from '../../services/api/content';
import PDFViewer from '../../components/content/ContentViewer/PDFViewer';
import VideoPlayer from '../../components/content/ContentViewer/VideoPlayer';
import AudioPlayer from '../../components/content/ContentViewer/AudioPlayer';
import DocumentViewer from '../../components/content/ContentViewer/DocumentViewer';

const ContentRead = () => {
  const { id } = useParams();
  const contentId = Number(id);
  const [loading, setLoading] = useState(true);
  const [accessUrl, setAccessUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [error, setError] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await contentService.checkAccess('publication', contentId);
        // response shape may include url or access flags
        const url = resp.url || resp.data?.url || resp.accessUrl || '';
        const access = Boolean(resp.access || resp.success || url);
        setAccessGranted(access);
        setAccessUrl(url||'');
        // Try to infer type from url
        if (url) {
          const lc = url.toLowerCase();
          if (lc.endsWith('.pdf')) setFileType('pdf');
          else if (lc.match(/\.(mp4|webm|ogg)$/)) setFileType('video');
          else if (lc.match(/\.(mp3|wav|m4a)$/)) setFileType('audio');
          else setFileType('document');
        }
      } catch (e) {
        setError('Access denied or failed to fetch content');
        setAccessGranted(false);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [contentId]);

  if (loading) return <div className="loading-state">Checking access...</div>;
  if (!accessGranted) return <div className="error-state">You do not have access to this content.</div>;
  if (!accessUrl) return <div className="error-state">No content URL available.</div>;

  switch (fileType) {
    case 'pdf':
      return <PDFViewer fileUrl={accessUrl} />;
    case 'video':
      return <VideoPlayer url={accessUrl} title={`Content ${contentId}`} />;
    case 'audio':
      return <AudioPlayer audioUrl={accessUrl} title={`Content ${contentId}`} />;
    default:
      return <DocumentViewer fileUrl={accessUrl} fileType={fileType} title={`Content ${contentId}`} />;
  }
};

export default ContentRead;
