const University = require('../models/university.model');

// ================== CREATE UNIVERSITY ==================
exports.createUniversity = async (req, res) => {
  try {
    const { name, location, description, type, mode, colleges } = req.body;

    const university = await University.create({
      name,
      location,
      description,
      type,      // "Public" or "Private"
      mode,      // "Sync" or "Async"
      colleges: colleges || [] // allow empty array
    });

    res.status(201).json({
      status: 'success',
      message: '🎉 University created successfully!',
      data: university
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET ALL UNIVERSITIES ==================
exports.getAllUniversities = async (req, res) => {
  try {
    const { search, location, type, mode, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (mode) query.mode = mode;

    const skip = (page - 1) * limit;
    const sortOption = sort ? sort.split(',').join(' ') : '-createdAt';

    const universities = await University.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'colleges',
        select: 'name code description',
        options: { sort: { name: 1 } } // optional sorting
      });

    const total = await University.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: universities.length,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total
      },
      data: universities
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== GET SINGLE UNIVERSITY ==================
exports.getUniversity = async (req, res) => {
  try {
    const university = await University.findById(req.params.id)
      .populate({
        path: 'colleges',
        select: 'name code description'
      });

    if (!university || university.isDeleted) {
      return res.status(404).json({ status: 'fail', message: 'University not found' });
    }

    res.status(200).json({
      status: 'success',
      data: university
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== UPDATE UNIVERSITY ==================
exports.updateUniversity = async (req, res) => {
  try {
    const { name, location, description, type, mode, colleges } = req.body;

    const university = await University.findByIdAndUpdate(
      req.params.id,
      { name, location, description, type, mode, colleges: colleges || [] },
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({ status: 'fail', message: 'University not found' });
    }

    res.status(200).json({
      status: 'success',
      message: '✅ University updated successfully',
      data: university
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== SOFT DELETE ==================
exports.softDeleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    if (!university) {
      return res.status(404).json({ status: 'fail', message: 'University not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `🗑️ ${university.name} has been soft deleted`,
      data: university
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== RESTORE UNIVERSITY ==================
exports.restoreUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!university) {
      return res.status(404).json({ status: 'fail', message: 'University not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `♻️ ${university.name} has been restored successfully`,
      data: university
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== HARD DELETE ==================
exports.hardDeleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);

    if (!university) {
      return res.status(404).json({ status: 'fail', message: 'University not found' });
    }

    res.status(200).json({
      status: 'success',
      message: `❌ ${university.name} permanently deleted`
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};

// ================== UNIVERSITY STATISTICS ==================
exports.getUniversityStats = async (req, res) => {
  try {
    const stats = await University.aggregate([
      { $match: { isDeleted: false } },
      {
        $project: {
          name: 1,
          location: 1,
          type: 1,
          mode: 1,
          createdAt: 1,
          totalColleges: { $size: '$colleges' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      message: '📊 University stats generated',
      data: stats
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error: error.message });
  }
};
