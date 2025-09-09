/**
 * Shared Boards Seed
 * Creates sample shared boards for testing public sharing functionality
 *
 * Created: 2025-09-08T19:12:00+0200
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Only run if we're in development and want to add shared boards
  if (process.env.NODE_ENV === 'production') {
    return
  }

  // Sample shared board data
  const sharedBoards = [
    {
      id: 'shared-board-1',
      user_id: 'sample-user-1',
      title: 'Public Job Board Example',
      data: JSON.stringify({
        columns: [
          {
            id: 'applied',
            title: 'Applied',
            cards: [
              {
                id: 'shared-card-1',
                title: 'Senior Software Engineer',
                company: 'TechGiant',
                location: 'London, UK',
                jobTitle: 'Senior Software Engineer',
                jobLink: 'https://techgiant.com/careers/senior-engineer',
                source: 'LinkedIn',
                createdAt: '2025-09-07T10:00:00Z',
                lastMoved: '2025-09-07T10:00:00Z',
                notes: [
                  {
                    id: 'shared-note-1',
                    title: 'Application Notes',
                    body: 'This is a public example board showing how job applications can be shared.',
                    createdAt: '2025-09-07T10:05:00Z',
                  },
                ],
              },
            ],
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
            id: 'shared-card-1',
            title: 'Senior Software Engineer',
            company: 'TechGiant',
            location: 'London, UK',
            jobTitle: 'Senior Software Engineer',
            jobLink: 'https://techgiant.com/careers/senior-engineer',
            source: 'LinkedIn',
            createdAt: '2025-09-07T10:00:00Z',
            lastMoved: '2025-09-07T10:00:00Z',
            notes: [
              {
                id: 'shared-note-1',
                title: 'Application Notes',
                body: 'This is a public example board showing how job applications can be shared.',
                createdAt: '2025-09-07T10:05:00Z',
              },
            ],
          },
        ],
      }),
      created_at: '2025-09-08T19:12:00Z',
      updated_at: '2025-09-08T19:12:00Z',
      share_token: 'sample-share-token-123',
      is_public: true,
    },
  ]

  // Insert shared boards (these will be added to existing data)
  await knex('boards').insert(sharedBoards)
}
