const User = require('../models/User');

// @desc    Get all user addresses
// @route   GET /api/users/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    res.json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault
    } = req.body;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required address fields'
      });
    }

    const user = await User.findById(req.user._id);

    // If this is the first address or isDefault is true, make it default
    if (user.addresses.length === 0 || isDefault) {
      // Remove default from other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country: country || 'India',
      isDefault: user.addresses.length === 0 ? true : (isDefault || false)
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding address',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault
    } = req.body;

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update fields
    if (fullName) address.fullName = fullName;
    if (phone) address.phone = phone;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (country) address.country = country;

    // Handle default address
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    address.remove();

    // If deleted address was default, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set this address as default
    address.isDefault = true;

    await user.save();

    res.json({
      success: true,
      message: 'Default address updated',
      data: user.addresses
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};
