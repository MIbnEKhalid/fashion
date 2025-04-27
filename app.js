import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { getPosts, getPostById, createPost, deletePost } from './db.js';
import bcrypt from 'bcryptjs';

const app = express();

// Environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key';

// Middleware
app.engine('hbs', engine({ extname: '.hbs' }));// Handlebars helpers
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    formatDate: function(date) {
      return new Date(date).toLocaleDateString();
    },
    truncate: function(str, len) {
      if (str.length > len) {
        return str.substring(0, len) + '...';
      }
      return str;
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

// Routes
app.get('/', async (req, res) => {
  const posts = await getPosts();
  res.render('index', { posts });
});

app.get('/posts', async (req, res) => {
  const posts = await getPosts();
  res.render('posts', { posts });
});

app.get('/posts/:id', async (req, res) => {
  const post = await getPostById(req.params.id);
  res.render('post', { post });
});

// Admin routes
app.get('/admin/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login');
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && await bcrypt.compare(password, await bcrypt.hash(ADMIN_PASSWORD, 10))) {
    req.session.isAuthenticated = true;
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', { error: 'Invalid credentials' });
});

app.get('/admin/dashboard', isAuthenticated, async (req, res) => {
  const posts = await getPosts();
  res.render('admin/dashboard', { posts });
});

app.post('/admin/posts', isAuthenticated, async (req, res) => {
  const { title, content } = req.body;
  await createPost(title, content);
  res.redirect('/admin/dashboard');
});

app.post('/admin/posts/:id/delete', isAuthenticated, async (req, res) => {
  await deletePost(req.params.id);
  res.redirect('/admin/dashboard');
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});