const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Site = require('../models/Site');
const Device = require('../models/Device');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Ticket stats
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const assignedTickets = await Ticket.countDocuments({ status: 'assigned' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });
    const highPriorityTickets = await Ticket.countDocuments({ priority: 'high' });

    // User stats
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalEngineers = await User.countDocuments({ role: 'engineer' });

    // Site and device stats
    const totalSites = await Site.countDocuments();
    const totalDevices = await Device.countDocuments();

    // Monthly ticket trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTickets = await Ticket.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

   //  lookup map from aggregation result
    const monthlyMap = new Map();

    monthlyTickets.forEach(item => {
    const key = `${item._id.year}-${item._id.month}`;
    monthlyMap.set(key, item.count);
    });

    // Final dataset with missing months filled
    const monthlyTicketsComplete = [];

    for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = `${year}-${month}`;

    monthlyTicketsComplete.push({
        _id: { month, year },
        count: monthlyMap.get(key) || 0
    });
    }

    // Category breakdown
    const categoryBreakdown = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Engineer wise ticket count
    const engineerTickets = await Ticket.aggregate([
      {
        $match: { assignedTo: { $ne: null } }
      },
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'engineer'
        }
      },
      {
        $project: {
          count: 1,
          engineerName: { $arrayElemAt: ['$engineer.name', 0] }
        }
      }
    ]);

    // Recent tickets
    const recentTickets = await Ticket.find()
      .populate('raisedBy', 'name')
      .populate('assignedTo', 'name')
      .populate('site', 'siteName')
      .sort({ createdAt: -1 })
      .limit(5);

      //console.log(monthlyTicketsComplete);

    res.json({
      ticketStats: {
        total: totalTickets,
        open: openTickets,
        assigned: assignedTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        highPriority: highPriorityTickets
      },
      userStats: {
        clients: totalClients,
        engineers: totalEngineers
      },
      siteStats: {
        total: totalSites
      },
      deviceStats: {
        total: totalDevices
      },
      monthlyTickets: monthlyTicketsComplete,
      categoryBreakdown,
      engineerTickets,
      recentTickets
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };