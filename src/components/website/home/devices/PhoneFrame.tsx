
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';
import { screenshotVariants, deviceFrameVariants } from '../animations';

interface PhoneFrameProps {
  screenshots: string[];
  deviceImage: string;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ screenshots, deviceImage }) => {
  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-[9/16]">
      <motion.div 
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-900 bg-gray-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-5 bg-gray-900 rounded-b-lg z-10 flex justify-center items-end pb-1">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
        
        <div className="absolute inset-0 bg-white overflow-hidden">
          <Carousel 
            className="w-full h-full"
            opts={{
              align: "start",
              loop: true
            }}
          >
            <CarouselContent className="h-full">
              {screenshots.map((screenshot, idx) => (
                <CarouselItem key={idx} className="basis-full h-full">
                  <motion.div
                    variants={screenshotVariants}
                    initial="hidden"
                    animate="visible"
                    custom={idx}
                    className="w-full h-full"
                  >
                    <img 
                      src={screenshot} 
                      alt={`Mobile screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = deviceImage;
                      }}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20" />
          </Carousel>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};

export default PhoneFrame;
