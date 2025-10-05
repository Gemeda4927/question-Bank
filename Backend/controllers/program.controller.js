const Program = require('../models/course.model');
const University = require('../models/university.model');

// ======================= CREATE PROGRAM =======================
exports.createProgram = async (req, res) => {
  try {
    const { name, description, universityId, courses } = req.body;

    // Check if university exists
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }

    const program = await Program.create({
      name,
      description,
      university: universityId,
      courses: courses || [] // Add courses if provided
    });

    // Add program to university's programs array
    university.programs.push(program._id);
    await university.save();

    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= GET ALL PROGRAMS =======================
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isDeleted: false })
      .populate('university', 'name location');
    res.status(200).json({ programs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= GET SINGLE PROGRAM =======================
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate('university', 'name location');
    
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
    const { name, description, courses } = req.body;
    const program = await Program.findById(req.params.id);

    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    if (name) program.name = name;
    if (description) program.description = description;
    if (courses) program.courses = courses;
    
    program.updatedAt = Date.now();

    await program.save();
    res.status(200).json({ message: 'Program updated successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= ADD COURSE TO PROGRAM =======================
exports.addCourseToProgram = async (req, res) => {
  try {
    const { name, code, description, credits } = req.body;
    const program = await Program.findById(req.params.id);

    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const newCourse = {
      name,
      code,
      description: description || '',
      credits: credits || 3
    };

    program.courses.push(newCourse);
    await program.save();

    res.status(200).json({ message: 'Course added successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================= REMOVE COURSE FROM PROGRAM =======================
exports.removeCourseFromProgram = async (req, res) => {
  try {
    const { courseId } = req.params;
    const program = await Program.findById(req.params.id);

    if (!program || program.isDeleted) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const course = program.courses.id(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isDeleted = true;
    course.deletedAt = new Date();
    await program.save();

    res.status(200).json({ message: 'Course removed successfully' });
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

    res.status(200).json({ message: 'Program restored successfully' });
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