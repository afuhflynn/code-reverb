"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Reveal = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  const navbarWidth = useMotionValue(65);
  const routesOpacity = useTransform(navbarWidth, [65, 500], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;

    if (difference > 50) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
    }

    setHeight(difference);
  });

  const firstNavVariants = {
    hidden: {
      width: 65,
      background: "transparent",
    },
    vissible: {
      width: 500,
      background: "rgb(0,0,0,0.5)",
    },
  };

  const routes = ["Home", "About", "Pricing", "FAQ"];

  if (!mounted) return <div>Loading...</div>;

  return (
    <div className="h-full w-full center">
      <motion.nav
        animate={height > 50 && !isHidden ? "vissible" : "hidden"}
        whileHover="vissible"
        initial="hidden"
        exit="hidden"
        onFocusCapture={() => setIsHidden(false)}
        variants={firstNavVariants}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed text-neutral-700 p-[10px] z-[10000000000] h-[65px]  backdrop-blur top-10 left-0 right-0 mx-auto overflow-hidden rounded-lg flex items-center justify-between pr-6"
        )}
        style={{
          width: navbarWidth,
        }}
      >
        <motion.div
          animate={{
            height: 50,
          }}
          className="bg-black rounded-lg max-w-[50px] min-w-[50px] flex items-center justify-center"
        >
          {!isHidden ? (
            <div className="shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2 text-2xl font-bold text-foreground"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">R</span>
                </div>
                {/* <span>CodeReverb</span> */}
              </Link>
            </div>
          ) : (
            <div className="h-4 rounded w-4 bg-white rotate-45" />
          )}
        </motion.div>
        <div className="mr-10" />
        <AnimatePresence>
          {(height >= 0 || !isHidden) && (
            <motion.ul className="flex items-center gap-10">
              {routes.map((route) => (
                <motion.li
                  key={route}
                  className="text-white text-xl cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    opacity: routesOpacity,
                  }}
                >
                  {route}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Reveal;
