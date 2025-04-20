
import React from 'react';
import { motion } from 'framer-motion';
import WebShowcase from '../showcase/WebShowcase';
import { screenshotVariants } from '../animations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const LaptopFrame = () => {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  return (
    <div className="relative w-full aspect-[16/10]">
      <motion.div 
        className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900 to-purple-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full h-full select-none">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-purple-950 to-purple-900 z-10 flex justify-center items-center">
            <div className="w-2 h-2 rounded-full bg-purple-400/50"></div>
          </div>
          
          <div className="absolute top-4 left-0 right-0 bottom-0 overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/90 dark:from-purple-900 dark:to-purple-800">
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
                    className="w-full h-full"
                  >
                    <WebShowcase />
                  </motion.div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-gradient-to-r from-purple-900 to-purple-800 rounded-b-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};

export default LaptopFrame;
