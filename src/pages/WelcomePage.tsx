
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/website/home/HeroSection';
import PlatformShowcase from '@/components/website/home/PlatformShowcase';
import VideoTutorials from '@/components/website/home/VideoTutorials';
import CallToAction from '@/components/website/home/CallToAction';
import ContactSection from '@/components/website/home/ContactSection';
import { Button } from '@/components/ui/button';

const WelcomePage = () => {
  return (
    <div className="space-y-20">
      <div className="container mx-auto flex justify-end px-4 pt-4">
        <div className="space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/login">دخول المسؤول</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/restaurant/login">دخول المطعم</Link>
          </Button>
        </div>
      </div>
      <HeroSection />
      <PlatformShowcase />
      <VideoTutorials />
      <CallToAction />
      <ContactSection />
    </div>
  );
};

export default WelcomePage;
