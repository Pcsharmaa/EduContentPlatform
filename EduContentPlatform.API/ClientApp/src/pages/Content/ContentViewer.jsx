import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentService } from '../../services/api/content';
import { useAuth } from '../../context/AuthContext';
import { usePermission } from '../../hooks/usePermission';
import PermissionGuard from '../../components/PermissionGuard';
import PDFViewer from '../../components/content/ContentViewer/PDFViewer';
import VideoPlayer from '../../components/content/ContentViewer/VideoPlayer';
import AudioPlayer from '../../components/content/ContentViewer/AudioPlayer';
import DocumentViewer from '../../components/content/ContentViewer/DocumentViewer';
import Button from '../../components/common/UI/Button/Button';
import '../../pages/Upload/upload.css';

const ContentViewerPage = () => {
  const { id } = useParams();
  const contentId = Number(id);
  const { user } = useAuth();
  const { hasPermission, isAdmin, isEditor, isReviewer, userRole } = usePermission();

  const [item, setItem] = useState(null);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const resp = await contentService.getPublication(contentId);
        // tolerant shape handling
        const pub = resp.publication || resp.data?.publication || resp.data || resp;
        const vols = resp.volumes || resp.data?.volumes || [];
        setItem(pub);
        setVolumes(vols);
      } catch (e) {
        console.error('Error fetching publication', e);
        setError('Failed to load content');
      }

      try {
        const access = await contentService.checkAccess('publication', contentId);
        setHasAccess(Boolean(access?.access || access?.success));
      } catch (e) {
        setHasAccess(false);
      }

      setLoading(false);
    };

    load();
  }, [contentId]);

  const handlePurchase = async () => {
    if (!user) return;
    setPurchasing(true);
    try {
      await contentService.purchaseContent({ ItemType: 'publication', ItemId: contentId, Amount: item?.price || 0 });
      const access = await contentService.checkAccess('publication', contentId);
      setHasAccess(Boolean(access?.access));
    } catch (e) {
      console.error('Purchase failed', e);
      setError('Purchase failed');
    }
    setPurchasing(false);
  };

  if (loading) return <div className="loading-state">Loading content...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!item) return <div className="empty-state">Content not found.</div>;

  // determine viewer type & source
  const fileUrl = item.fileUrl || item.contentUrl || item.url || (volumes[0] && volumes[0].fileUrl) || '';
  const fileType = (item.fileType || item.type || '').toLowerCase();

  const isOwner = user && (item.createdBy === user.id || item.createdBy === user?.userId || item.createdBy === user?.id);
  const canEdit = isOwner || hasPermission('edit_any_content') || hasPermission('edit_own_content');
  const canAssign = hasPermission('assign_to_editor') || hasPermission('assign_reviewer');
  const canApprove = hasPermission('approve_content') || isAdmin || isEditor || isReviewer;

  const renderViewer = () => {
    if (!fileUrl) return <DocumentViewer fileUrl={fileUrl} fileType={fileType} title={item.title} />;

    if (fileType.includes('pdf') || fileUrl.endsWith('.pdf')) {
      return <PDFViewer fileUrl={fileUrl} />;
    }

    if (fileType.includes('video') || /\.(mp4|webm|ogg)$/.test(fileUrl)) {
      return <VideoPlayer url={fileUrl} title={item.title} />;
    }

    if (fileType.includes('audio') || /\.(mp3|wav|m4a)$/.test(fileUrl)) {
      return <AudioPlayer audioUrl={fileUrl} title={item.title} coverImage={item.coverImageUrl} />;
    }

    return <DocumentViewer fileUrl={fileUrl} fileType={fileType} title={item.title} />;
  };

  return (
    <div className="content-viewer-page container">
      <div className="content-header">
        <div className="content-meta">
          <h1>{item.title}</h1>
          <p className="muted">By {item.author || item.createdByName || item.authorName}</p>
          <p>{item.description}</p>
        </div>

        <div className="content-actions">
          {hasAccess ? (
            <Link to={`/content/read/${contentId}`} className="btn btn-primary">Open</Link>
          ) : (
            <>
              <Button variant="primary" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? 'Purchasing...' : (item.price ? `Buy for $${item.price}` : 'Request Access')}
              </Button>
              {isAdmin && (
                <Button variant="ghost" onClick={async () => {
                  try {
                    await contentService.purchaseContent({ UserId: user?.id || user?.userId, ItemType: 'publication', ItemId: contentId, Amount: 0, AccessType: 'Granted' });
                    const a = await contentService.checkAccess('publication', contentId);
                    setHasAccess(Boolean(a?.access));
                  } catch (e) {
                    console.error(e);
                  }
                }}>
                  Grant Access
                </Button>
              )}
            </>
          )}

          {canEdit && (
            <Link to={`/dashboard/content/edit/${contentId}`} className="btn btn-secondary" style={{ marginLeft: 8 }}>Edit</Link>
          )}

          {canAssign && (
            <Link to={`/editorial/assign?itemType=publication&itemId=${contentId}`} className="btn btn-ghost" style={{ marginLeft: 8 }}>Assign</Link>
          )}

          {canApprove && (
            <div style={{ display: 'inline-block', marginLeft: 8 }}>
              <Button variant="success" onClick={() => alert('Approve flow (backend)')}>
                Approve
              </Button>
              <Button variant="danger" onClick={() => alert('Reject flow (backend)')} style={{ marginLeft: 6 }}>
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>

      <section className="viewer-section" style={{ marginTop: 24 }}>
        {renderViewer()}
      </section>

      <section className="volumes-section" style={{ marginTop: 24 }}>
        <h3>Volumes & Articles</h3>
        {volumes.length === 0 ? (
          <p>No volumes available.</p>
        ) : (
          <ul className="volumes-list">
            {volumes.map(v => (
              <li key={v.id} className="volume-item">
                <h4>{v.title}</h4>
                <p className="muted">{v.description}</p>
                {hasAccess ? (
                  <a href={v.fileUrl} target="_blank" rel="noreferrer">Open</a>
                ) : (
                  <span className="muted">Locked - purchase to access</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ContentViewerPage;
