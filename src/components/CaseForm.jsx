"use client";

import { useState } from "react";
import { Home, Briefcase, FileText, ShoppingBag, Users, HelpCircle, Upload, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const issueTypes = [
  { id: "landlord", icon: Home, label: "Landlord/Tenant", description: "Leases, deposits, evictions" },
  { id: "employment", icon: Briefcase, label: "Employment", description: "Wages, wrongful termination" },
  { id: "contracts", icon: FileText, label: "Contracts", description: "Disputes, breaches, claims" },
  { id: "consumer", icon: ShoppingBag, label: "Consumer Rights", description: "Products, services, refunds" },
  { id: "family", icon: Users, label: "Family", description: "Custody, divorce, support" },
  { id: "other", icon: HelpCircle, label: "Other", description: "Something else" },
];

const CaseForm = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [location, setLocation] = useState("");
  const [situation, setSituation] = useState("");

  return (
    <section className="py-24 bg-[#FBFAF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Tell Us What's <span className="italic">Happening</span>
          </h2>
          <p className="text-lg text-gray-500">
            Share the details of your situation and we'll provide personalized guidance
          </p>
        </div>

        {/* Form */}
        <div className="space-y-10">
          
          {/* Step 1: Issue Type */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                1
              </span>
              What type of issue are you facing?
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {issueTypes.map((issue) => {
                const Icon = issue.icon;
                return (
                  <button
                    key={issue.id}
                    type="button"
                    className="p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-sm border-border hover:border-accent/50 group"
                  >
                    <Icon className="w-5 h-5 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <div className="font-medium text-foreground text-sm">{issue.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{issue.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Location */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                2
              </span>
              Where are you located?
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="City, State/Province, Country"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <p className="text-xs text-muted-foreground">This helps us provide jurisdiction-specific legal guidance</p>
          </div>

          {/* Submit Button (Customized) */}
          <div className="pt-4">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 bg-accent text-accent-foreground font-medium hover:brightness-105 active:scale-[0.98] h-14 rounded-xl px-10 text-lg w-full">
              Get Legal Guidance
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Your information is encrypted and never shared. This is not legal advice — it's educational guidance to help you understand your options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseForm;