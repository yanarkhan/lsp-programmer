import { pool } from '../db/pool';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';
import type { TokenPayload } from '../middleware/auth';

export async function loginDenganEmail(email: string, password: string) {
  const q = `
    SELECT id_pengguna, nama, email, peran,
           (crypt($2, kata_sandi_hash) = kata_sandi_hash) AS cocok
    FROM pengguna WHERE email = $1
  `;
  const { rows } = await pool.query(q, [email, password]);
  const row = rows[0];
  if (!row || !row.cocok) throw new HttpError(401, 'Email atau kata sandi salah');

  const payload: TokenPayload = {
    id_pengguna: row.id_pengguna,
    peran: row.peran,
    email: row.email,
    nama: row.nama,
  };

  const options: SignOptions = { expiresIn: env.jwtExpiresIn }; // string | number ok
  const secret: Secret = env.jwtSecret;                          // pastikan string

  const token = jwt.sign(payload, secret, options);
  return { token, pengguna: payload };
}
