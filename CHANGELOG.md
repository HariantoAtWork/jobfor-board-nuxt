# Changelog

All notable changes to the Job Application Tracker project will be documented in this file.

## [Unreleased]

### Added - 2025-09-03T12:32:42+0200
- **AI Development Rules** - Comprehensive guidelines for Nuxt 4 + Nuxt Iconify development
- Created `AI_RULES.md` with detailed development conventions and best practices
- Includes Nuxt 4 conventions, Composition API usage, and file structure guidelines
- Comprehensive icon usage patterns with Nuxt Iconify integration
- Performance considerations and optimization guidelines
- Common icon names reference and naming conventions
- Development commands and package management with pnpm
- TypeScript best practices and Vue 3 Composition API guidelines

### Added - 2025-09-03T12:32:42+0200
- **Full RESTful API for JSON Data Management** - Complete API system for managing data.json files
- Created comprehensive REST API endpoints in `server/api/data/` directory
- **Core CRUD Operations**: GET, POST, PUT, DELETE for `/api/data`
- **Utility Endpoints**: File existence check, metadata info, backup creation, search functionality
- **Advanced Features**: Automatic directory creation, data validation, error handling
- **Search Capabilities**: Full-text search with path-based filtering and result limiting
- **Backup System**: Timestamped backups with automatic directory management
- **File Management**: Automatic `.data/json/` directory structure creation
- **Comprehensive Documentation**: Complete API reference with examples and usage patterns
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Security Features**: Path validation and restricted file operations

### Added - 2025-09-03T12:32:42+0200
- **Board Save Functionality** - Integrated board saving with REST API
- Implemented `onSaveBoard` function in Board.vue component
- Saves complete board state (board, columns, cards) to `/api/data` endpoint
- Includes timestamp for last saved data
- Proper error handling with user-friendly alerts
- Fixed UI.Logo component reference issue

### Fixed - 2025-09-03T12:32:42+0200
- **Import from URL Functionality** - Fixed inconsistent behavior and sort errors
- Enhanced `importFromUrl` function with proper data validation
- Added HTTP response status checking for better error handling
- Implemented same validation logic as file import for consistency
- Added proper error logging and user-friendly error messages
- Fixed data structure validation to prevent sort errors
- Ensured imported data has required columns and cards arrays

### Added - 2025-09-03T12:32:42+0200
- **Load Board Functionality** - New button to load saved board data from API
- Added "Load Board" button before "Save Board" in footer actions
- Implemented `onLoadBoard` function to fetch data from `/api/data` endpoint
- Added comprehensive data validation for loaded board data
- Includes proper error handling and user feedback
- Styled with orange theme to distinguish from other action buttons
- Provides seamless board restoration from saved JSON data

### Added - 2025-01-27T11:45:00+0000
- **Better-Auth API Test Script** - Comprehensive testing suite for central auth server
- Created `test-login.sh` script for testing all better-auth endpoints
- Script tests user registration, login, session management, and logout
- Includes proper error handling and colored output for better readability
- Tests both valid and invalid credentials scenarios
- Extracts and uses session cookies for authenticated endpoint testing
- Provides detailed response information including HTTP status codes
- Supports testing against https://accounts.harianto.dev/
- Includes health check endpoint testing
- Script is executable and ready for immediate use

### Fixed - 2025-08-26T13:15:27+0200
- **Column Context Menu Click-Outside** - Improved menu behavior
- Fixed column context menu not hiding when clicking outside
- Added click-outside event listener with proper cleanup
- Menu now closes automatically when clicking anywhere outside
- Consistent behavior with other context menus in the application
- Added proper event handling with onMounted/onUnmounted lifecycle hooks

### Added - 2025-08-25T21:51:05+0200
- **Editable Last Moved Date** - Enhanced card editing capabilities
- Added ability to edit the "Last Moved" date in Card Details Edit Mode
- Date picker uses datetime-local input for precise date/time selection
- Created date is displayed as read-only for reference
- Proper date format conversion between ISO strings and datetime-local format
- Uses dayjs for consistent date/time handling across the application

### Added - 2025-08-25T21:36:14+0200
- **Card Move Context Menu** - Quick column navigation for cards
- Added three-dot menu button in card header for quick actions
- Context menu shows all available columns to move the card to
- Current column is highlighted with checkmark and blue background
- Menu closes automatically when clicking outside or selecting a column
- Perfect solution for moving cards when columns are far apart
- Responsive design with proper z-index and positioning

### Enhanced - 2025-08-25T17:06:39+0200
- **Enhanced Activity History** - Added notes to the activity timeline
- Notes are now included in the activity history flow alongside card movements
- Each note entry shows card title, note title, and creation timestamp
- All activities (movements + notes) are sorted chronologically in a single timeline
- Improved visual styling with sticky month/year headers and better contrast
- Enhanced activity descriptions with bold formatting for better readability

### Added - 2025-08-25T16:39:31+0200
- **Activity History Modal** - Complete implementation of the history tracking system
- Added Activity History modal that displays when clicking the History button
- Shows chronological log of all card movements grouped by month and year
- Each activity entry displays card title, destination column, and timestamp
- Activities are sorted with newest items on top
- Empty state with icon when no activity history exists
- Responsive design with proper scrolling for long history lists
- Clean, professional UI matching the application's design system

### Fixed - 2025-08-25T14:20:00+0200
- **Fixed import functionality** - imported data now properly updates the board state instead of just logging to console
- Added `replaceBoard` method to `useBoard` composable for proper board replacement
- Added validation for imported JSON data structure to ensure required fields are present
- Updated both file import and URL import handlers to use the new `replaceBoard` method
- Added success alerts to confirm successful imports

### Added - 2025-08-20T01:45:37+0200
- **Location field support** for job applications
  - Added `location?: string` to `ICard` interface
  - Added location field to add card form with placeholder "e.g., London, Remote, New York"
  - Added location field to edit card form
  - Added location display in card details modal
  - Added location display in card component with proper styling
  - Updated all card creation and editing logic to handle location field

### Changed - 2025-08-20T01:50:15+0200
- Renamed `place` field to `location` throughout the application for better clarity
  - Updated `ICard` interface from `place?: string` to `location?: string`
  - Updated all form labels from "Place" to "Location"
  - Updated all CSS classes from `.card-place` to `.card-location`
  - Updated all data binding and references throughout components

### Added - 2025-08-20T13:40:04+0200
- **Complete Notes system** for job application cards
  - Added `CardNotes.vue` component with full CRUD functionality
  - Added note management functions to `useBoard` composable (`addNoteToCard`, `updateNoteInCard`, `deleteNoteFromCard`)
  - Integrated notes into card details modal with edit mode support
  - Added note count display in notes header
  - Added note creation timestamps with relative time formatting
  - Added edit and delete actions for individual notes
  - Added form validation for note creation and editing
  - Added keyboard shortcuts (Enter to save, Ctrl+Enter for textarea)
  - Added confirmation dialog for note deletion
  - Added proper TypeScript types and interfaces for note management
  - Added comprehensive styling with amber theme for notes section

### Added - 2025-08-20T13:54:09+0200
- **Improved Notes view mode** with compact toggle design
  - Notes now display title and timestamp on one line for better space efficiency
  - Added expand/collapse toggle button (chevron up/down) next to each note
  - Note body is hidden by default in view mode and can be toggled to show/hide
  - In edit mode, all note bodies are always visible for editing
  - Maintains individual expansion state for each note independently
  - Cleaner, more organized layout with better visual hierarchy

### Added - 2025-08-20T15:01:57+0200
- **Enhanced Notes editing capabilities**
  - Added datetime picker for editing note creation date (`createdAt`)
  - Notes now sorted by creation date with newest items on top
  - Added proper date format conversion between ISO strings and datetime-local input
  - Improved note management with chronological ordering
  - Enhanced edit form with date/time selection for better note organization

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

### Added - 2025-08-19T16:39:10+0200
- Added card editing functionality with toggle between View and Edit modes
- Edit/Save/Cancel button toggle in card details modal
- Inline editing form with all card fields
- Enhanced card management with full CRUD operations

### Added - 2025-08-19T16:30:25+0200
- Added card details modal for viewing job application information
- Card details modal with comprehensive information display
- Edit and Delete buttons in card details header
- Enhanced card management with detailed view capabilities

### Added - 2025-08-19T15:24:14+0200
- Added column title editing functionality
- Edit column modal with form validation
- Column titles can now be changed via context menu
- Enhanced column management capabilities

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
