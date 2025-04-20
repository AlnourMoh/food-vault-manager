
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const contentVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export const screenshotVariants = {
  hidden: { 
    opacity: 0, 
    x: 50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  }
};

export const deviceFrameVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};
