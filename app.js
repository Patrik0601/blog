import express from 'express'
import cors from 'cors'
import { getAllPost, creatPost, updatePost, deletePost, getAllUser, getPostById } from './util/database.js';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/users', (req, res) => {
   try {
    const users = getAllUser();
    res.json(users);
  } catch (err) {
    console.error('GET /users hiba:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a felhasználokat.' });
  }
});


app.get('/posts', (req, res) => {
   try {
    const posts = getAllPost();
    res.json(posts);
  } catch (err) {
    console.error('GET /posts hiba:', err);
    res.status(500).json({ error: 'Nem sikerült lekérni a posztokat.' });
  }
});

app.get("/posts/:id", (req, res) => {
    try {
        const post = getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});


app.post('/posts', (req, res) => {
  try {
    const { author_id, title, category, content } = req.body;
    if (!author_id || !title || !category || !content) {
      return res.status(400).json({ error: 'Hiányzó mezők a kérésben.' });
    }
    const result = creatPost(author_id, title, category, content);
    res.status(201).json({ message: 'Poszt létrehozva.', id: result.lastInsertRowid });
  } catch (err) {
    console.error('POST /posts hiba:', err);
    res.status(500).json({ error: 'Nem sikerült létrehozni a posztot.' });
  }
});

app.put('/posts/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { author_id, title, category, content } = req.body;
    if (!author_id || !title || !category || !content) {
      return res.status(400).json({ error: 'Hiányzó mezők a kérésben.' });
    }
    const result = updatePost(id, author_id, title, category, content);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nem található a poszt.' });
    }
    res.json({ message: 'Poszt frissítve.' });
  } catch (err) {
    console.error('PUT /posts/:id hiba:', err);
    res.status(500).json({ error: 'Nem sikerült frissíteni a posztot.' });
  }
});

app.delete('/posts/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = deletePost(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Nem található a poszt.' });
    }
    res.json({ message: 'Poszt törölve.' });
  } catch (err) {
    console.error('DELETE /posts/:id hiba:', err);
    res.status(500).json({ error: 'Nem sikerült törölni a posztot.' });
  }
});

app.listen(8080, () => {
  console.log('Szerver fut: http://localhost:8080');
});
