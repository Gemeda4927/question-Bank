const Program = require('../models/course.model');
const University = require('../models/university.model');

// ======================= CREATE PROGRAM =======================
exports.createProgram = async (req, res) => {
  try {
    const { name, description, universityId, level, duration, eligibility, careerPaths, isFeatured } = req.body;

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    const program = await Program.create({
      name,
      description,
      university: universityId,
      level: level || 'Bachelor',
      duration: duration || '4 years',
      eligibility: eligibility || 'High School Diploma',
      careerPaths: careerPaths || ['Undecided'],
      isFeatured: isFeatured || false
    });

    // Add program to university's programs array
    university.programs.push(program._id);
    await university.save();

    // Populate university and subscribers for response
    const populatedProgram = await Program.findById(program._id)
      .populate('university', 'name location')
      .populate('subscribers.student', 'name email')
      .populate('examAccess.examId', 'name examType');

    res.status(201).json({ message: 'Program created successfully', program: populatedProgram });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= GET ALL PROGRAMS =======================
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isDeleted: false })
      .populate('university', 'name location')
      .populate('subscribers.student', 'name email')
      .populate('examAccess.examId', 'name examType');

    res.status(200).json({ programs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= GET SINGLE PROGRAM =======================
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('university', 'name location')
      .populate('subscribers.student', 'name email')
      .populate('examAccess.examId', 'name examType');

    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= UPDATE PROGRAM =======================
exports.updateProgram = async (req, res) => {
  try {
    const { name, description, level, duration, eligibility, careerPaths, isFeatured } = req.body;
    const program = await Program.findById(req.params.id);

    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    if (name) program.name = name;
    if (description) program.description = description;
    if (level) program.level = level;
    if (duration) program.duration = duration;
    if (eligibility) program.eligibility = eligibility;
    if (careerPaths) program.careerPaths = careerPaths;
    if (isFeatured !== undefined) program.isFeatured = isFeatured;

    program.updatedAt = Date.now();
    await program.save();

    const populatedProgram = await Program.findById(program._id)
      .populate('university', 'name location')
      .populate('subscribers.student', 'name email')
      .populate('examAccess.examId', 'name examType');

    res.status(200).json({ message: 'Program updated successfully', program: populatedProgram });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= SOFT DELETE PROGRAM =======================
exports.softDeleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    program.isDeleted = true;
    program.deletedAt = Date.now();
    await program.save();

    res.status(200).json({ message: 'Program soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= RESTORE PROGRAM =======================
exports.restoreProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program || !program.isDeleted) {
      return res.status(404).json({ message: 'Program not found or not deleted' });
    }

    program.isDeleted = false;
    program.deletedAt = null;
    await program.save();

    const populatedProgram = await Program.findById(program._id)
      .populate('university', 'name location')
      .populate('subscribers.student', 'name email')
      .populate('examAccess.examId', 'name examType');

    res.status(200).json({ message: 'Program restored successfully', program: populatedProgram });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= HARD DELETE PROGRAM =======================
exports.hardDeleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Remove program reference from university
    await University.findByIdAndUpdate(program.university, {
      $pull: { programs: program._id }
    });

    res.status(200).json({ message: 'Program permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
