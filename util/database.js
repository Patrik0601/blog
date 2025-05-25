import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );
`);

export const getAllPost = () => db.prepare(`SELECT posts.*, users.author AS author_name FROM posts JOIN users ON posts.author_id = users.id`).all()
export const getPostById = (id) => db.prepare(`SELECT posts.*, users.author AS author_name FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id = ?`).get(id)
export const creatPost = (author_id, title, category, content) => {
  const now = new Date().toISOString();
  return db.prepare(`
    INSERT INTO posts (author_id, title, category, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(author_id, title, category, content, now, now);
}
export const updatePost = (id, author_id, title, category, content) => {
  const now = new Date().toISOString();
  return db.prepare(`
    UPDATE posts SET author_id = ?, title = ?, category = ?, content = ?, updated_at = ?
    WHERE id = ?
  `).run(author_id, title, category, content, now, id);
};
export const deletePost= (id) => db.prepare(`DELETE FROM posts WHERE id = ?`).run(id)
export const getAllUser = () => db.prepare(`SELECT * FROM users`).all()


const users = [
  { author: 'Ann'},{author: 'Bob'},{author: 'Cloe'}
];

const posts = [
    {author_id: 1, title: 'Ann első posztja', category: 'Tech', content: 'Ez Ann első technológiai bejegyzése.' },
    {author_id: 1, title: 'Ann második posztja', category: 'Life', content: 'Ez Ann életéről szóló második bejegyzése.' },
    {author_id: 2, title: 'Bob első posztja', category: 'Gaming', content: 'Bob kedvenc játékairól szóló posztja.' },
    {author_id: 2, title: 'Bob második posztja', category: 'Coding', content: 'Bob tapasztalatai a programozásban.' },
    {author_id: 3, title: 'Cloe első posztja', category: 'Travel', content: 'Cloe utazási élményei Európából.' },
    {author_id: 3, title: 'Cloe második posztja', category: 'Food', content: 'Cloe kedvenc receptjei és ételei.' }
];

const insertUser = db.prepare(`INSERT INTO users (author) VALUES (?)`);
const insertPost = db.prepare(`
  INSERT INTO posts (author_id, title, category, content, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const existingUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (existingUsers === 0) {
  users.forEach(user => insertUser.run(user.author));
}

const existingPosts = db.prepare('SELECT COUNT(*) AS count FROM posts').get().count;
if (existingPosts === 0) {
  const now = new Date().toISOString();
  posts.forEach(post => insertPost.run(
    post.author_id,
    post.title,
    post.category,
    post.content,
    now,
    now
  ));
}