import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, GroundingChunk } from '../types';
import LoadingIndicator from './LoadingIndicator';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import ExecutiveSummary from './ExecutiveSummary';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const renderMarkdown = (text: string) => {
  if (!text) return null;

  // Helper to process inline formatting like bold text.
  const processInlineFormatting = (line: string) => {
    // Split by the bold delimiter, then alternate between plain text and <strong> tags.
    return line.split('**').map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-2 my-3">{listItems}</ul>);
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Headings
    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold text-indigo-300 mt-4 mb-2">{processInlineFormatting(trimmedLine.replace('### ', ''))}</h3>);
    } else if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold text-indigo-400 mt-6 mb-3">{processInlineFormatting(trimmedLine.replace('## ', ''))}</h2>);
    } else if (trimmedLine.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold text-indigo-400 mt-8 mb-4">{processInlineFormatting(trimmedLine.replace('# ', ''))}</h1>);
    } 
    // List Items
    else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const itemContent = trimmedLine.substring(2);
      listItems.push(<li key={index}>{processInlineFormatting(itemContent)}</li>);
    } 
    // Paragraphs
    else if (trimmedLine.length > 0) {
      flushList();
      elements.push(<p key={index} className="mb-3 leading-relaxed">{processInlineFormatting(trimmedLine)}</p>);
    } 
    // Empty lines act as list terminators
    else {
      flushList();
    }
  });

  // Ensure any remaining list is flushed at the end
  flushList();

  return elements;
};


const GroundingSources: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => (
  <div className="mt-4 border-t border-gray-700 pt-3">
    <h4 className="text-sm font-semibold text-gray-400 mb-2">Sumber:</h4>
    <ul className="flex flex-wrap gap-2">
      {sources.map((source, index) => {
        const linkData = source.web || source.maps;
        if (!linkData) return null;
        return (
          <li key={index}>
            <a
              href={linkData.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-gray-700 text-indigo-300 hover:bg-gray-600 hover:text-indigo-200 rounded-full px-3 py-1 transition-colors duration-200"
            >
              {linkData.title}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode; sources?: GroundingChunk[]; rawText: string; }> = ({ title, children, sources, rawText }) => {
  const [isCopied, setIsCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Gagal menyalin teks: ', err);
    }
  };

  return (
    <div 
      ref={ref}
      className={`bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-indigo-400">{title}</h2>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          title={isCopied ? 'Disalin!' : 'Salin Teks'}
          aria-label="Salin teks ke papan klip"
        >
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="prose prose-invert prose-sm md:prose-base text-gray-300 max-w-none">{children}</div>
      {sources && sources.length > 0 && <GroundingSources sources={sources} />}
    </div>
  );
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mt-12 space-y-8">
        <ExecutiveSummary summary={result.executiveSummary} />
        
        <div className="space-y-8 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnalysisCard title="Analisis SWOT" rawText={result.swotAnalysis}>{renderMarkdown(result.swotAnalysis)}</AnalysisCard>
            <AnalysisCard title="Profil Target Audiens" rawText={result.targetAudienceProfile}>{renderMarkdown(result.targetAudienceProfile)}</AnalysisCard>
          </div>
          <AnalysisCard title="Tren Pasar" sources={result.marketTrendsSources} rawText={result.marketTrends}>
            {renderMarkdown(result.marketTrends)}
          </AnalysisCard>
          {result.localOpportunities && (
            <AnalysisCard title="Peluang & Pesaing Lokal" sources={result.localOpportunitiesSources} rawText={result.localOpportunities}>
              {renderMarkdown(result.localOpportunities)}
            {/* FIX: Corrected a typo in the closing JSX tag. */}
            </AnalysisCard>
          )}
          <AnalysisCard title="Strategi Pemasaran Berbasis AI" rawText={result.marketingStrategy}>
            {renderMarkdown(result.marketingStrategy)}
          </AnalysisCard>
        </div>
    </div>
  );
};

export default AnalysisDisplay;