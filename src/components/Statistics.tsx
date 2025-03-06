import React from 'react';

interface StatisticsProps {
  data: {
    totalSale: number;
    soldItems: number;
    notSoldItems: number;
  } | null;
  month: string;
}

const Statistics: React.FC<StatisticsProps> = ({ data, month }) => {
  if (!data) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Statistics - {month}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">Total Sale</h3>
          <p className="text-2xl font-bold text-yellow-900">${data.totalSale.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Total Sold Items</h3>
          <p className="text-2xl font-bold text-green-900">{data.soldItems}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Total Not Sold Items</h3>
          <p className="text-2xl font-bold text-red-900">{data.notSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;