import express from "express";
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from 'cors';
import multer from 'multer'; // Import multer for handling file uploads

dotenv.config();

const app = express();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory

app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Your frontend URL
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const sendEmail = async (to, subject, text, attachments = []) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        attachments, // Attach files to the email
    };

    return transporter.sendMail(mailOptions);
};

// API for Client Support Form
app.post('/submit-client-support', upload.array('supportingDocs'), async (req, res) => {
    const { name, email, message } = req.body;
    const files = req.files; // Access uploaded files

    const recipientEmail = 'heysid88@gmail.com';
    const subject = 'New Client Support Form Submission';

    const emailContent = `
        You have received a new client support form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    // Prepare attachments if files are present
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: file.path, // Path to the uploaded file
    }));

    try {
        await sendEmail(recipientEmail, subject, emailContent, attachments);
        res.status(200).send({ message: 'Client support form submitted successfully!' });
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).send({ message: 'Failed to submit client support form', error });
    }
});

// API for Careers Form
app.post('/submit-careers', upload.array('resumes'), async (req, res) => {
    const { name, email, message } = req.body;
    const files = req.files; // Access uploaded files

    const recipientEmail = 'heysid88@gmail.com';
    const subject = 'New Careers Form Submission';

    const emailContent = `
        You have received a new careers form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    // Prepare attachments if files are present
    const attachments = files.map(file => ({
        filename: file.originalname,
        path: file.path, // Path to the uploaded file
    }));

    try {
        await sendEmail(recipientEmail, subject, emailContent, attachments);
        res.status(200).send({ message: 'Careers form submitted successfully!' });
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).send({ message: 'Failed to submit careers form', error });
    }
});

// API for Contact Us Form
app.post('/submit-contact-us', async (req, res) => {
    const { name, email, message } = req.body;

    const recipientEmail = 'heysid88@gmail.com';
    const subject = 'New Contact Us Form Submission';

    const emailContent = `
        You have received a new contact us form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    try {
        await sendEmail(recipientEmail, subject, emailContent);
        res.status(200).send({ message: 'Contact us form submitted successfully!' });
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).send({ message: 'Failed to submit contact us form', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});