const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getResume
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', protect, authorize('jobseeker'), upload.single('resume'), applyForJob);
router.get('/my', protect, authorize('jobseeker'), getMyApplications);

router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

router.get('/:id/resume', protect, getResume);

module.exports = router;
