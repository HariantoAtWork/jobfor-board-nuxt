# Changelog

All notable changes to the Job Application Tracker project will be documented in this file.

## [Unreleased]

### Fixed - 2025-08-19T13:41:14+0200
- Fixed Card component resolution issue in BoardColumn component
- Renamed Card.vue to BoardCard.vue for consistency
- Added proper import for BoardCard component in BoardColumn
- Cards now display properly when added to columns

### Fixed - 2025-08-19T12:37:48+0200
- Fixed component resolution error by renaming `Column.vue` to `BoardColumn.vue`
- Fixed TypeScript type issues with readonly properties in useBoard composable
- Fixed `cards.filter is not a function` error by adding proper type checking
- Updated `getCardsForColumn` function to handle undefined cards array
- Development server now runs successfully without errors

### Added - 2025-08-19T12:33:38+0200
- Initial project setup with Nuxt v4
- TypeScript type definitions for job application tracking
- Core project structure and file organization
- Tailwind CSS configuration and styling
- Utility functions for data management and formatting
- Local storage integration for data persistence
- Drag and drop functionality for cards
- Board component with column management
- Card component with job application details
- Column component with card management
- Import/Export functionality (basic structure)
- Modern, responsive UI design
- Action buttons in footer (History, Export, Import File, Import from URL)

### Added - 2025-08-19T15:11:31+0200
- Added column drag and drop functionality for reordering
- Column headers are now draggable with visual feedback
- Cursor changes to grab/grabbing when dragging columns
- Enhanced board layout with reorderable columns

### Added - 2025-08-19T14:12:49+0200
- Added background drop zone functionality
- Cards can now be dropped in the empty space below columns
- Automatic column detection based on mouse position when dropping in background
- Visual feedback when dragging over the board area
- Enhanced drag and drop UX for better user experience

### Technical Implementation
- **Framework**: Nuxt v4 with Vue 3
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **State Management**: Vue composables
- **Data Persistence**: Local Storage
- **Type Safety**: TypeScript throughout

### Components Created
- `Board.vue` - Main board container
- `BoardColumn.vue` - Individual column component (renamed from Column.vue)
- `Card.vue` - Job application card component
- Utility functions for data management
- Storage utilities for import/export

### Features Implemented
- ✅ Kanban board layout with multiple columns
- ✅ Card creation and management
- ✅ Drag and drop between columns
- ✅ Local storage persistence
- ✅ Column management (add/delete)
- ✅ Basic import/export structure
- ✅ Responsive design
- ✅ TypeScript type safety
- ✅ Development server running successfully

### Next Steps
- [ ] Card details modal
- [ ] Notes system for cards
- [ ] History tracking and display
- [ ] Search and filtering
- [ ] Enhanced import/export functionality
- [ ] Column editing
- [ ] Card editing
- [ ] Performance optimizations
