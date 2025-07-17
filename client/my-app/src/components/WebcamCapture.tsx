'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';

interface WebcamCaptureProps {
  onCapture?: (imageSrc: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setErrorMessage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setErrorMessage('Could not access webcam. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !isCameraActive) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a data URL (base64 encoded image)
      const imageSrc = canvas.toDataURL('image/png');
      
      // Log the captured image to console
      console.log('Captured image:', imageSrc);
      
      // Call the onCapture callback if provided
      if (onCapture) {
        onCapture(imageSrc);
      }
      
      return imageSrc;
    }
    
    return null;
  }, [isCameraActive, onCapture]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="webcam-container flex flex-col">
      <div className="relative">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-64 ${isCameraActive ? 'block' : 'hidden'}`}
          />
          
          {!isCameraActive && (
            <div className="bg-gray-100 h-64 flex items-center justify-center">
              <p className="text-gray-500">Camera is turned off</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-5">
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg"
            >
              Capture Image
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg"
            >
              Stop Camera
            </button>
          </>
        )}

        
        
      </div>
    </div>
  );
};

export default WebcamCapture;
