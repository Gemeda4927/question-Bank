const Department = require('../models/department.model');

// ======================== CREATE DEPARTMENT ========================
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, university } = req.body;

    const department = await Department.create({
      name,
      code,
      description,
      university
    });

    res.status(201).json({
      status: 'success',
      data: department
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// ======================== GET ALL DEPARTMENTS ========================
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isDeleted: false }).populate('university');
    res.status(200).json({
      status: 'success',
      results: departments.length,
      data: departments
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET DEPARTMENT BY ID ========================
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('university programs');
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
      runValidators: true
    });

    if (!department || department.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Department not found' });
    }

    res.status(200).json({ status: 'success', data: department });
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

    res.status(200).json({ status: 'success', message: 'Department soft-deleted', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE SOFT-DELETED DEPARTMENT ========================
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

    res.status(200).json({ status: 'success', message: 'Department restored', data: department });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
