import React, { useState } from 'react';
import HTMLToDOCX from 'html-to-docx';
import saveAs from 'file-saver';
import { AnalysisResult } from '../types';
import { generateHtmlForDocx } from '../utils/exportHelper';
import { FileDownIcon } from './icons/FileDownIcon';

interface ExportButtonsProps {
  result: AnalysisResult;
  businessName: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ result, businessName }) => {
    const [isExporting, setIsExporting] = useState<boolean>(false);

    const handleExportDocx = async () => {
        setIsExporting(true);
        try {
            const htmlString = generateHtmlForDocx(result, businessName);
            const fileBuffer = await HTMLToDOCX(htmlString, null, {
                footer: true,
                header: true,
                pageNumber: true,
            });

            saveAs(fileBuffer, `strategi-${businessName.replace(/\s+/g, '-').toLowerCase()}.docx`);
        } catch (error) {
            console.error("Kesalahan saat mengekspor DOCX:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-300">Unduh Laporan Lengkap</h3>
            <button
                onClick={handleExportDocx}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-blue-900/50 text-blue-300 border border-blue-700 hover:bg-blue-800/50 disabled:opacity-50 disabled:cursor-wait"
            >
                <FileDownIcon className="w-5 h-5" />
                {isExporting ? 'Mengekspor...' : 'Unduh sebagai DOCX'}
            </button>
        </div>
    );
};

export default ExportButtons;