import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const blogPosts = [
    {
      title: 'Getting Started with Machine Learning: A Beginner\'s Guide',
      excerpt: 'Discover the fundamentals of machine learning and how to start your journey in AI. From basic concepts to your first model.',
      date: 'Dec 5, 2024',
      readTime: '8 min read',
      category: 'AI/ML',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Building Scalable MERN Stack Applications',
      excerpt: 'Learn best practices for creating robust full-stack applications using MongoDB, Express, React, and Node.js.',
      date: 'Nov 28, 2024',
      readTime: '12 min read',
      category: 'Web Dev',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'The Art of Writing Clean Code in C++',
      excerpt: 'Explore techniques and patterns for writing maintainable, efficient, and elegant C++ code that stands the test of time.',
      date: 'Nov 15, 2024',
      readTime: '10 min read',
      category: 'Programming',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Poetry in the Digital Age: Finding Balance',
      excerpt: 'Reflections on maintaining creative expression while pursuing a technical career. How art and science coexist.',
      date: 'Oct 30, 2024',
      readTime: '6 min read',
      category: 'Personal',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-[rgb(var(--muted))]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">Latest Blog Posts</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] mx-auto rounded-full" />
          <p className="text-[rgb(var(--muted-foreground))] mt-6 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on technology, creativity, and everything in between.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-effect rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className={`h-48 bg-gradient-to-br ${post.color} relative`}>
                <motion.div
                  className="absolute inset-0 bg-black/40"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1 bg-white/90 text-gray-900 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-[rgb(var(--muted-foreground))] mb-3">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {post.readTime}
                  </span>
                </div>

                <h4 className="mb-3 group-hover:text-[rgb(var(--primary))] transition-colors">
                  {post.title}
                </h4>
                <p className="text-[rgb(var(--muted-foreground))] mb-4">
                  {post.excerpt}
                </p>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-[rgb(var(--primary))] group-hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[rgb(var(--primary))] text-white rounded-full hover:bg-[rgb(var(--primary))]/90 transition-all"
          >
            View All Posts
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
