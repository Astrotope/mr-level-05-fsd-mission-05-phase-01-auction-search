module.exports = {
  testEnvironment: "node",        // Use the Node.js environment for testing
  verbose: true,                  // Display individual test results with the test suite hierarchy
  collectCoverage: true,          // Enable test coverage reporting
  collectCoverageFrom: [          // Specify the files for which to collect coverage
    "src/**/*.js",                // Include all .js files in the src/ directory
    "!src/index.js"               // Exclude the main entry point file (index.js)
  ],
  coverageDirectory: "coverage",  // Specify the directory for storing coverage reports
  testMatch: [                    // Match test files
    "**/test/**/*.test.js"       // Look for .test.js files in the tests/ directory
  ],
  moduleDirectories: [            // Allow Jest to resolve modules
    "node_modules",               // Default Node.js modules
    "src"                         // Source directory for absolute imports (optional)
  ]
};
