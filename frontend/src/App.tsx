import React, { useState, useEffect } from 'react';
import {
  Table,
  MonthSelector,
  SearchBar,
  Statistics,
  BarChart,
  PieChart,
  Pagination
} from './components';
import { getTransactions, getStatistics, getBarChartData, getPieChartData } from './services/api';
import type { Transaction, Statistics as StatisticsData, ChartDataPoint } from './services/api';

function App() {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [barChartData, setBarChartData] = useState<ChartDataPoint[]>([]);
  const [pieChartData, setPieChartData] = useState<ChartDataPoint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [transData, statsData, barData, pieData] = await Promise.all([
          getTransactions(month, search, page),
          getStatistics(month),
          getBarChartData(month),
          getPieChartData(month)
        ]);

        if (!isMounted) return;

        setTransactions(transData.transactions);
        setTotalPages(transData.totalPages);
        setStatistics(statsData);
        setBarChartData(barData);
        setPieChartData(pieData);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [month, search, page]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Transaction Dashboard</h1>
        
        <div className="flex justify-between items-center mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <MonthSelector value={month} onChange={setMonth} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <Statistics data={statistics} month={month} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <BarChart data={barChartData} />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <PieChart data={pieChartData} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <Table transactions={transactions} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;