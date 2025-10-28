import React, { useState, useEffect, useCallback } from 'react';
import { HeartPulse, UploadCloud, Check, Eye, EyeOff, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Api =  process.env.REACT_APP_API_URL;



const statesAndCities = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada"], "Bihar": ["Patna", "Gaya"], "Jharkhand": ["Ranchi", "Jamshedpur"], "West Bengal": ["Kolkata", "Asansol"],
};

const Register = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '', dob: '', gender: '', bloodGroup: '', emergencyContact: '',
        occupation: '', homeState: '', homeCity: '', pastHistory: '', allergies: '',
        disabilities: '', medications: '', mobile: '', aadhaar: '', password: '', confirmPassword: ''
    });
    const [consents, setConsents] = useState({ data: false, share: false, terms: false });
    const [isStepValid, setIsStepValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, color: 'bg-red-500', width: 'w-1/4' });
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [apiError, setApiError] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);

    const [otp, setOtp] = useState({ motp: '', adrotp: '' });
    const [otpSent, setOtpSent] = useState({ mobile: false, aadhaar: false });
    const [otpVerifying, setOtpVerifying] = useState({ mobile: false, aadhaar: false });
    const [otpVerified, setOtpVerified] = useState({ mobile: false, aadhaar: false });

    const stepsConfig = [
        { fields: ['fullName', 'dob', 'gender', 'bloodGroup', 'homeState', 'homeCity'] },
        { fields: [] },
        { validator: () => otpVerified.mobile && otpVerified.aadhaar },
        { validator: () => true },
        {
            fields: ['password', 'confirmPassword'],
            validator: () => {
                const allConsentsGiven = Object.values(consents).every(Boolean);
                const passwordsMatch = formData.password === formData.confirmPassword;
                return allConsentsGiven && passwordsMatch && passwordStrength.score >= 4;
            }
        }
    ];

    const validateStep = useCallback(() => {
        const stepConfig = stepsConfig[currentStep];
        if (!stepConfig) return false;
        if (stepConfig.validator) return stepConfig.validator();
        return stepConfig.fields.every(field => formData[field]?.trim() !== '');
    }, [currentStep, formData, otpVerified, consents, passwordStrength.score, stepsConfig]);

    useEffect(() => {
        setIsStepValid(validateStep());
    }, [formData, currentStep, otpVerified, consents, validateStep]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setApiError('');
        if (type === 'checkbox') {
            setConsents(prev => ({ ...prev, [id.split('-')[1]]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };
    
    const handleStateChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value, homeCity: '' }));
    };

    const handleNextStep = () => {
        if (isStepValid && currentStep < stepsConfig.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => (currentStep > 0) && setCurrentStep(prev => prev - 1);
    const handleEditStep = (step) => setCurrentStep(step);
    const handleOtpChange = (e) => setOtp({ ...otp, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setUploadedFile(e.target.files[0]);

    const handleSendOtp = async (type) => {
        setApiError('');
        const endpoint = type === 'mobile' ? `${Api}/api/send-mobile-otp`: `${Api}/api/send-aadhaar-otp`;
        const payload = type === 'mobile' ? { mobile: formData.mobile } : { aadhaar: formData.aadhaar };
        const key = type === 'mobile' ? 'mobile' : 'aadhaar';
        
        try {
            const response = await axios.post(endpoint, payload);
            console.log(`Simulating OTP sent for ${key}`);
            setOtpSent(prev => ({ ...prev, [key]: true }));
        } catch (err) {
            setApiError(`Failed to send OTP. Please try again.`);
            console.error(`Error sending ${key} OTP:`, err);
        }
    };
    
    const handleVerifyOtp = async (type) => {
        setApiError('');
        const endpoint = type === 'mobile' ? `${Api}/api/verify-mobile-otp`: `${Api}/api/verify-aadhaar-otp`;
        const payload = type === 'mobile' ? { mobile: formData.mobile, otp: otp.motp } : { aadhaar: formData.aadhaar, otp: otp.adrotp };
        const key = type === 'mobile' ? 'mobile' : 'aadhaar';

        setOtpVerifying(prev => ({ ...prev, [key]: true }));
        try {
            const response = await axios.post(endpoint, payload);
             console.log(`Simulating OTP verified for ${key}`);
            setOtpVerified(prev => ({ ...prev, [key]: true }));
        } catch (err) {
            setApiError(`OTP verification failed. Please try again.`);
            console.error(`Error verifying ${key} OTP:`, err);
        } finally {
            setOtpVerifying(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        if (!isStepValid) {
             setPasswordError('Please complete all required fields and give consent.');
             return;
        }
        setPasswordError('');
        setApiError('');


        const registrationData = new FormData();

        for (const key in formData) {
            registrationData.append(key, formData[key]);
        }

        for (const key in consents) {
            registrationData.append(`consent_${key}`, consents[key]);
        }
        if (uploadedFile) {
            registrationData.append('healthRecord', uploadedFile);
        }
        
        try {
            const response = await axios.post(`${Api}/api/register-patient`, registrationData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Simulating Form Submission:", Object.fromEntries(registrationData.entries()));
            setShowSuccessModal(true);
        } catch (err) {
            setApiError('Registration failed. Please try again later.');
            console.error("Error submitting registration:", err);
        }
    };

    useEffect(() => {
        const pass = formData.password;
        let score = 0;
        if (pass.length > 8) score++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
        if (/\d/.test(pass)) score++;
        if (/[^a-zA-Z\d]/.test(pass)) score++;
        const strength = {
            1: { score: 1, color: 'bg-red-500', width: 'w-1/4' },
            2: { score: 2, color: 'bg-yellow-500', width: 'w-1/2' },
            3: { score: 3, color: 'bg-green-500', width: 'w-3/4' },
            4: { score: 4, color: 'bg-green-500', width: 'w-full' }
        };
        setPasswordStrength(strength[score] || { score: 0, color: 'bg-gray-200', width: 'w-0' });
        if (formData.confirmPassword && pass !== formData.confirmPassword) {
            setPasswordError('Passwords do not match.');
        } else {
            setPasswordError('');
        }
    }, [formData.password, formData.confirmPassword]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-center">Step 1: Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 required">Full Name</label><input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                            <div><label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1 required">Date of Birth</label><input type="date" id="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></div>
                            <div><label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1 required">Gender</label><select id="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                            <div><label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1 required">Blood Group</label><select id="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
                            <div><label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label><input type="tel" id="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Optional" /></div>
                            <div><label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">Occupation</label><input type="text" id="occupation" value={formData.occupation} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Optional, e.g., Construction" /></div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label htmlFor="homeState" className="block text-sm font-medium text-gray-700 mb-1 required">Home State</label><select id="homeState" value={formData.homeState} onChange={handleStateChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required><option value="">Select State</option>{Object.keys(statesAndCities).map(state => <option key={state} value={state}>{state}</option>)}</select></div>
                                <div><label htmlFor="homeCity" className="block text-sm font-medium text-gray-700 mb-1 required">Home City / District</label><select id="homeCity" value={formData.homeCity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required disabled={!formData.homeState}><option value="">Select City</option>{formData.homeState && statesAndCities[formData.homeState].map(city => <option key={city} value={city}>{city}</option>)}</select></div>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-center">Step 2: Health Information (Optional)</h3>
                        <div className="space-y-6">
                             <div><label htmlFor="pastHistory" className="block text-sm font-medium text-gray-700 mb-1">Past Medical History</label><textarea id="pastHistory" rows="3" value={formData.pastHistory} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Diabetes, or type 'None'"></textarea></div>
                             <div><label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label><textarea id="allergies" rows="2" value={formData.allergies} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Penicillin, or type 'None'"></textarea></div>
                             <div><label htmlFor="disabilities" className="block text-sm font-medium text-gray-700 mb-1">Disabilities or Chronic Conditions</label><textarea id="disabilities" rows="2" value={formData.disabilities} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Physical disability, or type 'None'"></textarea></div>
                             <div><label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label><textarea id="medications" rows="2" value={formData.medications} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Metformin, or type 'None'"></textarea></div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Previous Health Records (PDF only)</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center"><UploadCloud className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"><span>{uploadedFile ? uploadedFile.name : 'Upload a PDF'}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" /></label></div><p className="text-xs text-gray-500">PDF up to 10MB</p></div></div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-center">Step 3: Verification</h3>
                        {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}
                        <div className="space-y-6">
                            <div className="verification-group"><label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1 required">Mobile Number</label><div className="flex space-x-2"><input type="tel" id="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required disabled={otpVerified.mobile} /><button type="button" onClick={() => handleSendOtp('mobile')} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-gray-300 flex-shrink-0" disabled={otpVerified.mobile}>{otpSent.mobile ? 'Resend OTP' : 'Send OTP'}</button></div>{otpSent.mobile && !otpVerified.mobile && (<div className="mt-2 flex space-x-2"><input type="text" name='motp' onChange={handleOtpChange} className="w-full p-2 border rounded-md" placeholder="Enter OTP" /><button type="button" onClick={() => handleVerifyOtp('mobile')} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-teal-600 flex-shrink-0 w-28 flex items-center justify-center" disabled={otpVerifying.mobile}>{otpVerifying.mobile ? <LoaderCircle className="animate-spin" /> : 'Verify'}</button></div>)}{otpVerified.mobile && <p className="text-green-600 text-sm mt-2 flex items-center"><CheckCircle2 size={16} className="mr-1"/> Mobile Verified</p>}</div>
                            <div className="verification-group"><label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1 required">Aadhaar Number</label><div className="flex space-x-2"><input type="text" id="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required disabled={otpVerified.aadhaar} /><button type="button" onClick={() => handleSendOtp('aadhaar')} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-gray-300 flex-shrink-0" disabled={otpVerified.aadhaar}>{otpSent.aadhaar ? 'Resend OTP' : 'Send OTP'}</button></div>{otpSent.aadhaar && !otpVerified.aadhaar && (<div className="mt-2 flex space-x-2"><input type="text" name='adrotp' onChange={handleOtpChange} className="w-full p-2 border rounded-md" placeholder="Enter OTP" /><button type="button" onClick={() => handleVerifyOtp('aadhaar')} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-teal-600 flex-shrink-0 w-28 flex items-center justify-center" disabled={otpVerifying.aadhaar}>{otpVerifying.aadhaar ? <LoaderCircle className="animate-spin" /> : 'Verify'}</button></div>)}{otpVerified.aadhaar && <p className="text-green-600 text-sm mt-2 flex items-center"><CheckCircle2 size={16} className="mr-1"/> Aadhaar Verified</p>}</div>
                        </div>
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-center">Step 4: Preview Your Details</h3>
                        <p className="text-center text-sm text-gray-500 mb-6">Please review all information carefully.</p>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                            <div className="pb-2 border-b"><div className="flex justify-between items-center"><h4 className="font-semibold text-gray-700">Personal Details</h4><button type="button" onClick={() => handleEditStep(0)} className="text-blue-600 text-sm font-semibold">Edit</button></div><div className="mt-2 text-sm grid grid-cols-2 gap-2"><p><strong>Name:</strong> <span className="font-semibold text-gray-800">{formData.fullName}</span></p><p><strong>DOB:</strong> <span className="font-semibold text-gray-800">{formData.dob}</span></p><p><strong>Gender:</strong> <span className="font-semibold text-gray-800">{formData.gender}</span></p><p><strong>Blood Group:</strong> <span className="font-semibold text-gray-800">{formData.bloodGroup}</span></p><p><strong>Address:</strong> <span className="font-semibold text-gray-800">{formData.homeCity}, {formData.homeState}</span></p></div></div>
                            <div className="pt-2"><div className="flex justify-between items-center"><h4 className="font-semibold text-gray-700">Health Information</h4><button type="button" onClick={() => handleEditStep(1)} className="text-blue-600 text-sm font-semibold">Edit</button></div><div className="mt-2 text-sm space-y-2"><p><strong>History:</strong> <span className="font-semibold text-gray-800">{formData.pastHistory || 'N/A'}</span></p><p><strong>Allergies:</strong> <span className="font-semibold text-gray-800">{formData.allergies || 'N/A'}</span></p><p><strong>Disabilities:</strong> <span className="font-semibold text-gray-800">{formData.disabilities || 'N/A'}</span></p><p><strong>Medications:</strong> <span className="font-semibold text-gray-800">{formData.medications || 'N/A'}</span></p></div></div>
                        </div>
                    </div>
                );
            case 4:
                return (
                     <div>
                        <h3 className="font-semibold text-lg mb-4 text-center">Step 5: Secure Your Account</h3>
                        <div className="space-y-6">
                            <div><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 required">Create Password</label><div className="relative"><input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">{showPassword ? <EyeOff size={20}/> : <Eye size={20} />}</button></div><div className="mt-2 h-2 w-full bg-gray-200 rounded-full"><div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.color}`}></div></div></div>
                            <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 required">Confirm Password</label><input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />{passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}</div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <label className="flex items-start"><input type="checkbox" id="consent-data" checked={consents.data} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" /><span className="ml-3 text-sm text-gray-600">I consent to the use of my anonymized health data for public health research. <span className="text-red-500">*</span></span></label>
                            <label className="flex items-start"><input type="checkbox" id="consent-share" checked={consents.share} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" /><span className="ml-3 text-sm text-gray-600">I consent to sharing my health records with authorized doctors. <span className="text-red-500">*</span></span></label>
                            <label className="flex items-start"><input type="checkbox" id="consent-terms" checked={consents.terms} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" /><span className="ml-3 text-sm text-gray-600">I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a>. <span className="text-red-500">*</span></span></label>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8"><a href="/" className="flex items-center justify-center space-x-3"><HeartPulse className="h-12 w-12 text-blue-600" /><div><h1 className="text-3xl font-bold text-gray-800">Arogya Connect</h1><p className="text-xs text-gray-500">Your Health, Connected</p></div></a></div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Create Your Health ID</h2>
                    <p className="text-center text-gray-500 text-sm mt-2 mb-6">A single, secure ID for all your health records.</p>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">{[...Array(5)].map((_, i) => (<React.Fragment key={i}><div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep > i ? 'bg-green-600 text-white' : ''} ${currentStep === i ? 'bg-blue-600 text-white' : ''} ${currentStep < i ? 'bg-gray-200 text-gray-500' : ''}`}>{currentStep > i ? <Check size={20} /> : i + 1}</div>{i < 4 && <div className={`flex-1 h-1 ${currentStep > i ? 'bg-green-600' : 'bg-gray-200'}`}></div>}</React.Fragment>))}</div>
                    <form onSubmit={handleSubmit}>
                        {renderStepContent()}
                        <div className="mt-8 flex justify-between">
                            {currentStep > 0 ? (<button type="button" onClick={handlePrevStep} className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-400">Back</button>) : <div></div>}
                            {currentStep < stepsConfig.length - 1 ? (<button type="button" onClick={handleNextStep} disabled={!isStepValid} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Next Step</button>) : (<button type="submit" disabled={!isStepValid} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Create Account</button>)}
                        </div>
                    </form>
                    <div className="mt-6 pt-6 border-t text-center text-sm"><p className="text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Login Here</Link></p></div>
                </div>
            </div>
            {showSuccessModal && (<div className="fixed inset-0 z-50 flex items-center justify-center"><div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setShowSuccessModal(false)}></div><div className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm p-8 m-4 text-center transform transition-all duration-300 scale-100 opacity-100"><div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center"><CheckCircle2 className="h-12 w-12 text-green-600" /></div><h3 className="text-2xl font-semibold mt-6 mb-2">Registration Successful!</h3><p className="text-gray-600 mb-6">Your Arogya Connect Health ID has been created.</p><Link to="/" className="w-full block bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700">Login Now</Link></div></div>)}
            <style jsx global>{`label.required::after { content: ' *'; color: #EF4444; }`}</style>
        </div>
    );
};

export default Register;