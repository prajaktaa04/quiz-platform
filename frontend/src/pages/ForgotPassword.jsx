import { useState } from "react";

const API_URL = "http://localhost:5000/api";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [resetUrl, setResetUrl] = useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");
        setResetUrl("");


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_URL}/auth/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to process request."
                );
            }


            setMessage(
                data.message ||
                "Password reset link generated."
            );


            /*
             * Development mode:
             * Backend currently returns resetUrl.
             *
             * Later this will be replaced
             * with an email link.
             */

            if (data.resetUrl) {

                setResetUrl(
                    data.resetUrl
                );

            }

        } catch (err) {

            console.error(
                "Forgot password error:",
                err
            );

            setError(
                err.message ||
                "Something went wrong."
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
                        Forgot Password
                    </h1>

                    <p>
                        Enter your email to reset your password
                    </p>

                </div>


                {/* =====================================
                    SUCCESS MESSAGE
                ===================================== */}

                {message && (

                    <div className="login-success">

                        {message}

                    </div>

                )}


                {/* =====================================
                    ERROR MESSAGE
                ===================================== */}

                {error && (

                    <div className="login-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    FORM
                ===================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >

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
                            placeholder="Enter your registered email"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}

                    </button>

                </form>


                {/* =====================================
                    DEVELOPMENT RESET LINK
                ===================================== */}

                {resetUrl && (

                    <div className="reset-development">

                        <p>
                            <strong>
                                Password reset link
                            </strong>
                        </p>

                        <p className="reset-development-text">
                            For development, the reset
                            link is available below.
                        </p>

                        <button
                            type="button"
                            className="reset-link-button"
                            onClick={() => {
                                window.location.href =
                                    resetUrl;
                            }}
                        >
                            Reset Password →
                        </button>

                    </div>

                )}


                {/* =====================================
                    BACK TO LOGIN
                ===================================== */}

                <div className="register-link">

                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;