
import React from 'react';
import { motion } from 'framer-motion';
import WebShowcase from '../showcase/WebShowcase';
import { screenshotVariants } from '../animations';

const LaptopFrame = () => {
  return (
    <div className="relative w-full aspect-[16/10]">
      <motion.div 
        className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl bg-gray-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gray-900 z-10 flex justify-center items-center">
            <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          </div>
          
          <div className="absolute top-4 left-0 right-0 bottom-0 bg-white overflow-hidden">
            <motion.div
              variants={screenshotVariants}
              initial="hidden"
              animate="visible"
              className="w-full h-full"
            >
              <WebShowcase />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-gray-700 rounded-b-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};

export default LaptopFrame;
