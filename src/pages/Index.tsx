import Navbar from '@/components/cricket/Navbar';
import HeroSection from '@/components/cricket/HeroSection';
import StatsSection from '@/components/cricket/StatsSection';
import FeaturesSection from '@/components/cricket/FeaturesSection';
// import TestimonialsSection from '@/components/cricket/TestimonialsSection';
import RegistrationForm from '@/components/cricket/RegistrationForm';
// import CoachRegistrationForm from '@/components/cricket/CoachRegistrationForm';
import FAQSection from '@/components/cricket/FAQSection';
import Footer from '@/components/cricket/Footer';
import SEO from '@/components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="BRPL - Join the Ultimate Cricket League"
        description="Register now for the Beyond Reach Premier League. Showcase your cricket talent, get coached by experts, and compete in the biggest tournament."
      />
      <Navbar />
      <main>
        <HeroSection />
        {/* <div id="stats">
          <StatsSection />
        </div> */}
        {/* <div id="testimonials">
          <TestimonialsSection />
        </div> */}
        <div id="why-choose-us">
          <FeaturesSection />
        </div>
        {/* <RegistrationForm /> */}
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
