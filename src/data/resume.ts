/** Facts for the `man rohan` page and the terminal. Keep in sync with public/Rohan_Paul_Resume.pdf. */
export const resume = {
  name: 'Rohan Paul',
  titles: ['Data Engineer', 'Software Engineer', 'Cloud Architect'],
  email: 'rohanpaul2468@gmail.com',
  github: 'https://github.com/rohan-0024',
  linkedin: 'https://www.linkedin.com/in/rohan-paul-b5181a288',
  pdf: '/Rohan_Paul_Resume.pdf',
  location: 'Chennai / Bhubaneswar, India',
  synopsis: 'rohan [--data] [--software] [--cloud] [--explain] <problem>',
  description:
    'Builds systems that keep working when the network, the data, or the user doesn’t cooperate. ' +
    'Strong on data structures, networking and operating systems; happiest where a model, an API and a cloud bill all have to agree.',
  skills: [
    { group: 'languages', items: ['Python', 'JavaScript / TypeScript', 'Java', 'C / C++', 'SQL'] },
    { group: 'cloud', items: ['AWS (Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito, SAM)', 'Microsoft Azure', 'Firebase', 'Vercel', 'Render'] },
    { group: 'data + ml', items: ['scikit-learn', 'XGBoost', 'PySpark', 'feature engineering', 'model serving', 'Grafana', 'Power BI (learning)'] },
    { group: 'web', items: ['React', 'Node + Express', 'Astro', 'Tailwind', 'GSAP', 'Zod'] },
    { group: 'platforms', items: ['ServiceNow (CSA, CAD)', 'Git + GitHub', 'VS Code', 'IntelliJ'] },
  ],
  experience: [
    {
      org: 'ION Aerospace India',
      role: 'Software Developer Intern',
      when: 'Jul 2025 – Aug 2025',
      what: 'Designed and tested drone navigation and control systems. Improved flight algorithms and system reliability in real-world simulation environments.',
    },
  ],
  education: [
    { org: 'SRM Institute of Science & Technology, Kattankulathur', what: 'B.Tech Computer Science & Engineering, specialisation in Cloud Computing', when: '2023 – May 2027 (expected)', note: 'CGPA 9.43' },
    { org: 'KiiT International School, Bhubaneswar', what: 'Higher Secondary (12th)', when: '2023', note: '84.6%' },
    { org: 'Divya Jyoti Convent School, Betnoti', what: 'Secondary (10th)', when: '2021', note: '84.8%' },
  ],
  certifications: [
    { name: 'Certified Application Developer', by: 'ServiceNow', year: 2026 },
    { name: 'Certified System Administrator', by: 'ServiceNow', year: 2026 },
    { name: 'Azure Data Fundamentals (DP-900)', by: 'Microsoft', year: 2026 },
    { name: 'Fortinet Certified Professional, Cloud Security', by: 'Fortinet', year: 2026 },
    { name: 'Database Management System', by: 'NPTEL', year: 2025 },
    { name: 'Programming in Java', by: 'NPTEL', year: 2024 },
    { name: 'Cloud Computing', by: 'NPTEL', year: 2024 },
  ],
  otherProjects: [
    { name: 'UtilityHub', when: 'Apr 2026', what: 'Multi-cloud booking platform for shared resources. Atomic SQL transactions stop double-booking. AWS Cognito, API Gateway and Lambda; Azure SQL and Blob Storage; GCP Apps Script and Gmail API.' },
    { name: 'MindScan', when: 'Feb 2026', what: 'Multimodal depression-risk screening from text sentiment, voice prosody and facial micro-expressions, fused into one score. MLP reached 97.2% on a synthetic dataset. Generates clinical-style PDF reports.' },
    { name: 'Energy Consumption Forecasting', when: 'Oct 2025', what: 'Published research. Smart-meter data processed with PySpark; Random Forest, XGBoost, SVM and LSTM compared. Random Forest won at 76.48% accuracy, MAE 0.4319 kWh. Grafana dashboards.' },
  ],
  activities: [
    { name: 'SharpAlthon by Sharpsys', when: '2025', what: 'Round 2. AI-enabled CRM that ranks leads by history, engagement and predicted conversion, with live dashboards.' },
    { name: 'DAYZERO by CodeNex', when: '2025', what: 'AI/ML password-strength analyser with explainable, real-time recommendations.' },
    { name: 'Cloud Nova Club, SRM', when: '2024 – 2025', what: 'Member. Built and maintained the club website and organised technical events.' },
  ],
  bugs: [
    'Occasionally over-engineers the fallback path.',
    'Reads the whole README before running the quick start.',
    'Will refactor a working script at 1 a.m. if the variable names bother him.',
  ],
};
