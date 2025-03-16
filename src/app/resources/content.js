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
    name: "Email",
    icon: "email",
    link: "mailto:joelanzi@ymail",
  },
  {
    name: "Scheadule a call",
    icon: "calendar",
    link: "https://cal.com/joelanzi",
  },
  {
    name: "Resume",
    icon: "file",
    link: "/resume.pdf",
  },
];

const home = {
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work`,
  headline: <>AI Engineer · Data Scientist · Investor</>,
  subline: (
    <>
      "Hey I'm <InlineCode>Joe</InlineCode>, an AI innovator dedicated to transforming complex challenges into 
      breakthrough solutions, designing intelligent systems that create tangible impact across industries"
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
        I'm a developer with 5+ years leading AI & ML projects in industry and research, specializing in generative AI 
        for full stack applications, cybersecurity, healthcare, finance, transportation, and geospatial applications. Skilled in end-to-end 
        system design for scalable solutions on cloud and edge platforms.
      </>
    ),
  },
  work: {
    display: true,
    title: "Experience",
    experiences: [
      {
        company: "Guild Mortgage",
        link: "https://www.guildmortgage.com/about-us/news/press-release/guild-mortgage-launches-custom-ai-system-streamlining-tasks-and-improving-efficiency/",
        timeframe: "Jan 2025 - Present",
        role: "AI Engineer",
        achievements: [
          <>As one of the key technical architects behind GuildIQ, I'm helping revolutionize knowledge access by developing 
          a multi-agent retrieval-augmented generation (RAG) framework that transforms how teams interact with 
          critical information. I've implemented comprehensive full-stack optimization strategies across the framework, 
          significantly boosting document processing speeds, reducing response times, and cutting operational overhead 
          through efficient resource management. This innovative approach reshaped internal workflows and set a new 
          benchmark for leveraging AI in operational environments.</>
        ],
        tags: ["Large Language Models (LLM)", "Generative AI", "Retrieval-Augmented Generation (RAG)", "Real-time Multiagent Framework", "Python", "Javascript", "MS Azure", "System Design"],
        images: [],
      },
      {
        company: "GovernmentGPT",
        link: "https://techcrunch.com/2024/04/04/meet-the-startup-pitch-finalists-at-tc-early-stage-2024-chargebay-govgpt-ti%C2%A2ker/",
        timeframe: "Jan 2024 - Dec 2024",
        role: "Lead AI Engineer",
        achievements: [
          <>I led the design and deployment of an adaptive multi-modal system that redefined real-time environmental 
          awareness in high-stakes operations. By orchestrating the development of state-of-the-art AI models across 
          cloud and edge platforms, I achieved exceptional accuracy in threat detection and classification. 
          Integrating fine-tuned large language models with high-performance auditory transcription systems resulted 
          in a tenfold increase in processing speeds, establishing a robust, mission-critical AI pipeline that 
          seamlessly bridges cloud capabilities with on-ground operations.</>
        ],
        tags: ["Large Language Models (LLM)", "Generative AI", "Retrieval-Augmented Generation (RAG)", "Real-time Multiagent Framework", "Python", "C++", "Javascript", "Amazon Web Services(AWS)", "Nvidia Jetson", "MLOps", "System Design"],
        images: [],
      },
      {
        company: "Object Computing, Inc.",
        link: "https://objectcomputing.com/client-outcomes/revolutionizing-disaster-response-with-ai",
        timeframe: "Aug 2022 - Dec 2023",
        role: "AI Data Scientist",
        achievements: [
          <>I played a pivotal role as a data scientist and lead architect for advanced geospatial analytics 
          solutions collaborating with industry leaders like Google and Planet Data Labs, where I developed innovative 
          methods for environmental analysis that drove breakthroughs in crop prediction and natural disaster 
          assessment. Additionally, I oversaw the development and deployment of production-grade models for malware 
          categorization and fraud detection in healthcare, demonstrating the significant impact of data-driven 
          solutions on complex, real-world challenges.</>
        ],
        tags: ["Python", "Geographic Information System (GIS)", "Machine Learning", "Data Analysis", "Google Earth Engine", "Google Cloud Platform (GCP)", "Amazon Web Servies (AWS)", "MS Azure", "MLOps", "System Design"],
        images: [],
      },
      {
        company: "Saint Louis University",
        link: "https://www.trails.umd.edu/news/app-developed-by-a-saint-louis-university-researcher-helps-stop-human-trafficking",
        timeframe: "Aug 2021 - Dec 2022",
        role: "Research Assistant / Deep Learning Programmer",
        achievements: [
          <>I enhanced deep learning techniques for image search systems supporting critical human trafficking 
          investigations, and developed a reinforcement learning model that simulated virtual economies—delivering 
          fresh insights into adaptive behaviors that drive real-world impact.</>
        ],
        tags: ["Deep Learning", "Reinforcement Learning", "Computer Vision", "Neural Networks"],
        images: [],
      },
      {
        company: "NYSCF",
        link: "https://nyscf.org/research-institute/research-capabilities/",
        timeframe: "Jun 2020 - May 2021",
        role: "Machine Learning Engineer",
        achievements: [
          <>I merged deep learning with medical research by crafting a custom CNN for precise cell segmentation and 
          designing object detection methods to capture key biological markers. My work in 3D tumor cell classification 
          sharpened our ability to predict cancer progression with greater accuracy.</>
        ],
        tags: ["Deep Learning", "Image Segmentation", "Object Detection", "Medical Imaging"],
        images: [],
      },
      {
        company: "Manhattan College",
        timeframe: "Jan 2019 - May 2020",
        role: "Research Assistant / Deep Learning Programmer",
        achievements: [
          <>I utilized advanced neuromorphic vision sensors to create bio-inspired vision systems that excel in challenging 
          conditions. By improving contrast sensitivity and developing deep learning strategies for rapid scene analysis, 
          I built a facial recognition solution that achieved 99% accuracy even under conditions with facial coverings.</>
        ],
        tags: ["Deep Learning", "Computer Vision", "Neuromorphic Vision", "Image Processing"],
        images: [],
      },
      {
        company: "United States Marine Corps",
        timeframe: "Jun 2013 - Jun 2018",
        role: "Intelligence Support / Instructor",
        achievements: [
          <>As an instructor, I crafted targeted lesson plans and delivered over 400 hours of specialized training 
          to more than 20,000 personnel, significantly enhancing operational readiness. Separately, in my role as an 
          intelligence support specialist, I analyzed real-time operational elements and provided strategic briefs to 
          shape future decisions.</>
        ],
        tags: ["Real-time Analytics", "Intelligence Analysis", "Operational Leadership", "System Design", "Technical Instruction", "Cybersecurity"],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Saint Louis University | St. Louis, MO",
        description: <>MS in Artificial Intelligence</>,
      },
      {
        name: "Manhattan College | New York, NY",
        description: <>BS in Computer Engineering</>,
      },
    ],
  },
  technical: {
    display: false, // set to false to hide this section
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
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
