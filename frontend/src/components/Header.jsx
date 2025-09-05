import React, { useState, useEffect } from "react";
// eslint-disable-next-line
import { motion } from "framer-motion";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 text-gray-700 bg-white/90 py-4 px-6 mx-6 rounded-xl mt-4 transition-all duration-300 ease-in-out ${
        scrolled ? "bg-primary-800 shadow-lg" : "bg-primary-700"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-xl font-bold flex items-center gap-2 text-gray-700">
            <motion.span
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              className="inline-block"
            >
              🤖
            </motion.span>
            A2A Agent Dashboard
          </h1>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ul className="flex gap-6">
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="#"
                className="hover:text-gray-500 transition text-gray-700"
              >
                Home
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="#"
                className="hover:text-gray-500 transition text-gray-700"
              >
                About
              </a>
            </motion.li>
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="#"
                className="hover:text-gray-500 transition text-gray-700"
              >
                Contact
              </a>
            </motion.li>
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
}

export default Header;
