import React from 'react';
import { BusinessInput, Geolocation } from '../types';

interface BusinessInputFormProps {
  businessInput: BusinessInput;
  setBusinessInput: React.Dispatch<React.SetStateAction<BusinessInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
  onGeolocate: () => void;
  geolocation: Geolocation | null;
}

const BusinessInputForm: React.FC<BusinessInputFormProps> = ({
  businessInput,
  setBusinessInput,
  onAnalyze,
  isLoading,
  onGeolocate,
  geolocation
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessInput((prev) => ({ ...prev, [name]: value }));
  };

  // FIX: Add a type guard to ensure 'field' is a string before calling .trim(), resolving a TypeScript error where 'field' was inferred as 'unknown'.
  const isFormValid = Object.values(businessInput).every(field => typeof field === 'string' && field.trim() !== '');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nama Bisnis
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={businessInput.name}
            onChange={handleChange}
            placeholder="contoh: 'Kopi Nusantara'"
            className="w-full bg-gray-900/70 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Deskripsi Bisnis
          </label>
          <textarea
            id="description"
            name="description"
            value={businessInput.description}
            onChange={handleChange}
            rows={4}
            placeholder="Jelaskan bisnis Anda, produk atau layanannya, dan proposisi nilai uniknya."
            className="w-full bg-gray-900/70 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-2">
            Target Audiens
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={businessInput.targetAudience}
            onChange={handleChange}
            placeholder="contoh: 'Mahasiswa dan pekerja kantoran'"
            className="w-full bg-gray-900/70 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="competitors" className="block text-sm font-medium text-gray-300 mb-2">
            Pesaing yang Diketahui
          </label>
          <input
            type="text"
            id="competitors"
            name="competitors"
            value={businessInput.competitors}
            onChange={handleChange}
            placeholder="contoh: 'Starbucks, Janji Jiwa'"
            className="w-full bg-gray-900/70 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
              onClick={onGeolocate}
              className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  geolocation
                      ? 'bg-green-600/20 text-green-300 border border-green-500'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
              }`}
          >
              {geolocation ? 'Lokasi Ditambahkan!' : 'Tambah Konteks Lokal (Opsional)'}
          </button>
          <button
              onClick={onAnalyze}
              disabled={isLoading || !isFormValid}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
              {isLoading ? 'Menganalisis...' : 'Buat Strategi'}
          </button>
      </div>
    </div>
  );
};

export default BusinessInputForm;