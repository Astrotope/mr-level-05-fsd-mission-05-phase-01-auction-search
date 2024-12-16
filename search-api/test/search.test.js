// test/search.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Search API', () => {

  test('should search items by query', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ q: 'wooden' });

    console.log('Response JSON:', response.body); // Log the response body
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(typeof response.body.count).toBe('number');
    expect(response.body.query).toBe('wooden');
  });
  
  test.todo('should return 400 if query is missing');
  test.todo('should search in both title and description');

});
