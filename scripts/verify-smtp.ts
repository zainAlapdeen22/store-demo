import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=:#]+?)[=:](.*)/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log(`Loaded env from ${filePath}`);
        }
    } catch (e) {
        console.error(`Failed to load ${filePath}`, e);
    }
}

// Load environment variables
loadEnv(path.resolve(process.cwd(), '.env'));
loadEnv(path.resolve(process.cwd(), '.env.local'));

async function verifySMTP() {
    console.log('📧 Testing SMTP Configuration...');
    console.log('--------------------------------');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`Port: ${process.env.SMTP_PORT}`);
    console.log(`User: ${process.env.SMTP_USER}`);
    console.log(`Secure: ${process.env.SMTP_SECURE}`);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ Error: SMTP_USER or SMTP_PASS is missing in environment variables.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('🔄 Attempting to connect...');
        await transporter.verify();
        console.log('✅ Success! Your SMTP configuration is correct and ready to send emails.');
    } catch (error: any) {
        console.error('❌ Connection Failed!');
        console.error('--------------------------------');
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        console.error('--------------------------------');

        if (error.code === 'EAUTH') {
            console.log('💡 Tip: Authentication failed. Check your email and password.');
            console.log('   - If using Gmail, make sure you are using an "App Password", not your login password.');
            console.log('   - Ensure 2-Step Verification is enabled on your Google account.');
        } else if (error.code === 'ESOCKET') {
            console.log('💡 Tip: Connection timed out or failed. Check your Host and Port.');
            console.log('   - Try changing port to 465 (secure: true) or 587 (secure: false).');
        }
    }
}

verifySMTP();
