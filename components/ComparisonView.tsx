import React, { useState } from 'react';
import { SavedAnalysis } from '../types';

interface ComparisonViewProps {
  analyses: SavedAnalysis[];
  onClose: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ analyses, onClose }) => {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'prompts' | 'responses'>('overview');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeDifference = (older: number, newer: number) => {
    const diff = newer - older;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h`;
  };

  // Sort analyses by timestamp
  const sortedAnalyses = [...analyses].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Analysis Comparison</h2>
            <p className="text-gray-400 text-sm mt-1">
              Comparing {analyses.length} analyses
              {analyses.length >= 2 && ` • ${getTimeDifference(sortedAnalyses[0].timestamp, sortedAnalyses[sortedAnalyses.length - 1].timestamp)} time span`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setSelectedSection('overview')}
            className={`px-6 py-3 font-medium transition ${
              selectedSection === 'overview'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedSection('prompts')}
            className={`px-6 py-3 font-medium transition ${
              selectedSection === 'prompts'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Prompts
          </button>
          <button
            onClick={() => setSelectedSection('responses')}
            className={`px-6 py-3 font-medium transition ${
              selectedSection === 'responses'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Responses
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedSection === 'overview' && (
            <div className="space-y-4">
              {/* Metadata Comparison Table */}
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-white font-semibold">Attribute</th>
                      {sortedAnalyses.map((analysis, index) => (
                        <th key={analysis.id} className="px-4 py-3 text-left text-white font-semibold">
                          Analysis {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">Project</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3">
                          {analysis.projectName}
                          {analysis.projectSymbol && ` (${analysis.projectSymbol})`}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">Date</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3">
                          {formatDate(analysis.timestamp)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">Analysis Type</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            analysis.analysisType === 'deep' ? 'bg-purple-600' :
                            analysis.analysisType === 'balanced' ? 'bg-indigo-600' :
                            'bg-green-600'
                          } text-white`}>
                            {analysis.analysisType}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">AI Provider</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3 capitalize">
                          {analysis.provider}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">Response Length</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3">
                          {analysis.response.length.toLocaleString()} chars
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-gray-600">
                      <td className="px-4 py-3 font-medium">Tags</td>
                      {sortedAnalyses.map(analysis => (
                        <td key={analysis.id} className="px-4 py-3">
                          {analysis.tags && analysis.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {analysis.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Time Evolution */}
              {analyses.length >= 2 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">Timeline</h3>
                  <div className="space-y-2">
                    {sortedAnalyses.map((analysis, index) => (
                      <div key={analysis.id} className="flex items-center gap-3">
                        <div className="w-20 text-gray-400 text-sm">
                          {index === 0 ? 'Start' : `+${getTimeDifference(sortedAnalyses[0].timestamp, analysis.timestamp)}`}
                        </div>
                        <div className="flex-1 bg-gray-600 rounded p-3">
                          <div className="font-medium text-white">{analysis.projectName}</div>
                          <div className="text-sm text-gray-400">{formatDate(analysis.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedSection === 'prompts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedAnalyses.map((analysis, index) => (
                <div key={analysis.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white">Analysis {index + 1}</h3>
                    <span className="text-xs text-gray-400">{formatDate(analysis.timestamp)}</span>
                  </div>
                  <div className="bg-gray-800 rounded p-3 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {analysis.prompt}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSection === 'responses' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedAnalyses.map((analysis, index) => (
                <div key={analysis.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white">Analysis {index + 1}</h3>
                    <span className="text-xs text-gray-400">{formatDate(analysis.timestamp)}</span>
                  </div>
                  <div className="bg-gray-800 rounded p-3 max-h-96 overflow-y-auto">
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {analysis.response}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            💡 Tip: Use this to track how your analysis of a project evolved over time
          </div>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
