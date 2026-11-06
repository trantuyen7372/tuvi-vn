import fs from 'node:fs';
import path from 'node:path';

// Node >= 22.15. Nạp qua require để tương thích @types/node 20 của dự án.
type Value = string | number | null;
interface Statement { run(...args: Value[]): { changes: number | bigint }; get(...args: Value[]): unknown; all(...args: Value[]): unknown[] }
interface DB { exec(sql: string): void; prepare(sql: string): Statement }
let connection: DB | undefined;
let statements = new Map<string, Statement>();
export function db(): DB {
  if (connection) return connection;
  const file = process.env.TUVI_DB_PATH || path.join(process.cwd(), 'storage', 'tuvi.sqlite');
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: new (file: string) => DB };
  connection = new DatabaseSync(file) as DB;
  statements = new Map();
  connection.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,verified INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'active',created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS customer_sessions (hash TEXT PRIMARY KEY,customer_id TEXT NOT NULL REFERENCES customers(id),expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS customer_auth_tokens (hash TEXT PRIMARY KEY,customer_id TEXT NOT NULL REFERENCES customers(id),purpose TEXT NOT NULL,expires INTEGER NOT NULL,used INTEGER);
    CREATE TABLE IF NOT EXISTS birth_profiles (id TEXT PRIMARY KEY,customer_id TEXT NOT NULL REFERENCES customers(id),label TEXT NOT NULL,input TEXT NOT NULL,created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, code INTEGER UNIQUE NOT NULL, token_hash TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL, product TEXT NOT NULL, amount INTEGER NOT NULL, quantity INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', input TEXT NOT NULL, coupon TEXT,
      provider TEXT NOT NULL, link_id TEXT, checkout_url TEXT, qr TEXT,
      created INTEGER NOT NULL, expires INTEGER NOT NULL, paid_at INTEGER, refunded_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS credits (order_id TEXT PRIMARY KEY REFERENCES orders(id), email TEXT NOT NULL, remaining INTEGER NOT NULL CHECK(remaining>=0));
    CREATE TABLE IF NOT EXISTS readings (
      id TEXT PRIMARY KEY, token TEXT UNIQUE NOT NULL, order_id TEXT NOT NULL REFERENCES orders(id),
      fingerprint TEXT NOT NULL, input TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      text TEXT NOT NULL DEFAULT '', attempts INTEGER NOT NULL DEFAULT 0, lease INTEGER,
      created INTEGER NOT NULL, completed INTEGER, email_status TEXT NOT NULL DEFAULT 'pending',
      UNIQUE(order_id, fingerprint)
    );
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY, order_code INTEGER, amount INTEGER NOT NULL, link_id TEXT,
      status TEXT NOT NULL, created INTEGER NOT NULL, reason TEXT
    );
    CREATE TABLE IF NOT EXISTS coupons (code TEXT PRIMARY KEY, percent INTEGER NOT NULL CHECK(percent BETWEEN 1 AND 100), max_uses INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS ai_usage (id INTEGER PRIMARY KEY, reading_id TEXT NOT NULL, model TEXT NOT NULL, input_tokens INTEGER NOT NULL, output_tokens INTEGER NOT NULL, cost_vnd REAL, created INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS admin_sessions (hash TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY, action TEXT NOT NULL, target TEXT NOT NULL, detail TEXT NOT NULL, created INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS orders_email ON orders(email);
    CREATE INDEX IF NOT EXISTS orders_coupon ON orders(coupon);
    CREATE INDEX IF NOT EXISTS readings_order ON readings(order_id);
    CREATE INDEX IF NOT EXISTS payments_order_code ON payments(order_code);
    CREATE INDEX IF NOT EXISTS rate_limits_reset ON rate_limits(reset);
  `);
  const columns=connection.prepare('PRAGMA table_info(orders)').all() as {name:string}[];
  if(!columns.some(c=>c.name==='customer_id')) connection.exec('ALTER TABLE orders ADD COLUMN customer_id TEXT REFERENCES customers(id)');
  connection.exec('CREATE INDEX IF NOT EXISTS orders_customer ON orders(customer_id); CREATE INDEX IF NOT EXISTS sessions_customer ON customer_sessions(customer_id)');
  return connection;
}
function stmt(sql: string): Statement {
  const conn = db();
  let s = statements.get(sql);
  if (!s) { s = conn.prepare(sql); statements.set(sql, s); }
  return s;
}
export function get<T>(sql: string, ...args: Value[]): T | undefined { return stmt(sql).get(...args) as T | undefined; }
export function all<T>(sql: string, ...args: Value[]): T[] { return stmt(sql).all(...args) as T[]; }
export function run(sql: string, ...args: Value[]) { return stmt(sql).run(...args); }
export function transaction<T>(fn: () => T): T {
  db().exec('BEGIN IMMEDIATE');
  try { const value = fn(); db().exec('COMMIT'); return value; }
  catch (e) { db().exec('ROLLBACK'); throw e; }
}
