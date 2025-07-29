import { motion } from "motion/react";

function LoadingCircleSpinner() {
  return (
    <div className="flex justify-center items-center p-10 rounded-sm">
      <motion.div
        className="w-10 h-10 rounded-full border-2 border-t-2 border-t-black"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default LoadingCircleSpinner;
