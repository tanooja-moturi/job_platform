const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
      maxlength: [100, 'Company cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    requirements: {
      type: String,
      required: [true, 'Please add job requirements'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    employmentType: {
      type: String,
      required: [true, 'Please add an employment type'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'],
    },
    salary: {
      type: String,
      default: 'Not specified',
    },
    skills: {
      type: [String],
      default: [],
    },
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for search and filtering
jobSchema.index({ title: 'text', company: 'text', skills: 'text' });
jobSchema.index({ employer: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ employmentType: 1 });

module.exports = mongoose.model('Job', jobSchema);
