import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mbkauthe from 'mbkauthe';
import adminRoute from './routes/admin.js';
import mainRoute from './routes/main.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine({ extname: '.handlebars' }));
app.engine('handlebars', engine({
  extname: '.handlebars',
  defaultLayout: 'main',
  partialsDir: [
    path.join(__dirname, "views/templates"),
    path.join(__dirname, "views/notice"),
    path.join(__dirname, "views")
  ],
  helpers: {
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.use(mbkauthe);
app.use(mainRoute);
app.use(adminRoute);

app.get('/', (_, res) => {
  res.render('index.handlebars', { title: 'Home' });
});

app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  return res.render("staticPage/404.handlebars");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});