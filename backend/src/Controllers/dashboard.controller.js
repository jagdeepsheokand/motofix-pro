const Customer = require('../models/customer.model');
const Vehicle = require('../models/vehicle.model');
const RepairJob = require('../models/repairJob.model');
const Inventory = require('../models/inventory.model');
const Invoice = require('../models/invoice.model');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    console.log('🔍 Dashboard Request - User ID:', userId);

    // Revenue Chart Query (Last 6 months)
    const revenueChartPromise = Invoice.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          paymentStatus: "Paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              "$_id.month"
            ]
          },
          revenue: 1
        }
      }
    ]);

    // Run all queries in parallel
    const [
      customers,
      vehicles,
      activeJobs,
      completedJobs,
      pendingPayments,
      lowStockCount,
      monthlyRevenueResult,
      revenueChart
    ] = await Promise.all([
      Customer.countDocuments({ createdBy: userId }),
      Vehicle.countDocuments({ createdBy: userId }),
      RepairJob.countDocuments({
        createdBy: userId,
        status: { $in: ['PENDING', 'DIAGNOSIS', 'IN_PROGRESS'] }
      }),
      RepairJob.countDocuments({
        createdBy: userId,
        status: 'COMPLETED'
      }),
      Invoice.countDocuments({
        createdBy: userId,
        paymentStatus: { $in: ['Pending', 'Partially Paid'] }
      }),

      // Low Stock
      Inventory.countDocuments({
        createdBy: userId,
        $expr: { $lte: ['$quantity', '$minimumStock'] }
      }).catch(() => 0),

      // Current Month Revenue
      Invoice.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(userId),
            paymentStatus: "Paid",
            createdAt: { $gte: firstDayOfMonth, $lt: firstDayOfNextMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).then(r => r[0]?.total || 0),

      // Revenue Chart (Last 6 Months)
      revenueChartPromise
    ]);

    const monthlyRevenue = monthlyRevenueResult || 0;

    // Debug log
    console.log('📊 Dashboard Results:', {
      customers,
      vehicles,
      activeJobs,
      completedJobs,
      pendingPayments,
      lowStockItems: lowStockCount,
      monthlyRevenue,
      revenueChartCount: revenueChart?.length || 0
    });

    res.status(200).json({
      success: true,
      data: {
        customers,
        vehicles,
        activeJobs,
        completedJobs,
        lowStockItems: lowStockCount,
        pendingPayments,
        monthlyRevenue,
        revenueChart: revenueChart || []   // ← Always returns array
      }
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      details: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};