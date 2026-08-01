const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      filename: { type: String, required: true },
      originalName: { type: String, required: true },
      path: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true }
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
// Optimize queries for employer and applicant
applicationSchema.index({ employer: 1 });
applicationSchema.index({ applicant: 1 });

module.exports = mongoose.model('Application', applicationSchema);
