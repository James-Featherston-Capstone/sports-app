import type { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: (e: MouseEvent) => void;
  children: ReactNode;
}

const RSVPModal = ({ isOpen, onClose, children }: RSVPModalProps) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed w-screen h-screen top-0 left-0 bg-black/10 z-5"
            onClick={onClose}
          />
          <motion.span
            onClick={onClose}
            className={`z-50 absolute left-1/2 top-1/2 flex items-center justify-center text-black`}
            initial={{
              transform: "translate(-50%, -150%) rotate(-360deg)",
              opacity: 0,
            }}
            animate={{
              transform: "translate(-50%, -50%) rotate(0deg)",
              opacity: 1,
            }}
            transition={{ duration: 1.2, ease: "linear" }}
          >
            {children}
          </motion.span>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RSVPModal;
