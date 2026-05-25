import { test, expect } from '@playwright/test';


test.describe('Reqres API Tests', () => {
   test('successful login', async ({ request }) => {
    const response = await request.post(process.env.API_URL + '/api/login', {
      headers: {
        'x-api-key': process.env.API_TOKEN,
      },
      data: {
        email: process.env.VALID_API_USERNAME,
        password: process.env.VALID_API_PASSWORD,
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
  });

  test('should return 400 for missing password', async ({ request }) => {
    const response = await request.post(process.env.API_URL + '/api/login', {
      headers: {
        'x-api-key': process.env.API_TOKEN,
      },
      data: {
        email: process.env.INVALID_API_USERNAME,
      },
    });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toContain('Missing password');
  });

  test('list all users', async ({ request }) => {
    const response = await request.get(process.env.API_URL + '/api/users', {
      headers: {
        'x-api-key': process.env.API_TOKEN,
      },
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data.length).toBeGreaterThan(0);
    expect(responseBody).toHaveProperty('total');
  });
}) 
