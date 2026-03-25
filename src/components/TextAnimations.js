import React from 'react';
import { motion } from 'framer-motion';

export const SplitText = ({ text, delay = 0.05, className = "" }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: 90,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <motion.span
      style={{ display: "inline-flex", flexWrap: "wrap", perspective: "1000px" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block", paddingRight: letter === " " ? "0.3em" : "0px" }}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const FadeText = ({ text, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    className={className}
  >
    {text}
  </motion.div>
);
