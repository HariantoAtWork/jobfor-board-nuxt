/**
 * Sample Boards Seed
 * Creates sample job application boards for development and testing
 *
 * Created: 2025-09-08T19:12:00+0200
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('boards').del()

  // Sample board data
  const sampleBoards = [
    {
      id: 'sample-board-1',
      user_id: 'sample-user-1',
      title: 'Software Engineer Applications',
      data: JSON.stringify({
        columns: [
          {
            id: 'applied',
            title: 'Applied',
            cards: [
              {
                id: 'card-1',
                title: 'Senior Frontend Developer',
                company: 'TechCorp',
                location: 'London, UK',
                jobTitle: 'Senior Frontend Developer',
                jobLink: 'https://techcorp.com/jobs/senior-frontend',
                source: 'LinkedIn',
                createdAt: '2025-09-01T10:00:00Z',
                lastMoved: '2025-09-01T10:00:00Z',
                notes: [
                  {
                    id: 'note-1',
                    title: 'Initial Application',
                    body: 'Applied through LinkedIn. Company looks promising with good benefits.',
                    createdAt: '2025-09-01T10:05:00Z',
                  },
                ],
              },
              {
                id: 'card-2',
                title: 'Full Stack Developer',
                company: 'StartupXYZ',
                location: 'Remote',
                jobTitle: 'Full Stack Developer',
                jobLink: 'https://startupxyz.com/careers',
                source: 'Company Website',
                createdAt: '2025-09-02T14:30:00Z',
                lastMoved: '2025-09-02T14:30:00Z',
                notes: [],
              },
            ],
          },
          {
            id: 'interview',
            title: 'Interview',
            cards: [
              {
                id: 'card-3',
                title: 'React Developer',
                company: 'WebAgency',
                location: 'Manchester, UK',
                jobTitle: 'React Developer',
                jobLink: 'https://webagency.com/jobs/react-dev',
                source: 'Indeed',
                createdAt: '2025-08-28T09:15:00Z',
                lastMoved: '2025-09-03T16:45:00Z',
                notes: [
                  {
                    id: 'note-2',
                    title: 'Phone Interview Scheduled',
                    body: 'Phone interview scheduled for next Tuesday at 2 PM. Need to prepare for React questions.',
                    createdAt: '2025-09-03T16:50:00Z',
                  },
                ],
              },
            ],
          },
          {
            id: 'offer',
            title: 'Offer',
            cards: [],
          },
          {
            id: 'rejected',
            title: 'Rejected',
            cards: [
              {
                id: 'card-4',
                title: 'Junior Developer',
                company: 'OldCorp',
                location: 'Birmingham, UK',
                jobTitle: 'Junior Developer',
                jobLink: 'https://oldcorp.com/careers',
                source: 'Job Board',
                createdAt: '2025-08-25T11:20:00Z',
                lastMoved: '2025-09-05T13:10:00Z',
                notes: [
                  {
                    id: 'note-3',
                    title: 'Rejection Feedback',
                    body: 'They said I was overqualified for the role. Looking for someone with less experience.',
                    createdAt: '2025-09-05T13:15:00Z',
                  },
                ],
              },
            ],
          },
        ],
        cards: [
          {
            id: 'card-1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'London, UK',
            jobTitle: 'Senior Frontend Developer',
            jobLink: 'https://techcorp.com/jobs/senior-frontend',
            source: 'LinkedIn',
            createdAt: '2025-09-01T10:00:00Z',
            lastMoved: '2025-09-01T10:00:00Z',
            notes: [
              {
                id: 'note-1',
                title: 'Initial Application',
                body: 'Applied through LinkedIn. Company looks promising with good benefits.',
                createdAt: '2025-09-01T10:05:00Z',
              },
            ],
          },
          {
            id: 'card-2',
            title: 'Full Stack Developer',
            company: 'StartupXYZ',
            location: 'Remote',
            jobTitle: 'Full Stack Developer',
            jobLink: 'https://startupxyz.com/careers',
            source: 'Company Website',
            createdAt: '2025-09-02T14:30:00Z',
            lastMoved: '2025-09-02T14:30:00Z',
            notes: [],
          },
          {
            id: 'card-3',
            title: 'React Developer',
            company: 'WebAgency',
            location: 'Manchester, UK',
            jobTitle: 'React Developer',
            jobLink: 'https://webagency.com/jobs/react-dev',
            source: 'Indeed',
            createdAt: '2025-08-28T09:15:00Z',
            lastMoved: '2025-09-03T16:45:00Z',
            notes: [
              {
                id: 'note-2',
                title: 'Phone Interview Scheduled',
                body: 'Phone interview scheduled for next Tuesday at 2 PM. Need to prepare for React questions.',
                createdAt: '2025-09-03T16:50:00Z',
              },
            ],
          },
          {
            id: 'card-4',
            title: 'Junior Developer',
            company: 'OldCorp',
            location: 'Birmingham, UK',
            jobTitle: 'Junior Developer',
            jobLink: 'https://oldcorp.com/careers',
            source: 'Job Board',
            createdAt: '2025-08-25T11:20:00Z',
            lastMoved: '2025-09-05T13:10:00Z',
            notes: [
              {
                id: 'note-3',
                title: 'Rejection Feedback',
                body: 'They said I was overqualified for the role. Looking for someone with less experience.',
                createdAt: '2025-09-05T13:15:00Z',
              },
            ],
          },
        ],
      }),
      created_at: '2025-09-08T19:12:00Z',
      updated_at: '2025-09-08T19:12:00Z',
      share_token: null,
      is_public: false,
    },
    {
      id: 'sample-board-2',
      user_id: 'sample-user-1',
      title: 'DevOps Engineer Applications',
      data: JSON.stringify({
        columns: [
          {
            id: 'interested',
            title: 'Interested',
            cards: [
              {
                id: 'card-5',
                title: 'Senior DevOps Engineer',
                company: 'CloudTech',
                location: 'Edinburgh, UK',
                jobTitle: 'Senior DevOps Engineer',
                jobLink: 'https://cloudtech.com/careers/devops',
                source: 'Company Website',
                createdAt: '2025-09-06T08:30:00Z',
                lastMoved: '2025-09-06T08:30:00Z',
                notes: [],
              },
            ],
          },
          {
            id: 'applied',
            title: 'Applied',
            cards: [],
          },
          {
            id: 'interview',
            title: 'Interview',
            cards: [],
          },
          {
            id: 'offer',
            title: 'Offer',
            cards: [],
          },
          {
            id: 'rejected',
            title: 'Rejected',
            cards: [],
          },
        ],
        cards: [
          {
            id: 'card-5',
            title: 'Senior DevOps Engineer',
            company: 'CloudTech',
            location: 'Edinburgh, UK',
            jobTitle: 'Senior DevOps Engineer',
            jobLink: 'https://cloudtech.com/careers/devops',
            source: 'Company Website',
            createdAt: '2025-09-06T08:30:00Z',
            lastMoved: '2025-09-06T08:30:00Z',
            notes: [],
          },
        ],
      }),
      created_at: '2025-09-08T19:12:00Z',
      updated_at: '2025-09-08T19:12:00Z',
      share_token: null,
      is_public: false,
    },
  ]

  // Inserts seed entries
  await knex('boards').insert(sampleBoards)
}
