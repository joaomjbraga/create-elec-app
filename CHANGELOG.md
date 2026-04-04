# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-04-04

### Fixed

- Invalid `dependencies` check in `vite.config.ts` (always returned true)
- Non-existent SVG files being copied from `electron/` directory
- `vite.config.ts` generation with improper import placement
- Idempotency issues in file editing operations

### Refactored

- Simplified IPC snippet generation
- Improved regex for `plugins: [react()]` detection
- Better idempotency checks for `tsconfig.json` and `.gitignore`

### Removed

- Unused color functions (`gary`, `cyan`, `yellow`, `green`)
- Unnecessary `editFile` call for `App.tsx`
- Dead code from codebase

### Chores

- Added `pretest` script to auto-build before tests
- Updated test to use correct `vite.svg` filename
- Added error handling for missing `electron/package.json`

## [0.1.1] - 2026-04-04

### Fixed

- Improved electron main and preload with better comments and IPC API

## [0.1.0] - 2026-04-04

### Added

- Initial release
- Electron + Vite + React + TypeScript scaffolding
- Electron Builder configuration
- IPC communication example
- Unit and integration tests
