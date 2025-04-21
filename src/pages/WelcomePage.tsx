import React from 'react';
import HeroSection from '@/components/website/home/HeroSection';
import PlatformShowcase from '@/components/website/home/PlatformShowcase';
import VideoTutorials from '@/components/website/home/VideoTutorials';
import CallToAction from '@/components/website/home/CallToAction';
import ContactSection from '@/components/website/home/ContactSection';
import AboutSection from '@/components/website/home/AboutSection';
import ServicesSection from '@/components/website/home/ServicesSection';
import RestaurantLogos from '@/components/website/home/RestaurantLogos';
import SmartSensorsSection from '@/components/website/home/SmartSensorsSection';

const WelcomePage = () => {
  return (
    <div className="space-y-20">
      <HeroSection />
      <div id="about">
        <AboutSection />
      </div>
      <div id="services">
        <ServicesSection />
      </div>
      <SmartSensorsSection />
      <PlatformShowcase />
      <RestaurantLogos />
      <VideoTutorials />
      <CallToAction />
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
};

export default WelcomePage;
