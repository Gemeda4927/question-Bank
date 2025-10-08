const Program = require('../models/program.model');
const Faculty = require('../models/faculty.model');

// ======================== CREATE PROGRAM ========================
exports.createProgram = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      faculty,
      courses,
      type,
      level
    } = req.body;

    if (!faculty) {
      return res.status(400).json({ status: 'fail', message: 'Faculty is required' });
    }

    const program = await Program.create({
      name,
      code,
      description,
      faculty,
      courses: courses || [],
      type: type || 'Undergraduate',
      level: level || '1'
    });

    // Add program to faculty
    await Faculty.findByIdAndUpdate(faculty, {
      $push: { programs: program._id }
    });

    res.status(201).json({
      status: 'success',
      message: '🎉 Program created successfully!',
      data: program
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET ALL PROGRAMS ========================
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isDeleted: false })
      .populate('faculty', 'name code')
      .populate('courses', 'name code');

    res.status(200).json({
      status: 'success',
      results: programs.length,
      data: programs
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== GET PROGRAM BY ID ========================
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('faculty', 'name code')
      .populate('courses', 'name code');

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
    const { name, code, description, faculty, courses, type, level } = req.body;

    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { name, code, description, faculty, courses, type, level },
      { new: true, runValidators: true }
    )
      .populate('faculty', 'name code')
      .populate('courses', 'name code');

    if (!program || program.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Program not found' });
    }

    res.status(200).json({
      status: 'success',
      message: '✅ Program updated successfully',
      data: program
    });
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

    res.status(200).json({
      status: 'success',
      message: '🗑️ Program soft-deleted',
      data: program
    });
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

    res.status(200).json({
      status: 'success',
      message: '♻️ Program restored',
      data: program
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// ======================== HARD DELETE PROGRAM ========================
exports.hardDeleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) return res.status(404).json({ status: 'fail', message: 'Program not found' });

    res.status(200).json({
      status: 'success',
      message: '❌ Program permanently deleted'
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
