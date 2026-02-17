import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, Instagram, Facebook, Send } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { triggerHaptic } = useHaptic();

  const socialLinks = [
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:niteshjoshi010@icloud.com',
      color: 'hover:text-red-500'
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/Niteshh-DeV',
      color: 'hover:text-gray-800 dark:hover:text-white'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/niteshjoshi',
      color: 'hover:text-blue-600'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://x.com/niteshh_joshi',
      color: 'hover:text-blue-400'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/nitesh_joshi_/',
      color: 'hover:text-pink-500'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      href: 'https://www.facebook.com/NiteshhJoshi',
      color: 'hover:text-blue-700'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    triggerHaptic('medium');
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('message', formData.message);

      const response = await fetch('https://formspree.io/f/xjgeragy', {
        method: 'POST',
        body: formDataObj
      });

      const data = await response.json();
      console.log('Formspree Response:', response.status, data);

      // Formspree returns 200 for success or shows ok: true
      if (response.status === 200 || data.ok === true) {
        setStatus('success');
        triggerHaptic('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        triggerHaptic('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      triggerHaptic('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] mx-auto rounded-full" />
          <p className="text-[rgb(var(--muted-foreground))] mt-6 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out. I'm always open to discussing new opportunities and collaborations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-effect p-8 rounded-2xl"
          >
            <h3 className="mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-[rgb(var(--muted-foreground))]">
                  Your Name
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => triggerHaptic('selection')}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                  placeholder="Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-[rgb(var(--muted-foreground))]">
                  Your Email
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => triggerHaptic('selection')}
                  required
                  className="w-full px-4 py-3 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-[rgb(var(--muted-foreground))]">
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => triggerHaptic('selection')}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[rgb(var(--muted))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all resize-none"
                  placeholder="Tell me about your project or just say hi!"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={status === 'submitting'}
                onTouchStart={() => triggerHaptic('light')}
                className="w-full px-8 py-3 bg-[rgb(var(--primary))] text-black rounded-full hover:bg-[rgb(var(--primary))]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                <Send size={20} />
              </motion.button>

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center"
                >
                  Failed to send message. Please try again or email directly.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="glass-effect p-8 rounded-2xl">
              <h3 className="mb-6">Connect With Me</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => triggerHaptic('light')}
                    onTouchStart={() => triggerHaptic('selection')}
                    className={`flex flex-col items-center justify-center p-6 glass-effect rounded-xl ${social.color} transition-all group`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <social.icon size={32} />
                    </motion.div>
                    <span className="mt-2">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-effect p-8 rounded-2xl"
            >
              <h4 className="mb-4">Quick Info</h4>
              <div className="space-y-4 text-[rgb(var(--muted-foreground))]">
                <p>
                  <strong className="text-[rgb(var(--foreground))]">Location:</strong><br />
                  Mahendrnagar, Nepal
                </p>
                <p>
                  <strong className="text-[rgb(var(--foreground))]">Email:</strong><br />
                  niteshjoshi010@icloud.com
                </p>
                <p>
                  <strong className="text-[rgb(var(--foreground))]">Availability:</strong><br />
                  Open for opportunities
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="glass-effect p-8 rounded-2xl bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10"
            >
              <p className="text-center italic">
                "Let's create something amazing together. Whether it's code, poetry, or a revolutionary idea – I'm all ears!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
