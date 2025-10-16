// Filename: src/components/AnimatedSection.jsx
import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // `once: true` makes the animation run only once
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Fire the animation
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 }, // Starts invisible and 75px down
          visible: { opacity: 1, y: 0 },   // Fades in and moves up to its original position
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AnimatedSection;
