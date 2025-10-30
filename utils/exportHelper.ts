import { AnalysisResult } from '../types';

const markdownToHtmlString = (text: string): string => {
    if (!text) return '';
    let html = '';
    let inList = false;
    const lines = text.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim();
        const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');

        if (isListItem && !inList) {
            html += '<ul>';
            inList = true;
        } else if (!isListItem && inList) {
            html += '</ul>';
            inList = false;
        }

        if (trimmedLine.startsWith('### ')) {
            html += `<h3>${trimmedLine.replace('### ', '')}</h3>`;
        } else if (trimmedLine.startsWith('## ')) {
            html += `<h2>${trimmedLine.replace('## ', '')}</h2>`;
        } else if (trimmedLine.startsWith('# ')) {
            html += `<h1>${trimmedLine.replace('# ', '')}</h1>`;
        } else if (isListItem) {
            const itemContent = trimmedLine.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<li>${itemContent}</li>`;
        } else if (trimmedLine) {
            const pContent = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p>${pContent}</p>`;
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
};

export const generateHtmlForDocx = (result: AnalysisResult, businessName: string): string => {
  const {
    swotAnalysis,
    targetAudienceProfile,
    marketTrends,
    marketingStrategy,
    localOpportunities
  } = result;

  let content = `<h1>Analisis Strategi untuk ${businessName}</h1>`;
  content += `<h2>Analisis SWOT</h2>${markdownToHtmlString(swotAnalysis)}`;
  content += `<h2>Profil Target Audiens</h2>${markdownToHtmlString(targetAudienceProfile)}`;
  content += `<h2>Tren Pasar</h2>${markdownToHtmlString(marketTrends)}`;
  if (localOpportunities) {
    content += `<h2>Peluang & Pesaing Lokal</h2>${markdownToHtmlString(localOpportunities)}`;
  }
  content += `<h2>Strategi Pemasaran Berbasis AI</h2>${markdownToHtmlString(marketingStrategy)}`;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Analisis Strategi - ${businessName}</title>
      <style>
        body { font-family: Calibri, sans-serif; font-size: 11pt; }
        h1 { color: #2E74B5; }
        h2 { color: #365F91; }
        h3 { color: #4F81BD; }
        strong { font-weight: bold; }
        ul { list-style-type: disc; margin-left: 20px; }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};