import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import rawData from '../data/processed.json';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// type for each record in the JSON file
interface WageRecord {
  year: number;
  nominal_wage: number;
  cpi: number;
  real_wage: number;
}

// cast imported JSON to a typed array
const data: WageRecord[] = rawData as WageRecord[];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WageChart = () => {
  // default to latest year in data (2022)
  const [yearEnd, setYearEnd] = useState(2022);

  // filter data up to selected year
  const filteredData = data.filter((d) => d.year <= yearEnd);

  const chartData = {
    labels: filteredData.map((d) => d.year),
    datasets: [
      { 
        label: 'Nominal Wage', 
        data: filteredData.map((d) => d.nominal_wage), 
        borderColor: 'blue', 
        fill: false 
      },
      { 
        label: 'Real Wage', 
        data: filteredData.map((d) => d.real_wage), 
        borderColor: 'green', 
        fill: false 
      }
    ]
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>Student Wages vs Inflation</h2>
      <Line data={chartData} />
      <div style={{ marginTop: '20px' }}>
        <label>End Year: {yearEnd}</label>
        <input
          type="range"
          min={2013}
          max={2022}
          value={yearEnd}
          onChange={(e) => setYearEnd(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <p>
        Notice: Real wage (green) stays mostly flat, while nominal wage (blue) increases. Inflation erodes gains.
      </p>
    </div>
  );
};

export default WageChart;