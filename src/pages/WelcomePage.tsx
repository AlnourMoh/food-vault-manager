
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeroSection from '@/components/website/home/HeroSection';
import PlatformShowcase from '@/components/website/home/PlatformShowcase';
import VideoTutorials from '@/components/website/home/VideoTutorials';
import CallToAction from '@/components/website/home/CallToAction';
import ContactSection from '@/components/website/home/ContactSection';
import AboutSection from '@/components/website/home/AboutSection';
import ServicesSection from '@/components/website/home/ServicesSection';
import RestaurantLogos from '@/components/website/home/RestaurantLogos';
import SmartSensorsSection from '@/components/website/home/SmartSensorsSection';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const WelcomePage = () => {
  return (
    <div>
      <HeroSection />
      
      <div id="about" className="scroll-mt-16">
        <AnimatedSection>
          <AboutSection />
        </AnimatedSection>
      </div>
      
      <div id="services" className="scroll-mt-16">
        <AnimatedSection>
          <ServicesSection />
        </AnimatedSection>
      </div>
      
      <AnimatedSection>
        <SmartSensorsSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <PlatformShowcase />
      </AnimatedSection>
      
      <AnimatedSection>
        <RestaurantLogos />
      </AnimatedSection>
      
      <AnimatedSection>
        <VideoTutorials />
      </AnimatedSection>
      
      <AnimatedSection>
        <CallToAction />
      </AnimatedSection>
      
      <div id="contact" className="scroll-mt-16">
        <AnimatedSection>
          <ContactSection />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default WelcomePage;
