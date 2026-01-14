'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    // State for dynamic contact info
    const [contactInfo, setContactInfo] = useState({
        phone: '',
        email: '',
        address: '',
        twitter_url: '',
        instagram_url: '',
        linkedin_url: ''
    });
    const [loadingInfo, setLoadingInfo] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Contact Info on Mount
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await fetch('/api/contact');
                if (res.ok) {
                    const data = await res.json();
                    if (data) setContactInfo(data);
                }
            } catch (error) {
                console.error("Failed to load contact info", error);
            } finally {
                setLoadingInfo(false);
            }
        };

        fetchContactInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Message sent successfully!");
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                console.error('Validation errors:', data.errors);
                alert(data.message || "Failed to send message. Please check your inputs.");
            }
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#2d3748] font-sans selection:bg-blue-100">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl tracking-tight mb-4 text-[#1a202c] font-serif">
                        Get in 
                        <span className="text-[#1a202c] italic"> Touch</span>
                    </h1>
                    <p className="text-md text-gray-600 max-w-2xl mx-auto">
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
                    
                    {/* Contact Info Sidebar (Darker/Accent Background) */}
                    <div className="lg:col-span-1 bg-[#1E293E] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-white opacity-5"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                            <p className="text-gray-300 mb-10 leading-relaxed">
                                Fill up the form and our Team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <Phone className="w-6 h-6 text-blue-400 mt-1" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-gray-300">
                                            {loadingInfo ? 'Loading...' : (contactInfo.phone || '+1 (555) 123-4567')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 text-blue-400 mt-1" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-gray-300">
                                            {loadingInfo ? 'Loading...' : (contactInfo.email || 'hello@example.com')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-gray-300 whitespace-pre-line">
                                            {loadingInfo ? 'Loading...' : (contactInfo.address || '123 Innovation Dr,\nTech City, TC 90210')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12">
                            <div className="flex space-x-4">
                                {/* Twitter / X */}
                                <a 
                                    href={contactInfo.twitter_url || "#"} 
                                    target={contactInfo.twitter_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors duration-300 cursor-pointer ${!contactInfo.twitter_url && !loadingInfo ? 'opacity-50 cursor-default' : ''}`}
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>

                                {/* Instagram */}
                                <a 
                                    href={contactInfo.instagram_url || "#"} 
                                    target={contactInfo.instagram_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors duration-300 cursor-pointer ${!contactInfo.instagram_url && !loadingInfo ? 'opacity-50 cursor-default' : ''}`}
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href={contactInfo.linkedin_url || "#"} 
                                    target={contactInfo.linkedin_url ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className={`p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${!contactInfo.linkedin_url && !loadingInfo ? 'opacity-50 cursor-default' : ''}`}
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="lg:col-span-2 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-500">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300/70 focus:border-[#F59F0A] focus:outline-none focus:ring-0 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-500">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300/70 focus:border-[#F59F0A] focus:outline-none focus:ring-0 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Subject Input */}
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-gray-500">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300/70 focus:border-[#F59F0A] focus:outline-none focus:ring-0 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Project Inquiry"
                                    required
                                />
                            </div>

                            {/* Message Input */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-500">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300/70 focus:border-[#F59F0A] focus:outline-none focus:ring-0 outline-none transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                                    placeholder="Tell us about your project..."
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-3 bg-[#E17100] hover:bg-[#E17100] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                    {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}