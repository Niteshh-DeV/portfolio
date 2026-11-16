import { motion } from 'motion/react';
import { useState } from 'react';
import { useHaptic } from '@/hooks/useHaptic';
import { Reveal, SectionHead } from './Reveal';
import { Magnetic, Words } from './Kinetic';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { triggerHaptic } = useHaptic();

  const socialLinks = [
    { label: 'Email', href: 'mailto:niteshjoshi010@icloud.com' },
    { label: 'GitHub', href: 'https://github.com/Niteshh-DeV' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/niteshjoshi' },
    { label: 'Twitter', href: 'https://x.com/niteshh_joshi' },
    { label: 'Instagram', href: 'https://www.instagram.com/nitesh_joshi_/' },
    { label: 'Facebook', href: 'https://www.facebook.com/NiteshhJoshi' }
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
        headers: {
          Accept: 'application/json'
        },
        body: formDataObj
      });

      let data: { ok?: boolean } | null = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      }

      // Treat HTTP success as the primary signal; JSON may be absent.
      if (response.ok && data?.ok !== false) {
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
    <section id="contact" aria-label="Contact" className="section contact">
      <SectionHead numeral="VI" label="Correspondence — Get in touch" folio="06 / 06" />

      <Words className="display contact__title" text="Let’s create something *amazing* together." />

      <div className="contact__grid">
        {/* Contact Form */}
        <Reveal>
          <p className="contact__lede">
            Have a project in mind or just want to chat? Feel free to reach out. I&apos;m always open to discussing new
            opportunities and collaborations — whether it&apos;s code, poetry, or a revolutionary idea, I&apos;m all ears.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <span className="field__num label" aria-hidden="true">01</span>
              <label htmlFor="name" className="label">Your name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => triggerHaptic('selection')}
                required
                autoComplete="name"
                placeholder="Name"
              />
            </div>

            <div className="field">
              <span className="field__num label" aria-hidden="true">02</span>
              <label htmlFor="email" className="label">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => triggerHaptic('selection')}
                required
                autoComplete="email"
                placeholder="name@example.com"
              />
            </div>

            <div className="field">
              <span className="field__num label" aria-hidden="true">03</span>
              <label htmlFor="message" className="label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => triggerHaptic('selection')}
                required
                rows={4}
                placeholder="Tell me about your project or just say hi!"
              />
            </div>

            <Magnetic className="send-wrap" strength={0.25}>
            <button
              type="submit"
              className="send"
              disabled={status === 'submitting'}
              onTouchStart={() => triggerHaptic('light')}
            >
              {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
              <span aria-hidden="true">→</span>
            </button>
            </Magnetic>

            <div aria-live="polite">
              {status === 'success' && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="form__note">
                  Thank you — your message is on its way.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="form__note form__note--error"
                >
                  Failed to send message. Please try again or email directly.
                </motion.p>
              )}
            </div>
          </form>
        </Reveal>

        {/* Contact Info */}
        <Reveal className="details" delay={0.15}>
          <dl>
            <div className="details__row">
              <dt className="label">Location</dt>
              <dd>Mahendranagar, Nepal</dd>
            </div>
            <div className="details__row">
              <dt className="label">Email</dt>
              <dd>
                <a href="mailto:niteshjoshi010@icloud.com">niteshjoshi010@icloud.com</a>
              </dd>
            </div>
            <div className="details__row">
              <dt className="label">Availability</dt>
              <dd>
                <i aria-hidden="true" />
                Open for opportunities
              </dd>
            </div>
          </dl>

          <div className="socials">
            <h3 className="label">Connect with me</h3>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="social"
                {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => triggerHaptic('light')}
                onTouchStart={() => triggerHaptic('selection')}
              >
                <span>{social.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
