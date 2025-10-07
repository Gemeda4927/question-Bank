const User = require('../models/user.mode');

// ====================== CREATE USER ======================
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const user = await User.findById(newUser._id); // return full user including subscriptions
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET ALL USERS ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET USER BY ID ======================
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== UPDATE USER ======================
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== SOFT DELETE USER ======================
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User soft-deleted successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== RESTORE SOFT-DELETED USER ======================
exports.restoreUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User restored successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== HARD DELETE USER ======================
exports.hardDeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== GET PROFILE (LOGGED-IN USER) ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== UPDATE PROFILE (LOGGED-IN USER) ======================
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== SUBSCRIBE USER TO COURSE ======================
exports.subscribeToCourse = async (req, res) => {
  try {
    const { courseId, paymentStatus = 'paid' } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found' });

    await user.subscribeToCourse(courseId, paymentStatus);
    res.status(200).json({ success: true, message: 'Subscribed to course successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================== CHECK USER ACCESS TO COURSE/EXAM ======================
exports.checkCourseAccess = async (req, res) => {
  try {
    const { courseId, examId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted) return res.status(404).json({ success: false, message: 'User not found' });

    const hasAccess = user.hasAccessToCourse(courseId, examId);
    res.status(200).json({
      success: true,
      data: { hasAccess },
      message: hasAccess ? '✅ User has access' : '❌ User does not have access',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
