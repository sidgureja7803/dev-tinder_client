import { useState, useEffect } from 'react';
import Select from 'react-select';

const popularSkills = [
  { value: 'javascript', label: 'JavaScript', color: '#F7DF1E' },
  { value: 'python', label: 'Python', color: '#3776AB' },
  { value: 'react', label: 'React', color: '#61DAFB' },
  { value: 'node', label: 'Node.js', color: '#339933' },
  { value: 'typescript', label: 'TypeScript', color: '#3178C6' },
  { value: 'java', label: 'Java', color: '#007396' },
  { value: 'csharp', label: 'C#', color: '#239120' },
  { value: 'php', label: 'PHP', color: '#777BB4' },
  { value: 'ruby', label: 'Ruby', color: '#CC342D' },
  { value: 'swift', label: 'Swift', color: '#FA7343' },
  { value: 'golang', label: 'Go', color: '#00ADD8' },
  { value: 'rust', label: 'Rust', color: '#000000' },
  { value: 'kotlin', label: 'Kotlin', color: '#0095D5' },
  { value: 'vue', label: 'Vue.js', color: '#4FC08D' },
  { value: 'angular', label: 'Angular', color: '#DD0031' },
  { value: 'docker', label: 'Docker', color: '#2496ED' },
  { value: 'kubernetes', label: 'Kubernetes', color: '#326CE5' },
  { value: 'aws', label: 'AWS', color: '#232F3E' },
  { value: 'firebase', label: 'Firebase', color: '#FFCA28' },
  { value: 'mongodb', label: 'MongoDB', color: '#47A248' },
  { value: 'postgresql', label: 'PostgreSQL', color: '#336791' },
  { value: 'graphql', label: 'GraphQL', color: '#E10098' },
  { value: 'flutter', label: 'Flutter', color: '#02569B' },
  { value: 'django', label: 'Django', color: '#092E20' },
  { value: 'laravel', label: 'Laravel', color: '#FF2D20' },
  { value: 'scala', label: 'Scala', color: '#DC322F' },
  { value: 'elixir', label: 'Elixir', color: '#6E4C7E' },
  { value: 'haskell', label: 'Haskell', color: '#5e5086' },
  { value: 'lua', label: 'Lua', color: '#2C2D72' },
  { value: 'r', label: 'R', color: '#276DC3' },
  { value: 'matlab', label: 'MATLAB', color: '#800000' },
  { value: 'vhdl', label: 'VHDL', color: '#8F5B00' },
  { value: 'c', label: 'C', color: '#A8B9CC' },
  { value: 'bash', label: 'Bash', color: '#4EAA25' },
  { value: 'perl', label: 'Perl', color: '#A8A8B9' },
  { value: 'go', label: 'Go', color: '#00ADD8' },
  { value: 'objective-c', label: 'Objective-C', color: '#303030' },
  { value: 'sql', label: 'SQL', color: '#F4A300' },
  { value: 'plsql', label: 'PL/SQL', color: '#323D48' },
  { value: 'graphql', label: 'GraphQL', color: '#E10098' },
  { value: 'solidity', label: 'Solidity', color: '#AA6746' },
  { value: 'dart', label: 'Dart', color: '#00B4B6' },
  { value: 'terraform', label: 'Terraform', color: '#7B5AB6' },
  { value: 'ansible', label: 'Ansible', color: '#FF0000' },
  { value: 'chef', label: 'Chef', color: '#F3B035' },
  { value: 'puppet', label: 'Puppet', color: '#E2B97F' },
  { value: 'gradle', label: 'Gradle', color: '#02303A' },
  { value: 'webpack', label: 'Webpack', color: '#8DD6F2' },
  { value: 'eslint', label: 'ESLint', color: '#4B32C3' },
  { value: 'jest', label: 'Jest', color: '#99425E' },
  { value: 'mocha', label: 'Mocha', color: '#8D6748' },
  { value: 'cypress', label: 'Cypress', color: '#2F4D59' },
  { value: 'selenium', label: 'Selenium', color: '#43B02A' },
  { value: 'vagrant', label: 'Vagrant', color: '#F4E1D2' },
  { value: 'docker-compose', label: 'Docker Compose', color: '#F3F3F3' },
  { value: 'git', label: 'Git', color: '#F1502F' },
  { value: 'bitbucket', label: 'Bitbucket', color: '#0052CC' },
  { value: 'github', label: 'GitHub', color: '#181717' },
  { value: 'gitlab', label: 'GitLab', color: '#FCA326' },
  { value: 'nginx', label: 'Nginx', color: '#009639' },
  { value: 'apache', label: 'Apache', color: '#D72D31' },
  { value: 'redis', label: 'Redis', color: '#D82C2C' },
  { value: 'memcached', label: 'Memcached', color: '#6A5ACD' },
  { value: 'elasticsearch', label: 'Elasticsearch', color: '#F9A825' },
  { value: 'rabbitmq', label: 'RabbitMQ', color: '#FF6600' },
  { value: 'kafka', label: 'Kafka', color: '#B93B3D' },
  { value: 'mongodb', label: 'MongoDB', color: '#47A248' },
  { value: 'mysql', label: 'MySQL', color: '#00758F' },
  { value: 'postgresql', label: 'PostgreSQL', color: '#336791' },
  { value: 'mssql', label: 'Microsoft SQL Server', color: '#CC2927' },
  { value: 'oracle', label: 'Oracle', color: '#F80000' },
  { value: 'cassandra', label: 'Cassandra', color: '#1287B1' },
  { value: 'dynamo', label: 'Amazon DynamoDB', color: '#405E57' },
  { value: 'firebase', label: 'Firebase', color: '#FFCA28' },
  { value: 'cloudflare', label: 'Cloudflare', color: '#F38020' },
  { value: 'aws', label: 'AWS', color: '#232F3E' },
  { value: 'azure', label: 'Azure', color: '#0078D4' },
  { value: 'googlecloud', label: 'Google Cloud', color: '#4285F4' },
  { value: 'heroku', label: 'Heroku', color: '#6762A6' },
  { value: 'netlify', label: 'Netlify', color: '#00C7B7' },
  { value: 'vercel', label: 'Vercel', color: '#000000' },
  { value: 'gitlabci', label: 'GitLab CI/CD', color: '#FCA326' },
  { value: 'circleci', label: 'CircleCI', color: '#3F6D9E' },
  { value: 'travisci', label: 'Travis CI', color: '#3E7B8D' },
  { value: 'jenkins', label: 'Jenkins', color: '#D24926' },
  { value: 'grunt', label: 'Grunt', color: '#F4A300' },
  { value: 'gulp', label: 'Gulp', color: '#F3A3A2' },
  { value: 'webpack', label: 'Webpack', color: '#8DD6F2' },
  { value: 'flutter', label: 'Flutter', color: '#02569B' },
  { value: 'xcode', label: 'Xcode', color: '#0071C5' },
  { value: 'android', label: 'Android', color: '#3DDC84' },
  { value: 'ios', label: 'iOS', color: '#000000' },
  { value: 'unity', label: 'Unity', color: '#222222' },
  { value: 'unreal', label: 'Unreal Engine', color: '#0E3A67' },
  { value: 'blender', label: 'Blender', color: '#F5792A' },
  { value: 'autocad', label: 'AutoCAD', color: '#F7A800' },
  { value: 'solidworks', label: 'SolidWorks', color: '#0096A8' },
  { value: 'sketchup', label: 'SketchUp', color: '#9B9B9B' },
  { value: 'docker', label: 'Docker', color: '#2496ED' },
  { value: 'kubernetes', label: 'Kubernetes', color: '#326CE5' },
  { value: 'terraform', label: 'Terraform', color: '#7B5AB6' }
];


const customStyles = {
  control: (base, state) => ({
    ...base,
    background: '#f3f4f6',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#8b5cf6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(139, 92, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#8b5cf6'
    }
  }),
  option: (base, { data, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? data.color : base.backgroundColor,
    color: isSelected ? 'white' : base.color,
    '&:hover': {
      backgroundColor: data.color,
      color: 'white'
    }
  }),
  multiValue: (base, { data }) => ({
    ...base,
    backgroundColor: `${data.color}22`,
    borderRadius: '0.375rem'
  }),
  multiValueLabel: (base, { data }) => ({
    ...base,
    color: data.color,
    fontWeight: 600
  }),
  multiValueRemove: (base, { data }) => ({
    ...base,
    color: data.color,
    '&:hover': {
      backgroundColor: data.color,
      color: 'white'
    }
  })
};

const SkillSelector = ({ selectedSkills, onChange, maxSkills = 10 }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with popular skills
    setSuggestions(popularSkills);
  }, []);

  const handleSkillChange = (selected) => {
    if (selected.length <= maxSkills) {
      onChange(selected);
    }
  };

  return (
    <div className="space-y-2">
      <Select
        isMulti
        options={suggestions}
        value={selectedSkills}
        onChange={handleSkillChange}
        styles={customStyles}
        placeholder="Select up to 10 skills..."
        isLoading={isLoading}
        closeMenuOnSelect={false}
        noOptionsMessage={() => "No matching skills found"}
      />
      {selectedSkills?.length >= maxSkills && (
        <p className="text-sm text-red-500">
          Maximum {maxSkills} skills allowed
        </p>
      )}
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Popular skills:</p>
        <div className="flex flex-wrap gap-2">
          {popularSkills.slice(0, 8).map((skill) => (
            <button
              key={skill.value}
              onClick={() => {
                if (selectedSkills?.length < maxSkills && !selectedSkills?.find(s => s.value === skill.value)) {
                  handleSkillChange([...(selectedSkills || []), skill]);
                }
              }}
              className="px-3 py-1 text-sm rounded-full transition-all"
              style={{
                backgroundColor: `${skill.color}22`,
                color: skill.color,
                border: `1px solid ${skill.color}44`
              }}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSelector; 