import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginDenganEmail } from '../services/authService';

const skemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req: Request, res: Response): Promise<void> {
  const body = skemaLogin.parse(req.body);
  const hasil = await loginDenganEmail(body.email, body.password);
  res.json(hasil);
}
