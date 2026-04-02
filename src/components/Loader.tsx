import { motion } from 'motion/react';

export function Loader() {
  const letters = "NITESH".split("");
  const extension = ".DEV".split("");

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      }
    },
  };

  const completionPulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        delay: 2.1,
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
    >
      <div className="flex flex-col items-center">
        <motion.div
          layoutId="logo-text"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-5xl md:text-6xl font-bold tracking-wider flex"
          style={{ fontFamily: '"Orbitron", sans-serif' }}
        >
          <motion.div className="flex" variants={completionPulse}>
          {letters.map((char, i) => (
            <motion.span key={i} variants={letterVariants} style={{ display: "inline-block" }}>
              {char}
            </motion.span>
          ))}
          <motion.span variants={letterVariants} style={{ color: '#ff6b35', display: "inline-block" }} className="flex">
            {extension.map((char, i) => (
              <motion.span key={i} variants={letterVariants} style={{ display: "inline-block" }}>
                {char}
              </motion.span>
            ))}
          </motion.span>
          </motion.div>
        </motion.div>
        
        {/* Page Load Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ 
            opacity: 1, 
            width: '180px',
            scale: [1, 1, 1.02, 1], // Pulse at the end
          }}
          transition={{ 
            width: { duration: 0.5, delay: 0.8 },
            opacity: { duration: 0.5, delay: 0.8 },
            scale: { delay: 2.1, duration: 0.3 }
          }}
          style={{ 
            position: 'relative', 
            marginTop: '2rem', 
            height: '4px', 
            backgroundColor: 'rgba(128,128,128,0.2)', 
            borderRadius: '9999px', 
            overflow: 'hidden',
            boxShadow: '0 0 15px rgba(0,0,0,0.1)'
          }}
        >
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#ff6b35', boxShadow: '0 0 10px #ff6b35' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
