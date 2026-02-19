/**
 * KOICA DX Center Platform - Mock Data
 * Sample data for development and testing
 */

// ==================== STATISTICS ====================
const STATS = {
    totalGraduates: 19,
    certificationRate: 100,
    partnerCompanies: 4,
    employmentRate: 85,
    activeCourses: 3
};

// ==================== TRAINEES ====================
const TRAINEES = [
    {
        id: 1,
        name: 'Van Kirk Lumantas',
        batch: 1,
        track: 1,
        major: 'Computer Science',
        gender: 'Male',
        skills: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
        hasKOICACert: true,
        hasTESDA: true,
        profileImage: null,
        projects: [1],
        employmentStatus: 'Employed'
    },
    {
        id: 2,
        name: 'Maria Santos',
        batch: 1,
        track: 2,
        major: 'Information Technology',
        gender: 'Female',
        skills: ['Python', 'Deep Learning', 'TensorFlow', 'Data Visualization'],
        hasKOICACert: true,
        hasTESDA: true,
        profileImage: null,
        projects: [2],
        employmentStatus: 'Employed'
    },
    {
        id: 3,
        name: 'John Reyes',
        batch: 1,
        track: 1,
        major: 'Business Analytics',
        gender: 'Male',
        skills: ['Python', 'Pandas', 'SQL', 'Tableau'],
        hasKOICACert: true,
        hasTESDA: false,
        profileImage: null,
        projects: [1],
        employmentStatus: 'Job Seeking'
    }
];

// ==================== PROJECTS ====================
const PROJECTS = [
    {
        id: 1,
        title: 'Employee Attrition Analysis',
        description: 'Predictive model to identify employees at risk of leaving the company using machine learning techniques. Achieved 87% accuracy using Random Forest classifier.',
        category: 'Machine Learning',
        batch: 1,
        teamMembers: [1, 3],
        skills: ['Python', 'Scikit-learn', 'Pandas', 'Data Visualization'],
        completedDate: '2025-12-15',
        githubUrl: null,
        thumbnail: null
    },
    {
        id: 2,
        title: 'Student Employability Prediction',
        description: 'Analysis of factors affecting student employability after graduation. Built classification models to predict job placement success based on academic and demographic data.',
        category: 'Data Analytics',
        batch: 1,
        teamMembers: [2],
        skills: ['Python', 'TensorFlow', 'Data Analysis', 'Statistics'],
        completedDate: '2025-12-20',
        githubUrl: null,
        thumbnail: null
    },
    {
        id: 3,
        title: 'BPO Call Center Performance Dashboard',
        description: 'Interactive dashboard for monitoring call center KPIs including average handling time, customer satisfaction scores, and agent productivity metrics.',
        category: 'Business Intelligence',
        batch: 1,
        teamMembers: [1, 2, 3],
        skills: ['Python', 'Plotly', 'Dash', 'SQL'],
        completedDate: '2026-01-10',
        githubUrl: null,
        thumbnail: null
    }
];

// ==================== JOB POSTINGS ====================
const JOBS = [
    {
        id: 1,
        companyName: 'Inspiro',
        jobTitle: 'Data Analyst',
        location: 'Dumaguete City',
        jobType: 'Full-time',
        requiredSkills: ['Python', 'SQL', 'Data Visualization', 'Excel'],
        description: 'Looking for talented data analysts to join our business intelligence team. Work with real-world BPO data to drive strategic decisions.',
        salaryRange: '₱25,000 - ₱35,000',
        deadline: '2026-03-31',
        postedDate: '2026-02-01'
    },
    {
        id: 2,
        companyName: 'WrkPod',
        jobTitle: 'Junior AI Engineer',
        location: 'Dumaguete City',
        jobType: 'Full-time',
        requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning'],
        description: 'Exciting opportunity for fresh graduates to work on AI-powered customer service solutions. Training provided.',
        salaryRange: '₱30,000 - ₱40,000',
        deadline: '2026-04-15',
        postedDate: '2026-02-05'
    },
    {
        id: 3,
        companyName: 'Straive',
        jobTitle: 'Business Intelligence Analyst',
        location: 'Dumaguete City / Remote',
        jobType: 'Full-time',
        requiredSkills: ['SQL', 'Python', 'Tableau', 'Data Analysis'],
        description: 'Join our analytics team to transform data into actionable insights. Experience with dashboard creation preferred.',
        salaryRange: '₱28,000 - ₱38,000',
        deadline: '2026-03-20',
        postedDate: '2026-01-28'
    },
    {
        id: 4,
        companyName: 'TaskUs',
        jobTitle: 'Data Science Intern',
        location: 'Dumaguete City',
        jobType: 'Internship',
        requiredSkills: ['Python', 'Statistics', 'Data Analysis'],
        description: '6-month internship program with potential for full-time conversion. Hands-on experience with real business problems.',
        salaryRange: '₱15,000 - ₱20,000',
        deadline: '2026-02-28',
        postedDate: '2026-02-10'
    }
];

// ==================== LEARNING RESOURCES ====================
const RESOURCES = [
    {
        id: 1,
        title: 'AI & Database Modeling',
        type: 'pdf',
        category: 'Textbook',
        description: 'Comprehensive guide to AI fundamentals and database design principles',
        author: 'KOICA DX Center',
        fileSize: '12.5 MB',
        uploadDate: '2025-09-01'
    },
    {
        id: 2,
        title: 'Data Analytics with Python',
        type: 'pdf',
        category: 'Textbook',
        description: 'Complete course material covering Pandas, NumPy, and data visualization',
        author: 'KOICA-Silliman DX Center',
        fileSize: '15.8 MB',
        uploadDate: '2025-09-01'
    },
    {
        id: 3,
        title: 'Week 1-4: Python Fundamentals',
        type: 'ppt',
        category: 'Lecture Slides',
        description: 'Introduction to Python programming, data types, and control structures',
        author: 'Prof. Song Hee-seok',
        fileSize: '8.2 MB',
        uploadDate: '2025-10-15'
    },
    {
        id: 4,
        title: 'Machine Learning Dataset Collection',
        type: 'zip',
        category: 'Datasets',
        description: 'Curated datasets for ML practice including CSV files and documentation',
        author: 'Dr. Kang Shin-cheol',
        fileSize: '45.3 MB',
        uploadDate: '2025-11-20'
    },
    {
        id: 5,
        title: 'VS Code & Python Setup Guide',
        type: 'pdf',
        category: 'Installation Guide',
        description: 'Step-by-step installation and configuration of development environment',
        author: 'KOICA-Silliman DX Center',
        fileSize: '3.4 MB',
        uploadDate: '2025-09-10'
    }
];

// ==================== FACULTY ====================
const FACULTY = [
    {
        id: 1,
        name: 'Dr. Kang Shin-cheol',
        title: 'Instructor',
        affiliation: 'Hannam University',
        expertise: ['AI Fundamentals', 'Prompt Engineering', 'Database Modeling'],
        courses: ['Track 1', 'Track 2', 'Track 3'],
        bio: 'Expert in artificial intelligence and database systems with over 15 years of teaching experience.',
        profileImage: null
    },
    {
        id: 2,
        name: 'Prof. Song Hee-seok',
        title: 'Instructor',
        affiliation: 'Hannam University',
        expertise: ['Data Analysis', 'Machine Learning', 'Data Visualization'],
        courses: ['Track 1', 'Track 2'],
        bio: 'Specialized in data science education with extensive industry experience in analytics.',
        profileImage: null
    },
    {
        id: 3,
        name: 'Dr. Maria dela Cruz',
        title: 'Instructor',
        affiliation: 'KOICA Philippines',
        expertise: ['Python Programming', 'Data Analytics', 'Business Intelligence'],
        courses: ['Track 1'],
        bio: 'Track 3 graduate now teaching the next generation of data professionals.',
        profileImage: null
    }
];

// ==================== CURRICULUM ====================
const CURRICULUM = {
    track1: {
        name: 'Track 1: Foundation Program',
        target: 'Local Youth (Out-of-school)',
        duration: '124 hours',
        topics: [
            'AI Fundamentals',
            'Python Programming Basics',
            'Database Design & Modeling',
            'Data Analysis with Pandas',
            'Data Visualization',
            'Mini Project'
        ]
    },
    track2: {
        name: 'Track 2: Advanced Program',
        target: 'University Students',
        duration: '120 hours',
        topics: [
            'Advanced Python Programming',
            'Machine Learning Algorithms',
            'Deep Learning & Neural Networks',
            'Large Language Models (LLM)',
            'AI Application Development',
            'Capstone Project'
        ]
    },
    track3: {
        name: 'Track 3: Train the Trainer',
        target: 'Local Faculty',
        duration: '30 hours',
        topics: [
            'Teaching Methodologies',
            'Lab Instruction Techniques',
            'Curriculum Development',
            'Assessment Design',
            'Educational Technology'
        ]
    }
};

// ==================== PARTNER COMPANIES ====================
const PARTNERS = [
    { name: 'Inspiro', logo: null },
    { name: 'WrkPod', logo: null },
    { name: 'Straive', logo: null },
    { name: 'TaskUs', logo: null }
];

// Export all data
window.MOCK_DATA = {
    STATS,
    TRAINEES,
    PROJECTS,
    JOBS,
    RESOURCES,
    FACULTY,
    CURRICULUM,
    PARTNERS
};
