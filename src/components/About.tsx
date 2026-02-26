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
      description: 'Pursuing excellence in computer science and engineering, specializing in practical and future-focused technologies.'
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

  const highlights = [
    { label: 'Domains', value: 'AI/ML • Creative Tech' },
    { label: 'Approach', value: 'Build with empathy, iterate with intent' },
    { label: 'Goal', value: 'Craft work that is useful, memorable, and human' }
  ];

  return (
    <section id="about" aria-label="About me" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 uppercase tracking-wider font-handjet">About Me</h2>
          <p className="max-w-3xl mx-auto text-[rgb(var(--muted-foreground))]">
            I blend engineering precision with creative storytelling to design digital experiences that feel both powerful and personal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass-effect p-8 rounded-lg border-2 border-[rgb(var(--border))] group cursor-pointer hover:border-[rgb(var(--foreground))] transition-all h-full"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-lg bg-[rgb(var(--foreground))] flex items-center justify-center mb-6 mx-auto"
              >
                <feature.icon className="text-[rgb(var(--background))]" size={28} />
              </motion.div>
              <h4 className="text-center mb-4 uppercase tracking-wider font-handjet">{feature.title}</h4>
              <p className="text-[rgb(var(--muted-foreground))] text-center leading-relaxed">
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
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="mb-6 leading-relaxed">
                I&apos;m a passionate engineering student with a unique blend of technical execution and artistic expression.
                My journey in technology is driven by curiosity and impact, while poetry adds a human touch to everything I create.
              </p>
              <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                Whether I&apos;m training machine learning models, building full-stack applications, or writing verses that resonate,
                I approach every challenge with consistency, creativity, and care.
              </p>
            </div>

            <div className="space-y-4 pt-4 lg:pt-6">
              <h4 className="uppercase tracking-wider font-handjet">Current Focus</h4>
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--muted)/0.35)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[rgb(var(--muted-foreground))] mb-2">{item.label}</p>
                  <p className="leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}