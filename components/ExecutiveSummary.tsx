import React, { useState, useRef, useEffect } from 'react';
import { ExecutiveSummary as ExecutiveSummaryType } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TargetIcon } from './icons/TargetIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface ExecutiveSummaryProps {
  summary: ExecutiveSummaryType;
}

const SummaryItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
}> = ({ icon, title, text }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-indigo-400">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  </div>
);

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
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

  const summaryItems = [
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'Analisis SWOT',
      text: summary.swot,
    },
    {
      icon: <TargetIcon className="w-6 h-6" />,
      title: 'Target Audiens',
      text: summary.targetAudience,
    },
    {
      icon: <TrendingUpIcon className="w-6 h-6" />,
      title: 'Tren Pasar',
      text: summary.marketTrends,
    },
    {
      icon: <LightbulbIcon className="w-6 h-6" />,
      title: 'Strategi Pemasaran',
      text: summary.marketingStrategy,
    },
  ];

  if (summary.localOpportunities) {
    summaryItems.push({
      icon: <MapPinIcon className="w-6 h-6" />,
      title: 'Peluang Lokal',
      text: summary.localOpportunities,
    });
  }

  return (
    <div 
      ref={ref}
      className={`bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-2xl font-bold text-indigo-400 mb-6">Ringkasan Eksekutif</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryItems.map((item) => (
          <SummaryItem key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ExecutiveSummary;