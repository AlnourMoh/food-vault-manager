
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { contentVariants, containerVariants } from './animations';

interface PlatformFeaturesProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({
  icon,
  title,
  description,
  features,
}) => {
  return (
    <motion.div variants={contentVariants} className="w-full md:w-1/2">
      <motion.div variants={contentVariants} className="flex items-center gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </motion.div>
      
      <motion.p variants={contentVariants} className="text-muted-foreground mb-6">
        {description}
      </motion.p>
      
      <motion.ul variants={containerVariants} className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            variants={contentVariants}
            className="flex items-center gap-2 text-foreground"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            {feature}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default PlatformFeatures;
