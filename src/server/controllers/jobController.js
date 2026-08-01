const Job = require('../models/Job');
const Application = require('../models/Application');
const fs = require('fs');

// @desc    Get all jobs (with search, filter, pagination)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, location, employmentType, skills, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    // Search by text (title, company, skills)
    if (search) {
      query.$text = { $search: search };
    }

    // Exact or regex match filters
    if (location) query.location = { $regex: location, $options: 'i' };
    if (employmentType) query.employmentType = employmentType;
    if (skills) query.skills = { $regex: skills, $options: 'i' };

    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('employer', 'name email');

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
  try {
    req.body.employer = req.user.id;
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Make sure user owns job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Make sure user owns job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to delete this job' });
    }

    await job.deleteOne();
    
    // Find all applications for this job to delete their associated resume files
    const applications = await Application.find({ job: req.params.id });
    for (const app of applications) {
      if (app.resume && app.resume.path) {
        try { fs.unlinkSync(app.resume.path); } catch (e) { /* ignore */ }
      }
    }
    
    // Also delete all applications for this job from database
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({ success: true, message: 'Job and related applications deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get employer's posted jobs
// @route   GET /api/jobs/employer/myjobs
// @access  Private (Employer only)
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    next(err);
  }
};
