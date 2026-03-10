import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, FileText, Mail, User, Briefcase, Layers, Building2, Armchair, Box, Globe, Plane, Video, ArrowUpRight, Phone } from 'lucide-react';

interface QuoteFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    preselectedService?: string;
    isInline?: boolean;
    isCompact?: boolean;
}

// Telegram configuration (add these to your .env.local file)
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
const SEND_TO_EMAIL = import.meta.env.VITE_SEND_TO_EMAIL || '';

const projectTypes = [
    { id: 'residential', label: 'Residential', icon: Building2, description: 'Homes, apartments, housing developments' },
    { id: 'commercial', label: 'Commercial', icon: Briefcase, description: 'Offices, retail, mixed-use buildings' },
    { id: 'interior', label: 'Interior', icon: Armchair, description: 'Interior design, renovations, staging' },
];

const serviceTypes = [
    { id: 'exterior-rendering', label: 'Exterior Rendering', icon: Building2 },
    { id: 'interior-visualization', label: 'Interior Visualization', icon: Armchair },
    { id: 'immersive-tours', label: 'Immersive 3D Tours', icon: Box },
    { id: 'virtual-tour', label: 'Virtual Tour 360°', icon: Globe },
    { id: 'aerial-rendering', label: 'Aerial Rendering', icon: Plane },
    { id: 'animation', label: '3D Animation', icon: Video },
];

interface FormContentProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    uploadedFiles: File[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isSubmitting: boolean;
    isSubmitted: boolean;
    touchedFields: Record<string, boolean>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur: (fieldName: string) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: (index: number) => void;
    validateStep1: () => boolean;
    validateStep2: () => boolean;
    validateStep3: () => boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    nextStep: () => void;
    prevStep: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    projectTypes: typeof projectTypes;
    serviceTypes: typeof serviceTypes;
    onClose?: () => void;
}

const FormContent: React.FC<FormContentProps> = ({
    step, setStep, formData, setFormData, uploadedFiles, setUploadedFiles,
    isSubmitting, isSubmitted, touchedFields, handleInputChange, handleBlur,
    handleFileUpload, handleRemoveFile, validateStep1, validateStep2, validateStep3,
    handleSubmit, nextStep, prevStep, fileInputRef, projectTypes, serviceTypes, onClose
}) => {
    if (isSubmitted) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="font-display text-3xl text-white mb-4">Your Request Has Been Sent!</h3>
                <p className="text-neutral-400 text-lg mb-8">
                    Thank you for your interest. Our team will review your project details and contact you at <span className="text-white">{formData.email}</span> within 24 hours.
                </p>
                <div className="inline-flex items-center gap-2 text-neutral-500 text-sm">
                    <Mail size={16} />
                    <span>A confirmation email has been sent to your inbox</span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                            step >= s
                                ? 'bg-white text-neutral-950'
                                : 'bg-white/5 text-neutral-500 border border-white/10'
                        }`}>
                            {step > s ? <CheckCircle2 size={18} /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-px transition-all ${
                                step > s ? 'bg-white/50' : 'bg-white/10'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Contact Information */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <User size={14} />
                                Full Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('name')}
                                placeholder="John Doe"
                                required
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover ${
                                    touchedFields.name && !formData.name
                                        ? 'border-red-500/50'
                                        : 'border-white/10'
                                }`}
                            />
                            {touchedFields.name && !formData.name && (
                                <p className="text-red-400 text-xs mt-1">Name is required</p>
                            )}
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <Phone size={14} />
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('phone')}
                                placeholder="+1 (555) 000-0000"
                                required
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover ${
                                    touchedFields.phone && !formData.phone
                                        ? 'border-red-500/50'
                                        : 'border-white/10'
                                }`}
                            />
                            {touchedFields.phone && !formData.phone && (
                                <p className="text-red-400 text-xs mt-1">Phone number is required</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <Mail size={14} />
                                Email Address <span className="text-neutral-500">(optional)</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('email')}
                                placeholder="john@company.com"
                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover ${
                                    touchedFields.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                                        ? 'border-red-500/50'
                                        : 'border-white/10'
                                }`}
                            />
                            {touchedFields.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>
                            )}
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <Briefcase size={14} />
                                Company Name <span className="text-neutral-500">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('company')}
                                placeholder="Your company (optional)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                if (validateStep1()) {
                                    nextStep();
                                }
                            }}
                            className="bg-white text-neutral-950 px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-hover"
                        >
                            Continue
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Project Details */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                        <label className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                            <Briefcase size={14} />
                            Project Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {projectTypes.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, projectType: type.id }));
                                        setTouchedFields(prev => ({ ...prev, projectType: true }));
                                    }}
                                    className={`p-4 rounded-xl border text-left transition-all cursor-hover ${
                                        formData.projectType === type.id
                                            ? 'bg-white text-neutral-950 border-white'
                                            : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }`}
                                >
                                    <type.icon size={24} className="mb-3" />
                                    <div className="font-medium text-sm">{type.label}</div>
                                    <div className={`text-xs mt-1 ${
                                        formData.projectType === type.id ? 'text-neutral-600' : 'text-neutral-500'
                                    }`}>{type.description}</div>
                                </button>
                            ))}
                        </div>
                        {touchedFields.projectType && !formData.projectType && (
                            <p className="text-red-400 text-xs mt-2">Please select a project type</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                            <Layers size={14} />
                            Service Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {serviceTypes.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, serviceType: service.id }));
                                        setTouchedFields(prev => ({ ...prev, serviceType: true }));
                                    }}
                                    className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all cursor-hover ${
                                        formData.serviceType === service.id
                                            ? 'bg-white text-neutral-950 border-white'
                                            : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }`}
                                >
                                    <service.icon size={20} />
                                    <span className="text-sm font-medium">{service.label}</span>
                                </button>
                            ))}
                        </div>
                        {touchedFields.serviceType && !formData.serviceType && (
                            <p className="text-red-400 text-xs mt-2">Please select a service type</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="border border-white/20 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2 cursor-hover"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (validateStep2()) {
                                    nextStep();
                                }
                            }}
                            disabled={!formData.projectType || !formData.serviceType}
                            className="bg-white text-neutral-950 px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Additional Details & Upload */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="group">
                        <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                            <FileText size={14} />
                            Project Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="projectDetails"
                            value={formData.projectDetails}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('projectDetails')}
                            rows={4}
                            placeholder="Describe your project, goals, and any specific requirements..."
                            required
                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none cursor-hover ${
                                touchedFields.projectDetails && !formData.projectDetails
                                    ? 'border-red-500/50'
                                    : 'border-white/10'
                            }`}
                        />
                        {touchedFields.projectDetails && !formData.projectDetails && (
                            <p className="text-red-400 text-xs mt-1">Project description is required</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <Phone size={14} />
                                Timeline <span className="text-neutral-500">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('timeline')}
                                placeholder="e.g., 2-3 months"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover"
                            />
                        </div>
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                                <Briefcase size={14} />
                                Budget <span className="text-neutral-500">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('budget')}
                                placeholder="e.g., $5,000 - $10,000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all cursor-hover"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                            <Upload size={14} />
                            Upload Files <span className="text-neutral-500">(optional)</span>
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                            <p className="text-neutral-400 text-sm mb-1">Click to upload or drag and drop</p>
                            <p className="text-neutral-600 text-xs">PDF, DWG, SKP, or images (max 10MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.dwg,.skp,.jpg,.jpeg,.png,.webp"
                            />
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-neutral-400" />
                                            <span className="text-sm text-neutral-300">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="text-neutral-500 hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="border border-white/20 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2 cursor-hover"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white text-neutral-950 px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-hover disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Request'}
                            {!isSubmitting && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

const QuoteForm: React.FC<QuoteFormProps> = ({ isOpen = true, onClose = () => {}, preselectedService, isInline = false, isCompact = false }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        projectType: '',
        serviceType: preselectedService || '',
        projectDetails: '',
        timeline: '',
        budget: '',
        howDidYouHear: '',
    });
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouchedFields(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = (fieldName: string) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep1 = (): boolean => {
        if (!formData.name.trim()) {
            alert('Please enter your name');
            return false;
        }
        if (!formData.phone.trim()) {
            alert('Please enter your phone number');
            return false;
        }
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            alert('Please enter a valid phone number (at least 7 digits)');
            return false;
        }
        if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const validateStep2 = (): boolean => {
        if (!formData.projectType) {
            alert('Please select a project type');
            return false;
        }
        if (!formData.serviceType) {
            alert('Please select a service type');
            return false;
        }
        return true;
    };

    const validateStep3 = (): boolean => {
        if (!formData.projectDetails.trim()) {
            alert('Please describe your project');
            return false;
        }
        if (formData.projectDetails.trim().length < 10) {
            alert('Please provide more details about your project (at least 10 characters)');
            return false;
        }
        return true;
    };

    const sendToTelegram = async (): Promise<boolean> => {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Telegram credentials not configured. Please update .env.local with VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID');
            alert('Telegram not configured. Please contact the administrator.');
            return false;
        }

        const projectTypeLabel = projectTypes.find(pt => pt.id === formData.projectType)?.label || formData.projectType;
        const serviceTypeLabel = serviceTypes.find(st => st.id === formData.serviceType)?.label || formData.serviceType;

        let message = `🎯 *New Quote Request*\n\n`;
        message += `👤 *Name:* ${formData.name}\n`;
        message += `📱 *Phone:* ${formData.phone}\n`;
        if (formData.email) {
            message += `📧 *Email:* ${formData.email}\n`;
        }
        if (formData.company) {
            message += `🏢 *Company:* ${formData.company}\n`;
        }
        message += `\n`;
        message += `📋 *Project Type:* ${projectTypeLabel}\n`;
        message += `🛠️ *Service Type:* ${serviceTypeLabel}\n`;
        message += `\n`;
        message += `📝 *Project Details:*\n${formData.projectDetails}\n\n`;
        if (formData.timeline) {
            message += `⏰ *Timeline:* ${formData.timeline}\n`;
        }
        if (formData.budget) {
            message += `💰 *Budget:* ${formData.budget}\n`;
        }
        if (formData.howDidYouHear) {
            message += `📢 *Source:* ${formData.howDidYouHear}\n`;
        }

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Telegram API Error:', data);
                alert(`Failed to send to Telegram: ${data.description || 'Unknown error'}`);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            alert('Error connecting to Telegram. Please check your internet connection.');
            return false;
        }
    };

    const sendFilesToTelegram = async (): Promise<boolean> => {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || uploadedFiles.length === 0) {
            return true;
        }

        for (const file of uploadedFiles) {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;
            const formDataFile = new FormData();
            formDataFile.append('chat_id', TELEGRAM_CHAT_ID);
            formDataFile.append('document', file);
            formDataFile.append('caption', `📎 File from ${formData.name}: ${file.name}`);

            try {
                await fetch(url, {
                    method: 'POST',
                    body: formDataFile,
                });
            } catch (error) {
                console.error('Error sending file to Telegram:', error);
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const telegramSuccess = await sendToTelegram();

            if (uploadedFiles.length > 0) {
                await sendFilesToTelegram();
            }

            setIsSubmitting(false);

            if (telegramSuccess) {
                setIsSubmitted(true);
            } else {
                alert('Failed to submit form. Please check your Telegram configuration or contact us directly at contact@noveld.com.et');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            alert('An error occurred. Please try again or contact us directly at contact@noveld.com.et');
        }

        setTimeout(() => {
            setIsSubmitted(false);
            setStep(1);
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                projectType: '',
                serviceType: '',
                projectDetails: '',
                timeline: '',
                budget: '',
                howDidYouHear: '',
            });
            setUploadedFiles([]);
            if (onClose) onClose();
        }, 3000);
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    if (!isOpen && !isInline) return null;

    if (isInline) {
        const sectionClasses = isCompact
            ? ''
            : 'py-32 bg-neutral-950 relative overflow-hidden';
        const containerClasses = isCompact
            ? ''
            : 'max-w-4xl mx-auto px-6 lg:px-12 relative z-10';
        const headerClasses = isCompact
            ? 'text-center mb-8'
            : 'text-center mb-12';
        const headingClasses = isCompact
            ? 'font-display text-2xl md:text-3xl font-medium mb-3'
            : 'font-display text-4xl md:text-5xl font-medium mb-6';
        const textClasses = isCompact
            ? 'text-neutral-400 text-sm'
            : 'text-neutral-400 leading-relaxed text-lg max-w-2xl mx-auto';

        return (
            <div className={sectionClasses}>
                {!isCompact && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                )}
                <div className={containerClasses}>
                    {!isCompact && (
                        <div className={headerClasses}>
                            <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">Request a Quote</p>
                            <h2 className={headingClasses}>
                                Let's Discuss Your <span className="text-stroke text-white">Project</span>
                            </h2>
                            <p className={textClasses}>
                                Tell us about your project and we'll get back to you within 24 hours with a customized quote.
                            </p>
                        </div>
                    )}
                    <FormContent
                        step={step}
                        setStep={setStep}
                        formData={formData}
                        setFormData={setFormData}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        isSubmitting={isSubmitting}
                        isSubmitted={isSubmitted}
                        touchedFields={touchedFields}
                        handleInputChange={handleInputChange}
                        handleBlur={handleBlur}
                        handleFileUpload={handleFileUpload}
                        handleRemoveFile={handleRemoveFile}
                        validateStep1={validateStep1}
                        validateStep2={validateStep2}
                        validateStep3={validateStep3}
                        handleSubmit={handleSubmit}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        fileInputRef={fileInputRef}
                        projectTypes={projectTypes}
                        serviceTypes={serviceTypes}
                        onClose={onClose}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-neutral-900 border-b border-white/10 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="font-display text-2xl md:text-3xl text-white">
                            {isSubmitted ? 'Thank You!' : 'Get a Free Quote for Your Project'}
                        </h2>
                        {!isSubmitted && (
                            <p className="text-neutral-400 text-sm mt-1">
                                Tell us about your project and we'll get back to you within 24 hours
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Close form"
                    >
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <div className="p-8">
                    <FormContent
                        step={step}
                        setStep={setStep}
                        formData={formData}
                        setFormData={setFormData}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        isSubmitting={isSubmitting}
                        isSubmitted={isSubmitted}
                        touchedFields={touchedFields}
                        handleInputChange={handleInputChange}
                        handleBlur={handleBlur}
                        handleFileUpload={handleFileUpload}
                        handleRemoveFile={handleRemoveFile}
                        validateStep1={validateStep1}
                        validateStep2={validateStep2}
                        validateStep3={validateStep3}
                        handleSubmit={handleSubmit}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        fileInputRef={fileInputRef}
                        projectTypes={projectTypes}
                        serviceTypes={serviceTypes}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuoteForm;
