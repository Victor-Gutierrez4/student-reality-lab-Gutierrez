import React, { useMemo, useState } from 'react';
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

interface WageRecord {
  year: number;
  nominal_wage: number;
  cpi: number;
  real_wage: number;
}

const data: WageRecord[] = rawData as WageRecord[];

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WageChart = () => {
  const firstYear = data[0].year;
  const finalYear = data[data.length - 1].year;
  const [yearEnd, setYearEnd] = useState(finalYear);

  const filteredData = data.filter((d) => d.year <= yearEnd);
  const firstRecord = filteredData[0];
  const currentRecord = filteredData[filteredData.length - 1];
  const realChange = currentRecord.real_wage - firstRecord.real_wage;
  const nominalChange = currentRecord.nominal_wage - firstRecord.nominal_wage;

  const chartData = useMemo(
    () => ({
      labels: filteredData.map((d) => d.year),
      datasets: [
        {
          label: 'Nominal wage',
          data: filteredData.map((d) => d.nominal_wage),
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
        },
        {
          label: 'Real wage (inflation-adjusted)',
          data: filteredData.map((d) => d.real_wage),
          borderColor: '#0f766e',
          backgroundColor: '#0f766e',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
        },
      ],
    }),
    [filteredData]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: $${context.parsed.y.toFixed(2)}/hour`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Hourly wage in dollars',
        },
        ticks: {
          callback: (value: string | number) => `$${value}`,
        },
      },
    },
  };

  return (
    <section className="chart-panel" aria-labelledby="chart-heading">
      <div className="section-kicker">View 1</div>
      <h2 id="chart-heading">Student wages vs. inflation</h2>
      <p>
        Use the slider to stop the story at any year and compare the face-value
        wage with the inflation-adjusted wage.
      </p>

      <div className="chart-frame">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="slider-control">
        <label htmlFor="year-end">
          End year: <strong>{yearEnd}</strong>
        </label>
        <input
          id="year-end"
          type="range"
          min={firstYear}
          max={finalYear}
          value={yearEnd}
          onChange={(e) => setYearEnd(parseInt(e.target.value))}
        />
      </div>

      <aside className="data-callout" aria-label="Chart annotation">
        <strong>Annotation: {firstYear} to {yearEnd}</strong>
        <span>
          Nominal wages are up ${nominalChange.toFixed(2)}/hour, but real wages
          are up only ${realChange.toFixed(2)}/hour after inflation.
        </span>
      </aside>
    </section>
  );
};

export default WageChart;
