const College = require('../models/college.model');
const University = require('../models/university.model');


exports.createCollege = async (req, res) => {
  try {
    const { name, code, description, university, faculties } = req.body;

    // 1️⃣ Create college
    const college = await College.create({
      name,
      code,
      description,
      university,
      faculties: faculties || []
    });

    // 2️⃣ Push college ID to university.colleges
    await University.findByIdAndUpdate(university, {
      $addToSet: { colleges: college._id }
    });

    res.status(201).json({
      status: 'success',
      message: '🎓 College created and linked to university successfully!',
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET ALL COLLEGES ==================
exports.getAllColleges = async (req, res) => {
  try {
    const { search, university, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (university) query.university = university;

    const skip = (page - 1) * limit;
    const sortOption = sort ? sort.split(',').join(' ') : '-createdAt';

    const colleges = await College.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'faculties',
        select: 'name code description'
      })
      .populate({
        path: 'university',
        select: 'name type mode'
      });

    const total = await College.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: colleges.length,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      },
      data: colleges
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET SINGLE COLLEGE ==================
exports.getCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate({
        path: 'faculties',
        select: 'name code description'
      })
      .populate({
        path: 'university',
        select: 'name type mode'
      });

    if (!college || college.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    res.status(200).json({
      status: 'success',
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== UPDATE COLLEGE ==================
exports.updateCollege = async (req, res) => {
  try {
    const { name, code, description, university, faculties } = req.body;

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { name, code, description, university, faculties: faculties || [] },
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    // Update university.colleges reference if university changed
    if (university && college.university.toString() !== university) {
      await University.findByIdAndUpdate(college.university, {
        $pull: { colleges: college._id }
      });
      await University.findByIdAndUpdate(university, {
        $addToSet: { colleges: college._id }
      });
    }

    res.status(200).json({
      status: 'success',
      message: '✅ College updated successfully',
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== PUSH FACULTY TO COLLEGE ==================
exports.addFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { faculties: facultyId } }, // avoid duplicates
      { new: true }
    ).populate('faculties', 'name code description');

    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    res.status(200).json({
      status: 'success',
      message: '🎯 Faculty added to college successfully',
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== SOFT DELETE ==================
exports.softDeleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `🗑️ ${college.name} has been soft deleted`,
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== RESTORE COLLEGE ==================
exports.restoreCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `♻️ ${college.name} has been restored successfully`,
      data: college
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== HARD DELETE ==================
exports.hardDeleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({ status: 'fail', message: 'College not found' });
    }

    // Remove from university.colleges
    await University.findByIdAndUpdate(college.university, {
      $pull: { colleges: college._id }
    });

    res.status(200).json({
      status: 'success',
      message: `❌ ${college.name} permanently deleted`
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== COLLEGE STATISTICS ==================
exports.getCollegeStats = async (req, res) => {
  try {
    const stats = await College.aggregate([
      { $match: { isDeleted: false } },
      {
        $project: {
          name: 1,
          university: 1,
          createdAt: 1,
          totalFaculties: { $size: '$faculties' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      message: '📊 College stats generated',
      data: stats
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
