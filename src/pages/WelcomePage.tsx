
import React from 'react';
import HeroSection from '@/components/website/home/HeroSection';
import PlatformShowcase from '@/components/website/home/PlatformShowcase';
import CallToAction from '@/components/website/home/CallToAction';
import ContactSection from '@/components/website/home/ContactSection';

const WelcomePage = () => {
  return (
    <div className="space-y-20">
      <HeroSection />
      <PlatformShowcase />
      <CallToAction />
      <ContactSection />
    </div>
  );
};

export default WelcomePage;
