import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { WageRecord } from './schema.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load raw CSV and calculate real wages
export const loadData = async (): Promise<WageRecord[]> => {
  const data: WageRecord[] = [];
  const rawPath = path.resolve(__dirname, '../../data/raw.csv'); // path to your CSV

  return new Promise((resolve, reject) => {
    fs.createReadStream(rawPath)
      .pipe(csv())
      .on('data', (row) => {
        // Calculate real wage: nominal / (CPI/100)
        const real_wage = parseFloat(row.nominal_wage) / (parseFloat(row.cpi) / 100);

        data.push({
          year: parseInt(row.year),
          nominal_wage: parseFloat(row.nominal_wage),
          cpi: parseFloat(row.cpi),
          real_wage
        });
      })
      .on('end', () => {
        console.log('Data loaded successfully:', data);
        resolve(data);
      })
      .on('error', (error) => reject(error));
  });
};