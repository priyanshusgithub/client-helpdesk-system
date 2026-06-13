const Site = require('../models/Site');

// @desc    Get all sites
// @route   GET /api/sites
// @access  Private/Admin
const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find()
      .populate('assignedClient', 'name email phone');
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single site
// @route   GET /api/sites/:id
// @access  Private/Admin
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id)
      .populate('assignedClient', 'name email phone');
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create site
// @route   POST /api/sites
// @access  Private/Admin
const createSite = async (req, res) => {
  try {
    const { siteName, email, phone, address, assignedClient } = req.body;

    const site = await Site.create({
      siteName,
      email,
      phone,
      address,
      assignedClient: assignedClient || null
    });

    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update site
// @route   PUT /api/sites/:id
// @access  Private/Admin
const updateSite = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    const { siteName, email, phone, address, assignedClient } = req.body;

    site.siteName = siteName || site.siteName;
    site.email = email || site.email;
    site.phone = phone || site.phone;
    site.address = address || site.address;
    if (assignedClient !== undefined) site.assignedClient = assignedClient;

    const updatedSite = await site.save();
    res.json(updatedSite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete site
// @route   DELETE /api/sites/:id
// @access  Private/Admin
const deleteSite = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    await site.deleteOne();
    res.json({ message: 'Site removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSites,
  getSiteById,
  createSite,
  updateSite,
  deleteSite
};