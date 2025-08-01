import { motion, useScroll, useTransform } from "framer-motion";

function FloatingButton({ onClick }: { onClick: () => void }) {
    const { scrollYProgress } = useScroll();
    // Animate scale from 1 to 1.1 as you scroll from 0 to 10% of the page
    const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.1]);

    return (
        <motion.button
            style={{
                position: "fixed", // <-- Use fixed for floating
                bottom: "2rem",
                right: "2rem",
                zIndex: 100,
                scale, // <-- This is a Framer Motion value, not a CSS property
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            onClick={onClick}
            aria-label="Add"
        >
            +
        </motion.button>
    );
}

export default FloatingButton;