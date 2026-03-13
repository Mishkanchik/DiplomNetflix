import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import { transitions, type TransitionType } from "../api/pageTransitions";

interface AnimatedOutletProps {
    transition?: TransitionType;           // за замовчуванням або пропс
    className?: string;
}

export default function AnimatedOutlet({
    transition = "fadeInUp",              // дефолтна анімація
    className = "",
}: AnimatedOutletProps) {
    const location = useLocation();
    const outlet = useOutlet();

    if (!outlet) return null;

    const selectedVariants = transitions[transition];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={selectedVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`w-full ${className}`}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
}