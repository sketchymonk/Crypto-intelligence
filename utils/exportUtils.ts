import { SavedAnalysis, DataProvenance } from '../types';
import { marked } from 'marked';

/**
 * Professional Investment Report Generator
 * Creates institutional-grade research reports with sophisticated styling
 */

/**
 * Parse and format markdown content with professional styling
 */
function parseMarkdown(markdown: string): string {
  // Remove duplicate "Analysis Date:" line at the start (already in metadata bar)
  let cleanedMarkdown = markdown.replace(/^Analysis Date:\s*[^\n]+\n+/i, '');

  // Add special callout boxes for key sections
  cleanedMarkdown = enhanceSpecialSections(cleanedMarkdown);

  // Convert key metrics sections to professional tables
  cleanedMarkdown = convertKeyMetricsToTable(cleanedMarkdown);

  // Configure marked for better output
  marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
  });

  // Parse markdown to HTML
  let html = marked.parse(cleanedMarkdown) as string;

  // Enhance tables
  html = html.replace(/<table>/g, '<table class="data-table">');

  // Enhance blockquotes
  html = html.replace(/<blockquote>/g, '<blockquote class="callout-box">');

  // Style risk indicators
  html = html.replace(/🟢\s*(LOW|Low)/g, '<span class="risk-badge risk-low">🟢 LOW</span>');
  html = html.replace(/🟡\s*(MEDIUM|Medium)/g, '<span class="risk-badge risk-medium">🟡 MEDIUM</span>');
  html = html.replace(/🔴\s*(HIGH|High)/g, '<span class="risk-badge risk-high">🔴 HIGH</span>');
  html = html.replace(/⚠️\s*(CRITICAL|Critical)/g, '<span class="risk-badge risk-critical">⚠️ CRITICAL</span>');

  // Style recommendations
  html = html.replace(/\b(BUY|Buy)\b/g, '<span class="recommendation-buy">BUY</span>');
  html = html.replace(/\b(HOLD|Hold)\b/g, '<span class="recommendation-hold">HOLD</span>');
  html = html.replace(/\b(SELL|Sell)\b/g, '<span class="recommendation-sell">SELL</span>');
  html = html.replace(/\b(AVOID|Avoid)\b/g, '<span class="recommendation-avoid">AVOID</span>');

  // Style percentage changes
  html = html.replace(/([+-]?\d+\.?\d*%)/g, (match) => {
    if (match.startsWith('+') || (!match.startsWith('-') && parseFloat(match) > 0)) {
      return `<span class="percent-positive">${match}</span>`;
    } else if (match.startsWith('-')) {
      return `<span class="percent-negative">${match}</span>`;
    }
    return match;
  });

  // Style dollar amounts
  html = html.replace(/\$[\d,]+\.?\d*/g, '<span class="dollar-amount">$&</span>');

  // Enhance strong emphasis
  html = html.replace(/<strong>(.*?)<\/strong>/g, '<strong class="highlight">$1</strong>');

  // Add section breaks
  html = html.replace(/<h2/g, '<div class="section-break"></div><h2');

  return html;
}

/**
 * Enhance special sections with callout boxes
 */
function enhanceSpecialSections(markdown: string): string {
  // Executive Summary
  markdown = markdown.replace(
    /#{1,3}\s*(Executive Summary|Summary|Overview)[\s\S]*?\n((?:[^\n#]|\n(?!#{1,3}\s))+)/gi,
    (match, header, content) => {
      return `### ${header}\n\n<div class="executive-summary-box">\n${content.trim()}\n</div>\n`;
    }
  );

  // Investment Recommendation
  markdown = markdown.replace(
    /#{1,3}\s*(?:Investment )?Recommendation[\s\S]*?\n((?:[^\n#]|\n(?!#{1,3}\s))+)/gi,
    (match, content) => {
      return `### Investment Recommendation\n\n<div class="recommendation-box">\n${content.trim()}\n</div>\n`;
    }
  );

  // Key Takeaways / TL;DR
  markdown = markdown.replace(
    /#{1,3}\s*(?:Key Takeaways|TL;?DR|Quick Summary)[\s\S]*?\n((?:[^\n#]|\n(?!#{1,3}\s))+)/gi,
    (match, header, content) => {
      return `### ${header}\n\n<div class="takeaway-box">\n${content.trim()}\n</div>\n`;
    }
  );

  // Warnings / Red Flags
  markdown = markdown.replace(
    /#{1,3}\s*(?:⚠️\s*)?(?:Warnings?|Red Flags?|Caution)[\s\S]*?\n((?:[^\n#]|\n(?!#{1,3}\s))+)/gi,
    (match, content) => {
      return `### ⚠️ Warnings\n\n<div class="warning-box">\n${content.trim()}\n</div>\n`;
    }
  );

  return markdown;
}

/**
 * Convert sections with data to professional HTML tables
 */
function convertKeyMetricsToTable(markdown: string): string {
  // Extended pattern for all data-heavy sections that should be tables
  const tableSections = [
    'Key Metrics', 'Current Metrics', 'Market Metrics', 'Price Metrics', 'Token Metrics',
    'Dashboard', 'Live Data', 'Market Data', 'Trading Metrics',
    'Tokenomics', 'Token Distribution', 'Supply Metrics',
    'Technical Indicators', 'Technical Analysis', 'On-Chain Metrics',
    'Fundamental Metrics', 'Financial Metrics', 'Performance Metrics',
    'Risk Metrics', 'Risk Assessment', 'Risk Breakdown', 'Risk Categories',
    'Competitive Analysis', 'Competitor Comparison', 'Market Position',
    'Team Metrics', 'Development Metrics', 'GitHub Metrics',
    'Social Metrics', 'Community Metrics', 'Engagement Metrics',
    'Valuation Metrics', 'Price Analysis', 'Historical Performance'
  ];

  const sectionsRegex = tableSections.join('|');

  // Pattern 1: Sections with bold key-value pairs
  const keyValuePattern = new RegExp(`#{1,3}\\s*(?:${sectionsRegex})[\\s\\S]*?\\n((?:[-*]\\s+\\*\\*[^*]+\\*\\*:[^\\n]+\\n?)+)`, 'gi');

  markdown = markdown.replace(keyValuePattern, (match, content) => {
    const lines = content.match(/[-*]\s+\*\*([^*]+)\*\*:\s*([^\n]+)/g);
    if (!lines || lines.length === 0) return match;

    let tableRows = '';
    lines.forEach((line: string) => {
      const lineMatch = line.match(/[-*]\s+\*\*([^*]+)\*\*:\s*([^\n]+)/);
      if (lineMatch) {
        tableRows += `| ${lineMatch[1].trim()} | ${lineMatch[2].trim()} |\n`;
      }
    });

    const headerMatch = match.match(/(#{1,3}\s*[^\n]+)/i);
    const header = headerMatch ? headerMatch[1] : '### Metrics';

    return `${header}\n\n| Metric | Value |\n|--------|-------|\n${tableRows}\n`;
  });

  // Pattern 2: Simple colon-separated key-value lists (3+ items)
  const colonPattern = new RegExp(`#{1,3}\\s*(?:${sectionsRegex})[\\s\\S]*?\\n((?:[-*]\\s+[^:]+:[^\\n]+\\n?){3,})`, 'gi');

  markdown = markdown.replace(colonPattern, (match, content) => {
    const lines = content.match(/[-*]\s+([^:]+):\s*([^\n]+)/g);
    if (!lines || lines.length === 0) return match;

    let tableRows = '';
    lines.forEach((line: string) => {
      const lineMatch = line.match(/[-*]\s+([^:]+):\s*([^\n]+)/);
      if (lineMatch) {
        const label = lineMatch[1].trim().replace(/\*\*/g, '');
        tableRows += `| ${label} | ${lineMatch[2].trim()} |\n`;
      }
    });

    const headerMatch = match.match(/(#{1,3}\s*[^\n]+)/i);
    const header = headerMatch ? headerMatch[1] : '### Data';

    return `${header}\n\n| Metric | Value |\n|--------|-------|\n${tableRows}\n`;
  });

  // Pattern 3: Pros and Cons sections
  markdown = convertProsConsToTable(markdown);

  // Pattern 4: Risk assessment with ratings
  markdown = convertRiskAssessmentToTable(markdown);

  // Pattern 5: Comparison lists (vs, compared to, etc.)
  markdown = convertComparisonToTable(markdown);

  return markdown;
}

/**
 * Convert Pros and Cons sections to side-by-side table
 */
function convertProsConsToTable(markdown: string): string {
  const prosConsPattern = /#{1,3}\s*(Pros|Strengths|Advantages)[\s\S]*?\n((?:[-*]\s+[^\n]+\n?)+)[\s\S]*?#{1,3}\s*(Cons|Weaknesses|Disadvantages|Risks)[\s\S]*?\n((?:[-*]\s+[^\n]+\n?)+)/gi;

  return markdown.replace(prosConsPattern, (match, prosHeader, prosContent, consHeader, consContent) => {
    const pros = prosContent.match(/[-*]\s+([^\n]+)/g)?.map((p: string) => p.replace(/^[-*]\s+/, '').trim()) || [];
    const cons = consContent.match(/[-*]\s+([^\n]+)/g)?.map((c: string) => c.replace(/^[-*]\s+/, '').trim()) || [];

    const maxRows = Math.max(pros.length, cons.length);
    let tableRows = '';

    for (let i = 0; i < maxRows; i++) {
      const pro = pros[i] || '';
      const con = cons[i] || '';
      tableRows += `| ${pro} | ${con} |\n`;
    }

    return `### ${prosHeader} & ${consHeader}\n\n| ✅ ${prosHeader} | ❌ ${consHeader} |\n|--------|--------|\n${tableRows}\n`;
  });
}

/**
 * Convert Risk Assessment sections to table
 */
function convertRiskAssessmentToTable(markdown: string): string {
  const riskPattern = /#{1,3}\s*Risk Assessment[\s\S]*?\n((?:[-*]\s+\*\*[^:]+\*\*:?\s*[🟢🟡🔴⚠️]?\s*(?:LOW|MEDIUM|HIGH|CRITICAL)[^\n]*\n?)+)/gi;

  return markdown.replace(riskPattern, (match, content) => {
    const lines = content.match(/[-*]\s+\*\*([^:]+)\*\*:?\s*([🟢🟡🔴⚠️]?\s*(?:LOW|MEDIUM|HIGH|CRITICAL)[^\n]*)/gi);
    if (!lines || lines.length === 0) return match;

    let tableRows = '';
    lines.forEach((line: string) => {
      const lineMatch = line.match(/[-*]\s+\*\*([^:]+)\*\*:?\s*([🟢🟡🔴⚠️]?\s*(?:LOW|MEDIUM|HIGH|CRITICAL)[^\n]*)/i);
      if (lineMatch) {
        const category = lineMatch[1].trim();
        const rating = lineMatch[2].trim();
        tableRows += `| ${category} | ${rating} |\n`;
      }
    });

    return `### Risk Assessment\n\n| Risk Category | Rating |\n|--------------|--------|\n${tableRows}\n`;
  });
}

/**
 * Convert comparison lists to table
 */
function convertComparisonToTable(markdown: string): string {
  const comparisonPattern = /#{1,3}\s*(?:Competitive Analysis|Competitor Comparison|vs\.|Comparison)[\s\S]*?\n((?:[-*]\s+\*\*[^:]+\*\*:[^\n]+\n?){2,})/gi;

  return markdown.replace(comparisonPattern, (match, content) => {
    const lines = content.match(/[-*]\s+\*\*([^:]+)\*\*:\s*([^\n]+)/g);
    if (!lines || lines.length === 0) return match;

    let tableRows = '';
    lines.forEach((line: string) => {
      const lineMatch = line.match(/[-*]\s+\*\*([^:]+)\*\*:\s*([^\n]+)/);
      if (lineMatch) {
        tableRows += `| ${lineMatch[1].trim()} | ${lineMatch[2].trim()} |\n`;
      }
    });

    const headerMatch = match.match(/(#{1,3}\s*[^\n]+)/i);
    const header = headerMatch ? headerMatch[1] : '### Comparison';

    return `${header}\n\n| Metric | Value |\n|--------|-------|\n${tableRows}\n`;
  });
}

/**
 * Generate data provenance table HTML
 */
function generateProvenanceTableHTML(provenance: DataProvenance[]): string {
  if (!provenance || provenance.length === 0) {
    return '';
  }

  let tableHTML = `
    <div class="provenance-section">
      <h2>📊 Data Provenance & Quality Report</h2>
      <p class="provenance-description">
        This table provides complete transparency on all data sources, their freshness,
        confidence levels, and validation status for every metric used in this analysis.
      </p>
      <table class="data-table provenance-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Data Sources</th>
            <th>Timestamp</th>
            <th>Confidence</th>
            <th>Staleness</th>
            <th>Status</th>
            <th>Validation</th>
          </tr>
        </thead>
        <tbody>
  `;

  provenance.forEach(item => {
    const statusClass =
      item.validationStatus === 'pass' ? 'status-pass' :
      item.validationStatus === 'warning' ? 'status-warning' :
      'status-fail';

    const statusIcon =
      item.validationStatus === 'pass' ? '✓' :
      item.validationStatus === 'warning' ? '⚠' :
      '✗';

    item.sources.forEach((source, index) => {
      const sourceStatusClass =
        source.status === 'active' ? 'source-active' :
        source.status === 'warning' ? 'source-warning' :
        source.status === 'error' ? 'source-error' :
        'source-blacklisted';

      const timestamp = new Date(source.timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      tableHTML += `
        <tr>
          ${index === 0 ? `<td rowspan="${item.sources.length}">${item.metric}</td>` : ''}
          ${index === 0 ? `<td rowspan="${item.sources.length}"><strong>${item.value}</strong></td>` : ''}
          <td>
            <div class="source-info">
              <span class="source-name">${source.name}</span>
              ${source.url ? `<a href="${source.url}" target="_blank" class="source-link">🔗</a>` : ''}
            </div>
          </td>
          <td>${timestamp}</td>
          <td>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${source.confidence}%"></div>
              <span class="confidence-text">${source.confidence}%</span>
            </div>
          </td>
          <td>
            <span class="${source.isStale ? 'staleness-warning' : 'staleness-fresh'}">
              ${source.staleness !== undefined ? `${source.staleness} min` : 'N/A'}
            </span>
          </td>
          <td>
            <span class="source-status ${sourceStatusClass}">
              ${source.status}
            </span>
          </td>
          ${index === 0 ? `
            <td rowspan="${item.sources.length}">
              <div class="validation-status ${statusClass}">
                <span class="validation-icon">${statusIcon}</span>
                <span class="validation-text">${item.validationStatus}</span>
                ${item.validationMessages && item.validationMessages.length > 0 ? `
                  <div class="validation-messages">
                    ${item.validationMessages.map(msg => `<div class="validation-msg">• ${msg}</div>`).join('')}
                  </div>
                ` : ''}
                ${item.consensus ? `
                  <div class="consensus-info">
                    <small>Consensus: ${item.consensus.method} | Deviation: ${item.consensus.deviation?.toFixed(2)}%</small>
                    ${item.consensus.outliers && item.consensus.outliers.length > 0 ? `
                      <small>Outliers: ${item.consensus.outliers.join(', ')}</small>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            </td>
          ` : ''}
        </tr>
      `;
    });
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  return tableHTML;
}

/**
 * Generate professional HTML report
 */
export function generateAnalysisHTML(analysis: SavedAnalysis, includeProvenance: boolean = false): string {
  const date = new Date(analysis.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const metadata = getAnalysisMetadata(analysis.response);
  const contentHtml = parseMarkdown(analysis.response);

  const providerNames: Record<string, string> = {
    claude: 'Claude AI',
    gemini: 'Gemini AI',
    ollama: 'Ollama'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${analysis.projectName} - Investment Research Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">

    <style>
        /* ========================================
           PROFESSIONAL INVESTMENT REPORT STYLING
           ======================================== */

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Color Palette - Professional Investment Theme */
            --primary-navy: #0A1F44;
            --primary-blue: #1E3A8A;
            --accent-gold: #D4AF37;
            --accent-teal: #0891B2;
            --text-primary: #1F2937;
            --text-secondary: #4B5563;
            --text-muted: #6B7280;
            --bg-white: #FFFFFF;
            --bg-gray-50: #F9FAFB;
            --bg-gray-100: #F3F4F6;
            --border-gray: #E5E7EB;
            --border-gray-dark: #D1D5DB;

            /* Risk Colors */
            --risk-low: #10B981;
            --risk-medium: #F59E0B;
            --risk-high: #EF4444;
            --risk-critical: #991B1B;

            /* Recommendation Colors */
            --rec-buy: #059669;
            --rec-hold: #0891B2;
            --rec-sell: #DC2626;
        }

        @page {
            size: A4;
            margin: 20mm;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 10.5pt;
            line-height: 1.7;
            color: var(--text-primary);
            background: var(--bg-gray-50);
            padding: 0;
        }

        .report-container {
            max-width: 210mm;
            margin: 0 auto;
            background: var(--bg-white);
            box-shadow: 0 0 30px rgba(0,0,0,0.08);
        }

        /* ========================================
           HEADER & COVER PAGE
           ======================================== */

        .report-header {
            background: linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-blue) 100%);
            color: white;
            padding: 60px 50px;
            position: relative;
            overflow: hidden;
        }

        .report-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%);
            border-radius: 50%;
        }

        .company-logo {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 40px;
            color: var(--accent-gold);
        }

        .report-title {
            font-family: 'Merriweather', Georgia, serif;
            font-size: 36px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 12px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .report-subtitle {
            font-size: 16px;
            font-weight: 300;
            color: rgba(255,255,255,0.9);
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* ========================================
           METADATA BAR
           ======================================== */

        .metadata-bar {
            background: var(--bg-gray-100);
            border-top: 3px solid var(--accent-gold);
            border-bottom: 1px solid var(--border-gray);
            padding: 20px 50px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .meta-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .meta-value {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .analysis-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .badge-deep { background: #6366F1; color: white; }
        .badge-balanced { background: #0891B2; color: white; }
        .badge-fast { background: #10B981; color: white; }
        .badge-risk { background: #EF4444; color: white; }
        .badge-consensus { background: #F59E0B; color: white; }

        /* ========================================
           CONTENT SECTIONS
           ======================================== */

        .report-body {
            padding: 50px;
        }

        .content-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .content-section h1 {
            font-family: 'Merriweather', Georgia, serif;
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-navy);
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid var(--accent-gold);
        }

        .content-section h2 {
            font-size: 22px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 30px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--bg-gray-100);
        }

        .content-section h3 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 25px 0 12px 0;
        }

        .content-section h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-secondary);
            margin: 20px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .content-section p {
            margin-bottom: 16px;
            text-align: justify;
            line-height: 1.8;
        }

        /* Enhanced bullet points */
        .content-section ul {
            margin-left: 0;
            margin-bottom: 20px;
            padding-left: 0;
            list-style: none;
        }

        .content-section ul li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 12px;
            line-height: 1.7;
        }

        .content-section ul li::before {
            content: '▸';
            position: absolute;
            left: 8px;
            color: var(--accent-teal);
            font-weight: 700;
            font-size: 14px;
        }

        /* Nested lists */
        .content-section ul ul {
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .content-section ul ul li::before {
            content: '◦';
            color: var(--primary-blue);
        }

        /* Enhanced numbered lists */
        .content-section ol {
            margin-left: 0;
            margin-bottom: 20px;
            padding-left: 0;
            list-style: none;
            counter-reset: item;
        }

        .content-section ol li {
            position: relative;
            padding-left: 40px;
            margin-bottom: 14px;
            line-height: 1.7;
            counter-increment: item;
        }

        .content-section ol li::before {
            content: counter(item);
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(135deg, var(--primary-navy), var(--primary-blue));
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .content-section strong.highlight {
            color: var(--primary-navy);
            font-weight: 700;
        }

        .content-section a {
            color: var(--accent-teal);
            text-decoration: none;
            border-bottom: 1px solid var(--accent-teal);
            transition: all 0.2s;
        }

        .content-section a:hover {
            border-bottom: 2px solid var(--accent-teal);
            color: var(--primary-blue);
        }

        /* Professional highlight boxes */
        .content-section blockquote {
            margin: 24px 0;
        }

        /* Executive Summary special styling */
        .content-section > h2:first-of-type + p,
        .content-section > h1:first-of-type + p {
            background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
            border-left: 4px solid var(--primary-blue);
            padding: 20px 24px;
            margin: 24px 0;
            border-radius: 4px;
            font-size: 11pt;
            line-height: 1.8;
        }

        /* Key takeaways boxes */
        .content-section p strong:first-child {
            color: var(--primary-navy);
        }

        /* Section dividers */
        .content-section hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
            margin: 40px 0;
        }

        .section-break {
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-gray), transparent);
            margin: 30px 0;
        }

        /* ========================================
           SPECIAL CALLOUT BOXES
           ======================================== */

        .executive-summary-box {
            background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
            border-left: 5px solid var(--accent-teal);
            border-radius: 8px;
            padding: 24px 28px;
            margin: 24px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            position: relative;
        }

        .executive-summary-box::before {
            content: '📊';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 32px;
            opacity: 0.3;
        }

        .recommendation-box {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 2px solid var(--accent-gold);
            border-radius: 8px;
            padding: 24px 28px;
            margin: 24px 0;
            box-shadow: 0 4px 12px rgba(212,175,55,0.15);
            position: relative;
        }

        .recommendation-box::before {
            content: '💡';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 32px;
            opacity: 0.4;
        }

        .takeaway-box {
            background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
            border: 2px solid var(--primary-blue);
            border-radius: 8px;
            padding: 24px 28px;
            margin: 24px 0;
            box-shadow: 0 2px 8px rgba(99,102,241,0.1);
        }

        .takeaway-box::before {
            content: '✨';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 28px;
            opacity: 0.3;
        }

        .warning-box {
            background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
            border-left: 5px solid #EF4444;
            border-radius: 8px;
            padding: 24px 28px;
            margin: 24px 0;
            box-shadow: 0 2px 8px rgba(239,68,68,0.1);
            position: relative;
        }

        .warning-box::before {
            content: '⚠️';
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 32px;
            opacity: 0.4;
        }

        /* ========================================
           INLINE STYLING ENHANCEMENTS
           ======================================== */

        .percent-positive {
            color: #059669;
            font-weight: 600;
        }

        .percent-negative {
            color: #DC2626;
            font-weight: 600;
        }

        .dollar-amount {
            font-weight: 600;
            color: var(--primary-navy);
            font-variant-numeric: tabular-nums;
        }

        /* ========================================
           TABLES
           ======================================== */

        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 24px 0;
            border: 1px solid var(--border-gray);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .data-table thead {
            background: linear-gradient(to bottom, var(--primary-navy), var(--primary-blue));
            color: white;
        }

        .data-table th {
            padding: 14px 16px;
            text-align: left;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 2px solid var(--accent-gold);
        }

        .data-table td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--bg-gray-100);
            font-size: 10.5pt;
        }

        .data-table tbody tr:nth-child(even) {
            background: var(--bg-gray-50);
        }

        .data-table tbody tr:hover {
            background: rgba(212,175,55,0.08);
        }

        .data-table tbody tr:last-child td {
            border-bottom: none;
        }

        /* ========================================
           SPECIAL ELEMENTS
           ======================================== */

        .executive-summary {
            background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
            border-left: 5px solid var(--accent-teal);
            padding: 30px;
            margin: 30px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .executive-summary h2 {
            color: var(--primary-navy);
            border-bottom: none;
            margin-top: 0;
        }

        .callout-box {
            background: var(--bg-gray-50);
            border-left: 4px solid var(--accent-gold);
            padding: 20px 24px;
            margin: 24px 0;
            border-radius: 4px;
            font-style: italic;
            color: var(--text-secondary);
        }

        .key-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .metric-card {
            background: var(--bg-white);
            border: 2px solid var(--border-gray);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s;
        }

        .metric-card:hover {
            border-color: var(--accent-teal);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .metric-value {
            font-size: 28px;
            font-weight: 800;
            color: var(--primary-navy);
            display: block;
            margin-bottom: 8px;
        }

        .metric-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            font-weight: 600;
        }

        /* ========================================
           RISK & RECOMMENDATION BADGES
           ======================================== */

        .risk-badge, .recommendation-buy, .recommendation-hold,
        .recommendation-sell, .recommendation-avoid {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin: 0 4px;
        }

        .risk-low {
            background: rgba(16,185,129,0.15);
            color: var(--risk-low);
            border: 2px solid var(--risk-low);
        }

        .risk-medium {
            background: rgba(245,158,11,0.15);
            color: var(--risk-medium);
            border: 2px solid var(--risk-medium);
        }

        .risk-high {
            background: rgba(239,68,68,0.15);
            color: var(--risk-high);
            border: 2px solid var(--risk-high);
        }

        .risk-critical {
            background: rgba(153,27,27,0.15);
            color: var(--risk-critical);
            border: 2px solid var(--risk-critical);
        }

        .recommendation-buy {
            background: var(--rec-buy);
            color: white;
            box-shadow: 0 2px 4px rgba(5,150,105,0.3);
        }

        .recommendation-hold {
            background: var(--rec-hold);
            color: white;
            box-shadow: 0 2px 4px rgba(8,145,178,0.3);
        }

        .recommendation-sell {
            background: var(--rec-sell);
            color: white;
            box-shadow: 0 2px 4px rgba(220,38,38,0.3);
        }

        .recommendation-avoid {
            background: var(--risk-critical);
            color: white;
            box-shadow: 0 2px 4px rgba(153,27,27,0.3);
        }

        /* ========================================
           FOOTER
           ======================================== */

        .report-footer {
            background: var(--bg-gray-100);
            border-top: 3px solid var(--accent-gold);
            padding: 30px 50px;
            margin-top: 50px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 20px;
        }

        .footer-section h4 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: var(--text-muted);
            margin-bottom: 12px;
            font-weight: 700;
        }

        .footer-section p {
            font-size: 10px;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .disclaimer {
            background: var(--bg-white);
            border: 1px solid var(--border-gray);
            border-radius: 4px;
            padding: 16px;
            margin-top: 20px;
            font-size: 9px;
            color: var(--text-muted);
            line-height: 1.5;
        }

        .disclaimer strong {
            color: var(--text-secondary);
        }

        .report-id {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--border-gray);
            font-size: 9px;
            color: var(--text-muted);
            font-family: 'Courier New', monospace;
        }

        /* ========================================
           TAGS
           ======================================== */

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 20px 0;
        }

        .tag {
            background: var(--bg-gray-100);
            border: 1px solid var(--border-gray);
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            color: var(--text-secondary);
        }

        /* ========================================
           DATA PROVENANCE TABLE
           ======================================== */

        .provenance-section {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 3px solid var(--accent-gold);
        }

        .provenance-section h2 {
            color: var(--primary-navy);
            margin-bottom: 12px;
        }

        .provenance-description {
            color: var(--text-secondary);
            margin-bottom: 24px;
            font-size: 11pt;
        }

        .provenance-table {
            font-size: 9.5pt;
        }

        .provenance-table th {
            font-size: 10px;
        }

        .source-info {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .source-name {
            font-weight: 500;
        }

        .source-link {
            font-size: 12px;
            text-decoration: none;
        }

        .confidence-bar {
            position: relative;
            width: 100%;
            height: 20px;
            background: var(--bg-gray-100);
            border-radius: 4px;
            overflow: hidden;
        }

        .confidence-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: linear-gradient(90deg, #10B981 0%, #059669 100%);
            transition: width 0.3s;
        }

        .confidence-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 9px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .staleness-fresh {
            color: #10B981;
            font-weight: 600;
        }

        .staleness-warning {
            color: #F59E0B;
            font-weight: 600;
        }

        .source-status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .source-active {
            background: rgba(16, 185, 129, 0.15);
            color: #059669;
        }

        .source-warning {
            background: rgba(245, 158, 11, 0.15);
            color: #D97706;
        }

        .source-error {
            background: rgba(239, 68, 68, 0.15);
            color: #DC2626;
        }

        .source-blacklisted {
            background: rgba(153, 27, 27, 0.15);
            color: #991B1B;
        }

        .validation-status {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .validation-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 50%;
            font-weight: 700;
            margin-right: 6px;
        }

        .status-pass .validation-icon {
            background: #10B981;
            color: white;
        }

        .status-warning .validation-icon {
            background: #F59E0B;
            color: white;
        }

        .status-fail .validation-icon {
            background: #EF4444;
            color: white;
        }

        .validation-text {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
        }

        .status-pass .validation-text {
            color: #10B981;
        }

        .status-warning .validation-text {
            color: #F59E0B;
        }

        .status-fail .validation-text {
            color: #EF4444;
        }

        .validation-messages {
            margin-top: 8px;
            font-size: 9px;
            color: var(--text-secondary);
        }

        .validation-msg {
            padding: 2px 0;
        }

        .consensus-info {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-gray);
        }

        .consensus-info small {
            display: block;
            font-size: 9px;
            color: var(--text-muted);
            margin-bottom: 4px;
        }

        /* ========================================
           PRINT STYLES
           ======================================== */

        @media print {
            body {
                background: white;
            }

            .report-container {
                max-width: 100%;
                box-shadow: none;
            }

            .content-section {
                page-break-inside: avoid;
            }

            .content-section h1,
            .content-section h2 {
                page-break-after: avoid;
            }

            .data-table {
                page-break-inside: avoid;
            }

            a {
                color: inherit;
                text-decoration: underline;
            }
        }

        /* ========================================
           RESPONSIVE
           ======================================== */

        @media (max-width: 768px) {
            .report-header,
            .report-body,
            .metadata-bar,
            .report-footer {
                padding: 30px 20px;
            }

            .report-title {
                font-size: 28px;
            }

            .metadata-bar {
                grid-template-columns: 1fr;
            }

            .footer-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <!-- HEADER -->
        <div class="report-header">
            <div class="company-logo">CRYPTOINTEL</div>
            <h1 class="report-title">${analysis.projectName}${analysis.projectSymbol ? ` (${analysis.projectSymbol.toUpperCase()})` : ''}</h1>
            <p class="report-subtitle">Institutional Investment Research Report</p>
        </div>

        <!-- METADATA BAR -->
        <div class="metadata-bar">
            <div class="meta-item">
                <span class="meta-label">Report Date</span>
                <span class="meta-value">${formattedDate}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Time</span>
                <span class="meta-value">${formattedTime} UTC</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Analysis Type</span>
                <span class="meta-value">
                    <span class="analysis-badge badge-${analysis.analysisType}">${analysis.analysisType.toUpperCase()}</span>
                </span>
            </div>
            <div class="meta-item">
                <span class="meta-label">AI Engine</span>
                <span class="meta-value">${providerNames[analysis.provider] || 'AI Analysis'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Report Length</span>
                <span class="meta-value">${metadata.wordCount.toLocaleString()} words</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Reading Time</span>
                <span class="meta-value">${metadata.readingTime} minutes</span>
            </div>
        </div>

        ${analysis.tags && analysis.tags.length > 0 ? `
        <div class="report-body">
            <div class="tags-container">
                ${analysis.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- MAIN CONTENT -->
        <div class="report-body">
            ${analysis.notes ? `
            <div class="callout-box">
                <strong>Analyst Notes:</strong> ${analysis.notes}
            </div>
            ` : ''}

            <div class="content-section">
                ${contentHtml}
            </div>

            ${includeProvenance && analysis.dataProvenance ? generateProvenanceTableHTML(analysis.dataProvenance) : ''}
        </div>

        <!-- FOOTER -->
        <div class="report-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>About This Report</h4>
                    <p>This report was generated using CryptoIntel's advanced AI-powered research platform. All analysis is provided for informational purposes and represents the output of sophisticated artificial intelligence models trained on comprehensive market data.</p>
                </div>
                <div class="footer-section">
                    <h4>Methodology</h4>
                    <p>Analysis conducted using ${providerNames[analysis.provider]} with ${analysis.analysisType} mode. Report incorporates fundamental analysis, technical indicators, on-chain metrics, and market sentiment data.</p>
                </div>
            </div>

            <div class="disclaimer">
                <strong>IMPORTANT DISCLAIMER:</strong> This report is for informational and educational purposes only and does not constitute financial, investment, or trading advice. Cryptocurrency investments carry significant risk. Past performance does not guarantee future results. Always conduct your own research and consult with qualified financial advisors before making investment decisions. CryptoIntel and its AI models do not guarantee accuracy or completeness of information. Market conditions can change rapidly.
            </div>

            <div class="report-id">
                Report ID: ${analysis.id} | Generated: ${date.toISOString()} | CryptoIntel Research Platform
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Download analysis as professional HTML file
 */
export function downloadAsHTML(analysis: SavedAnalysis, includeProvenance: boolean = false): void {
  const html = generateAnalysisHTML(analysis, includeProvenance);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `CryptoIntel_${analysis.projectName.replace(/[^a-z0-9]/gi, '_')}_Report_${new Date(analysis.timestamp).toISOString().split('T')[0]}.html`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export as PDF (opens print dialog)
 */
export function exportAsPDF(analysis: SavedAnalysis, includeProvenance: boolean = false): void {
  const html = generateAnalysisHTML(analysis, includeProvenance);
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } else {
    alert('Please allow pop-ups to export as PDF. Use browser\'s print-to-PDF feature for best results.');
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
  readingTime: number;
  characterCount: number;
  estimatedTokens: number;
} {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const characterCount = text.length;
  const readingTime = Math.ceil(wordCount / 200);
  const estimatedTokens = Math.ceil(wordCount * 1.3);

  return {
    wordCount,
    readingTime,
    characterCount,
    estimatedTokens
  };
}
