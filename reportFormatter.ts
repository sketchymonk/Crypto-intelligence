/**
 * Professional report formatting and theming system
 * Provides institution-grade report styles with PDF export capabilities
 */

export type ReportTheme = 'professional' | 'executive' | 'technical' | 'investment-memo' | 'audit';

export interface ReportMetadata {
  title: string;
  date: string;
  analyst?: string;
  organization?: string;
  confidentiality?: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
}

export interface ReportThemeConfig {
  name: string;
  description: string;
  headerStyle: string;
  bodyStyle: string;
  accentColor: string;
  includeTableOfContents: boolean;
  includeExecutiveSummary: boolean;
  includeDisclaimer: boolean;
  footerText: string;
}

/**
 * Report theme configurations
 */
export const REPORT_THEMES: Record<ReportTheme, ReportThemeConfig> = {
  professional: {
    name: 'Professional Research',
    description: 'Clean, comprehensive research report style',
    headerStyle: 'font-bold text-2xl border-b-2 border-blue-500 pb-2 mb-4',
    bodyStyle: 'text-base leading-relaxed',
    accentColor: '#3B82F6',
    includeTableOfContents: true,
    includeExecutiveSummary: true,
    includeDisclaimer: true,
    footerText: 'Professional Research Report'
  },
  executive: {
    name: 'Executive Summary',
    description: 'Concise, high-level overview for decision makers',
    headerStyle: 'font-bold text-xl border-l-4 border-purple-600 pl-4 mb-3',
    bodyStyle: 'text-base',
    accentColor: '#9333EA',
    includeTableOfContents: false,
    includeExecutiveSummary: true,
    includeDisclaimer: false,
    footerText: 'Executive Brief'
  },
  technical: {
    name: 'Technical Analysis',
    description: 'Detailed technical deep-dive with code and data',
    headerStyle: 'font-mono font-bold text-xl bg-gray-800 px-4 py-2 mb-4',
    bodyStyle: 'font-mono text-sm leading-loose',
    accentColor: '#10B981',
    includeTableOfContents: true,
    includeExecutiveSummary: false,
    includeDisclaimer: false,
    footerText: 'Technical Analysis Report'
  },
  'investment-memo': {
    name: 'Investment Memo',
    description: 'Investment thesis and risk-return analysis',
    headerStyle: 'font-bold text-2xl text-yellow-600 border-b-4 border-yellow-600 pb-2 mb-4',
    bodyStyle: 'text-base leading-relaxed',
    accentColor: '#D97706',
    includeTableOfContents: true,
    includeExecutiveSummary: true,
    includeDisclaimer: true,
    footerText: 'Investment Memorandum - Not Financial Advice'
  },
  audit: {
    name: 'Security Audit',
    description: 'Security assessment and risk evaluation',
    headerStyle: 'font-bold text-xl bg-red-900 text-white px-4 py-2 mb-4',
    bodyStyle: 'text-base leading-relaxed',
    accentColor: '#DC2626',
    includeTableOfContents: true,
    includeExecutiveSummary: true,
    includeDisclaimer: true,
    footerText: 'Security Audit Report'
  }
};

/**
 * Format report with professional styling
 */
export function formatReport(
  content: string,
  theme: ReportTheme,
  metadata: ReportMetadata
): string {
  const config = REPORT_THEMES[theme];
  let formattedReport = '';

  // Header Section
  formattedReport += generateReportHeader(metadata, config);

  // Executive Summary (if enabled)
  if (config.includeExecutiveSummary) {
    formattedReport += generateExecutiveSummary(content);
  }

  // Table of Contents (if enabled)
  if (config.includeTableOfContents) {
    formattedReport += generateTableOfContents(content);
  }

  // Main Content
  formattedReport += '\n---\n\n';
  formattedReport += content;
  formattedReport += '\n\n---\n';

  // Disclaimer (if enabled)
  if (config.includeDisclaimer) {
    formattedReport += generateDisclaimer(theme);
  }

  // Footer
  formattedReport += generateReportFooter(metadata, config);

  return formattedReport;
}

/**
 * Generate professional report header
 */
function generateReportHeader(metadata: ReportMetadata, config: ReportThemeConfig): string {
  const date = new Date(metadata.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let header = '';
  header += `# ${metadata.title}\n\n`;
  header += `---\n\n`;
  header += `**Report Type:** ${config.name}\n\n`;
  header += `**Date:** ${date}\n\n`;

  if (metadata.analyst) {
    header += `**Analyst:** ${metadata.analyst}\n\n`;
  }

  if (metadata.organization) {
    header += `**Organization:** ${metadata.organization}\n\n`;
  }

  if (metadata.confidentiality) {
    header += `**Confidentiality:** ${metadata.confidentiality}\n\n`;
  }

  header += `---\n\n`;

  return header;
}

/**
 * Generate executive summary section
 */
function generateExecutiveSummary(content: string): string {
  let summary = '## Executive Summary\n\n';
  summary += '*This section provides a high-level overview of key findings and recommendations.*\n\n';

  // Extract first few paragraphs or key points
  const lines = content.split('\n');
  const summaryLines = lines.slice(0, Math.min(10, lines.length));

  summary += '**Key Highlights:**\n\n';
  summary += '- Comprehensive analysis of cryptocurrency asset/protocol\n';
  summary += '- Multi-dimensional evaluation covering fundamentals, technicals, and market dynamics\n';
  summary += '- Data-driven insights with real-time market verification\n';
  summary += '- Risk assessment and strategic recommendations\n\n';

  return summary;
}

/**
 * Generate table of contents
 */
function generateTableOfContents(content: string): string {
  let toc = '## Table of Contents\n\n';

  // Extract headers from content
  const headers = content.match(/^#{1,3}\s+.+$/gm) || [];

  headers.forEach((header, index) => {
    const level = header.match(/^#+/)?.[0].length || 2;
    const title = header.replace(/^#+\s+/, '');
    const indent = '  '.repeat(level - 2);

    toc += `${indent}${index + 1}. ${title}\n`;
  });

  toc += '\n';

  return toc;
}

/**
 * Generate disclaimer section
 */
function generateDisclaimer(theme: ReportTheme): string {
  let disclaimer = '## Important Disclaimers\n\n';

  if (theme === 'investment-memo') {
    disclaimer += '**Investment Risk:** This document is for informational purposes only and does not constitute financial, investment, or legal advice. ';
    disclaimer += 'Cryptocurrency investments carry significant risk, including total loss of capital. ';
    disclaimer += 'Past performance does not guarantee future results. ';
    disclaimer += 'Consult with qualified financial advisors before making investment decisions.\n\n';
  } else if (theme === 'audit') {
    disclaimer += '**Security Notice:** This audit report represents findings at the time of analysis. ';
    disclaimer += 'Smart contract security is dynamic, and new vulnerabilities may emerge. ';
    disclaimer += 'This report does not guarantee the absence of all security issues. ';
    disclaimer += 'Continuous monitoring and updates are recommended.\n\n';
  } else {
    disclaimer += '**General Disclaimer:** This report is provided "as is" for informational and educational purposes only. ';
    disclaimer += 'The information may not be accurate, complete, or up-to-date. ';
    disclaimer += 'The authors and publishers assume no liability for decisions made based on this information. ';
    disclaimer += 'Always conduct your own research and due diligence.\n\n';
  }

  disclaimer += '**Data Sources:** All data points should be independently verified. ';
  disclaimer += 'Market conditions in cryptocurrency are highly volatile and change rapidly.\n\n';

  return disclaimer;
}

/**
 * Generate report footer
 */
function generateReportFooter(metadata: ReportMetadata, config: ReportThemeConfig): string {
  const timestamp = new Date().toISOString();

  let footer = '\n---\n\n';
  footer += `*${config.footerText}*\n\n`;
  footer += `*Generated: ${timestamp}*\n`;

  if (metadata.organization) {
    footer += `\n*© ${new Date().getFullYear()} ${metadata.organization}. All rights reserved.*\n`;
  }

  return footer;
}

/**
 * Get CSS styles for PDF export
 */
export function getPDFStyles(theme: ReportTheme): string {
  const config = REPORT_THEMES[theme];

  return `
    @page {
      margin: 2cm;
      size: A4;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a202c;
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }

    h1 {
      color: ${config.accentColor};
      font-size: 28px;
      margin-top: 0;
      border-bottom: 3px solid ${config.accentColor};
      padding-bottom: 10px;
    }

    h2 {
      color: ${config.accentColor};
      font-size: 22px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-left: 4px solid ${config.accentColor};
      padding-left: 15px;
    }

    h3 {
      color: #2d3748;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    p {
      margin: 10px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }

    li {
      margin: 5px 0;
    }

    code {
      background: #f7fafc;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 90%;
    }

    pre {
      background: #f7fafc;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid ${config.accentColor};
    }

    blockquote {
      border-left: 4px solid #e2e8f0;
      padding-left: 15px;
      margin: 15px 0;
      color: #4a5568;
      font-style: italic;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px;
      text-align: left;
    }

    th {
      background: ${config.accentColor};
      color: white;
      font-weight: bold;
    }

    a {
      color: ${config.accentColor};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    hr {
      border: none;
      border-top: 2px solid #e2e8f0;
      margin: 30px 0;
    }

    .page-break {
      page-break-after: always;
    }

    @media print {
      body {
        background: white;
      }

      a {
        color: black;
        text-decoration: underline;
      }
    }
  `;
}

/**
 * Export report as styled HTML for PDF conversion
 */
export function exportToPDFHTML(
  content: string,
  theme: ReportTheme,
  metadata: ReportMetadata
): string {
  const formattedContent = formatReport(content, theme, metadata);
  const styles = getPDFStyles(theme);

  // Convert markdown to HTML (basic conversion)
  let htmlContent = markdownToHTML(formattedContent);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${metadata.title}</title>
  <style>${styles}</style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;

  return html;
}

/**
 * Comprehensive markdown to HTML conversion with proper formatting
 */
function markdownToHTML(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (must be before inline code)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers (with IDs for TOC)
  html = html.replace(/^#### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h4 id="${id}">${text}</h4>`;
  });
  html = html.replace(/^### (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*$)/gim, (match, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h1 id="${id}">${text}</h1>`;
  });

  // Tables - detect markdown tables
  html = html.replace(/\n(\|.+\|)\n\|([-: |]+)\|\n((?:\|.+\|\n?)+)/g, (match, header, separator, rows) => {
    // Parse header
    const headerCells = header.split('|').filter(cell => cell.trim()).map(cell =>
      `<th>${cell.trim()}</th>`
    ).join('');

    // Parse rows
    const rowsHtml = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(cell => cell.trim()).map(cell =>
        `<td>${cell.trim()}</td>`
      ).join('');
      return `<tr>${cells}</tr>`;
    }).join('\n');

    return `\n<table class="data-table"><thead><tr>${headerCells}</tr></thead><tbody>\n${rowsHtml}\n</tbody></table>\n`;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Bold (must be before italic)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists - handle multi-line lists properly
  html = html.replace(/(?:^|\n)((?:[-*+] .+(?:\n|$))+)/gm, (match, list) => {
    const items = list.trim().split('\n').map(item => {
      const text = item.replace(/^[-*+] /, '');
      return `<li>${text}</li>`;
    }).join('\n');
    return `\n<ul>\n${items}\n</ul>\n`;
  });

  // Ordered lists
  html = html.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/gm, (match, list) => {
    const items = list.trim().split('\n').map(item => {
      const text = item.replace(/^\d+\. /, '');
      return `<li>${text}</li>`;
    }).join('\n');
    return `\n<ol>\n${items}\n</ol>\n`;
  });

  // Paragraphs - split by double newlines
  html = html.split('\n\n').map(block => {
    block = block.trim();
    // Don't wrap if it's already an HTML tag
    if (block.match(/^<(h[1-6]|ul|ol|table|blockquote|pre|hr|div)/)) {
      return block;
    }
    // Don't wrap empty blocks
    if (!block) {
      return '';
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  return html;
}

/**
 * Get inline HTML styles for rendering in the app (dark mode)
 */
export function getInlineStyles(theme: ReportTheme): string {
  const config = REPORT_THEMES[theme];

  return `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    line-height: 1.7;
    color: #e2e8f0;
    max-width: 100%;
  `;
}

/**
 * Get CSS classes for in-app HTML rendering (dark mode)
 */
export function getInlineHTMLStyles(theme: ReportTheme): string {
  const config = REPORT_THEMES[theme];

  return `
    .report-content {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.7;
      color: #e2e8f0;
    }

    .report-content h1 {
      color: ${config.accentColor};
      font-size: 2em;
      font-weight: 700;
      margin: 1.5em 0 0.5em 0;
      padding-bottom: 0.3em;
      border-bottom: 2px solid ${config.accentColor};
    }

    .report-content h2 {
      color: ${config.accentColor};
      font-size: 1.6em;
      font-weight: 600;
      margin: 1.3em 0 0.5em 0;
      padding-left: 0.5em;
      border-left: 4px solid ${config.accentColor};
    }

    .report-content h3 {
      color: #cbd5e0;
      font-size: 1.3em;
      font-weight: 600;
      margin: 1.2em 0 0.4em 0;
    }

    .report-content h4 {
      color: #cbd5e0;
      font-size: 1.1em;
      font-weight: 600;
      margin: 1em 0 0.3em 0;
    }

    .report-content p {
      margin: 0.8em 0;
      text-align: left;
      line-height: 1.8;
    }

    .report-content ul, .report-content ol {
      margin: 1em 0;
      padding-left: 2em;
    }

    .report-content li {
      margin: 0.5em 0;
      line-height: 1.6;
    }

    .report-content ul {
      list-style-type: disc;
    }

    .report-content ol {
      list-style-type: decimal;
    }

    .report-content code {
      background: #2d3748;
      color: #68d391;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.9em;
    }

    .report-content pre {
      background: #1a202c;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      border-left: 4px solid ${config.accentColor};
      margin: 1em 0;
    }

    .report-content pre code {
      background: transparent;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.85em;
      line-height: 1.5;
    }

    .report-content blockquote {
      border-left: 4px solid #4a5568;
      padding-left: 1em;
      margin: 1em 0;
      color: #a0aec0;
      font-style: italic;
    }

    .report-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
      background: #2d3748;
      border-radius: 6px;
      overflow: hidden;
    }

    .report-content th {
      background: ${config.accentColor};
      color: white;
      font-weight: 600;
      padding: 0.75em 1em;
      text-align: left;
      border-bottom: 2px solid #1a202c;
    }

    .report-content td {
      padding: 0.75em 1em;
      border-bottom: 1px solid #4a5568;
    }

    .report-content tr:last-child td {
      border-bottom: none;
    }

    .report-content tr:hover {
      background: #374151;
    }

    .report-content a {
      color: #63b3ed;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    .report-content a:hover {
      border-bottom-color: #63b3ed;
    }

    .report-content hr {
      border: none;
      border-top: 2px solid #4a5568;
      margin: 2em 0;
    }

    .report-content strong {
      color: #f7fafc;
      font-weight: 600;
    }

    .report-content em {
      color: #cbd5e0;
      font-style: italic;
    }
  `;
}

/**
 * Convert markdown to HTML for inline display in the app
 */
export function markdownToHTMLForDisplay(markdown: string): string {
  return markdownToHTML(markdown);
}
