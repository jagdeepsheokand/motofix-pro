const Customer = require('../models/customer.model');
const Vehicle = require('../models/vehicle.model');
const RepairJob = require('../models/repairJob.model');
const Inventory = require('../models/inventory.model');
const Invoice = require('../models/invoice.model');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 🔍 Debug logging
    console.log('🔍 Dashboard Request - User ID:', userId);
    console.log('🔍 Date Range:', {
      start: firstDayOfMonth,
      end: firstDayOfNextMonth
    });

    // Run all queries in parallel
    const [
      customers,
      vehicles,
      activeJobs,
      completedJobs,
      pendingPayments,
      lowStockCount,
      monthlyRevenueAgg
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
        paymentStatus: { $ne: 'PAID' }
      }),
      
      // ✅ FIXED: Low Stock Query
      Inventory.countDocuments({
        createdBy: userId,
        $expr: { $lte: ['$quantity', '$minimumStock'] }
      }).catch(err => {
        console.error('❌ Low stock query error:', err);
        return 0;
      }),
      
      // Monthly Revenue
      Invoice.aggregate([
        {
          $match: {
            createdBy: userId,
            createdAt: {
              $gte: firstDayOfMonth,
              $lt: firstDayOfNextMonth
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }  // ← Using 'total' field from Invoice
          }
        }
      ]).then(r => {
        console.log('🔍 Monthly revenue result:', JSON.stringify(r));
        return r[0] ? r[0].total : 0;
      }).catch(err => {
        console.error('❌ Revenue query error:', err);
        return 0;
      })
    ]);

    // 🔍 Debug logging
    console.log('📊 Dashboard Results:', {
      customers,
      vehicles,
      activeJobs,
      completedJobs,
      pendingPayments,
      lowStockItems: lowStockCount,
      monthlyRevenue: monthlyRevenueAgg
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
        monthlyRevenue: monthlyRevenueAgg
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