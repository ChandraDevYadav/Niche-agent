import React, { useEffect } from "react";
// eslint-disable-next-line
import { motion } from "framer-motion";
import Header from "./components/Header";
import ConsultingNicheForm from "./components/ConsultingNicheForm";

function App() {
  useEffect(() => {
    // Add a gradient background that slowly shifts colors
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-primary-50",
      "to-secondary-50"
    );
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <ConsultingNicheForm />
      </div>

      {/* Background animated shapes */}
      <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </motion.div>
  );
}

export default App;
