import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: Array<{
    category: string;
    count: number;
  }>;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const colors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)'
  ];

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color.replace('0.5', '1')),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Category Distribution'
      }
    }
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;