import React, { useState, useEffect } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';

export const PdfViewer = ({ url, isDarkMode = false }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    let objectUrl = null;
    
    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        // Fetch the file directly to bypass Cloudinary's "attachment" disposition
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        
        const blob = await response.blob();
        
        // Force the blob type to application/pdf so the browser renders it natively
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(pdfBlob);
        
        setBlobUrl(objectUrl);
        setUseFallback(false);
      } catch (err) {
        console.error("Failed to load PDF natively, falling back to Google Docs Viewer:", err);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  if (!url) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-8 text-center bg-zinc-950">
        <FileText className="w-16 h-16 mb-4 opacity-50" />
        <p>Resume file is not available.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10 text-emerald-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium text-sm">Loading PDF securely...</p>
      </div>
    );
  }

  const filterStyle = isDarkMode ? { filter: 'invert(1) hue-rotate(180deg) grayscale(0.5) contrast(1.2)' } : {};

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950 group">

      {useFallback || !blobUrl ? (
        <iframe 
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} 
          className="w-full h-full border-none transition-all duration-500"
          title="Resume PDF"
          style={filterStyle}
        />
      ) : (
        <object 
          data={blobUrl} 
          type="application/pdf" 
          className="w-full h-full border-none transition-all duration-500"
          style={filterStyle}
        >
          <div className="flex items-center justify-center h-full w-full p-8 text-center text-zinc-500">
            <p>Your browser does not support native PDF rendering. <br/><a href={blobUrl} download className="text-emerald-500 hover:underline">Download the PDF</a> instead.</p>
          </div>
        </object>
      )}
    </div>
  );
};
