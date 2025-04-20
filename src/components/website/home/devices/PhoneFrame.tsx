
import React from 'react';
import { motion } from 'framer-motion';
import MobileShowcase from '../showcase/MobileShowcase';
import { screenshotVariants } from '../animations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const PhoneFrame = () => {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-[9/16]">
      <motion.div 
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-purple-900 bg-gradient-to-br from-purple-900 to-purple-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-5 bg-purple-950 rounded-b-lg z-10 flex justify-center items-end pb-1">
          <div className="w-2 h-2 rounded-full bg-purple-400/50"></div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/90 dark:from-purple-900 dark:to-purple-800">
          <Carousel
            plugins={[autoplay.current]}
            className="w-full h-full pointer-events-none"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              <CarouselItem>
                <motion.div
                  variants={screenshotVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full h-full select-none"
                >
                  <MobileShowcase />
                </motion.div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-purple-900 to-purple-800 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};

export default PhoneFrame;
