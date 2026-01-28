import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

const project1Img = new URL('../assets/projectImage/p1.png', import.meta.url).href;
const project2Img = new URL('../assets/projectImage/p2.png', import.meta.url).href;
const project3Img = new URL('../assets/projectImage/p3.png', import.meta.url).href;

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { triggerHaptic } = useHaptic();

  const projects = [
    {
      title: 'Personal Portfolio Website',
      description: 'Built a responsive and interactive personal portfolio website to showcase my projects, skills, and experience.',
      tags: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
      github: 'https://github.com/Niteshh-DeV/portfolio',
      live: 'https://niteshjoshi.me',
      image: project1Img

    },
    {
      title: 'Weather App',
      description: 'Build an interactive weather application that fetches real-time data from a public API and displays it with dynamic backgrounds based on weather conditions.',
      tags: ['C++', 'Qt', 'API', 'JSON'],
      github: 'https://github.com/Niteshh-DeV/OOP_In_CPP/tree/main/Weather_App',
      live: '' ,
      image : project2Img
    },
    
    {
      title: 'Loan Prediction System',
      description: 'Developed a machine learning model to predict loan approval status based on applicant data, improving accuracy using feature engineering and different learning algorithms.',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'Data Analysis', 'Seaborn', 'Matplotlib', 'Numpy', 'Jupyter'],
      github: 'https://github.com/Niteshh-DeV/AI-ML-Journey-With-Learning-Utsav/tree/main/loan-approval-final-project',
      live: '',
      image : project3Img
    },
    {
      title: 'Collection Of Python Small Projects',
      description: 'A repository of small Python projects demonstrating various concepts such as Password generator, To-Do List and data analysis.',
      tags: ['Python', 'Data Analysis', 'Numpy', 'Pandas'],
      github: 'https://github.com/Niteshh-DeV/Python_Projects.git',
      live: ''
    },
    {
      title: 'Collection Of C++ Small Projects',
      description: 'A repository of small C++ projects demonstrating various concepts such as Student Management System and Library Management System.',
      tags: ['C++', 'OOP', 'STL'],
      github: 'https://github.com/Niteshh-DeV/Projects-.cpp.git',
      live: ''
    }
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--muted))]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 uppercase tracking-wider">Projects</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onHoverStart={() => {
                setHoveredProject(index);
                triggerHaptic('light');
              }}
              onHoverEnd={() => setHoveredProject(null)}
              onTouchStart={() => triggerHaptic('selection')}
              className="glass-effect rounded-lg overflow-hidden cursor-pointer group border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--foreground))] transition-all"
            >
              <div className="h-48 relative border-b-2 border-[rgb(var(--border))] overflow-hidden bg-[rgb(var(--muted))]">
                {project.image ? (
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    animate={{ scale: hoveredProject === index ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[rgb(var(--foreground))] opacity-10" />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-4">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => triggerHaptic('medium')}
                          onTouchStart={() => triggerHaptic('light')}
                          className="p-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--secondary))] transition-colors"
                        >
                          <Github size={20} />
                        </motion.button>
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => triggerHaptic('medium')}
                          onTouchStart={() => triggerHaptic('light')}
                          className="p-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--secondary))] transition-colors"
                        >
                          <ExternalLink size={20} />
                        </motion.button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="mb-3 uppercase tracking-wider">{project.title}</h4>
                <p className="text-[rgb(var(--muted-foreground))] mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[rgb(var(--muted))] text-xs rounded-md border border-[rgb(var(--border))] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}