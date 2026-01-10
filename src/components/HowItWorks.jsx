'use client';

import React from 'react';
import { MessageSquare, Upload, Lightbulb, FileText } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Describe Your Situation",
    description: "Tell us what's happening in plain language. Select your issue type and location so we can give jurisdiction-specific guidance.",
    icon: MessageSquare, // Added this
  },
  {
    number: "02",
    title: "Upload Documents",
    description: "Share relevant documents like contracts, leases, notices, or correspondence. Our AI analyzes them to understand your case better.",
    icon: Upload, // Added this
  },
  {
    number: "03",
    title: "Get Clear Guidance",
    description: "Receive a clear analysis of your rights, the other party's obligations, and actionable next steps you can take today.",
    icon: Lightbulb, // Added this
  },
  {
    number: "04",
    title: "Generate Documents",
    description: "Get professionally drafted letters, responses, and legal notices tailored to your specific situation and jurisdiction.",
    icon: FileText, // Added this
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#F7F6F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            How <span className="italic font-serif">Advocate</span> Works
          </h2>
          <p className="text-[#64748B] text-[16.5px] leading-[1.6] font-inter">
            Get from confusion to clarity in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            // Fallback to MessageSquare if icon is undefined to prevent crashes
            const Icon = step.icon || MessageSquare; 
            
            return (
              <div
                key={step.number}
                className="relative group h-full"
              >
                {/* Connecting Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[51%] h-px bg-gray-200 z-20" />
                )}

                {/* Card Container */}
                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  
                  {/* Top Row: Icon and Number */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon Container - Turns Yellow on Group Hover */}
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center border border-gray-100 group-hover:bg-[#FFAF0B]/30 transition-colors duration-300">
                      <Icon className="w-6 h-8 text-black group-hover:text-[#FFAF0B]" strokeWidth={1.5} />
                    </div>

                    {/* Step Number - Updated to change to a darker gray or accent color on Group Hover */}
                    <span className="text-4xl font-serif text-gray-200 group-hover:text-[#FFAF0B]/40 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  {/* Text Content */}
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#64748B] text-[13.5px] leading-[1.6] font-inter">
                      {step.description}
                    </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;