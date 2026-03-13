import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
    initial: {
        opacity: 0,
        y: 24,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        transition: {
            duration: 0.4,
            ease: "easeIn",
        },
    },
};

export const slideFromRight: Variants = {
    initial: { x: "100%", opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.5, ease: "easeIn" },
    },
};

export const slideFromBottom: Variants = {
    initial: { y: "100%", opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, // cubic-bezier для "природності"
    },
    exit: {
        y: "-30%",
        opacity: 0,
        transition: { duration: 0.45, ease: "easeIn" },
    },
};

export const zoomInFade: Variants = {
    initial: { opacity: 0, scale: 0.88 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        scale: 1.04,
        transition: { duration: 0.4, ease: "easeIn" },
    },
};

export const blurFade: Variants = {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        filter: "blur(6px)",
        transition: { duration: 0.5 },
    },
};

export const flipY: Variants = {
    initial: { opacity: 0, rotateY: 90 },
    animate: {
        opacity: 1,
        rotateY: 0,
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
        opacity: 0,
        rotateY: -70,
        transition: { duration: 0.5 },
    },
};

export const revealFromLeft: Variants = {
    initial: { clipPath: "inset(0 100% 0 0)" },
    animate: {
        clipPath: "inset(0 0 0 0)",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
        clipPath: "inset(0 0 0 100%)",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
    },
};

// Додай у Record transitions (внизу файлу)
export const transitions: Record<TransitionType, Variants> = {
    fadeInUp,
    slideFromRight,
    slideFromBottom,     // ← новий
    zoomInFade,          // ← новий
    blurFade,            // ← новий
    flipY,               // ← новий (виглядає ефектно, але не для повільного інтернету)
    revealFromLeft,      // ← новий (дуже сучасний ефект)
};

// Онови тип
export type TransitionType =
    | "fadeInUp"
    | "slideFromRight"
    | "slideFromBottom"
    | "zoomInFade"
    | "blurFade"
    | "flipY"
    | "revealFromLeft";