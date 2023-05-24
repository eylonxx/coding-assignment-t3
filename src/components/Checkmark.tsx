import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CheckmarkProps {
  color: string;
  isActive: boolean;
}
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, bounce: 0, ease: "easeInOut" },
      opacity: { duration: 0.01 },
    },
  },
};
const Checkmark = ({ color, isActive }: CheckmarkProps) => {
  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width='25'
      height='25'
      fill='currentColor'
      viewBox='0 0 16 16'
    >
      <path
        fill={`${isActive ? color : "gray"}`}
        d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'
      />
      <motion.path
        variants={draw}
        stroke='#222'
        d='M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z'
      />
    </motion.svg>
  );
};

export default Checkmark;
