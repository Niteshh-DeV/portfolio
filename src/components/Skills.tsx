import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      category: 'AI & Machine Learning',
      skills: ['Scikit-learn', 'Data Visualization', 'Deep Learning', 'NumPy', 'Pandas']
    },
    {
      category: 'Programming Languages',
      skills: ['C++', 'Python', 'JavaScript', 'C']
    },
    {
      category: 'Web Development',
      skills: ['HTML', 'Tailwind CSS', 'JavaScript']
    },
    {
      category: 'Tools & Others',
      skills: ['Git & GitHub', 'Docker', 'AWS', 'Linux', 'VS Code', 'Postman']
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--muted))]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">SKILLS & EXPERTISE</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="glass-effect p-6 rounded-lg hover:shadow-xl transition-all duration-300 border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--foreground))] overflow-hidden"
            >
              <h3 className="mb-4 text-[rgb(var(--primary))] uppercase tracking-wider text-sm break-words">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                    className="px-3 py-2 bg-[rgb(var(--muted))] rounded-md border border-[rgb(var(--border))] hover:bg-[rgb(var(--foreground))] hover:text-[rgb(var(--background))] transition-all duration-200 whitespace-nowrap"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}