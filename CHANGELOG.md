# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.0.13] - 2025-01-22

### Added
- `assistantName` prop to allow customizing the assistant's display name
- `welcomeMessage` prop to allow customizing the initial welcome message

### Changed
- Improved `handleSendMessage` function with cleaner, more readable logic
- Simplified `sendMessage` interface to return `Promise<string>` instead of `Promise<{success: boolean; response: string}>`
- Eliminated nested conditions and code duplication in message handling
- Enhanced error handling with guaranteed cleanup in finally blocks

### Refactored
- Drastically simplified component state management by removing unnecessary refs
- Streamlined message creation with unified `createMessage` helper function
- Improved code organization and readability throughout the component

## [0.0.12] - 2025-01-22

### Changed
- Updated package version and removed unused vite.svg

## [0.0.9] - 2025-01-22

### Changed
- Bumped version to 0.0.9

### Refactored
- Update response type for sendMessage function
- Remove agentId and simplify sendMessage prop
- Use new UI components from ui directory

### Fixed
- Improve error handling and console logging

## Previous versions

### Added
- Add .env.example, CONTRIBUTING.md, and LICENSE
- Create .npmignore file
- Use ContentaWidget in App.tsx
