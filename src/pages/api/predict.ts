import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';
import path from 'path';
import { promises as fs } from 'fs';

interface DataRow {
  [key: string]: string;
  'Self-care tips that might help you out': string;
}

interface Column {
  name: string;
  type: 'categorical';
  options: string[];
}

interface CacheData {
  mlData: DataRow[];
  columnInfo: Column[];
  lastUpdated: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let cache: CacheData | null = null;

async function loadAndProcessData(): Promise<CacheData> {
  const dataPath = path.join(process.cwd(), 'public', 'data.csv');
  const csvData = await fs.readFile(dataPath, 'utf-8');
  
  const parsedData = Papa.parse(csvData, { 
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim()
  });
  
  const mlData = parsedData.data as DataRow[];
  
  if (!mlData.length || !('Self-care tips that might help you out' in mlData[0])) {
    throw new Error('Invalid data structure in CSV');
  }
  
  const headers = Object.keys(mlData[0]).filter(header => 
    header !== 'Self-care tips that might help you out'
  );
  
  const columnInfo = headers.map(colname => {
    const uniqueValues = new Set<string>();
    for (const row of mlData) {
      if (row[colname]) uniqueValues.add(row[colname]);
    }
    
    return {
      name: colname,
      type: 'categorical' as const,
      options: Array.from(uniqueValues).sort()
    };
  });
  
  return {
    mlData,
    columnInfo,
    lastUpdated: Date.now()
  };
}

async function getCachedData(): Promise<CacheData> {
  if (!cache || Date.now() - cache.lastUpdated > CACHE_DURATION) {
    try {
      cache = await loadAndProcessData();
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load data');
    }
  }
  return cache;
}

function findBestMatch(userInput: Record<string, string>, mlData: DataRow[]): DataRow {
  let bestMatch = mlData[0];
  let maxScore = -1;
  
  const inputEntries = Object.entries(userInput);
  const totalFields = inputEntries.length;
  
  for (const row of mlData) {
    let score = 0;
    
    for (const [key, value] of inputEntries) {
      if (row[key] === value) {
        score++;
      }
    }
    
    const normalizedScore = score / totalFields;
    
    if (normalizedScore > maxScore) {
      maxScore = normalizedScore;
      bestMatch = row;
    }
  }
  
  return bestMatch;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { columnInfo } = await getCachedData();
      res.status(200).json({ success: true, columns: columnInfo });
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ success: false, error: 'Failed to load form structure' });
    }
  } else if (req.method === 'POST') {
    try {
      const { mlData } = await getCachedData();
      const userInput = req.body;
      
      if (!userInput || typeof userInput !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid input format' });
      }
      
      const bestMatch = findBestMatch(userInput, mlData);
      
      res.status(200).json({ 
        success: true, 
        prediction: bestMatch['Self-care tips that might help you out']
      });
    } catch (error) {
      console.error('Recommendation error:', error);
      res.status(500).json({ success: false, error: 'Failed to generate recommendation' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}