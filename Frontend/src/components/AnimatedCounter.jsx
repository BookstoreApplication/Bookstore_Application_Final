import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedCounter = ({ value, prefix = "", duration = 1.2, decimals = 0 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setDisplay(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
    </motion.span>
  );
};

export default AnimatedCounter;
