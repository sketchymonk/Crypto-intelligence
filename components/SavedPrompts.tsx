import React, { useState, useEffect } from 'react';
import { FormData } from '../types';
import {
  getAllSavedPrompts,
  savePrompt,
  updatePrompt,
  deletePrompt,
  promptNameExists,
  exportPrompts,
  importPrompts,
  formatDate,
  SavedPrompt
} from '../savedPrompts';

interface SavedPromptsProps {
  onClose: () => void;
  onLoad: (formData: FormData) => void;
  currentFormData: FormData;
}

const SavedPrompts: React.FC<SavedPromptsProps> = ({ onClose, onLoad, currentFormData }) => {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = () => {
    setSavedPrompts(getAllSavedPrompts());
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      alert('Please enter a name for this prompt');
      return;
    }

    if (promptNameExists(saveName, editingId || undefined)) {
      alert('A prompt with this name already exists');
      return;
    }

    if (editingId) {
      updatePrompt(editingId, saveName, currentFormData, saveDescription);
      showSuccessToast('Prompt updated successfully');
    } else {
      savePrompt(saveName, currentFormData, saveDescription);
      showSuccessToast('Prompt saved successfully');
    }

    setSaveName('');
    setSaveDescription('');
    setEditingId(null);
    setShowSaveDialog(false);
    loadPrompts();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deletePrompt(id);
      showSuccessToast('Prompt deleted');
      loadPrompts();
    }
  };

  const handleLoad = (prompt: SavedPrompt) => {
    onLoad(prompt.formData);
    showSuccessToast(`Loaded "${prompt.name}"`);
    onClose();
  };

  const handleExport = () => {
    const json = exportPrompts();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-intelligence-prompts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccessToast('Prompts exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importPrompts(content);

      if (result.success > 0) {
        showSuccessToast(`Imported ${result.success} prompt(s)`);
        loadPrompts();
      }

      if (result.errors > 0) {
        alert(`Failed to import ${result.errors} prompt(s)`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const showSuccessToast = (message: string) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const openSaveDialog = () => {
    setSaveName('');
    setSaveDescription('');
    setEditingId(null);
    setShowSaveDialog(true);
  };

  const filteredPrompts = savedPrompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Saved Prompts</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={openSaveDialog}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Save Current
            </button>

            <button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              disabled={savedPrompts.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export All
            </button>

            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
              <input
                type="file"
                accept="application/json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Prompts List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-semibold">
                {searchQuery ? 'No prompts found' : 'No saved prompts yet'}
              </p>
              <p className="text-sm mt-2">
                {searchQuery ? 'Try a different search term' : 'Click "Save Current" to save your first prompt'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors border border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{prompt.name}</h3>
                      {prompt.description && (
                        <p className="text-sm text-gray-400 mt-1">{prompt.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {formatDate(prompt.createdAt)}
                        {prompt.updatedAt !== prompt.createdAt && (
                          <> • Updated: {formatDate(prompt.updatedAt)}</>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleLoad(prompt)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold"
                        title="Load this prompt"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id, prompt.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold"
                        title="Delete this prompt"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>{savedPrompts.length} saved prompt{savedPrompts.length !== 1 ? 's' : ''}</span>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Update Prompt' : 'Save Prompt'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g., My DeFi Research Template"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="Brief description of what this prompt is for..."
                  rows={3}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveName('');
                  setSaveDescription('');
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;
