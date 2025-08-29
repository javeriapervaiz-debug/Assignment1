# PNPM Setup Guide

This project uses **pnpm** as the package manager instead of npm for better performance and efficiency.

## Why pnpm?

- ⚡ **Faster installs**: Up to 2x faster than npm
- 💾 **Disk space efficient**: Shares packages across projects
- 🔒 **Stricter dependency resolution**: Prevents phantom dependencies
- 📦 **Better monorepo support**: Native workspace support

## Installation

### 1. Install pnpm globally

```bash
# Using npm (if you have it)
npm install -g pnpm

# Using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh

# Using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 2. Verify installation

```bash
pnpm --version
```

## Usage

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Other commands

```bash
# Add a dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name

# Update dependencies
pnpm update

# Run scripts
pnpm run script-name
```

## Migration from npm

This project has been migrated from npm to pnpm:

1. ✅ Removed `node_modules/` and `package-lock.json`
2. ✅ Installed dependencies with `pnpm install`
3. ✅ Generated `pnpm-lock.yaml`
4. ✅ Updated documentation to use pnpm commands

## Project Structure

- `pnpm-lock.yaml` - Lockfile (equivalent to package-lock.json)
- `package.json` - Package configuration (same as npm)
- `.npmrc` - pnpm configuration (if needed)

## Troubleshooting

### Peer dependency warnings
pnpm is stricter about peer dependencies. If you see warnings:

```bash
# Install peer dependencies manually
pnpm install peer-dep-name
```

### Cache issues
If you encounter issues, clear the pnpm cache:

```bash
pnpm store prune
```

### Switch back to npm (if needed)
```bash
rm -rf node_modules pnpm-lock.yaml
npm install
```

## Benefits in this project

- **Faster CI/CD**: Quicker installs in deployment
- **Consistent dependencies**: Exact versions across environments
- **Better security**: Stricter resolution prevents malicious packages
- **Modern workflow**: Industry standard for modern projects
