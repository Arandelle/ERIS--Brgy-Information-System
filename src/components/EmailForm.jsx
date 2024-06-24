import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [otpSent, setOtpSent] = useState(false); // Flag to track if OTP has been sent
    const [otpVerified, setOtpVerified] = useState(false); // Flag to track if OTP is verified
    const [generatedOtp, setGeneratedOtp] = useState(''); // State to store the generated OTP

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!email) {
                alert('Please enter a valid email address');
                return;
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
            const templateParams = {
                to_email: email,
                otp: otpCode
            };

            await emailjs.send('service_irwj6pe', 'template_kpt56kp', templateParams, 'k6-dH67sAovnHJHAn');
            setGeneratedOtp(otpCode.toString()); // Store generated OTP as a string
            setOtpSent(true); // Mark OTP as sent
            alert('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email: ' + error.message);
        }
    };

    const handleVerify = () => {
        if (otpInput === '') {
            alert('Please enter the OTP');
            return;
        }

        // Compare the OTP entered by the user with the generated OTP
        if (otpInput === generatedOtp) {
            setOtpVerified(true);
            alert('OTP verified successfully');
        } else {
            alert('Incorrect OTP, please try again');
        }
    };

    return (
        <div>
            {!otpVerified ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Recipient Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send OTP</button>
                </form>
            ) : (
                <p>OTP Verified Successfully!</p>
            )}

            {otpSent && !otpVerified && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button onClick={handleVerify}>Verify OTP</button>
                </div>
            )}
        </div>
    );
};

export default EmailForm;
