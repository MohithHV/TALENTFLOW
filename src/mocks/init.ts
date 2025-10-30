import { db, dbHelpers } from '@/lib/db';
import { seedDatabase } from './seedData';

export async function initializeMockData() {
  // Check if database is already seeded
  const existingJobs = await dbHelpers.getAllJobs();

  if (existingJobs.length === 0) {
    console.log('Seeding database with initial data...');

    const { jobs, candidates, assessments } = seedDatabase();

    // Seed jobs
    await db.jobs.bulkAdd(jobs);
    console.log(`✓ Seeded ${jobs.length} jobs`);

    // Seed candidates
    await db.candidates.bulkAdd(candidates);
    console.log(`✓ Seeded ${candidates.length} candidates`);

    // Seed assessments
    await db.assessments.bulkAdd(assessments);
    console.log(`✓ Seeded ${assessments.length} assessments`);

    console.log('Database seeding complete!');
  } else {
    console.log(`Database already contains ${existingJobs.length} jobs`);
  }
}
