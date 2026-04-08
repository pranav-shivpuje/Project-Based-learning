const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');

// Point fluent-ffmpeg to the static binaries
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const CHUNKS_DIR = path.join(__dirname, '../uploads/chunks');

// Ensure chunks directory exists
if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
}

/**
 * Get duration of an audio file in seconds
 */
const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
};

/**
 * Split audio into 10-minute chunks re-encoded at 64kbps MP3
 * Returns array of chunk file paths
 */
const splitAudioIntoChunks = async (filePath, chunkDurationSeconds = 600) => {
  const duration = await getAudioDuration(filePath);
  const numChunks = Math.ceil(duration / chunkDurationSeconds);
  const timestamp = Date.now();
  const chunkPaths = [];

  for (let i = 0; i < numChunks; i++) {
    const startTime = i * chunkDurationSeconds;
    const chunkPath = path.join(CHUNKS_DIR, `chunk_${timestamp}_${i}.mp3`);
    chunkPaths.push(chunkPath);

    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .setStartTime(startTime)
        .setDuration(chunkDurationSeconds)
        .audioCodec('libmp3lame')
        .audioBitrate('64k')
        .output(chunkPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }

  return chunkPaths;
};

/**
 * Delete all chunk files for a given set of paths
 */
const cleanupChunks = (chunkPaths) => {
  for (const p of chunkPaths) {
    try {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch (err) {
      console.error('Failed to delete chunk:', p, err.message);
    }
  }
};

module.exports = { splitAudioIntoChunks, cleanupChunks };
