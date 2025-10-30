import { http, HttpResponse, delay } from 'msw';
import type { Job, Candidate, JobFilters, PaginatedResponse } from '@/types';
import { dbHelpers } from '@/lib/db';
import { getRandomDelay, shouldSimulateError, generateId, generateSlug } from '@/lib/utils';

const API_BASE = '/api';

export const handlers = [
  // GET /jobs - with pagination, search, filtering
  http.get(`${API_BASE}/jobs`, async ({ request }) => {
    await delay(getRandomDelay());

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sort = url.searchParams.get('sort') || 'order';

    let jobs = await dbHelpers.getAllJobs();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }

    // Apply sorting
    jobs.sort((a, b) => {
      if (sort === 'order') return a.order - b.order;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    // Pagination
    const total = jobs.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

    const response: PaginatedResponse<Job> = {
      data: paginatedJobs,
      total,
      page,
      pageSize,
      totalPages
    };

    return HttpResponse.json(response);
  }),

  // GET /jobs/:id
  http.get(`${API_BASE}/jobs/:id`, async ({ params }) => {
    await delay(getRandomDelay());

    const { id } = params;
    const job = await dbHelpers.getJobById(id as string);

    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(job);
  }),

  // POST /jobs - create new job
  http.post(`${API_BASE}/jobs`, async ({ request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const body = await request.json() as Partial<Job>;

    // Validation
    if (!body.title) {
      return new HttpResponse(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.title);
    const existingJobs = await dbHelpers.getAllJobs();
    const slugExists = existingJobs.some(j => j.slug === slug);

    if (slugExists) {
      return new HttpResponse(
        JSON.stringify({ error: 'Slug must be unique' }),
        { status: 400 }
      );
    }

    const maxOrder = existingJobs.reduce((max, job) => Math.max(max, job.order), -1);

    const newJob: Job = {
      id: generateId(),
      title: body.title,
      slug,
      status: body.status || 'active',
      tags: body.tags || [],
      order: body.order ?? (maxOrder + 1),
      description: body.description,
      location: body.location,
      department: body.department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dbHelpers.createJob(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  // PATCH /jobs/:id - update job
  http.patch(`${API_BASE}/jobs/:id`, async ({ params, request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const { id } = params;
    const updates = await request.json() as Partial<Job>;

    const job = await dbHelpers.getJobById(id as string);
    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    // Validate slug uniqueness if changed
    if (updates.slug && updates.slug !== job.slug) {
      const existingJobs = await dbHelpers.getAllJobs();
      const slugExists = existingJobs.some(j => j.id !== id && j.slug === updates.slug);

      if (slugExists) {
        return new HttpResponse(
          JSON.stringify({ error: 'Slug must be unique' }),
          { status: 400 }
        );
      }
    }

    const updatedJob = await dbHelpers.updateJob(id as string, updates);
    return HttpResponse.json(updatedJob);
  }),

  // PATCH /jobs/:id/reorder - reorder job with occasional errors
  http.patch(`${API_BASE}/jobs/:id/reorder`, async ({ params, request }) => {
    await delay(getRandomDelay());

    // Simulate 5-10% error rate for testing rollback
    if (shouldSimulateError(0.08)) {
      return new HttpResponse(null, { status: 500, statusText: 'Reorder failed' });
    }

    const { id } = params;
    const { fromOrder, toOrder } = await request.json() as { fromOrder: number; toOrder: number };

    const jobs = await dbHelpers.getAllJobs();
    const jobToMove = jobs.find(j => j.id === id);

    if (!jobToMove) {
      return new HttpResponse(null, { status: 404 });
    }

    // Update orders
    const updatedJobs = jobs.map(job => {
      if (job.id === id) {
        return { ...job, order: toOrder, updatedAt: new Date().toISOString() };
      }

      if (fromOrder < toOrder) {
        // Moving down
        if (job.order > fromOrder && job.order <= toOrder) {
          return { ...job, order: job.order - 1, updatedAt: new Date().toISOString() };
        }
      } else {
        // Moving up
        if (job.order >= toOrder && job.order < fromOrder) {
          return { ...job, order: job.order + 1, updatedAt: new Date().toISOString() };
        }
      }

      return job;
    });

    await dbHelpers.bulkUpdateJobs(updatedJobs);
    const updatedJob = updatedJobs.find(j => j.id === id);

    return HttpResponse.json(updatedJob);
  }),

  // GET /candidates - with pagination and filtering
  http.get(`${API_BASE}/candidates`, async ({ request }) => {
    await delay(getRandomDelay());

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

    let candidates = await dbHelpers.getAllCandidates();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }

    if (stage) {
      candidates = candidates.filter(c => c.stage === stage);
    }

    // Pagination
    const total = candidates.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);

    const response: PaginatedResponse<Candidate> = {
      data: paginatedCandidates,
      total,
      page,
      pageSize,
      totalPages
    };

    return HttpResponse.json(response);
  }),

  // GET /candidates/:id
  http.get(`${API_BASE}/candidates/:id`, async ({ params }) => {
    await delay(getRandomDelay());

    const { id } = params;
    const candidate = await dbHelpers.getCandidateById(id as string);

    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(candidate);
  }),

  // GET /candidates/:id/timeline
  http.get(`${API_BASE}/candidates/:id/timeline`, async ({ params }) => {
    await delay(getRandomDelay());

    const { id } = params;
    const timeline = await dbHelpers.getCandidateTimeline(id as string);

    return HttpResponse.json(timeline);
  }),

  // PATCH /candidates/:id - update candidate (stage transitions)
  http.patch(`${API_BASE}/candidates/:id`, async ({ params, request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const { id } = params;
    const updates = await request.json() as Partial<Candidate>;

    const candidate = await dbHelpers.getCandidateById(id as string);
    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }

    // If stage changed, add timeline entry
    if (updates.stage && updates.stage !== candidate.stage) {
      await dbHelpers.addTimelineEntry({
        id: generateId(),
        candidateId: id as string,
        fromStage: candidate.stage,
        toStage: updates.stage,
        changedAt: new Date().toISOString()
      });
    }

    const updatedCandidate = await dbHelpers.updateCandidate(id as string, updates);
    return HttpResponse.json(updatedCandidate);
  }),

  // GET /candidates/:id/notes
  http.get(`${API_BASE}/candidates/:id/notes`, async ({ params }) => {
    await delay(getRandomDelay());

    const { id } = params;
    const notes = await dbHelpers.getCandidateNotes(id as string);

    return HttpResponse.json(notes);
  }),

  // POST /candidates/:id/notes
  http.post(`${API_BASE}/candidates/:id/notes`, async ({ params, request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const { id } = params;
    const { content, mentions } = await request.json() as { content: string; mentions: string[] };

    const note = {
      id: generateId(),
      candidateId: id as string,
      content,
      mentions,
      createdAt: new Date().toISOString()
    };

    await dbHelpers.addNote(note);
    return HttpResponse.json(note, { status: 201 });
  }),

  // GET /assessments/:jobId
  http.get(`${API_BASE}/assessments/:jobId`, async ({ params }) => {
    await delay(getRandomDelay());

    const { jobId } = params;
    const assessment = await dbHelpers.getAssessmentByJobId(jobId as string);

    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(assessment);
  }),

  // PUT /assessments/:jobId
  http.put(`${API_BASE}/assessments/:jobId`, async ({ params, request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const { jobId } = params;
    const assessment = await request.json() as any;

    assessment.jobId = jobId;
    assessment.updatedAt = new Date().toISOString();

    const saved = await dbHelpers.saveAssessment(assessment);
    return HttpResponse.json(saved);
  }),

  // POST /assessments/:jobId/submit
  http.post(`${API_BASE}/assessments/:jobId/submit`, async ({ params, request }) => {
    await delay(getRandomDelay());

    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
    }

    const response = await request.json() as any;
    response.submittedAt = new Date().toISOString();

    const saved = await dbHelpers.saveAssessmentResponse(response);
    return HttpResponse.json(saved);
  })
];
