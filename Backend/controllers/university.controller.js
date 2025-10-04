// controllers/university.controller.js
const University = require('../models/university.model');
const Program = require('../models/program.model');
const Course = require('../models/course.model');
const ExamType = require('../models/examType.model');
const Question = require('../models/question.model');

// ================== CREATE UNIVERSITY ==================
exports.createUniversity = async (req, res) => {
  try {
    const university = await University.create(req.body);
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
    const { search, location, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const skip = (page - 1) * limit;
    const sortOption = sort ? sort.split(',').join(' ') : '-createdAt';

    const universities = await University.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: 'programs',
        select: 'name description duration faculty isActive',
        populate: {
          path: 'courses',
          select: 'name code creditHours semester',
          populate: {
            path: 'examTypes',
            select: 'type price'
          }
        }
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
        path: 'programs',
        select: 'name description duration faculty isActive',
        populate: {
          path: 'courses',
          select: 'name code creditHours semester',
          populate: {
            path: 'examTypes',
            select: 'type price'
          }
        }
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
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
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
          createdAt: 1,
          totalPrograms: { $size: '$programs' }
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
