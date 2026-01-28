'use client';

import { motion } from 'motion/react';

export const AnimatedDaleLogo = () => {
  return (
    <motion.img
      src="/planeta-light.svg"
      alt="planeta.id"
      className="h-7 w-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};
