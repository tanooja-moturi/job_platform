require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/server/models/User');
const Job = require('./src/server/models/Job');
const Application = require('./src/server/models/Application');

const connectDB = require('./src/server/config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Application.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();
    console.log('Cleared existing data');

    // Create demo users
    const employer = await User.create({
      name: 'Demo Employer',
      email: 'employer@example.com',
      password: 'Employer@123',
      role: 'employer',
    });

    const seeker = await User.create({
      name: 'Demo Job Seeker',
      email: 'jobseeker@example.com',
      password: 'JobSeeker@123',
      role: 'jobseeker',
    });

    console.log('Created demo accounts:');
    console.log(`Employer: employer@example.com / Employer@123`);
    console.log(`Seeker: jobseeker@example.com / JobSeeker@123`);

    // Create sample jobs
    const jobs = await Job.create([
      {
        title: 'MERN Stack Developer',
        company: 'TechCorp Solutions',
        description: 'We are looking for an experienced MERN Stack Developer to join our growing team. You will be responsible for building scalable web applications, RESTful APIs, and responsive front-end interfaces.',
        requirements: '- 3+ years of experience with React, Node.js, and MongoDB\n- Strong understanding of asynchronous programming\n- Experience with state management (Redux/Context API)\n- Excellent problem-solving skills',
        location: 'Remote',
        employmentType: 'Full-time',
        salary: '$90,000 - $130,000',
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
        employer: employer._id,
      },
      {
        title: 'Senior React Developer',
        company: 'Acme Corp',
        description: 'Acme Corp is seeking a Senior React Developer to lead our front-end architecture. You will mentor junior developers and establish best practices for our UI components.',
        requirements: '- 5+ years of front-end development\n- Deep expertise in React and modern hooks\n- Experience with performance optimization\n- Strong CSS/styled-components skills',
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        salary: '$120,000 - $160,000',
        skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Webpack'],
        employer: employer._id,
      },
      {
        title: 'Node.js Backend Engineer',
        company: 'CloudSystems Inc',
        description: 'Join our backend team to build high-performance microservices. You will work closely with the infrastructure team to deploy robust Node.js applications.',
        requirements: '- 4+ years of backend development\n- Expert knowledge of Node.js and Express\n- Experience with database design (SQL and NoSQL)\n- Understanding of CI/CD pipelines',
        location: 'Remote',
        employmentType: 'Contract',
        salary: '$60 - $80 / hour',
        skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
        employer: employer._id,
      },
      {
        title: 'Frontend Developer',
        company: 'Creative Digital',
        description: 'Creative Digital is hiring a Frontend Developer who is passionate about creating beautiful, pixel-perfect user interfaces with React and vanilla CSS.',
        requirements: '- 2+ years of web development\n- Strong proficiency in HTML, CSS, and JS\n- Experience with React and responsive design\n- Portfolio of previous work',
        location: 'New York, NY',
        employmentType: 'Full-time',
        salary: '$80,000 - $110,000',
        skills: ['React', 'HTML5', 'CSS3', 'JavaScript'],
        employer: employer._id,
      },
      {
        title: 'Full Stack JavaScript Developer',
        company: 'InnovateTech',
        description: 'We are a fast-paced startup looking for a Full Stack Developer who can take features from concept to production using the MERN stack.',
        requirements: '- 3+ years of full stack experience\n- Ability to work independently\n- Experience with REST APIs and authentication\n- Agile methodology experience',
        location: 'Austin, TX',
        employmentType: 'Full-time',
        salary: '$100,000 - $140,000',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        employer: employer._id,
      },
      {
        title: 'DevOps Engineer',
        company: 'Serverless Solutions',
        description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and improve our deployment pipelines for our Node/React applications.',
        requirements: '- 3+ years in DevOps/SRE roles\n- Strong AWS or GCP experience\n- Kubernetes and Docker expertise\n- CI/CD automation experience',
        location: 'Remote',
        employmentType: 'Full-time',
        salary: '$130,000 - $170,000',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        employer: employer._id,
      },
      {
        title: 'React Native Mobile Developer',
        company: 'AppWorks',
        description: 'AppWorks needs a React Native developer to build our next-generation mobile application for iOS and Android platforms.',
        requirements: '- 2+ years of React Native experience\n- Published at least one app to App Store/Play Store\n- Experience with mobile native APIs\n- Strong UI/UX sensibilities',
        location: 'Chicago, IL',
        employmentType: 'Full-time',
        salary: '$110,000 - $145,000',
        skills: ['React Native', 'React', 'Mobile Development', 'Redux'],
        employer: employer._id,
      },
      {
        title: 'Junior Web Developer (Internship)',
        company: 'TechCorp Solutions',
        description: 'Kickstart your career with a paid internship at TechCorp. You will work alongside senior developers on real production code using the MERN stack.',
        requirements: '- CS degree or bootcamp graduate\n- Basic understanding of React and Node.js\n- Eagerness to learn and grow\n- Strong communication skills',
        location: 'Remote',
        employmentType: 'Internship',
        salary: '$20 - $25 / hour',
        skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
        employer: employer._id,
      }
    ]);

    console.log(`Created ${jobs.length} sample jobs`);
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
