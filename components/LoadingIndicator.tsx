import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Menganalisis lanskap pasar...",
  "Menyusun analisis SWOT...",
  "Mengidentifikasi demografi target...",
  "Berkonsultasi dengan ahli strategi AI...",
  "Menemukan tren pasar...",
  "Merumuskan tindakan pemasaran...",
  "Memeriksa peluang lokal...",
  "Menyelesaikan rencana pertumbuhan Anda...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mt-12 text-center p-8 bg-gray-800/50 border border-gray-700 rounded-xl">
      <div className="flex justify-center items-center mb-4">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-lg font-semibold text-gray-300 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingIndicator;