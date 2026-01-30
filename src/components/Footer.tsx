import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub, faLinkedin, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const footerSections = [
    {
      title: 'Eidos',
      content: 'Advancing Generative AI for Research & Development through collaborative innovation.',
      links: null
    },
    {
      title: 'Research Areas',
      links: ['Generative AI', 'Research Innovation', 'Life Sciences', 'Knowledge Graphs', 'Predictive Research']
    },
    {
      title: 'Resources',
      links: ['AI Research Tools', 'Knowledge Databases', 'Publications', 'API Documentation', 'Research Tutorials']
    },
    {
      title: 'Community',
      links: ['Research Groups', 'Events & Webinars', 'Collaboration Board', 'Career Opportunities', 'Contact Us']
    }
  ];

  const socialIcons = [
    { icon: faTwitter, url: '#' },
    { icon: faGithub, url: '#' },
    { icon: faLinkedin, url: '#' },
    { icon: faDiscord, url: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-12 pt-12 pb-6 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {footerSections.map((section, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            {section.content && (
              <>
                <p className="text-gray-300 mb-4">{section.content}</p>
                <div className="flex gap-4">
                  {socialIcons.map((social, i) => (
                    <a key={i} href={social.url} className="text-white text-xl hover:text-dna-purple transition-colors">
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </>
            )}
            {section.links && (
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-300 hover:text-dna-purple transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; 2024 Eidos. Advancing Generative AI for Research & Development.</p>
        <p className="text-sm mt-2">
          We are building a community of researchers with focus on AI applications in Healthcare and Life Sciences.
        </p>
      </div>
    </footer>
  );
}