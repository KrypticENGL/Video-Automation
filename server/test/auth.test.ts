import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models/User.js', () => ({ User: { findOne: vi.fn(), findById: vi.fn() } }));

const { User } = await import('../src/models/User.js');
const { createApp } = await import('../src/app.js');
const { signToken } = await import('../src/services/auth.js');

const findOne = vi.mocked(User.findOne);
const findById = vi.mocked(User.findById);
const user = {
  id: 'u1',
  email: 'client@example.com',
  passwordHash: bcrypt.hashSync('correct-pw', 4),
};
const SECRET = process.env.JWT_SECRET as string;

beforeEach(() => vi.resetAllMocks());

describe('POST /auth/login', () => {
  it('returns a JWT for the right password', async () => {
    findOne.mockResolvedValue(user as never);
    const res = await request(createApp())
      .post('/auth/login')
      .send({ email: 'Client@Example.com', password: 'correct-pw' });
    expect(res.status).toBe(200);
    expect(jwt.verify(res.body.token, SECRET)).toMatchObject({ sub: 'u1' });
    expect(findOne).toHaveBeenCalledWith({ email: 'client@example.com' });
  });

  it('gives the same 401 for a wrong password and an unknown email', async () => {
    findOne.mockResolvedValue(user as never);
    const wrong = await request(createApp())
      .post('/auth/login')
      .send({ email: user.email, password: 'nope' });
    findOne.mockResolvedValue(null as never);
    const unknown = await request(createApp())
      .post('/auth/login')
      .send({ email: 'who@example.com', password: 'nope' });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(unknown.body).toEqual(wrong.body);
  });

  it('rejects invalid input with 400', async () => {
    const res = await request(createApp()).post('/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_input');
    expect(findOne).not.toHaveBeenCalled();
  });

  it('rate-limits repeated attempts', async () => {
    findOne.mockResolvedValue(null as never);
    const app = createApp();
    const attempt = () => request(app).post('/auth/login').send({ email: 'a@b.co', password: 'x' });
    for (let i = 0; i < 10; i++) expect((await attempt()).status).toBe(401);
    const blocked = await attempt();
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('rate_limited');
  });
});

describe('auth middleware', () => {
  const me = (auth?: string) => {
    const req = request(createApp()).get('/me');
    return auth ? req.set('Authorization', auth) : req;
  };

  it('rejects a missing token', async () => {
    expect((await me()).status).toBe(401);
  });

  it('rejects a malformed header and a garbage token', async () => {
    expect((await me('Token abc')).status).toBe(401);
    expect((await me('Bearer abc')).status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const expired = jwt.sign({}, SECRET, { subject: 'u1', expiresIn: -10 });
    expect((await me(`Bearer ${expired}`)).status).toBe(401);
  });

  it('rejects a token signed with another secret or with alg none', async () => {
    const forged = jwt.sign({}, 'x'.repeat(40), { subject: 'u1' });
    const none = jwt.sign({}, '', { subject: 'u1', algorithm: 'none' });
    expect((await me(`Bearer ${forged}`)).status).toBe(401);
    expect((await me(`Bearer ${none}`)).status).toBe(401);
  });

  it('accepts a valid token and returns the user without the hash', async () => {
    findById.mockResolvedValue(user as never);
    const res = await me(`Bearer ${signToken('u1')}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'u1', email: user.email });
    expect(findById).toHaveBeenCalledWith('u1');
  });

  it('returns 401 when the user no longer exists', async () => {
    findById.mockResolvedValue(null as never);
    expect((await me(`Bearer ${signToken('u1')}`)).status).toBe(401);
  });

  it('protects unknown routes too (401 before 404)', async () => {
    expect((await request(createApp()).get('/posts')).status).toBe(401);
  });
});

describe('GET /health', () => {
  it('is public and reports the database as down when not connected', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ ok: false });
  });
});
