import { useState } from "react";

import API_URL from "../config";

function ResetPassword() {

    const params = new URLSearchParams(
        window.location.search
    );


    /*
     * Backend currently generates:
     *
     * /?resetPassword=TOKEN
     */

    const token =
        params.get("resetPassword");


    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        // ==========================================
        // TOKEN CHECK
        // ==========================================

        if (!token) {

            setError(
                "Invalid or missing password reset token."
            );

            return;
        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters long."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_URL}/auth/reset-password/${token}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Password reset failed."
                );
            }


            setMessage(
                data.message ||
                "Password reset successful."
            );


            setPassword("");

            setConfirmPassword("");


        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            setError(
                err.message ||
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-card">

                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="login-header">

                    <h1>
                        Reset Password
                    </h1>

                    <p>
                        Create a new password for your account
                    </p>

                </div>


                {/* =====================================
                    ERROR
                ===================================== */}

                {error && (

                    <div className="login-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    SUCCESS
                ===================================== */}

                {message && (

                    <div className="login-success">

                        {message}

                    </div>

                )}


                {/* =====================================
                    RESET FORM
                ===================================== */}

                {!message && (

                    <form
                        onSubmit={handleSubmit}
                        className="login-form"
                    >

                        {/* NEW PASSWORD */}

                        <div className="login-field">

                            <label htmlFor="password">
                                New Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                required
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="login-field">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                required
                            />

                        </div>


                        {/* RESET BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Resetting..."
                                : "Reset Password"}

                        </button>

                    </form>

                )}


                {/* =====================================
                    SUCCESS → LOGIN
                ===================================== */}

                {message && (

                    <button
                        type="button"
                        className="login-button reset-login-button"
                        onClick={() => {
                            window.location.href =
                                "/";
                        }}
                    >
                        Go to Login
                    </button>

                )}


                {/* =====================================
                    BACK TO LOGIN
                ===================================== */}

                {!message && (

                    <div className="register-link">

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href =
                                    "/";
                            }}
                        >
                            ← Back to Login
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}

export default ResetPassword;