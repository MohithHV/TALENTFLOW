import type { Job, Candidate, CandidateStage, Assessment, AssessmentSection, Question } from '@/types';
import { generateId } from '@/lib/utils';

const jobTitles = [
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Machine Learning Engineer',
  'QA Engineer',
  'Technical Writer',
  'Engineering Manager',
  'Solutions Architect',
  'Cloud Engineer',
  'Security Engineer',
  'Mobile Developer',
  'Database Administrator',
  'Site Reliability Engineer',
  'Platform Engineer',
  'Data Engineer',
  'AI Research Scientist',
  'Technical Support Engineer',
  'System Administrator',
  'Network Engineer',
  'Business Analyst'
];

const departments = ['Engineering', 'Product', 'Design', 'Data', 'Infrastructure', 'Security'];
const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
const tags = ['javascript', 'typescript', 'react', 'node.js', 'python', 'aws', 'docker', 'kubernetes', 'senior', 'junior', 'remote', 'full-time'];

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica', 'Daniel', 'Ashley', 'Matthew', 'Amanda', 'James', 'Jennifer', 'Robert'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

const stages: CandidateStage[] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function generateJobs(count: number = 25): Job[] {
  const jobs: Job[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    let title = randomItem(jobTitles);
    while (usedTitles.has(title) && usedTitles.size < jobTitles.length) {
      title = randomItem(jobTitles);
    }
    usedTitles.add(title);

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

    jobs.push({
      id: generateId(),
      title,
      slug: generateSlug(title) + (usedTitles.size > jobTitles.length ? `-${i}` : ''),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: randomItems(tags, Math.floor(Math.random() * 4) + 1),
      order: i,
      description: `We are looking for a talented ${title} to join our team. This is an exciting opportunity to work on cutting-edge projects.`,
      location: randomItem(locations),
      department: randomItem(departments),
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString()
    });
  }

  return jobs;
}

export function generateCandidates(jobs: Job[], count: number = 1000): Candidate[] {
  const candidates: Candidate[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 60));

    candidates.push({
      id: generateId(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      stage: randomItem(stages),
      jobId: randomItem(jobs).id,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      appliedAt: appliedDate.toISOString(),
      updatedAt: appliedDate.toISOString()
    });
  }

  return candidates;
}

export function generateAssessment(jobId: string): Assessment {
  const assessmentId = generateId();

  const sections: AssessmentSection[] = [
    {
      id: generateId(),
      assessmentId,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      order: 0
    },
    {
      id: generateId(),
      assessmentId,
      title: 'Technical Skills',
      description: 'Assess your technical capabilities',
      order: 1
    },
    {
      id: generateId(),
      assessmentId,
      title: 'Experience & Background',
      description: 'Share your professional experience',
      order: 2
    }
  ];

  const questions: Question[] = [
    // Section 1: Personal Information
    {
      id: generateId(),
      sectionId: sections[0].id,
      type: 'short-text',
      label: 'What is your current location?',
      validation: { required: true, maxLength: 100 },
      order: 0
    },
    {
      id: generateId(),
      sectionId: sections[0].id,
      type: 'single-choice',
      label: 'Are you authorized to work in the US?',
      options: [
        { id: generateId(), label: 'Yes', value: 'yes' },
        { id: generateId(), label: 'No', value: 'no' }
      ],
      validation: { required: true },
      order: 1
    },
    {
      id: 'q-visa-type',
      sectionId: sections[0].id,
      type: 'single-choice',
      label: 'What type of visa sponsorship do you need?',
      options: [
        { id: generateId(), label: 'H1B', value: 'h1b' },
        { id: generateId(), label: 'Green Card', value: 'green-card' },
        { id: generateId(), label: 'Other', value: 'other' }
      ],
      conditional: {
        questionId: sections[0].id,
        operator: '===',
        value: 'no'
      },
      validation: { required: false },
      order: 2
    },
    // Section 2: Technical Skills
    {
      id: 'q-primary-lang',
      sectionId: sections[1].id,
      type: 'multi-choice',
      label: 'Which programming languages are you proficient in?',
      options: [
        { id: generateId(), label: 'JavaScript/TypeScript', value: 'js' },
        { id: generateId(), label: 'Python', value: 'python' },
        { id: generateId(), label: 'Java', value: 'java' },
        { id: generateId(), label: 'Go', value: 'go' },
        { id: generateId(), label: 'Rust', value: 'rust' },
        { id: generateId(), label: 'C++', value: 'cpp' }
      ],
      validation: { required: true },
      order: 3
    },
    {
      id: generateId(),
      sectionId: sections[1].id,
      type: 'numeric',
      label: 'Years of professional experience',
      validation: { required: true, min: 0, max: 50 },
      order: 4
    },
    {
      id: generateId(),
      sectionId: sections[1].id,
      type: 'long-text',
      label: 'Describe a challenging technical problem you solved recently',
      validation: { required: true, minLength: 100, maxLength: 1000 },
      order: 5
    },
    // Section 3: Experience
    {
      id: generateId(),
      sectionId: sections[2].id,
      type: 'short-text',
      label: 'Current or most recent company',
      validation: { required: true, maxLength: 100 },
      order: 6
    },
    {
      id: generateId(),
      sectionId: sections[2].id,
      type: 'short-text',
      label: 'Current or most recent job title',
      validation: { required: true, maxLength: 100 },
      order: 7
    },
    {
      id: generateId(),
      sectionId: sections[2].id,
      type: 'long-text',
      label: 'Why are you interested in this position?',
      validation: { required: true, minLength: 50, maxLength: 500 },
      order: 8
    },
    {
      id: generateId(),
      sectionId: sections[2].id,
      type: 'file-upload',
      label: 'Upload your resume (PDF)',
      validation: { required: false },
      order: 9
    },
    {
      id: generateId(),
      sectionId: sections[2].id,
      type: 'single-choice',
      label: 'Expected salary range',
      options: [
        { id: generateId(), label: '$80k - $120k', value: '80-120' },
        { id: generateId(), label: '$120k - $160k', value: '120-160' },
        { id: generateId(), label: '$160k - $200k', value: '160-200' },
        { id: generateId(), label: '$200k+', value: '200+' }
      ],
      validation: { required: false },
      order: 10
    }
  ];

  return {
    id: assessmentId,
    jobId,
    title: 'Standard Job Assessment',
    description: 'Please complete this assessment to help us understand your qualifications better.',
    sections,
    questions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function seedDatabase() {
  const jobs = generateJobs(25);
  const candidates = generateCandidates(jobs, 1000);
  const assessments = jobs.slice(0, 3).map(job => generateAssessment(job.id));

  return {
    jobs,
    candidates,
    assessments
  };
}
