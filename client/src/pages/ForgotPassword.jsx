import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP and new password
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/forgot-password', { email });
      alert('OTP sent to your email');
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        {step === 1 ? (
          <>
            <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <button
                type="submit"
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;