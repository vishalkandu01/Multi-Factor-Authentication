import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                'http://localhost:8000/auth/login',
                {
                    email,
                    password
                }
            );

            if (response.data.success) {
                setShowOtpField(true);
                alert('OTP sent to your email. Check your inbox.');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            alert('An error occurred during login');
        }
    }

    const handleOtpVerification = async () => {
        try {
            const otpResponse = await axios.post(
                'http:localhost:8000/auth/verify-otp',
                {
                    otp
                }
            );

            if (otpResponse.data.success) {
                alert('OTP Verified. User logged in.');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error.message);
            alert('An error occurred during OTP verification');
        }
    }

    return (
        <div>
            <form>
                <input
                    type="email"
                    placeholder='Email'
                    // value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='Password'
                    // value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {
                    showOtpField && (
                        <>
                            <input
                                type="text"
                                placeholder='OTP'
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button
                                className='login-button'
                                onClick={handleOtpVerification}
                            >
                                Verify OTP
                            </button>
                        </>
                    )
                }

                <button
                    className='login-button'
                    onClick={handleLogin}
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login