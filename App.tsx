import React, { useState, useCallback } from 'react';
import { BusinessInput, AnalysisResult, Geolocation, ChatMessage } from './types';
import BusinessInputForm from './components/BusinessInputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import Chatbot from './components/Chatbot';
import { generateBusinessAnalysis } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ChatIcon } from './components/icons/ChatIcon';

const App: React.FC = () => {
  const [businessInput, setBusinessInput] = useState<BusinessInput>({
    name: '',
    description: '',
    targetAudience: '',
    competitors: '',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error: ", error);
          setError("Tidak dapat mengambil lokasi. Pastikan layanan lokasi diaktifkan.");
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await generateBusinessAnalysis(businessInput, geolocation);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('Terjadi kesalahan saat menganalisis bisnis. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [businessInput, geolocation]);

  return (
    <div className="bg-gray-900 min-h-screen text-white antialiased">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              AI Perencana Strategi Startup
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Dapatkan analisis mendalam dan strategi pemasaran berbasis AI yang kuat untuk usaha baru Anda.
          </p>
        </header>

        <main>
          <BusinessInputForm
            businessInput={businessInput}
            setBusinessInput={setBusinessInput}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onGeolocate={handleGeolocation}
            geolocation={geolocation}
          />

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <AnalysisDisplay result={analysisResult} isLoading={isLoading} />
        </main>
        
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} 24 Learning Centre. All rights reserved.</p>
        </footer>
      </div>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        aria-label="Buka/Tutup Chatbot"
      >
        <ChatIcon className="w-8 h-8" />
      </button>
      
      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} analysisResult={analysisResult} />}
    </div>
  );
};

export default App;