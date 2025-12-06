import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl, onLoadSuccess, onLoadError }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    if (onLoadSuccess) onLoadSuccess({ numPages });
  };

  const onDocumentLoadError = (error) => {
    setError(error.message);
    setLoading(false);
    if (onLoadError) onLoadError(error);
  };

  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  };

  const goToPage = (pageNum) => {
    const page = parseInt(pageNum);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [fileUrl]);

  return (
    <div className="pdf-viewer">
      {/* Controls */}
      <div className="pdf-controls">
        <div className="pdf-nav">
          <button 
            onClick={goToPrevPage} 
            disabled={pageNumber <= 1}
            className="pdf-nav-button"
          >
            Previous
          </button>
          
          <div className="pdf-page-info">
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageNumber}
              onChange={(e) => goToPage(e.target.value)}
              className="pdf-page-input"
            />
            <span className="pdf-page-total">of {numPages || '--'}</span>
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages}
            className="pdf-nav-button"
          >
            Next
          </button>
        </div>
        
        <div className="pdf-zoom">
          <button onClick={zoomOut} className="pdf-zoom-button">
            Zoom Out
          </button>
          <span className="pdf-zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="pdf-zoom-button">
            Zoom In
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="pdf-document-container">
        {loading && (
          <div className="pdf-loading">
            <div className="loading-spinner"></div>
            <p>Loading PDF...</p>
          </div>
        )}
        
        {error && (
          <div className="pdf-error">
            <p>Error loading PDF: {error}</p>
          </div>
        )}
        
        {fileUrl && !loading && !error && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="pdf-loading">
                <div className="loading-spinner"></div>
              </div>
            }
            error={
              <div className="pdf-error">
                <p>Failed to load PDF</p>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              className="pdf-page"
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;