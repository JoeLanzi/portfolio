import { InlineCode } from "@/once-ui/components";
import { HiArrowRight } from "react-icons/hi2";

const person = {
  firstName: "Joe",
  lastName: "Lanzi",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "AI Engineer · Data Scientist · Investor",
  avatar: "/images/avatar.jpg",
  location: "America/Chicago", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: [],
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I occasionally write about design, technology, and share thoughts on the intersection of
      creativity and engineering.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/JoeLanzi",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/lanzij/",
  },
  {
    name: "Publications",
    icon: "book",
    link: "https://scholar.google.com/citations?hl=en&user=FJEG83UAAAAJ",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:joelanzi@ymail",
  },
  {
    name: "Scheadule a call",
    icon: "calendar",
    link: "https://cal.com/joelanzi",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work`,
  headline: <>AI Engineer · Consultant · Investor</>,
  subline: (
    <>
      "Hey I'm <InlineCode>Joe</InlineCode>, a developer specializing in cutting-edge solutions, building the future of AI."
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com/joelanzi",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Developer with 5+ years leading AI & ML projects in industry and research, specializing in generative AI 
        for internal tools, cybersecurity, healthcare, finance, transportation, and geospatial applications. Skilled in end-to-end 
        system design for scalable solutions on cloud and edge platforms.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Guild Mortgage",
        timeframe: "Jan 2025 - Present",
        role: "AI Engineer",
        achievements: [
          <>As one of the technical architects behind GuildIQ, I helped revolutionize knowledge access across Guild Mortgage by implementing a multi-agent retrieval-augmented 
          generation (RAG) framework that fundamentally changed how teams interact with critical information. Through full-stack optimization strategies of the RAG pipeline, 
          I significantly improved document processing speed, response time, and reduced operational overhead through efficient resource utilization.</>
        ],
        images: [],
      },
      {
        company: "GovernmentGPT",
        timeframe: "Jan 2024 - Dec 2024",
        role: "Lead AI Engineer",
        achievements: [
          <>I led the developedment of the core adaptive multi-modal system that set new standards for real-time environmental awareness in high-stakes operations. 
          I drove the designing and deployment of optimized AI models across cloud and edge environments enabling unprecedented accuracy in threat detection and classification. 
          The implementation of fine-tuned LLMs for specialized applications, coupled with development of high-performance auditory transcription systems, 
          delivered a 10x improvement in processing speed compared to existing solutions at the time. This end-to-end AI pipeline architecture created a seamless bridge between 
          cloud capabilities and edge platforms, establishing new benchmarks for AI performance in real-time mission-critical scenarios.</>
        ],
        images: [],
      },
      {
        company: "Object Computing, Inc.",
        timeframe: "Aug 2022 - Dec 2023",
        role: "AI Data Scientist",
        achievements: [
          <>I wore multiple hats at OCI as a data scientist consultant like serving as lead architect for advanced geospatial ML solutions where I established new standards 
          in environmental analysis through collaboration with Google and Planet Data Labs. I also developed of sophisticated AI systems for crop prediction and natural disaster 
          analysis accelerating response times while reducing manual intervention. I was also responsible for deployment of production-grade ML systems such as malware 
          categorization and implementation of fraud detection models for the healthcare industry.
          These initiatives showcased the practical application of AI in solving complex operational challenges.</>
        ],
        images: [],
      },
      {
        company: "Saint Louis University",
        timeframe: "Aug 2021 - Dec 2022",
        role: "Research Assistant / Deep Learning Programmer",
        achievements: [
          <>Through my role in advancing visual categorization systems, I directly enhanced the capabilities of human trafficking investigations at the National Center for Missing and Exploited Children. My parallel development of a sophisticated reinforcement learning model for virtual economic simulation demonstrated the versatility of AI applications in both practical and theoretical domains. The success of these initiatives showcased how targeted AI solutions can simultaneously address critical social issues while advancing our understanding of complex systemic behaviors.</>
        ],
        images: [],
      },
      {
        company: "The New York Stem Cell Foundation Research Institute",
        timeframe: "Jun 2020 - May 2021",
        role: "Machine Learning Engineer",
        achievements: [
          <>By developing a sophisticated CNN architecture for cell segmentation, I enabled unprecedented accuracy in analyzing both nuclear and non-nuclear stains. My implementation of deep learning object detection algorithms created new possibilities for identifying specific biological characteristics in nuclei, while my innovative approach to 3D tumor cell classification and growth forecasting provided researchers with essential tools for understanding cancer progression. These developments directly contributed to advancing the foundation's research capabilities in stem cell analysis and cancer research.</>
        ],
        images: [],
      },
      {
        company: "Manhattan College",
        timeframe: "Jan 2019 - May 2020",
        role: "Research Assistant / Deep Learning Programmer",
        achievements: [
          <>Through my work with neuromorphic vision sensors, I pioneered bio-inspired vision systems that achieved breakthrough performance in classification and tracking. My development of deep learning techniques for motion-based target discrimination, combined with efficient scene analysis strategies, established new standards for computer vision under resource constraints. The culmination of this work - a partial facial recognition system achieving 99% accuracy for individuals with facial coverings - demonstrated the practical impact of my research in addressing real-world security challenges.</>
        ],
        images: [],
      },
      {
        company: "United States Marine Corps",
        timeframe: "Jun 2013 - Jun 2018",
        role: "Intelligence Support / Instructor",
        achievements: [
          <>As a key instructor and intelligence support specialist, I elevated the Marine Corps' operational capabilities through comprehensive 
          training programs reaching over 20,000 personnel. My development of organizational-level lesson plans and delivery of more than 400 hours of 
          specialized instruction strengthened the Corps' framework. There, my main responsibility was to analyze real time operational elements 
          and provided strategic briefs to support future operations.</>
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: <>Able to prototype in Figma with Once UI with unnatural speed.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: <>Building next gen apps with Next.js + Once UI + Supabase.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
