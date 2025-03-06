import axios from 'axios';



const API_URL = import.meta.env.VITE_API_URL;
// const API_BASE_URL = 'https://roxilerassignment-rakeshgowda.onrender.com/api';
// // const API_BASE_URL ='roxiler-assignment-rakesh-gowda.vercel.app';

export const API_BASE_URL = async () => {
  const response = await fetch(`${API_URL}/api`);
  return response.json();
};



export interface Transaction {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sold: boolean;
  dateOfSale: string; // Changed from Date to string
  image: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Statistics {
  totalSale: number;
  soldItems: number;
  notSoldItems: number;
}

export interface ChartDataPoint {
  range?: string;
  category?: string;
  count: number;
}

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data || error.message);
  } else {
    console.error('Error:', error);
  }
};

export const getTransactions = async (month: string, search: string = '', page: number = 1): Promise<TransactionResponse> => {
  try {
    const { data } = await axios.get<TransactionResponse>(`${API_BASE_URL}/transactions`, {
      params: { month, search, page }
    });
    
    // Ensure dates are strings
    return {
      ...data,
      transactions: data.transactions.map(transaction => ({
        ...transaction,
        dateOfSale: new Date(transaction.dateOfSale).toISOString()
      }))
    };
  } catch (error) {
    handleAxiosError(error);
    return {
      transactions: [],
      total: 0,
      page: 1,
      totalPages: 1
    };
  }
};

export const getStatistics = async (month: string): Promise<Statistics> => {
  try {
    const { data } = await axios.get<Statistics>(`${API_BASE_URL}/statistics`, {
      params: { month }
    });
    return {
      totalSale: Number(data.totalSale),
      soldItems: Number(data.soldItems),
      notSoldItems: Number(data.notSoldItems)
    };
  } catch (error) {
    handleAxiosError(error);
    return {
      totalSale: 0,
      soldItems: 0,
      notSoldItems: 0
    };
  }
};

export const getBarChartData = async (month: string): Promise<ChartDataPoint[]> => {
  try {
    const { data } = await axios.get<ChartDataPoint[]>(`${API_BASE_URL}/bar-chart`, {
      params: { month }
    });
    return data.map(point => ({
      range: point.range || '',
      count: Number(point.count)
    }));
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const getPieChartData = async (month: string): Promise<ChartDataPoint[]> => {
  try {
    const { data } = await axios.get<ChartDataPoint[]>(`${API_BASE_URL}/pie-chart`, {
      params: { month }
    });
    return data.map(point => ({
      category: point.category || '',
      count: Number(point.count)
    }));
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
};

export const getCombinedData = async (month: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/combined`, {
      params: { month }
    });
    return {
      transactions: {
        ...data.transactions,
        transactions: data.transactions.transactions.map((t: Transaction) => ({
          ...t,
          dateOfSale: new Date(t.dateOfSale).toISOString()
        }))
      },
      statistics: {
        totalSale: Number(data.statistics.totalSale),
        soldItems: Number(data.statistics.soldItems),
        notSoldItems: Number(data.statistics.notSoldItems)
      },
      barChart: data.barChart.map((point: ChartDataPoint) => ({
        range: point.range || '',
        count: Number(point.count)
      })),
      pieChart: data.pieChart.map((point: ChartDataPoint) => ({
        category: point.category || '',
        count: Number(point.count)
      }))
    };
  } catch (error) {
    handleAxiosError(error);
    return {
      transactions: { transactions: [], total: 0, page: 1, totalPages: 1 },
      statistics: { totalSale: 0, soldItems: 0, notSoldItems: 0 },
      barChart: [],
      pieChart: []
    };
  }
};
