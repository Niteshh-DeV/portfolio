import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Code, Pen, Heart } from 'lucide-react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Code,
      title: 'Computer Engineering Student',
      description: 'Pursuing excellence in computer science and engineering, specializing in cutting-edge technologies.'
    },
    {
      icon: Pen,
      title: 'Poet',
      description: 'Weaving emotions into words, expressing the beauty of life through poetry and creative writing.'
    },
    {
      icon: Heart,
      title: 'Passionate Creator',
      description: 'Combining technical expertise with artistic expression to build meaningful projects and share inspiring stories.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 uppercase tracking-wider">About Me</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-effect p-8 rounded-lg border-2 border-[rgb(var(--border))] group cursor-pointer hover:border-[rgb(var(--foreground))] transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-lg bg-[rgb(var(--foreground))] flex items-center justify-center mb-6 mx-auto"
              >
                <feature.icon className="text-[rgb(var(--background))]" size={28} />
              </motion.div>
              <h4 className="text-center mb-4 uppercase tracking-wider">{feature.title}</h4>
              <p className="text-[rgb(var(--muted-foreground))] text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-effect p-8 md:p-12 rounded-lg border-2 border-[rgb(var(--border))]"
        >
          <p className="text-center max-w-3xl mx-auto mb-6">
            I'm a passionate engineering student with a unique blend of technical prowess and creative expression. 
            My journey in technology is driven by curiosity and innovation, while my love for poetry adds a human 
            touch to everything I create.
          </p>
          <p className="text-center max-w-3xl mx-auto text-[rgb(var(--muted-foreground))]">
            Whether I'm training machine learning models, building full-stack applications, or crafting verses that 
            resonate with the soul, I approach every endeavor with dedication and creativity. I believe in the power 
            of technology to transform lives and the magic of words to touch hearts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}