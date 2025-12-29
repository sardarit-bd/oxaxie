import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CaseForm from "@/components/CaseForm";
import Testimonial from "@/components/Testimonial";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <CaseForm />
      <Testimonial />
    </main>
  );
};

export default Index;
