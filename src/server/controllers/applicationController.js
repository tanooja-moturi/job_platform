const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Job Seeker only)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      // Remove uploaded file if job not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied (backend validation)
    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existingApplication) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      employer: job.employer,
      coverLetter,
      resume: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (err) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
    }
    next(err);
  }
};

// @desc    Get job seeker's applications
// @route   GET /api/applications/my
// @access  Private (Job Seeker only)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location employmentType')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private (Employer only)
exports.getEmployerApplications = async (req, res, next) => {
  try {
    const query = { employer: req.user.id };
    if (req.query.jobId) {
      query.job = req.query.jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership
    if (application.employer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: 'Application status updated', application });
  } catch (err) {
    next(err);
  }
};

// @desc    Securely view/download applicant resume
// @route   GET /api/applications/:id/resume
// @access  Private (Employer of the job, or Applicant)
exports.getResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check authorization: must be the employer who owns the job OR the applicant
    if (application.employer.toString() !== req.user.id && application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this resume' });
    }

    const filePath = application.resume.path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on server' });
    }

    res.setHeader('Content-Type', application.resume.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${application.resume.originalName}"`);
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};
