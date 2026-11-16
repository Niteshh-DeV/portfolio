import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { Reveal, SectionHead } from './Reveal';

const statement =
  'I blend engineering precision with creative storytelling to design digital experiences that feel both powerful and personal.';

const italicWords = new Set(['creative', 'storytelling', 'personal.']);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const text = italicWords.has(word) ? <em>{word}</em> : word;
  return <motion.span style={{ opacity }}>{text} </motion.span>;
}

export function About() {
  const statementRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: statementRef,
    offset: ['start 0.9', 'end 0.5'],
  });

  const words = statement.split(' ');

  const features = [
    {
      title: 'Computer Engineering Student',
      description: 'Pursuing excellence in computer science and engineering, specializing in practical and future-focused technologies.'
    },
    {
      title: 'Poet',
      description: 'Weaving emotions into words, expressing the beauty of life through poetry and creative writing.'
    },
    {
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
    <section id="about" aria-label="About me" className="section preface">
      <SectionHead numeral="I" label="Preface — About me" folio="01 / 06" />

      <h2 className="preface__statement" ref={statementRef}>
        {words.map((word, index) => (
          <Word
            key={index}
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, Math.min(1, (index + 2) / words.length)]}
          />
        ))}
      </h2>

      <div className="preface__body">
        <Reveal className="preface__prose">
          <p>
            I&apos;m a passionate engineering student with a unique blend of technical execution and artistic expression.
            My journey in technology is driven by curiosity and impact, while poetry adds a human touch to everything I create.
          </p>
          <p>
            Whether I&apos;m training machine learning models, building full-stack applications, or writing verses that resonate,
            I approach every challenge with consistency, creativity, and care.
          </p>
        </Reveal>

        <Reveal className="focus" delay={0.15}>
          <h3 className="label">Current Focus</h3>
          <dl>
            {highlights.map((item) => (
              <div key={item.label} className="focus__row">
                <dt className="label">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="roles">
        {features.map((feature, index) => (
          <Reveal key={feature.title} className="role" delay={index * 0.12}>
            <span className="label">0{index + 1}</span>
            <h3 className="role__title">{feature.title}</h3>
            <p>{feature.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
