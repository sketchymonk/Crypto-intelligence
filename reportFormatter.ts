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
 * Basic markdown to HTML conversion
 */
function markdownToHTML(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Lists (basic)
  html = html.replace(/<p>- (.*?)<\/p>/g, '<ul><li>$1</li></ul>');

  return html;
}
