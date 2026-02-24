import type { Paper, Round, Direction, Relevance, IncludedStatus, TypeOfSource } from '@/types/paper';

/**
 * Composable for importing papers from CSV format
 */
export const useImportCsv = () => {
  /**
   * Parses a CSV line, handling quoted fields properly
   */
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current);
    return result;
  };

  /**
   * Validates and converts a value to a specific type
   */
  const validateField = <T>(value: string, validValues: readonly T[], fieldName: string): T => {
    const trimmed = value.trim() as T;
    if (validValues.includes(trimmed)) {
      return trimmed;
    }
    throw new Error(`Invalid value "${value}" for ${fieldName}. Expected one of: ${validValues.join(', ')}`);
  };

  /**
   * Parses CSV content and returns an array of Paper objects (without IDs)
   */
  const parseCsvContent = (csvContent: string): Omit<Paper, 'id'>[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    // Parse header
    const headerLine = lines[0];
    if (!headerLine) {
      throw new Error('CSV header is missing');
    }
    const headers = parseCsvLine(headerLine).map(h => h.trim());
    
    // Validate required headers
    const requiredHeaders = ['Round', 'Direction', 'Authors', 'Year', 'Title', 'Journal', 'Source Type', 'Keywords', 'Relevance', 'Included', 'Notes', 'DOI'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required CSV columns: ${missingHeaders.join(', ')}`);
    }

    // Find column indices
    const getIndex = (name: string) => headers.indexOf(name);
    const indices = {
      round: getIndex('Round'),
      direction: getIndex('Direction'),
      authors: getIndex('Authors'),
      year: getIndex('Year'),
      title: getIndex('Title'),
      journal: getIndex('Journal'),
      typeOfSource: getIndex('Source Type'),
      keywords: getIndex('Keywords'),
      relevance: getIndex('Relevance'),
      included: getIndex('Included'),
      notes: getIndex('Notes'),
      doi: getIndex('DOI'),
    };

    // Valid values for enums
    const ROUNDS: readonly Round[] = ['Seed', 'Round 1', 'Round 2', 'Round 3'];
    const DIRECTIONS: readonly Direction[] = ['No direction', 'Backward', 'Forward'];
    const RELEVANCE: readonly Relevance[] = ['High', 'Medium', 'Low', 'Pending'];
    const INCLUDED: readonly IncludedStatus[] = ['Yes', 'No', 'Pending'];
    const SOURCES: readonly TypeOfSource[] = ['SSCI', 'SCI', 'SSCI/SCI', 'ESCI', 'Google Scholar', 'Scopus', 'Not indexed', 'Unknown'];

    // Parse data rows
    const papers: Omit<Paper, 'id'>[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      try {
        const fields = parseCsvLine(line);
        
        if (fields.length !== headers.length) {
          throw new Error(`Row ${i + 1}: Expected ${headers.length} fields, got ${fields.length}`);
        }

        // Helper to safely get field value
        const getField = (index: number, fieldName: string): string => {
          const value = fields[index];
          if (value === undefined) {
            throw new Error(`Row ${i + 1}: Missing field "${fieldName}"`);
          }
          return value;
        };

        const paper: Omit<Paper, 'id'> = {
          round: validateField(getField(indices.round, 'Round'), ROUNDS, 'Round'),
          direction: validateField(getField(indices.direction, 'Direction'), DIRECTIONS, 'Direction'),
          authors: getField(indices.authors, 'Authors').trim(),
          year: parseInt(getField(indices.year, 'Year').trim(), 10),
          title: getField(indices.title, 'Title').trim(),
          journal: getField(indices.journal, 'Journal').trim(),
          typeOfSource: validateField(getField(indices.typeOfSource, 'Source Type'), SOURCES, 'Source Type'),
          keywords: getField(indices.keywords, 'Keywords').trim(),
          relevance: validateField(getField(indices.relevance, 'Relevance'), RELEVANCE, 'Relevance'),
          included: validateField(getField(indices.included, 'Included'), INCLUDED, 'Included'),
          notes: getField(indices.notes, 'Notes').trim(),
          doi: getField(indices.doi, 'DOI').trim(),
        };

        // Validate required fields
        if (!paper.title || !paper.authors) {
          throw new Error(`Row ${i + 1}: Title and Authors are required`);
        }

        if (isNaN(paper.year) || paper.year < 1900 || paper.year > 2100) {
          throw new Error(`Row ${i + 1}: Invalid year "${getField(indices.year, 'Year')}"`);
        }

        papers.push(paper);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : `Row ${i + 1}: Unknown error`;
        errors.push(errorMessage);
      }
    }

    if (errors.length > 0) {
      throw new Error(`CSV import errors:\n${errors.join('\n')}`);
    }

    return papers;
  };

  /**
   * Triggers file picker and imports papers from CSV
   */
  const importFromCSV = (): Promise<Omit<Paper, 'id'>[]> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const content = e.target?.result as string;
            const papers = parseCsvContent(content);
            console.log(`Successfully parsed ${papers.length} papers from CSV`);
            resolve(papers);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to parse CSV';
            console.error('CSV import error:', errorMessage);
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    });
  };

  return {
    importFromCSV,
    parseCsvContent,
  };
};
