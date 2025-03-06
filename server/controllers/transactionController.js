import Transaction from "../models/Transaction.js";
import axios from "axios";

export const seedDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      `s3.amazonaws.com/roxiler.com/product_transaction.json`
    );
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: isNaN(search) ? undefined : Number(search) },
      ].filter(Boolean);
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      transactions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    };

    const [totalSale, soldItems, notSoldItems] = await Promise.all([
      Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Transaction.countDocuments({ ...query, sold: true }),
      Transaction.countDocuments({ ...query, sold: false }),
    ]);

    res.json({
      totalSale: totalSale[0]?.total || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const result = await Promise.all(
      ranges.map(async ({ min, max }) => {
        const count = await Transaction.countDocuments({
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
          price: { $gte: min, $lt: max === Infinity ? 1000000 : max },
        });
        return {
          range: `${min}-${max === Infinity ? "above" : max}`,
          count,
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(
      result.map((item) => ({
        category: item._id,
        count: item.count,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:5000/api/transactions?month=${month}`),
      axios.get(`http://localhost:5000/api/statistics?month=${month}`),
      axios.get(`http://localhost:5000/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:5000/api/pie-chart?month=${month}`),
    ]);

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
