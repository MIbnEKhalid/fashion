import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateSessionAndRole } from 'mbkauthe';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




app.get('/', (_, res) => {
    res.render('index.handlebars', { title: 'Home' });
});

export default app;