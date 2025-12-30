import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CaseForm from "../components/CaseForm";
import Testimonial from "../components/Testimonial";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <CaseForm />
      <Testimonial />
    </main>
  );
};

export default Index;
