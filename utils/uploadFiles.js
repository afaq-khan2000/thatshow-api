const fs = require('fs').promises;

const uploadFiles = async (files, directory = 'others') => {
  if (!files || files.length === 0) return null;

  if (files.length && files.length > 0) {
    const paths = [];

    files.map(async (file) => {
      const dir = `public/uploads/${directory}/`;
      const path = dir + Date.now() + file.name;

      const exists = await fs
        .access(process.cwd() + dir)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await fs.mkdir(process.cwd() + dir, {
          recursive: true,
        });
      }

      file.mv(process.cwd() + path, function (err) {
        if (err) throw err;
      });

      paths.push(path);
    });

    return paths;
  } else {
    const dir = `/public/uploads/${directory}/`;
    const path = dir + Date.now() + files.name;

    const exists = await fs
      .access(process.cwd() + dir)
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      await fs.mkdir(process.cwd() + dir, {
        recursive: true,
      });
    }

    files.mv(process.cwd() + path, function (err) {
      if (err) throw err;
    });

    return path;
  }
};

module.exports = uploadFiles;
