# Job Application Tracker - Development Plan

**Created:** 2025-08-19T12:28:45+0200

## Project Overview

Building a Kanban-style job application tracker similar to Trello, specifically designed for managing job applications through various stages of the hiring process.

## Current Project State

- **Framework:** Nuxt v4 with Vue 3
- **Package Manager:** pnpm
- **Current Setup:** Clean Nuxt v4 project with basic dependencies
- **TypeScript:** Configured with proper type definitions

## Core Features to Implement

### 1. Kanban Board Structure
- **Columns:** Represent different stages of job application process
  - Job Posting
  - Cover Letter
  - Applied
  - First Meeting
  - Under Review
  - Follow Up
  - Offer
  - Rejected / Expired
  - Recruit Companies
  - Missed Calls
  - Custom columns (add/remove functionality)

### 2. Card Management
- **Card Creation:** Add new job application cards
- **Card Movement:** Drag and drop between columns
- **Card Details:** Display company, job title, location, contact info, links
- **Card History:** Track movement between columns with timestamps
- **Card Notes:** Add and manage notes for each application

### 3. Data Structure Implementation
Based on provided TypeScript interfaces:
- `IBoardData`: Main board container
- `IColumn`: Column definitions with ordering
- `ICard`: Job application cards with full metadata
- `ICardHistory`: Movement tracking
- `INote`: Notes system for cards

### 4. UI/UX Features
- **Modern Design:** Clean, professional interface
- **Responsive Layout:** Works on desktop and mobile
- **Drag & Drop:** Smooth card movement between columns
- **Real-time Updates:** Immediate visual feedback
- **Search/Filter:** Find specific applications
- **Card Counts:** Show number of cards in each column

### 5. Action Buttons (Footer)
- **History:** View application timeline
- **Export:** Download board data
- **Import File:** Upload board data
- **Import from URL:** Import from external source

## Technical Implementation Plan

### Phase 1: Core Structure (Frontend)
1. **Setup Project Structure**
   - Create components directory
   - Set up TypeScript types
   - Configure CSS/styling framework

2. **Create Core Components**
   - `Board.vue`: Main board container
   - `Column.vue`: Individual column component
   - `Card.vue`: Job application card component
   - `CardForm.vue`: Add/edit card form
   - `ColumnForm.vue`: Add/edit column form

3. **Implement State Management**
   - Use Nuxt's built-in state management
   - Create composables for board operations
   - Implement local storage for persistence

### Phase 2: Drag & Drop Functionality
1. **Install Drag & Drop Library**
   - Use `@vueuse/core` or similar for drag functionality
   - Implement smooth animations

2. **Card Movement Logic**
   - Handle drag start/move/end events
   - Update card columnId and history
   - Update lastMoved timestamp

### Phase 3: Data Management
1. **Local Storage Integration**
   - Save board state to localStorage
   - Load data on app startup
   - Handle data migration

2. **Import/Export Features**
   - JSON export functionality
   - File upload for imports
   - URL import capability

### Phase 4: Enhanced Features
1. **Card Details & Notes**
   - Expandable card details
   - Notes management system
   - Rich text editing

2. **Search & Filter**
   - Search across all cards
   - Filter by company, job title, status
   - Sort options

3. **History Tracking**
   - Visual timeline of card movements
   - Export history data

## File Structure Plan

```
app/
├── components/
│   ├── Board/
│   │   ├── Board.vue
│   │   ├── Column.vue
│   │   ├── Card.vue
│   │   ├── CardForm.vue
│   │   └── ColumnForm.vue
│   ├── UI/
│   │   ├── Button.vue
│   │   ├── Modal.vue
│   │   └── Input.vue
│   └── Layout/
│       ├── Header.vue
│       └── Footer.vue
├── composables/
│   ├── useBoard.ts
│   ├── useCards.ts
│   └── useStorage.ts
├── types/
│   └── index.ts
├── utils/
│   ├── storage.ts
│   └── helpers.ts
└── assets/
    └── styles/
        ├── main.css
        └── components.css
```

## Dependencies to Add

- **Styling:** Tailwind CSS or UnoCSS for utility-first styling
- **Icons:** Font Awesome (as per user preference)
- **Drag & Drop:** @vueuse/core or vue-draggable-next
- **Date Handling:** date-fns for timestamp management
- **Validation:** vee-validate for form validation

## Development Priorities

1. **MVP Features:**
   - Basic board with columns
   - Card creation and display
   - Drag and drop movement
   - Local storage persistence

2. **Enhanced Features:**
   - Card details and notes
   - Import/export functionality
   - Search and filtering
   - History tracking

3. **Polish:**
   - Responsive design
   - Animations and transitions
   - Error handling
   - Performance optimization

## Success Criteria

- [ ] Kanban board displays with multiple columns
- [ ] Cards can be created and moved between columns
- [ ] Data persists in local storage
- [ ] Drag and drop works smoothly
- [ ] Card details are properly displayed
- [ ] Import/export functionality works
- [ ] Responsive design on mobile devices
- [ ] TypeScript types are properly implemented

## Next Steps

1. Set up project structure and dependencies
2. Create basic board layout
3. Implement card creation and display
4. Add drag and drop functionality
5. Integrate local storage
6. Add import/export features
7. Polish UI/UX and add responsive design

This plan provides a comprehensive roadmap for building a professional job application tracker that matches the functionality shown in the reference image while leveraging the provided TypeScript interfaces and Nuxt v4 framework.
