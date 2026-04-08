// Uploads audio to Cloudinary for storage
const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (filePath) => {
  // Return a local file URL for now — swap with real Cloudinary later
  const filename = require('path').basename(filePath);
  return `http://localhost:5000/uploads/${filename}`;
};

module.exports = { uploadToCloudinary };
