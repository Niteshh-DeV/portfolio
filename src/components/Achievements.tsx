import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Award, Users, Trophy, Star } from 'lucide-react';

export function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const achievements = [
    {
      icon: Users,
      title: 'AI/ML Bootcamp',
      description: 'Organized and conducted a comprehensive 3-day bootcamp on Artificial Intelligence and Machine Learning',
      stats: '100+ participants',
      date: '2024'
    },
    {
      icon: Trophy,
      title: 'Hackathon Winner',
      description: 'Won first place in National Level Hackathon for developing an innovative AI-powered solution',
      stats: 'Top 1 of 150 teams',
      date: '2024'
    },
    {
      icon: Star,
      title: 'Tech Talk Speaker',
      description: 'Delivered keynote speeches at multiple technical conferences on Full-Stack Development and AI',
      stats: '5+ conferences',
      date: '2023-2024'
    },
    {
      icon: Award,
      title: 'Poetry Competition',
      description: 'Received recognition for creative writing and poetry at Inter-College Literary Fest',
      stats: '1st Place',
      date: '2023'
    },
    {
      icon: Users,
      title: 'Coding Workshop',
      description: 'Organized hands-on coding workshops for beginners, introducing them to web development',
      stats: '200+ students trained',
      date: '2023'
    },
    {
      icon: Trophy,
      title: 'Research Publication',
      description: 'Published research paper on Machine Learning applications in IEEE conference',
      stats: 'Peer-reviewed',
      date: '2024'
    }
  ];

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 uppercase tracking-wider">Achievements & Events</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-effect p-8 rounded-lg relative overflow-hidden group border-2 border-[rgb(var(--border))] hover:border-[rgb(var(--foreground))] transition-all"
            >
              
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 rounded-lg bg-[rgb(var(--foreground))] flex items-center justify-center mb-6"
              >
                <achievement.icon className="text-[rgb(var(--background))]" size={28} />
              </motion.div>

              <h4 className="mb-3 uppercase tracking-wider">{achievement.title}</h4>
              <p className="text-[rgb(var(--muted-foreground))] mb-4 text-sm">
                {achievement.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border))]">
                <span className="text-[rgb(var(--foreground))] font-semibold">
                  {achievement.stats}
                </span>
                <span className="text-[rgb(var(--muted-foreground))] text-sm">
                  {achievement.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 glass-effect p-8 rounded-lg border-2 border-[rgb(var(--border))]"
        >
          <h3 className="text-center mb-8 uppercase tracking-wider">Journey Timeline</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[rgb(var(--foreground))]" />
            <div className="space-y-8">
              {[
                { year: '2024', event: 'Published Research & Won Hackathon' },
                { year: '2023', event: 'Started Organizing Tech Events' },
                { year: '2022', event: 'Began Engineering Journey' }
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <h4 className="mb-2 uppercase tracking-wider">{item.year}</h4>
                    <p className="text-[rgb(var(--muted-foreground))] text-sm">{item.event}</p>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-[rgb(var(--foreground))] rounded-none border-2 border-[rgb(var(--background))] z-10" />
                  </div>
                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}