const jwt = require("jsonwebtoken");
const User = require("../models/user");


// =====================================================
// PROTECT ROUTES
// =====================================================

const protect = async (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization;


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        const token =
            authHeader.split(" ")[1];


        // ==========================================
        // VERIFY JWT
        // ==========================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==========================================
        // FIND CURRENT USER
        // ==========================================

        const user =
            await User.findById(
                decoded.userId
            ).select("-password");


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!user) {

            return res.status(401).json({
                message:
                    "User account not found"
            });

        }


        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (user.status !== "ACTIVE") {

            return res.status(403).json({
                message:
                    "Your account is inactive"
            });

        }


        // ==========================================
        // ATTACH CURRENT USER
        // ==========================================

        req.user = {

            userId: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            status: user.status

        };


        next();


    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

};


// =====================================================
// AUTHORIZE ROLES
// =====================================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {


        if (!req.user) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        if (
            !allowedRoles.includes(
                req.user.role
            )
        ) {

            return res.status(403).json({

                message:
                    "Access denied"

            });

        }


        next();

    };

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    protect,

    authorizeRoles

};