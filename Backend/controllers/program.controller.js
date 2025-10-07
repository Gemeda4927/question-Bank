const Program = require('../models/program.model');
const Department = require('../models/department.model');

// ======================== CREATE PROGRAM ========================
exports.createProgram = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      departmentId,
      courses,
      durationInYears,
      level,
      creditRequirement,
      enrollmentLimit,
      isFeatured,
    } = req.body;

    if (!departmentId) {
      return res.status(400).json({ status: 'fail', message: 'departmentId is required' });
    }

    const program = await Program.create({
      name,
      code,
      description,
      departmentId,
      courses: courses || null,
      durationInYears,
      level,
      creditRequirement,
      enrollmentLimit,
      isFeatured: isFeatured || false,
    });

    // Add program to department
    await Department.findByIdAndUpdate(departmentId, {
      $push: { programs: program._id },
    });

    res.status(201).json({
      status: 'success',
      message: '🎉 Program created successfully!',
      data: program,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL PROGRAMS ========================
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isDeleted: false })
      .populate('departmentId', 'name code')
      .populate('courses', 'name code')
      .populate('students', 'name email'); // optional

    res.status(200).json({
      status: 'success',
      results: programs.length,
      data: programs,
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET PROGRAM BY ID ========================
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('departmentId', 'name code')
      .populate('courses', 'name code')
      .populate('students', 'name email');

    if (!program || program.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Program not found' });
    }

    res.status(200).json({ status: 'success', data: program });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== UPDATE PROGRAM ========================
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('departmentId', 'name code')
      .populate('courses', 'name code')
      .populate('students', 'name email');

    if (!program || program.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Program not found' });
    }

    res.status(200).json({ status: 'success', message: '✅ Program updated', data: program });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== SOFT DELETE PROGRAM ========================
exports.softDeleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!program) return res.status(404).json({ status: 'fail', message: 'Program not found' });

    res.status(200).json({ status: 'success', message: '🗑️ Program soft-deleted', data: program });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== RESTORE PROGRAM ========================
exports.restoreProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!program) return res.status(404).json({ status: 'fail', message: 'Program not found' });

    res.status(200).json({ status: 'success', message: '♻️ Program restored', data: program });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE PROGRAM ========================
exports.hardDeleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) return res.status(404).json({ status: 'fail', message: 'Program not found' });

    res.status(200).json({ status: 'success', message: '❌ Program permanently deleted' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== STUDENT SUBSCRIBE TO PROGRAM ========================
exports.subscribeStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const program = await Program.findById(req.params.id);
    if (!program || program.isDeleted) return res.status(404).json({ status: 'fail', message: 'Program not found' });

    if (program.students.includes(studentId)) {
      return res.status(400).json({ status: 'fail', message: 'Student already enrolled in this program' });
    }

    program.students.push(studentId);
    await program.save();

    res.status(200).json({ status: 'success', message: 'Student subscribed successfully', data: program });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
