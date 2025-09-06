const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper to ensure directory exists
function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    // ignore if already exists
  }
}

// Compute destination based on field name
function destinationForField(fieldname) {
  // adjust folders as you need
  if (/menu/i.test(fieldname)) return path.join(__dirname, '..', 'uploads', 'menus');
  if (/profile/i.test(fieldname)) return path.join(__dirname, '..', 'uploads', 'deliveryAgents', 'profile');
  if (/license/i.test(fieldname)) return path.join(__dirname, '..', 'uploads', 'deliveryAgents', 'licenses');
  if (/partnerdocs|partnerdoc|partnerfile/i.test(fieldname)) return path.join(__dirname, '..', 'uploads', 'partners', 'docs');
  if (/partnermenu|partnermenu|partner_images/i.test(fieldname)) return path.join(__dirname, '..', 'uploads', 'partners', 'menus');
  return path.join(__dirname, '..', 'uploads', 'misc');
}

// Shared storage engine that chooses destination per-file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = destinationForField(file.fieldname);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

// Allowed image types
const ALLOWED_TYPES = /jpeg|jpg|pdf|png|webp/;
function fileFilter(req, file, cb) {
  const extname = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_TYPES.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  return cb(new Error('Only image files (jpeg, png, webp) are allowed'));
}

// Factory to create multer instance with configurable max file size
function createMulter(maxFileSizeBytes = 20 * 1024 * 1024) {
  return multer({
    storage,
    limits: { fileSize: maxFileSizeBytes },
    fileFilter
  });
}

// Pre-built middlewares for common use-cases
const uploadMenuSingle = createMulter(10 * 1024 * 1024).single('menuImage');
const uploadMenuMultiple = createMulter(10 * 1024 * 1024).array('menuImages', 10);
const uploadDeliveryFiles = createMulter(20 * 1024 * 1024).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'licensePhotos', maxCount: 4 }
]);
const uploadPartnerFiles = createMulter(20 * 1024 * 1024).fields([
  { name: 'partnerDocs', maxCount: 5 },
  { name: 'partnerMenuImages', maxCount: 10 }
]);

module.exports = {
  createMulter,
  uploadMenuSingle,
  uploadMenuMultiple,
  uploadDeliveryFiles,
  uploadPartnerFiles,
  // helper: expose storage and filter if you want to build custom middleware
  storage,
  fileFilter
};
