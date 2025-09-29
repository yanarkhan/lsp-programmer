import fs from 'fs';
import path from 'path';

export const storageRoot = path.resolve(process.cwd(), 'storage');
export const invoiceDir = path.join(storageRoot, 'invoices');

export function ensureStorage() {
  fs.mkdirSync(invoiceDir, { recursive: true });
}
