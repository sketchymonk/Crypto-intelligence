import { SavedAnalysis } from '../types';

/**
 * Utility functions for exporting analyses to various formats
 */

/**
 * Generate HTML content for an analysis
 */
export function generateAnalysisHTML(analysis: SavedAnalysis): string {
  const date = new Date(analysis.timestamp).toLocaleString();
  const providerIcons: Record<string, string> = {
    claude: '🧠',
    gemini: '💎',
    ollama: '🦙'
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.projectName} - Crypto Analysis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #8b5cf6;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header .subtitle {
            color: #666;
            font-size: 1.1em;
        }
        .metadata {
            background: #f8f8f8;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .metadata-item {
            display: flex;
            flex-direction: column;
        }
        .metadata-label {
            font-size: 0.85em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .metadata-value {
            font-weight: 600;
            color: #1a1a1a;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            color: white;
        }
        .badge-deep { background: #8b5cf6; }
        .badge-balanced { background: #6366f1; }
        .badge-fast { background: #10b981; }
        .badge-risk { background: #ef4444; }
        .badge-consensus { background: #f59e0b; }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
        }
        .tag {
            background: #e0e7ff;
            color: #4338ca;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 0.85em;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1a1a1a;
            font-size: 1.8em;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .section h3 {
            color: #374151;
            font-size: 1.3em;
            margin: 20px 0 10px 0;
        }
        .content {
            color: #374151;
            white-space: pre-wrap;
            line-height: 1.8;
        }
        .prompt-box {
            background: #f9fafb;
            border-left: 4px solid #8b5cf6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .notes-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 0.9em;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                padding: 20px;
            }
        }
        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            .header h1 {
                font-size: 1.8em;
            }
            .metadata {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${analysis.projectName}${analysis.projectSymbol ? ` (${analysis.projectSymbol})` : ''}</h1>
            <p class="subtitle">Crypto Intelligence Analysis Report</p>
        </div>

        <div class="metadata">
            <div class="metadata-item">
                <span class="metadata-label">Analysis Date</span>
                <span class="metadata-value">${date}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Analysis Type</span>
                <span class="metadata-value">
                    <span class="badge badge-${analysis.analysisType}">${analysis.analysisType.toUpperCase()}</span>
                </span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">AI Provider</span>
                <span class="metadata-value">${providerIcons[analysis.provider] || '🤖'} ${analysis.provider.charAt(0).toUpperCase() + analysis.provider.slice(1)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Report Length</span>
                <span class="metadata-value">${analysis.response.split(/\s+/).length.toLocaleString()} words</span>
            </div>
            ${analysis.tags && analysis.tags.length > 0 ? `
            <div class="metadata-item" style="grid-column: 1 / -1;">
                <span class="metadata-label">Tags</span>
                <div class="tags">
                    ${analysis.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>

        ${analysis.notes ? `
        <div class="notes-box">
            <h3>📝 Notes</h3>
            <p>${analysis.notes}</p>
        </div>
        ` : ''}

        <div class="section">
            <h2>📊 Analysis Results</h2>
            <div class="content">${escapeHtml(analysis.response)}</div>
        </div>

        ${analysis.consensusResults && analysis.consensusResults.length > 0 ? `
        <div class="section">
            <h2>🤝 Consensus Analysis (Multiple Providers)</h2>
            ${analysis.consensusResults.map(result => `
                <div class="prompt-box">
                    <h3>${providerIcons[result.provider] || '🤖'} ${result.provider.charAt(0).toUpperCase() + result.provider.slice(1)} Analysis</h3>
                    <div class="content">${escapeHtml(result.response)}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>📝 Research Prompt</h2>
            <div class="prompt-box">
                <div class="content">${escapeHtml(analysis.prompt)}</div>
            </div>
        </div>

        ${analysis.groundingChunks && analysis.groundingChunks.length > 0 ? `
        <div class="section">
            <h2>🔗 Sources</h2>
            <ul>
                ${analysis.groundingChunks.map(chunk =>
                    chunk.web ? `<li><a href="${chunk.web.uri}" target="_blank">${chunk.web.title || chunk.web.uri}</a></li>` : ''
                ).join('')}
            </ul>
        </div>
        ` : ''}

        <div class="footer">
            <p>Generated by CryptoIntel - AI-Powered Crypto Research Tool</p>
            <p>Report ID: ${analysis.id}</p>
        </div>
    </div>
</body>
</html>
`;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

/**
 * Download analysis as HTML file
 */
export function downloadAsHTML(analysis: SavedAnalysis): void {
  const html = generateAnalysisHTML(analysis);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${analysis.projectName.replace(/[^a-z0-9]/gi, '_')}_analysis_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open analysis in new window for printing as PDF
 */
export function exportAsPDF(analysis: SavedAnalysis): void {
  const html = generateAnalysisHTML(analysis);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } else {
    alert('Please allow pop-ups to export as PDF');
  }
}

/**
 * Copy analysis to clipboard as formatted text
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err2) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Calculate reading time and word count for analysis
 */
export function getAnalysisMetadata(text: string): {
  wordCount: number;
  readingTime: number; // in minutes
  characterCount: number;
  estimatedTokens: number;
} {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const characterCount = text.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute
  const estimatedTokens = Math.ceil(wordCount * 1.3); // Rough estimate: 1 token ≈ 0.75 words

  return {
    wordCount,
    readingTime,
    characterCount,
    estimatedTokens
  };
}
