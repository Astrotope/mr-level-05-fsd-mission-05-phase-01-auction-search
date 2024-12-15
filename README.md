# Mission Ready - Level 05 - Mission 05 - Phase 01 - Auction Search

## Project Overview

This project contains tools and utilities for managing an auction search system. The main components are:

### MongoDB CLI Seeding Tool

Located in the [`cli-tool`](./cli-tool) directory, this tool provides functionality to seed MongoDB with auction item data from JSON files.

#### Key Features
- Environment variable configuration for MongoDB connection
- JSON file validation and parsing
- Secure password handling
- Verbose mode for debugging
- Integration with Docker for local development

#### Documentation
- [Development Notes](./cli-tool/DEV_NOTES.md) - Setup, configuration, and usage guide
- [Testing Documentation](./cli-tool/TESTING_LOG.md) - Detailed TDD iterations and results

#### Quick Start
1. Set up environment variables (see DEV_NOTES.md)
2. Start MongoDB (Docker or local installation)
3. Run the seeding tool:
```bash
cd cli-tool/src
node src/seed.js -f datasets/auction-items.json --verbose
```

## Project Structure
```
auction-search/
├── cli-tool/               # MongoDB seeding utility
│   ├── src/               # Source code and tests
│   ├── datasets/          # Sample JSON data
│   ├── DEV_NOTES.md       # Development documentation
│   └── TESTING_LOG.md     # Testing documentation
└── README.md              # This file
```

## Development Status

- [x] MongoDB CLI Seeding Tool
  - [x] Basic functionality
  - [x] Unit tests
  - [x] Integration tests
  - [x] Docker support
  - [x] Documentation
