const Ticket = require('../models/Ticket');

// @desc    Create ticket
// @route   POST /api/tickets
// @access  Private/Client
const createTicket = async (req, res) => {
  try {
    const {
      title, category, priority, description,
      device, site, portalModule, screenshots
    } = req.body;

    const ticket = await Ticket.create({
      title,
      category,
      priority,
      description,
      device: device || null,
      site: site || null,
      portalModule: portalModule || null,
      screenshots: screenshots || [],
      raisedBy: req.user._id
    });

    res.status(201).json(ticket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private/Admin/Engineer
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('device', 'deviceId deviceName')
      .populate('site', 'siteName')
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my tickets
// @route   GET /api/tickets/my
// @access  Private/Client
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ raisedBy: req.user._id })
      .populate('device', 'deviceId deviceName')
      .populate('site', 'siteName')
      .sort({ createdAt: -1 });

    res.json(tickets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ticket by id
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('device', 'deviceId deviceName')
      .populate('site', 'siteName')
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign ticket to engineer
// @route   PUT /api/tickets/:id/assign
// @access  Private/Admin
const assignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.assignedTo = req.body.assignedTo;
    ticket.status = 'assigned';
    ticket.updates.push({
      text: 'Ticket assigned to engineer',
      updatedBy: req.user._id
    });

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin/Engineer
const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = req.body.status;
    ticket.updates.push({
      text: 'Status updated to ' + req.body.status,
      updatedBy: req.user._id
    });

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add update/comment to ticket
// @route   PUT /api/tickets/:id/update
// @access  Private
const addTicketUpdate = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.updates.push({
      text: req.body.text,
      updatedBy: req.user._id
    });

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close ticket
// @route   PUT /api/tickets/:id/close
// @access  Private/Client
const closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = 'closed';
    ticket.updates.push({
      text: 'Ticket closed by client',
      updatedBy: req.user._id
    });

    const closedTicket = await ticket.save();
    res.json(closedTicket);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  addTicketUpdate,
  closeTicket
};