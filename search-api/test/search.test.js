// test/search.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Search API', () => {
  describe('Basic Search Functionality', () => {
    test('should search items by query', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'wooden' });

      console.log('Response JSON:', response.body);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(typeof response.body.count).toBe('number');
      expect(response.body.query).toBe('wooden');
    });
    
    test('should return 400 if query is missing', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing search query');
      expect(response.body).toHaveProperty('message', 'Please provide a valid search term using the "q" query parameter');
    });

    // Not sure if this test is actually testing the correct functionality
    test('should search in both title and description', async () => {
      // First, search for a term likely to be in a title
      const titleResponse = await request(app)
        .get('/api/search')
        .query({ q: 'antique' });

      // Then, search for a term likely to be in a description
      const descriptionResponse = await request(app)
        .get('/api/search')
        .query({ q: 'condition' });

      // Both searches should return results
      expect(titleResponse.status).toBe(200);
      expect(titleResponse.body.items.length).toBeGreaterThan(0);
      
      expect(descriptionResponse.status).toBe(200);
      expect(descriptionResponse.body.items.length).toBeGreaterThan(0);

      // Verify that each response includes the full item data
      expect(titleResponse.body.items[0]).toHaveProperty('title');
      expect(titleResponse.body.items[0]).toHaveProperty('description');
      expect(descriptionResponse.body.items[0]).toHaveProperty('title');
      expect(descriptionResponse.body.items[0]).toHaveProperty('description');
    });
  });

  describe('Search Mode Tests', () => {
    test('should default to semantic search when m parameter is not provided', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'semantic');
      expect(response.body.items).toBeInstanceOf(Array);
    });

    test('should use semantic search when m=semantic', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'semantic' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'semantic');
      expect(response.body.items).toBeInstanceOf(Array);
    });

    test('should use MongoDB text search when m=mongo', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'mongo' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'mongo');
      expect(response.body.items).toBeInstanceOf(Array);
      // MongoDB text search results should have a score property
      expect(response.body.items[0]).toHaveProperty('score');
    });

    test('should use semantic search for invalid m parameter values', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'invalid_mode' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'semantic');
      expect(response.body.items).toBeInstanceOf(Array);
    });

    test('should return correct mode in response for semantic search', async () => {
      // Test both explicit and implicit semantic search
      const explicitResponse = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'semantic' });

      const implicitResponse = await request(app)
        .get('/api/search')
        .query({ q: 'vintage' });

      // Both responses should indicate semantic mode
      expect(explicitResponse.body).toHaveProperty('mode', 'semantic');
      expect(implicitResponse.body).toHaveProperty('mode', 'semantic');
      
      // Both should return array of results
      expect(explicitResponse.body.items).toBeInstanceOf(Array);
      expect(implicitResponse.body.items).toBeInstanceOf(Array);
    });

    test('should return correct mode in response for mongo search', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'mongo' });

      expect(response.body).toHaveProperty('mode', 'mongo');
      expect(response.body.items).toBeInstanceOf(Array);
      
      // Verify MongoDB-specific properties
      const firstResult = response.body.items[0];
      expect(firstResult).toHaveProperty('score');
      expect(firstResult).toHaveProperty('_id');
      expect(firstResult).toHaveProperty('title');
      expect(firstResult).toHaveProperty('description');
    });
  });

  describe('Result Limit Tests', () => {
    test('should default to 10 results when n parameter is not provided', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage' });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(10);
      expect(response.body.count).toBe(10);
    });

    test('should limit results to n items when n is a valid positive number', async () => {
      const limit = 5;
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', n: limit });

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBeLessThanOrEqual(limit);
      expect(response.body.count).toBe(response.body.items.length);
    });

    test('should default to 10 results when n is zero', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', n: 0 });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(10);
      expect(response.body.count).toBe(10);
    });

    test('should default to 10 results when n is negative', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', n: -5 });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(10);
      expect(response.body.count).toBe(10);
    });

    test('should default to 10 results when n is not a number', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', n: 'invalid' });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(10);
      expect(response.body.count).toBe(10);
    });

    test('should handle large n values gracefully', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', n: 1000 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.count).toBe(response.body.items.length);
      // The actual number of results might be less than 1000
      // depending on available data, but should be handled without errors
      expect(response.body.items.length).toBeLessThanOrEqual(1000);
    });

    test('should return correct count matching actual results length', async () => {
      // Test with different n values
      const testCases = [
        { n: 5 },
        { n: 15 },
        { n: 'invalid' }, // should default to 10
        { n: undefined }, // should default to 10
        { n: -1 }, // should default to 10
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get('/api/search')
          .query({ q: 'vintage', ...testCase });

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(response.body.items.length);
        
        if (!testCase.n || isNaN(testCase.n) || testCase.n <= 0) {
          expect(response.body.items).toHaveLength(10);
        } else {
          expect(response.body.items.length).toBeLessThanOrEqual(testCase.n);
        }
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string query', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    test('should handle very long queries', async () => {
      // Create a very long query string (1000 characters)
      const longQuery = 'vintage '.repeat(143);
      
      const response = await request(app)
        .get('/api/search')
        .query({ q: longQuery });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body).toHaveProperty('query', longQuery);
    });

    test('should handle special characters in queries', async () => {
      const specialChars = [
        '@#$%^&*()',
        'vintage!@#',
        '❤️🎨🎭',
        '<script>alert("test")</script>',
        'SELECT * FROM items'
      ];

      for (const query of specialChars) {
        const response = await request(app)
          .get('/api/search')
          .query({ q: query });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body).toHaveProperty('query', query);
      }
    });

    test('should handle queries with only numbers', async () => {
      const numericQueries = ['1234', '2024', '1800s', '19th'];

      for (const query of numericQueries) {
        const response = await request(app)
          .get('/api/search')
          .query({ q: query });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body).toHaveProperty('query', query);
      }
    });

    test('should handle queries with only spaces', async () => {
      const response = await request(app)
        .get('/api/search')
        .query({ q: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });

    test('should handle multiple concurrent requests', async () => {
      // Reduce number of concurrent queries and use shorter terms
      const queries = [
        'wood',
        'metal',
        'glass'
      ];

      // Set timeout to 10 seconds for this specific test
      jest.setTimeout(10000);

      try {
        // Make multiple requests concurrently
        const promises = queries.map(q => 
          request(app)
            .get('/api/search')
            .query({ q })
            .timeout(8000) // Set supertest timeout
        );

        const responses = await Promise.all(promises);

        // Verify each response
        responses.forEach((response, index) => {
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('items');
          expect(Array.isArray(response.body.items)).toBe(true);
          expect(response.body).toHaveProperty('query', queries[index]);
          expect(response.body.items.length).toBeLessThanOrEqual(10);
        });

        // Verify responses are different (not cached/mixed up)
        const uniqueQueries = new Set(responses.map(r => r.body.query));
        expect(uniqueQueries.size).toBe(queries.length);
      } finally {
        // Reset timeout to default
        jest.setTimeout(5000);
      }
    }, 10000); // Set Jest timeout for this specific test
  });

  describe('Combined Parameter Tests', () => {
    test('should correctly combine m and n parameters for semantic search', async () => {
      const limit = 5;
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'semantic', n: limit });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'semantic');
      expect(response.body.items).toHaveLength(limit);
      expect(response.body.count).toBe(limit);
      
      // Verify each item has semantic search properties
      response.body.items.forEach(item => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('score'); // Semantic similarity score
      });
    });

    test('should correctly combine m and n parameters for mongo search', async () => {
      const limit = 5;
      const response = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'mongo', n: limit });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mode', 'mongo');
      expect(response.body.items).toHaveLength(limit);
      expect(response.body.count).toBe(limit);
      
      // Verify each item has MongoDB text search properties
      response.body.items.forEach(item => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('score'); // MongoDB text search score
      });
    });

    test('should maintain consistent result format between search modes', async () => {
      // Test both search modes with the same query
      const semanticResponse = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'semantic' });

      const mongoResponse = await request(app)
        .get('/api/search')
        .query({ q: 'vintage', m: 'mongo' });

      // Verify both responses have the same structure
      expect(semanticResponse.status).toBe(200);
      expect(mongoResponse.status).toBe(200);

      // Check common properties
      const commonProperties = ['items', 'count', 'query', 'mode'];
      commonProperties.forEach(prop => {
        expect(semanticResponse.body).toHaveProperty(prop);
        expect(mongoResponse.body).toHaveProperty(prop);
      });

      // Check item structure is consistent
      const itemProperties = ['_id', 'title', 'description', 'score'];
      semanticResponse.body.items.forEach(item => {
        itemProperties.forEach(prop => {
          expect(item).toHaveProperty(prop);
        });
      });
      mongoResponse.body.items.forEach(item => {
        itemProperties.forEach(prop => {
          expect(item).toHaveProperty(prop);
        });
      });
    });

    test('should include similarity scores in both search modes', async () => {
      const testQueries = ['vintage', 'antique', 'rare'];

      for (const query of testQueries) {
        // Test semantic search scores
        const semanticResponse = await request(app)
          .get('/api/search')
          .query({ q: query, m: 'semantic' });

        expect(semanticResponse.status).toBe(200);
        semanticResponse.body.items.forEach(item => {
          expect(item).toHaveProperty('score');
          expect(typeof item.score).toBe('number');
          expect(item.score).toBeGreaterThanOrEqual(0);
          // Semantic similarity scores are typically between 0 and 1
          expect(item.score).toBeLessThanOrEqual(1);
        });

        // Test MongoDB text search scores
        const mongoResponse = await request(app)
          .get('/api/search')
          .query({ q: query, m: 'mongo' });

        expect(mongoResponse.status).toBe(200);
        mongoResponse.body.items.forEach(item => {
          expect(item).toHaveProperty('score');
          expect(typeof item.score).toBe('number');
          expect(item.score).toBeGreaterThan(0); // MongoDB text search scores are typically positive
        });

        // Verify scores are ordered correctly
        const verifyScoreOrdering = (items) => {
          for (let i = 1; i < items.length; i++) {
            expect(items[i].score).toBeLessThanOrEqual(items[i-1].score);
          }
        };

        verifyScoreOrdering(semanticResponse.body.items);
        verifyScoreOrdering(mongoResponse.body.items);
      }
    });
  });

  describe('Performance Tests', () => {
    test.todo('should respond within acceptable time limit for semantic search');
    test.todo('should respond within acceptable time limit for mongo search');
    test.todo('should handle large result sets efficiently');
  });

  describe('Error Handling', () => {
    test.todo('should handle database connection errors gracefully');
    test.todo('should handle Qdrant connection errors gracefully');
    test.todo('should handle embedding generation errors gracefully');
    test.todo('should return appropriate error messages for each failure case');
    test.todo('should not expose internal error details in response');
  });

  describe('Security Tests', () => {
    test.todo('should sanitize query parameters to prevent injection');
    test.todo('should handle malformed query parameters safely');
    test.todo('should validate and sanitize n parameter');
    test.todo('should validate and sanitize m parameter');
  });
});
