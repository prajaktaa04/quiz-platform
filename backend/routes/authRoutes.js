const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// AUTHENTICATION
// =====================================================

router.post(
    "/register",
    registerUser
);


router.post(
    "/login",
    loginUser
);


// =====================================================
// FORGOT / RESET PASSWORD
// =====================================================

router.post(
    "/forgot-password",
    forgotPassword
);


router.post(
    "/reset-password/:token",
    resetPassword
);


// =====================================================
// PROTECTED TEST ROUTE
// =====================================================

router.get(
    "/profile",
    protect,
    (req, res) => {

        res.status(200).json({

            message:
                "Authentication successful",

            user: req.user

        });
    }
);


// =====================================================
// STUDENT-ONLY TEST ROUTE
// =====================================================

router.get(
    "/student-test",
    protect,
    authorizeRoles("STUDENT"),

    (req, res) => {

        res.status(200).json({

            message:
                "Student authorization successful",

            user: req.user

        });
    }
);


// =====================================================
// ADMIN-ONLY TEST ROUTE
// =====================================================

router.get(
    "/admin-test",
    protect,
    authorizeRoles("ADMIN"),

    (req, res) => {

        res.status(200).json({

            message:
                "Admin authorization successful",

            user: req.user

        });
    }
);


module.exports = router;