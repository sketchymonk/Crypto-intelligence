import React, { useState, useEffect } from 'react';
import { SavedAnalysis, FormData } from '../types';
import { analysisHistoryService } from '../services/analysisHistory';
import { downloadAsHTML, exportAsPDF, copyToClipboard } from '../utils/exportUtils';
import { aiTaggingService } from '../services/aiTagging';

interface AnalysisHistoryProps {
  onClose: () => void;
  onLoad: (formData: FormData, analysis: SavedAnalysis) => void;
  onCompare: (analyses: SavedAnalysis[]) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onClose, onLoad, onCompare }) => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<SavedAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'project' | 'favorite'>('date');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [generatingTags, setGeneratingTags] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const allTags = analysisHistoryService.getAllTags();
  const allProjects = analysisHistoryService.getAllProjects();

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedTag, sortBy, analyses, showFavoritesOnly]);

  const loadAnalyses = () => {
    const all = analysisHistoryService.getAll();
    setAnalyses(all);
  };

  const applyFilters = () => {
    let filtered = [...analyses];

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(a => a.favorite);
    }

    // Search filter
    if (searchQuery) {
      filtered = analysisHistoryService.search(searchQuery);
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(a => a.tags?.includes(selectedTag));
    }

    // Sort
    if (sortBy === 'project') {
      filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
    } else if (sortBy === 'favorite') {
      filtered.sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        return b.timestamp - a.timestamp;
      });
    } else {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    setFilteredAnalyses(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      analysisHistoryService.delete(id);
      loadAnalyses();
      setSelectedForComparison(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleToggleComparison = (id: string) => {
    setSelectedForComparison(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (newSet.size >= 3) {
          alert('You can compare up to 3 analyses at a time');
          return prev;
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCompare = () => {
    const selected = analyses.filter(a => selectedForComparison.has(a.id));
    if (selected.length < 2) {
      alert('Please select at least 2 analyses to compare');
      return;
    }
    onCompare(selected);
  };

  const handleExport = () => {
    const json = analysisHistoryService.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-analysis-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        analysisHistoryService.import(json);
        loadAnalyses();
        alert('History imported successfully!');
      } catch (error) {
        alert('Failed to import history. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    analysisHistoryService.toggleFavorite(id);
    loadAnalyses();
  };

  const handleGenerateTags = async (analysis: SavedAnalysis, event: React.MouseEvent) => {
    event.stopPropagation();
    setGeneratingTags(prev => new Set(prev).add(analysis.id));

    try {
      const tags = await aiTaggingService.generateTags(analysis);
      analysisHistoryService.addTags(analysis.id, tags);
      loadAnalyses();
      showToast(`Generated ${tags.length} tags!`);
    } catch (error) {
      console.error('Failed to generate tags:', error);
      showToast('Failed to generate tags', true);
    } finally {
      setGeneratingTags(prev => {
        const newSet = new Set(prev);
        newSet.delete(analysis.id);
        return newSet;
      });
    }
  };

  const handleEditNotes = (analysis: SavedAnalysis, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingNotesId(analysis.id);
    setNotesText(analysis.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    analysisHistoryService.updateNotes(id, notesText);
    setEditingNotesId(null);
    setNotesText('');
    loadAnalyses();
    showToast('Notes saved!');
  };

  const handleCancelEditNotes = () => {
    setEditingNotesId(null);
    setNotesText('');
  };

  const handleExportAnalysis = (analysis: SavedAnalysis, format: 'html' | 'pdf', event: React.MouseEvent) => {
    event.stopPropagation();
    if (format === 'html') {
      downloadAsHTML(analysis);
      showToast('Analysis exported as HTML!');
    } else {
      exportAsPDF(analysis);
      showToast('Opening print dialog...');
    }
  };

  const handleCopyAnalysis = async (analysis: SavedAnalysis, event: React.MouseEvent) => {
    event.stopPropagation();
    const success = await copyToClipboard(analysis.response);
    if (success) {
      showToast('Analysis copied to clipboard!');
    } else {
      showToast('Failed to copy', true);
    }
  };

  const showToast = (message: string, isError = false) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;

    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours < 1) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }

    // Format as date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAnalysisTypeColor = (type: string) => {
    switch (type) {
      case 'deep': return 'bg-purple-600';
      case 'balanced': return 'bg-indigo-600';
      case 'fast': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      case 'ollama': return '🦙';
      default: return '🤖';
    }
  };

  const stats = analysisHistoryService.getStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Analysis History</h2>
            <p className="text-gray-400 text-sm mt-1">
              {stats.count} analyses saved {stats.oldestDate && `• Oldest: ${stats.oldestDate.toLocaleDateString()}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700 space-y-3">
          {/* Search and filters */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name or symbol..."
              className="flex-1 min-w-[200px] bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'project' | 'favorite')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="date">Sort by Date</option>
              <option value="favorite">Sort by Favorites</option>
              <option value="project">Sort by Project</option>
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showFavoritesOnly
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={showFavoritesOnly ? 'Show all' : 'Show favorites only'}
            >
              ⭐ {showFavoritesOnly ? 'Favorites' : 'All'}
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition"
              title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
            >
              {viewMode === 'list' ? '⊞' : '☰'}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {selectedForComparison.size > 0 && (
              <button
                onClick={handleCompare}
                disabled={selectedForComparison.size < 2}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition"
              >
                Compare ({selectedForComparison.size})
              </button>
            )}

            <button
              onClick={handleExport}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition"
            >
              Export History
            </button>

            <label className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium transition cursor-pointer">
              Import History
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            {analyses.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all analysis history?')) {
                    analysisHistoryService.clear();
                    loadAnalyses();
                    setSelectedForComparison(new Set());
                  }
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Analysis List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery || selectedTag ? 'No analyses match your filters' : 'No saved analyses yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {!searchQuery && !selectedTag && 'Run an analysis to save it automatically'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
              {filteredAnalyses.map(analysis => (
                <div
                  key={analysis.id}
                  className={`bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition ${
                    selectedForComparison.has(analysis.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">{analysis.projectName}</h3>
                        <button
                          onClick={(e) => handleToggleFavorite(analysis.id, e)}
                          className="text-2xl hover:scale-110 transition-transform"
                          title={analysis.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {analysis.favorite ? '⭐' : '☆'}
                        </button>
                      </div>
                      {analysis.projectSymbol && (
                        <p className="text-gray-400 text-sm">{analysis.projectSymbol.toUpperCase()}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.has(analysis.id)}
                        onChange={() => handleToggleComparison(analysis.id)}
                        className="w-5 h-5 cursor-pointer"
                        title="Select for comparison"
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${getAnalysisTypeColor(analysis.analysisType)} text-white`}>
                      {analysis.analysisType}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-600 text-white">
                      {getProviderIcon(analysis.provider)} {analysis.provider}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-600 text-white">
                      {formatDate(analysis.timestamp)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap mb-3 items-center">
                    {analysis.tags && analysis.tags.length > 0 && analysis.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-200">
                        #{tag}
                      </span>
                    ))}
                    <button
                      onClick={(e) => handleGenerateTags(analysis, e)}
                      disabled={generatingTags.has(analysis.id)}
                      className="text-xs px-2 py-1 rounded bg-purple-900 text-purple-200 hover:bg-purple-800 disabled:opacity-50 transition"
                      title="Generate AI tags"
                    >
                      {generatingTags.has(analysis.id) ? '...' : '+ AI Tags'}
                    </button>
                  </div>

                  {/* Notes */}
                  {editingNotesId === analysis.id ? (
                    <div className="mb-3 bg-gray-800 p-2 rounded">
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Add notes..."
                        className="w-full bg-gray-700 text-white p-2 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSaveNotes(analysis.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-xs transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditNotes}
                          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white text-xs transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : analysis.notes && (
                    <div className="mb-3 bg-yellow-900 bg-opacity-20 border-l-2 border-yellow-600 p-2 rounded text-sm text-gray-300">
                      📝 {analysis.notes}
                    </div>
                  )}

                  {/* Preview */}
                  {expandedId === analysis.id ? (
                    <div className="mb-3 bg-gray-800 p-3 rounded text-sm text-gray-300 max-h-48 overflow-y-auto">
                      {analysis.response.substring(0, 500)}...
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onLoad(analysis.formData, analysis)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white text-sm font-medium transition"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-white text-sm font-medium transition"
                    >
                      {expandedId === analysis.id ? 'Hide' : 'Preview'}
                    </button>
                    <button
                      onClick={(e) => handleEditNotes(analysis, e)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-white text-sm font-medium transition"
                      title="Edit notes"
                    >
                      📝
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <button
                      onClick={(e) => handleCopyAnalysis(analysis, e)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white text-xs transition"
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={(e) => handleExportAnalysis(analysis, 'html', e)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-white text-xs transition"
                      title="Export as HTML"
                    >
                      📄 HTML
                    </button>
                    <button
                      onClick={(e) => handleExportAnalysis(analysis, 'pdf', e)}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white text-xs transition"
                      title="Export as PDF"
                    >
                      📑 PDF
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white text-xs transition"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
