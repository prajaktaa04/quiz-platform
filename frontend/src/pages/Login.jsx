import { useState } from "react";

import API_URL from "../config";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }


            // ==========================================
            // SAVE TOKEN
            // ==========================================

            localStorage.setItem(
                "token",
                data.token
            );


            // ==========================================
            // SAVE USER
            // ==========================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // ==========================================
            // REDIRECT BASED ON ROLE
            // ==========================================

            if (data.user.role === "ADMIN") {

                window.location.href =
                    "/?admin=true";

            } else {

                window.location.href =
                    "/";

            }

        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err.message || "Login failed"
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
                        Quiz Platform
                    </h1>

                    <p>
                        Sign in to your account
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
                    LOGIN FORM
                ===================================== */}

                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    {/* EMAIL */}

                    <div className="login-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="login-field">

                        <label htmlFor="password">
                            Password
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
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"}

                    </button>

                </form>


                {/* =====================================
                    FORGOT PASSWORD
                ===================================== */}

                <div className="login-links">

                    <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => {
                            window.location.href =
                                "/?forgotPassword=true";
                        }}
                    >
                        Forgot Password?
                    </button>

                </div>


                {/* =====================================
                    REGISTER
                ===================================== */}

                <div className="register-link">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href =
                                "/?register=true";
                        }}
                    >
                        Create Account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;