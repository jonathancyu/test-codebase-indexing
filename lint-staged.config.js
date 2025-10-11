module.exports = {
  '*.{js,ts}': ['pnpm eslint --fix', 'pnpm prettier --write'],
  '*.{json,yml,yaml,md}': ['pnpm prettier --write'],
  'backend/**/*.py': files => {
    const relativePaths = files.map(file => file.replace('backend/', ''));
    return [
      `cd backend && poetry run ruff check --fix ${relativePaths.join(' ')}`,
      `cd backend && poetry run isort ${relativePaths.join(' ')}`,
      `cd backend && poetry run black ${relativePaths.join(' ')}`
    ];
  },
};
