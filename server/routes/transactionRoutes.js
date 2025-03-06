import express from 'express';
import {
  seedDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/seed', seedDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined', getCombinedData);

export default router;