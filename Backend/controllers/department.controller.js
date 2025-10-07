const Department = require('../models/department.model');

// ======================== CREATE DEPARTMENT ========================
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, universityId, programs } = req.body;

    if (!universityId) {
      return res.status(400).json({
        status: 'fail',
        message: 'universityId is required',
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      universityId,
      programs: programs || [],
    });

    res.status(201).json({
      status: 'success',
      message: '🎉 Department created successfully!',
      data: department,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL DEPARTMENTS ========================
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isDeleted: false })
      .populate('universityId', 'name location')
      .populate('programs', 'name code');

    res.status(200).json({
      status: 'success',
      results: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET DEPARTMENT BY ID ========================
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('universityId', 'name location')
      .populate('programs', 'name code');

    if (!department || department.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE DEPARTMENT ========================
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('universityId', 'name location')
      .populate('programs', 'name code');

    if (!department || department.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', message: '✅ Department updated', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SOFT DELETE DEPARTMENT ========================
exports.softDeleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', message: '🗑️ Department soft-deleted', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE DEPARTMENT ========================
exports.restoreDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', message: '♻️ Department restored', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE DEPARTMENT ========================
exports.hardDeleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', message: '❌ Department permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
