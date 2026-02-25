import type { Paper } from '@/types/paper';

/**
 * Composable for exporting papers to CSV format
 */
export const useExportCsv = () => {
  /**
   * Escapes CSV field values that contain semicolons, quotes, or newlines
   */
  const escapeCsvField = (value: string | number): string => {
    const stringValue = String(value);
    
    // If the value contains semicolon, quote, or newline, wrap it in quotes and escape internal quotes
    if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  /**
   * Converts an array of papers to CSV format and triggers download
   */
  const exportToCSV = (papers: Paper[]): void => {
    // Define CSV headers
    const headers = [
      'ID',
      'Round',
      'Direction',
      'Authors',
      'Year',
      'Title',
      'Journal',
      'Source Type',
      'Keywords',
      'Relevance',
      'Included',
      'Notes',
      'DOI'
    ];

    // Create CSV header row
    const headerRow = headers.join(';');

    // Create CSV data rows
    const dataRows = papers.map(paper => [
      paper.id,
      escapeCsvField(paper.round),
      escapeCsvField(paper.direction),
      escapeCsvField(paper.authors),
      paper.year,
      escapeCsvField(paper.title),
      escapeCsvField(paper.journal),
      escapeCsvField(paper.typeOfSource),
      escapeCsvField(paper.keywords),
      escapeCsvField(paper.relevance),
      escapeCsvField(paper.included),
      escapeCsvField(paper.notes),
      escapeCsvField(paper.doi)
    ].join(';'));

    // Combine header and data
    const csvContent = [headerRow, ...dataRows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with current date
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `snowballing-papers-${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`Exported ${papers.length} papers to ${filename}`);
  };

  return {
    exportToCSV
  };
};
