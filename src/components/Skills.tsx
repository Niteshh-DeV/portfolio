import { Reveal, SectionHead } from './Reveal';
import { Words } from './Kinetic';

export function Skills() {
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
    <section id="skills" aria-label="Skills and expertise" className="section instruments">
      <SectionHead numeral="II" label="Instruments — Skills & expertise" folio="02 / 06" />

      <div className="instruments__intro">
        <Words className="display" text="Skills & *expertise*" />
        <Reveal delay={0.1}>
          <p>
            A practical toolkit shaped by building projects end-to-end, from intelligent models and clean APIs to user-focused interfaces.
          </p>
        </Reveal>
      </div>

      <div>
        {skillCategories.map((category, catIndex) => (
          <Reveal key={category.category} className="inst-row" delay={catIndex * 0.06}>
            <span className="label">0{catIndex + 1}</span>
            <h3 className="label">{category.category}</h3>
            <ul className="inst-row__list">
              {category.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
