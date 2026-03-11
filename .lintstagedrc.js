module.exports = {
  '*.{ts,tsx,js}': (filenames) => {
    const nonTestFiles = filenames.filter(
      (file) => !file.includes('.spec.') && !file.includes('.test.')
    );
    if (nonTestFiles.length === 0) return [];
    return [
      `eslint --fix ${nonTestFiles.join(' ')}`,
      `prettier --write ${nonTestFiles.join(' ')}`,
    ];
  },
  '*.{json,md}': ['prettier --write'],
};
