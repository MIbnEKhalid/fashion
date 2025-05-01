import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateSessionAndRole } from 'mbkauthe';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get(["/admin/login", "/admin"], (req, res) => {
    if (req.session && req.session.user) {
        return res.render("staticPage/login.handlebars", { layout: false, userLoggedIn: true, UserName: req.session.user.username });
    }
    return res.render("staticPage/login.handlebars", { layout: false });
});

app.get('/admin/dashboard', validateSessionAndRole("SuperAdmin"), (req, res) => {
    console.log(req.session.user);
    res.json({ message: 'Welcome to the admin panel!' });
});

export default app;