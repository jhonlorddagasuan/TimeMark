import { hash, compare } from 'bcryptjs';
import { query } from './db';
import { User, LoginInput, SignupInput } from './types';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export async function createUser(input: SignupInput): Promise<User> {
  const { username, email, password, full_name } = input;
  
  // Check if user already exists
  const existing = await query(
    'SELECT id FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Username or email already exists');
  }

  const passwordHash = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, avatar_url, created_at, updated_at`,
    [username, email, passwordHash, full_name || null]
  );

  return result.rows[0];
}

export async function loginUser(input: LoginInput): Promise<User | null> {
  const { username, password } = input;

  const result = await query(
    'SELECT id, username, email, full_name, avatar_url, password_hash, created_at, updated_at FROM users WHERE username = $1',
    [username]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const passwordValid = await comparePasswords(password, user.password_hash);

  if (!passwordValid) {
    return null;
  }

  // Remove password_hash before returning
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );

  return token;
}

export async function validateSession(token: string): Promise<User | null> {
  const result = await query(
    `SELECT u.* FROM users u
     JOIN sessions s ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
    [token]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

export async function deleteSession(token: string): Promise<void> {
  await query('DELETE FROM sessions WHERE token = $1', [token]);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export const AUTH_COOKIE_NAME = 'attendease_session';
