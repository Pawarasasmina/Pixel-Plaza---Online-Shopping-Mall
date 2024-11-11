import React from "react";
import { motion } from "framer-motion";

export const HorizontalLine = () => {
  return (
    <motion.div
      className="h-1 bg-primary mt-4"
      animate={{ boxShadow: "0px 0px 8px 2px rgba(231, 111, 81, 0.7)" }}
      transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
    />
  );
};
