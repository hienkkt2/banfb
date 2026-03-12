import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('database.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    warranty TEXT,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const count = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, quantity, warranty, category) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run('Via Việt Cổ - Kháng Ads', 'Via Việt cổ 2015-2018, đã kháng link 273 hoặc 902, chuyên set camp.', 150000, 45, 'Bảo hành 24h: Sai pass, checkpoint khi login.', 'Via');
  insert.run('Via Ngoại (US/PH) - XMDT', 'Via US hoặc Philippines đã xác minh danh tính, trâu, ít bị quét.', 220000, 12, 'Bảo hành login lần đầu, 1 đổi 1 nếu lỗi.', 'Via');
  insert.run('BM50 Kháng - Limit 1m1', 'Business Manager 50 kháng, limit 1.1tr/ngày, đã ngâm sẵn.', 350000, 8, 'Bảo hành link die, không bảo hành khi đã add thẻ.', 'BM');
}

const settingsCount = db.prepare('SELECT count(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  const defaultWarranty = JSON.stringify([
    { title: 'Lỗi đăng nhập', detail: 'Bảo hành 1 đổi 1 nếu tài khoản sai mật khẩu hoặc bị checkpoint ngay khi đăng nhập lần đầu.' },
    { title: 'Thời gian bảo hành', detail: 'Mọi khiếu nại phải được gửi trong vòng 24h kể từ thời điểm mua hàng.' },
    { title: 'Từ chối bảo hành', detail: 'Không bảo hành đối với tài khoản đã lên camp, add thẻ, hoặc vi phạm chính sách cộng đồng sau khi bàn giao.' },
    { title: 'Hỗ trợ kỹ thuật', detail: 'Hỗ trợ ngâm via, cách login an toàn để tránh quét từ Facebook.' }
  ]);
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('warranty_policy', defaultWarranty);
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('zalo_phone', JSON.stringify('0943304685'));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', (req, res) => {
    const { name, description, price, quantity, warranty, category } = req.body;
    const info = db.prepare('INSERT INTO products (name, description, price, quantity, warranty, category) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, description, price, quantity, warranty, category);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, warranty, category } = req.body;
    db.prepare('UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, warranty = ?, category = ? WHERE id = ?')
      .run(name, description, price, quantity, warranty, category, id);
    res.json({ success: true });
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true });
  });

  app.get('/api/settings/:key', (req, res) => {
    const { key } = req.params;
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
    res.json({ value: setting ? JSON.parse(setting.value) : null });
  });

  app.post('/api/settings/:key', (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
    res.json({ success: true });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
