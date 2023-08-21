const fs = require('fs').promises;

const removeFiles = async (files) => {
  if (typeof files === 'string') {
    const path = files;

    const exists = await fs
      .access(process.cwd() + path)
      .then(() => true)
      .catch(() => false);
    if (exists) {
      await fs.unlink(process.cwd() + path);
    }
  } else if (Array.isArray(files)) {
    files.map(async (path) => {
      const exists = await fs
        .access(process.cwd() + path)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        await fs.unlink(process.cwd() + path);
      }
    });
  }
};

module.exports = removeFiles;
