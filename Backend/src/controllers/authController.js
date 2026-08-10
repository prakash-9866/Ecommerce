const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const register = async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(`[AUTH] Registration attempt: ${name} (${email})`);

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Please provide name and email' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        
        if (userExists) {
            console.log(`[AUTH] Registration failed: User ${normalizedEmail} already exists`);
            return res.status(400).json({ success: false, error: 'User already exists. Please login.' });
        }

        const user = await User.create({ name: name.trim(), email: normalizedEmail });
        console.log(`[AUTH] User created successfully: ID ${user._id}`);

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error(`[AUTH] Registration error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(`[AUTH] Login attempt: Name="${name}", Email="${email}"`);

        
        if (!email || !name) {
            return res.status(400).json({ success: false, error: 'Please provide both name and email' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedName = name.toLowerCase().trim();

        
        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            console.log(`[AUTH] Login failed: No user found with email ${normalizedEmail}`);
            return res.status(401).json({ success: false, error: 'Invalid credentials. User not found.' });
        }

        if (user.name.toLowerCase().trim() !== normalizedName) {
            console.log(`[AUTH] Login failed: Name mismatch. DB="${user.name}", Input="${name}"`);
            return res.status(401).json({ success: false, error: 'Invalid credentials. Name mismatch.' });
        }

        console.log(`[AUTH] Login successful: ${user.name} (${user.email})`);
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(`[AUTH] Login error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[AUTH] Admin Login attempt for: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log(`[AUTH] Admin Login failed: User ${email} not found`);
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            console.log(`[AUTH] Admin Login failed: Incorrect password for ${email}`);
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        if (!user.isAdmin) {
            console.log(`[AUTH] Admin Login failed: User ${email} is not an admin`);
            return res.status(403).json({ success: false, error: 'Access denied. You are not an administrator.' });
        }

        console.log(`[AUTH] Admin Login successful for: ${email}`);
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(`[AUTH] Admin Login error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email, name } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        
        let user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            if (!name) {
                return res.status(400).json({ success: false, error: 'Please provide name for signup' });
            }
            console.log(`[AUTH] Creating new user via OTP: ${name} (${normalizedEmail})`);
            user = await User.create({ name: name.trim(), email: normalizedEmail });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log(`[AUTH] Generated OTP for ${email}: ${otp}`);

        try {
            
            let testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });

            let info = await transporter.sendMail({
                from: '"My Shop" <noreply@myshop.com>',
                to: email,
                subject: 'Your Verification OTP',
                text: `Your OTP is ${otp}. It is valid for 10 minutes.`
            });
            
            console.log("OTP Sent via Ethereal. Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.status(200).json({ 
                success: true, 
                message: 'OTP sent to email', 
                previewUrl: nodemailer.getTestMessageUrl(info), 
                otp 
            });
        } catch (emailError) {
            console.warn("Email delivery failed, but OTP was generated:", emailError.message);
            res.status(200).json({ 
                success: true, 
                message: 'OTP generated (Email delivery failed, use the code below)', 
                otp,
                warning: 'Email could not be sent. Using fallback OTP display.'
            });
        }
    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ success: false, error: `Internal error: ${error.message}` });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail, otp, otpExpires: { $gt: Date.now() } });
        
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }
        
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isVerified = true; 
        await user.save();
        
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
};

module.exports = {
    register,
    login,
    adminLogin,
    sendOtp,
    verifyOtp,
};
