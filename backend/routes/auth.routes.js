import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserMONGO from "../models/UserMongo.js";
import UserSQL from "../models/UserSql.js";
import Joi from "joi";
import { where } from "sequelize";
import { sendWelcomeEmail } from "../utils/emailService.js";

const router = express.Router();

const registrationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().alphanum(),
    UserMONGO: Joi.boolean(), default: true
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().alphanum(),
    UserMONGO: Joi.boolean(), default: true
});

router.post("/register", async (req, res) => {
    try {
        
        const { value, error } = registrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
 
        const { name, email, password, UserMONGO } = value;
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = await (UserMONGO 
            ? UserMONGO.create({ name, email, password: hashedPassword })
            : UserSQL.create({ name, email, password: hashedPassword })
        );

        try {
            await sendWelcomeEmail(email, name);
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
            
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { value, error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password, UserMONGO } = value;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = UserMONGO 
            ? await UserMONGO.findOne({ email }) 
            : await UserSQL.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' } 
        );

        res.status(200).json({ 
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "An error occurred during login" }); 
    }
});

export default router;