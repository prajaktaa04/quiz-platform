const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user");


// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "STUDENT",
            status: "ACTIVE"
        });

        res.status(201).json({
            message: "Student registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Your account is inactive"
            });
        }

        // Compare password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        /*
         * Do not reveal whether an email exists.
         * This prevents account enumeration.
         */

        if (!user) {

            return res.status(200).json({
                message:
                    "If an account with that email exists, a password reset link has been generated."
            });
        }


        // Generate random token
        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // Hash token before storing in database
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        // Token expires in 15 minutes
        user.resetPasswordToken = hashedToken;

        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;


        await user.save();


        /*
         * Development reset URL.
         *
         * Later we can send this URL
         * through email using Nodemailer.
         */

        const resetUrl =
            `http://localhost:5173/?resetPassword=${resetToken}`;


        res.status(200).json({

            message:
                "Password reset link generated successfully.",

            resetUrl

        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while processing password reset"
        });
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;

        const { password } = req.body;


        if (!token) {

            return res.status(400).json({
                message: "Reset token is required"
            });
        }


        if (!password) {

            return res.status(400).json({
                message: "New password is required"
            });
        }


        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long"
            });
        }


        // Hash incoming token
        const hashedToken =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        // Find user with valid token
        const user = await User.findOne({

            resetPasswordToken: hashedToken,

            resetPasswordExpire: {
                $gt: Date.now()
            }

        });


        if (!user) {

            return res.status(400).json({
                message:
                    "Password reset token is invalid or expired"
            });
        }


        // Hash new password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        user.password = hashedPassword;


        // Remove reset token
        user.resetPasswordToken = null;

        user.resetPasswordExpire = null;


        await user.save();


        res.status(200).json({

            message:
                "Password reset successful. You can now login with your new password."

        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while resetting password"
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    registerUser,

    loginUser,

    forgotPassword,

    resetPassword

};