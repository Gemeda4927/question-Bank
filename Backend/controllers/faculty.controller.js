const Faculty = require('../models/faculty.model');
const College = require('../models/college.model');

// ================== CREATE FACULTY ==================
exports.createFaculty = async (req, res) => {
  try {
    const { name, code, description, college, programs, type } = req.body;

    // 1️⃣ Create faculty
    const faculty = await Faculty.create({
      name,
      code,
      description,
      college,
      programs: programs || [],
      type: type || 'Undergraduate'
    });

    // 2️⃣ Push faculty ID to college.faculties
    await College.findByIdAndUpdate(college, {
      $addToSet: { faculties: faculty._id }
    });

    res.status(201).json({
      status: 'success',
      message: '🎓 Faculty created and linked to college successfully!',
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET ALL FACULTIES ==================
exports.getAllFaculties = async (req, res) => {
  try {
    const { search, college, type, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (college) query.college = college;
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const sortOption = sort ? sort.split(',').join(' ') : '-createdAt';

    const faculties = await Faculty.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'programs',
        select: 'name code description'
      })
      .populate({
        path: 'college',
        select: 'name code description'
      });

    const total = await Faculty.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: faculties.length,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      },
      data: faculties
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET SINGLE FACULTY ==================
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate({
        path: 'programs',
        select: 'name code description'
      })
      .populate({
        path: 'college',
        select: 'name code description'
      });

    if (!faculty || faculty.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    res.status(200).json({
      status: 'success',
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== UPDATE FACULTY ==================
exports.updateFaculty = async (req, res) => {
  try {
    const { name, code, description, college, programs, type } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { name, code, description, college, programs: programs || [], type },
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    // Update college.faculties if college changed
    if (college && faculty.college.toString() !== college) {
      await College.findByIdAndUpdate(faculty.college, {
        $pull: { faculties: faculty._id }
      });
      await College.findByIdAndUpdate(college, {
        $addToSet: { faculties: faculty._id }
      });
    }

    res.status(200).json({
      status: 'success',
      message: '✅ Faculty updated successfully',
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== PUSH PROGRAM TO FACULTY ==================
exports.addProgram = async (req, res) => {
  try {
    const { programId } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { programs: programId } }, // avoid duplicates
      { new: true }
    ).populate('programs', 'name code description');

    if (!faculty) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    res.status(200).json({
      status: 'success',
      message: '🎯 Program added to faculty successfully',
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== SOFT DELETE ==================
exports.softDeleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `🗑️ ${faculty.name} has been soft deleted`,
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== RESTORE FACULTY ==================
exports.restoreFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `♻️ ${faculty.name} has been restored successfully`,
      data: faculty
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== HARD DELETE ==================
exports.hardDeleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!faculty) {
      return res.status(404).json({ status: 'fail', message: 'Faculty not found' });
    }

    // Remove from college.faculties
    await College.findByIdAndUpdate(faculty.college, {
      $pull: { faculties: faculty._id }
    });

    res.status(200).json({
      status: 'success',
      message: `❌ ${faculty.name} permanently deleted`
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== FACULTY STATISTICS ==================
exports.getFacultyStats = async (req, res) => {
  try {
    const stats = await Faculty.aggregate([
      { $match: { isDeleted: false } },
      {
        $project: {
          name: 1,
          college: 1,
          type: 1,
          createdAt: 1,
          totalPrograms: { $size: '$programs' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      message: '📊 Faculty stats generated',
      data: stats
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
