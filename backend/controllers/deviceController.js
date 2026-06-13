const Device = require('../models/Device');

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private/Admin
const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find()
      .populate('site', 'siteName address');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get devices by site
// @route   GET /api/devices/site/:siteId
// @access  Private/Admin
const getDevicesBySite = async (req, res) => {
  try {
    const devices = await Device.find({ site: req.params.siteId })
      .populate('site', 'siteName address');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private/Admin
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('site', 'siteName address');
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create device
// @route   POST /api/devices
// @access  Private/Admin
const createDevice = async (req, res) => {
  try {
    const { deviceId, deviceName, softwareVersion, site, status } = req.body;

    // Check if deviceId already exists
    const deviceExists = await Device.findOne({ deviceId });
    if (deviceExists) {
      return res.status(400).json({ message: 'Device ID already exists' });
    }

    const device = await Device.create({
      deviceId,
      deviceName,
      softwareVersion,
      site: site || null,
      status: status || 'offline'
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private/Admin
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const { deviceName, softwareVersion, site, status, isActive } = req.body;

    device.deviceName = deviceName || device.deviceName;
    device.softwareVersion = softwareVersion || device.softwareVersion;
    if (site !== undefined) device.site = site;
    if (status) device.status = status;
    if (isActive !== undefined) device.isActive = isActive;

    const updatedDevice = await device.save();
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private/Admin
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    await device.deleteOne();
    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDevices,
  getDevicesBySite,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
};