import React, { useState } from 'react';
import { GroundingChunk } from '../types';
import {
  ReportTheme,
  REPORT_THEMES,
  formatReport,
  exportToPDFHTML,
  ReportMetadata
} from '../reportFormatter';

interface OutputDisplayProps {
  title: string;
  text: string;
  isMarkdown?: boolean;
  groundingChunks?: GroundingChunk[];
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ title, text, isMarkdown = false, groundingChunks }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ReportTheme>('professional');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const handleCopy = () => {
    const formattedText = getFormattedText();
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFormattedText = (): string => {
    if (!isMarkdown) return text;

    const metadata: ReportMetadata = {
      title: 'Crypto Intelligence Research Report',
      date: new Date().toISOString(),
      confidentiality: 'Internal'
    };

    return formatReport(text, selectedTheme, metadata);
  };

  const handleExportPDF = () => {
    const metadata: ReportMetadata = {
      title: 'Crypto Intelligence Research Report',
      date: new Date().toISOString(),
      analyst: 'Crypto Intelligence Platform',
      confidentiality: 'Internal'
    };

    const htmlContent = exportToPDFHTML(text, selectedTheme, metadata);

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-report-${selectedTheme}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);

    showSuccessToast('Report exported! Open the HTML file and print to PDF');
  };

  const handlePrint = () => {
    const metadata: ReportMetadata = {
      title: 'Crypto Intelligence Research Report',
      date: new Date().toISOString(),
      analyst: 'Crypto Intelligence Platform',
      confidentiality: 'Internal'
    };

    const htmlContent = exportToPDFHTML(text, selectedTheme, metadata);

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const showSuccessToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const displayText = isMarkdown ? getFormattedText() : text;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-purple-400">{title}</h3>

        {isMarkdown && (
          <div className="flex gap-2 items-center flex-wrap">
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                {REPORT_THEMES[selectedTheme].name}
              </button>

              {showThemeSelector && (
                <div className="absolute top-full mt-2 right-0 bg-gray-700 rounded-lg shadow-xl z-50 min-w-[280px]">
                  <div className="p-2">
                    <div className="text-xs text-gray-400 font-semibold mb-2 px-2">Select Report Theme</div>
                    {(Object.keys(REPORT_THEMES) as ReportTheme[]).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => {
                          setSelectedTheme(theme);
                          setShowThemeSelector(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                          selectedTheme === theme
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold">{REPORT_THEMES[theme].name}</div>
                        <div className="text-xs opacity-75">{REPORT_THEMES[theme].description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition flex items-center gap-1"
              title="Export as HTML (then Print to PDF)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 rounded-md text-sm transition flex items-center gap-1"
              title="Print Report"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-md text-sm transition"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}

        {!isMarkdown && (
          <button
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-md text-sm transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Report Theme Badge */}
      {isMarkdown && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
            {REPORT_THEMES[selectedTheme].name}
          </span>
          <span className="text-xs text-gray-500">
            {REPORT_THEMES[selectedTheme].description}
          </span>
        </div>
      )}

      <div className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          <code>{displayText}</code>
        </pre>
        {groundingChunks && groundingChunks.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-400 mb-2 font-sans">Sources from Google Search:</h4>
            <ul className="list-disc list-inside space-y-1 font-sans">
              {groundingChunks.map((chunk, index) => (
                chunk.web && chunk.web.uri && (
                  <li key={index} className="truncate">
                    <a
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                      title={chunk.web.title || chunk.web.uri}
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Close theme selector when clicking outside */}
      {showThemeSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowThemeSelector(false)}
        />
      )}
    </div>
  );
};

export default OutputDisplay;
