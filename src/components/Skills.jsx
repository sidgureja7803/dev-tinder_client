import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SKILLS_LIST = [
  'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Docker', 'Kubernetes',
  'Machine Learning', 'Data Science', 'Blockchain', 'DevOps', 'UI/UX Design',
  'Mobile Development', 'Cloud Computing', 'Cybersecurity'
];

const Skills = ({ selectedSkills, onSkillsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredSkills = SKILLS_LIST.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSkill = (skill) => {
    const updatedSkills = [...selectedSkills, skill];
    onSkillsChange(updatedSkills);
    setSearchTerm('');
    
    // Animate the new skill tag
    gsap.from(`.skill-tag:last-child`, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out'
    });
  };

  const handleRemoveSkill = (skillToRemove) => {
    // Animate removal
    gsap.to(`[data-skill="${skillToRemove}"]`, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove);
        onSkillsChange(updatedSkills);
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              data-skill={skill}
              className="skill-tag inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 inline-flex items-center"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && filteredSkills.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
              onClick={() => handleAddSkill(skill)}
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills; 