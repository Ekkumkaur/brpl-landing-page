import Navbar from '@/components/cricket/Navbar';
import HeroSection from '@/components/cricket/HeroSection';
import StatsSection from '@/components/cricket/StatsSection';
import FeaturesSection from '@/components/cricket/FeaturesSection';
// import TestimonialsSection from '@/components/cricket/TestimonialsSection';
import RegistrationForm from '@/components/cricket/RegistrationForm';
// import CoachRegistrationForm from '@/components/cricket/CoachRegistrationForm';
import FAQSection from '@/components/cricket/FAQSection';
import Footer from '@/components/cricket/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <div id="stats">
          <StatsSection />
        </div>
        {/* <div id="testimonials">
          <TestimonialsSection />
        </div> */}
        <div id="why-choose-us">
          <FeaturesSection />
        </div>
        <RegistrationForm />
        {/* <CoachRegistrationForm /> */}
        <div id="faqs">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
