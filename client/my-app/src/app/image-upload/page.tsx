'use client';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import WebcamCapture from '@/components/WebcamCapture';

export default function ImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [inputMethod, setInputMethod] = useState<'upload' | 'webcam'>('upload');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  // const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebcamCapture = (imageSrc: string) => {
    setImagePreview(imageSrc);
    
    // Convert base64 to file object
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'webcam-capture.png', { type: 'image/png' });
        setSelectedImage(file);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Convert file to buffer
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          resolve(Buffer.from(arrayBuffer));
          console.log(Buffer.from(arrayBuffer));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(selectedImage);
      });
      //Convert buffer to base64
      const base64 = buffer.toString('base64');
      console.log(base64);
      // Send request to server
      const response = await fetch('http://localhost:5000/api/generate-image-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      setDescription(data.text[0].text);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image description');
    } finally {
      setLoading(false);
    }};

  const handleSpeak = () => {
    if (typeof window != 'undefined' && description) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(description);

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window != 'undefined'){
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Description Generator</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => setInputMethod('upload')}
            className={`px-4 py-2 rounded-lg ${
              inputMethod === 'upload' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setInputMethod('webcam')}
            className={`px-4 py-2 rounded-lg ${
              inputMethod === 'webcam' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Use Webcam
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMethod === 'upload' ? (
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="p-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-96 w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-500">
                    <p>Drag and drop an image here or click to select</p>
                    <p className="text-sm text-gray-400">Supported formats: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        ) : (
          <div className="border-2 border-gray-300 p-8 rounded-lg">
            {imagePreview && inputMethod === 'webcam' ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Captured Image:</h3>
                <img
                  src={imagePreview}
                  alt="Captured from webcam"
                  className="max-h-96 w-full object-contain"
                />
              </div>
            ) : null}
            <WebcamCapture onCapture={handleWebcamCapture} />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedImage}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>

      {description && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Generated Description:</h2>
          <p className="text-gray-700">{description}</p>
          
          <div className="flex items-center space-x-4 mt-5">
          <button 
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
          
          {isSpeaking ? (
            <>Speaking...</>
          ) : (
            <>Listen to Description</>
          )}

          </button>

          <button
            onClick={handleStopSpeech}
          disabled={!isSpeaking}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
          Stop Speaking
          </button></div>
        </div>
      )}

     
    </div>
  );
}
