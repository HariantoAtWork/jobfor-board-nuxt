# Changelog

All notable changes to the Job Application Tracker project will be documented in this file.

## [Unreleased]

### Simplified - 2025-09-06T00:36:59+0200
- **Migration Script Cleanup** - Simplified migrate.sh by removing redundant environment variable handling
- Removed duplicate environment variable loading logic from shell script
- Environment variables are now handled exclusively by knexfile.js with dotenv
- Cleaned up commented code and simplified script structure
- Migration script is now more maintainable and focused on its core purpose

### Fixed - 2025-09-06T00:25:15+0200
- **Knex Environment Variables** - Fixed knexfile.js not reading .env file
- Added `dotenv` package dependency for proper environment variable loading
- Updated knexfile.js to import and configure dotenv before reading process.env
- Added MySQL support to knexfile.js with proper environment variable handling
- Enhanced migration script to show correct PostgreSQL and MySQL environment variables
- Added debugging output to knexfile.js to show loaded environment configuration
- Fixed port parsing to use parseInt() for proper numeric conversion
- Migration system now properly reads all environment variables from .env file

### Refactored - 2025-09-05T23:37:18+0200
- **Module Structure Reorganization** - Moved boards functionality to dedicated module
- Created separate `modules/0001-boards/` module for board database functionality
- Moved `boards.server.js` from auth module to dedicated boards module
- Updated all API route imports to reference new boards module location
- Added boards module to Nuxt configuration
- Created comprehensive README for boards module with usage examples
- Improved separation of concerns between authentication and board management
- Maintained all existing functionality while improving code organization

### Added - 2025-09-05T20:18:53+0200
- **Database-Backed Board Management** - Complete RESTful API for multi-user board storage
- Created comprehensive database schema with boards table supporting SQLite, MySQL, and PostgreSQL
- **Database Migration**: Added `2025-09-05T20-18-53.000Z.sql` with boards table and indexes
- **Database Layer**: Created `boards.server.js` with full CRUD operations and multi-database support
- **RESTful API Endpoints**: Complete `/api/boards` API with authentication
  - `GET /api/boards` - List all user boards with optional search
  - `POST /api/boards` - Create new board with title and data
  - `GET /api/boards/[id]` - Get specific board by ID
  - `PUT /api/boards/[id]` - Update board title and/or data
  - `DELETE /api/boards/[id]` - Delete board
- **Authentication Integration**: All endpoints require user authentication via better-auth
- **Session Management**: Created `session.server.js` for secure session handling
- **Type Definitions**: Extended types with `IBoard`, `ICreateBoardRequest`, `IUpdateBoardRequest`
- **Multi-Database Support**: Automatic database type detection via `DB_TYPE` environment variable
- **Data Validation**: Comprehensive validation for board data structure and user permissions
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Search Functionality**: Full-text search across board titles with case-insensitive matching
- **User Isolation**: All board operations are scoped to authenticated user
- **Database Indexes**: Optimized queries with indexes on user_id, title, and created_at

### Added - 2025-09-05T20:18:53+0200
- **Database UI Integration** - Complete user interface for database board management
- **Database Button**: Added new indigo-themed Database button with context menu (only visible when user is logged in)
- **Database Context Menu**: Three main actions with proper icons and styling
  - Load Board: Browse and load saved boards from database
  - Save Board: Save current board to database with custom title
  - Manage Boards: Full board management interface
- **Board Selection Modal**: Interactive modal for loading boards with board previews
  - Shows board title, creation date, and card/column counts
  - Click-to-load functionality with hover effects
  - Empty state with helpful messaging
- **Board Management Modal**: Comprehensive board management interface
  - List all user boards with detailed information
  - Load and delete actions for each board
  - Shows creation date, last updated, and board statistics
- **Save Board Modal**: Title input for saving boards to database
  - Custom title input with placeholder showing creation date
  - Automatic fallback to ISO timestamp if no title provided
- **Smart Menu Positioning**: Database context menu automatically positions above/below based on available space
- **Click-Outside Handling**: Proper menu closure when clicking outside database menu
- **Consistent Styling**: Database UI matches existing design system with indigo theme
- **Error Handling**: Comprehensive error handling with user-friendly alerts
- **API Integration**: Full integration with database API endpoints for seamless user experience

### Fixed - 2025-09-05T19:24:31+0200
- **Clear Board Function** - Fixed to remove both cards and columns completely
- Updated `clearBoard()` function to clear both `board.value.cards = []` and `board.value.columns = []`
- Updated confirmation dialog to accurately describe the action
- Fixed duplicate key error in useBoard composable return statement

### Added - 2025-09-05T19:07:53+0200
- **File Context Menu Enhancements** - Added new board management options
- Added "Clear Board" button to File context menu (removes all cards and columns)
- Added "Default Board" button to File context menu (resets to default board data)
- Implemented `clearBoard()` function in useBoard composable
- Implemented `defaultBoard()` function in useBoard composable
- Added confirmation dialogs for destructive actions
- Enhanced File menu with visual separator and color-coded buttons
- Clear Board button uses red styling with delete-sweep icon
- Default Board button uses blue styling with refresh icon

### Enhanced - 2025-09-05T18:57:42+0200
- **Import Functions Refactoring** - Unified data validation across all import methods
- Updated URL import (`importFromUrl`) to use the new `dataValidator` system
- Updated database import (`onLoadBoard`) to use the new `dataValidator` system
- Enhanced server API (`/api/data`) with basic data structure validation
- All import methods now use consistent validation and sanitization
- File import, URL import, and database import all use the same validation logic
- Improved error handling and user feedback for all import operations
- Automatic data migration and sanitization for all import sources

### Fixed - 2025-09-05T18:41:03+0200
- **localStorage Crash Prevention** - Comprehensive data validation and error handling system
- Created `dataValidator.ts` with complete data structure validation and sanitization
- Enhanced `storage.ts` with backup system, error recovery, and fallback mechanisms
- Added `dataMigration.ts` for handling old data formats and version tracking
- Updated `useBoard.ts` composable with graceful error handling and recovery functions
- Implemented automatic backup creation before saving data
- Added data corruption recovery with automatic fallback to default values
- Enhanced import/export functions with proper validation and sanitization
- App now handles malformed localStorage data without crashing
- Automatic data migration for old data formats (e.g., `place` → `location`, `job_title` → `jobTitle`)
- Comprehensive error logging for debugging data issues
- Graceful degradation when localStorage is unavailable or corrupted

### Fixed - 2025-09-05T10:11:16+0200
- **MenuBar Context Menu Click Issue** - Fixed context menu closing when clicking anywhere inside the menu
- Removed problematic backdrop overlay that was interfering with menu interactions
- Implemented proper click-outside detection using container reference
- Added higher z-index to menu to ensure it stays above other elements
- Menu now only closes when clicking outside the entire menu container
- Form interactions now work properly without unexpected menu closure

### Fixed - 2025-09-05T10:06:58+0200
- **MenuBar Form Interaction Issue** - Fixed context menu closing when trying to fill form fields
- Added `@click.stop` to menu container to prevent event bubbling to backdrop
- Implemented proper backdrop click handling with event target checking
- Users can now interact with login/signup form fields without menu closing
- Enhanced click-outside functionality for better form usability

### Fixed - 2025-09-05T09:29:29+0200
- **MenuBar SSR Error** - Fixed server-side rendering error with useSession composable
- Wrapped MenuBar component in ClientOnly to prevent SSR issues
- Fixed session data structure access with proper destructuring
- Resolved "Cannot read properties of undefined" error during SSR
- Component now renders properly on both server and client

### Fixed - 2025-09-05T09:25:38+0200
- **MenuBar Component Error** - Fixed undefined session value error in MenuBar component
- Added missing `computed` import from Vue
- Added defensive programming with optional chaining for user properties
- Fixed server-side rendering error with session data handling
- Component now handles undefined session gracefully

### Added - 2025-09-05T09:20:59+0200
- **Menu Bar with Authentication** - Pill-shaped menu bar with account icon and context menu
- Created `UI.MenuBar.vue` component with modern pill design and backdrop blur effect
- Integrated `mdi-light:account` icon as requested with proper styling
- Implemented context menu with login form for email/password authentication
- Added sign-up form with name, email, and password fields
- Integrated with better-auth for seamless login/logout functionality
- Added user session management with proper state handling
- Implemented smooth transitions and animations for menu interactions
- Added keyboard support (Escape key to close menu)
- Responsive design with proper z-index and positioning
- Menu automatically closes after successful authentication
- Added loading states and error handling for auth operations
- Updated Board component to include the new MenuBar

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

### Enhanced - 2025-09-03T12:32:42+0200
- **Board Operations UI** - Combined Load and Save Board into context menu
- Replaced separate Load/Save buttons with unified "Board" dropdown menu
- Added purple-themed Board button with database icon and chevron
- Implemented click-outside functionality to close context menu
- Added smooth hover effects and transitions for context menu items
- Improved footer layout with cleaner, more organized action grouping
- Context menu automatically closes after successful board operations

### Fixed - 2025-09-03T12:32:42+0200
- **Context Menu Positioning** - Ensured menu visibility at screen edges
- Added smart positioning logic to detect available space
- Menu automatically appears above button when insufficient space below
- Implemented dynamic positioning calculation based on viewport height
- Added CSS classes for top and bottom menu positioning
- Prevents context menu from being cut off at bottom of screen

### Enhanced - 2025-09-03T12:32:42+0200
- **File Operations UI** - Combined Import and Export File into context menu
- Replaced separate Import/Export buttons with unified "Files" dropdown menu
- Added green-themed Files button with file-multiple icon and chevron
- Implemented same smart positioning logic for file context menu
- Added click-outside functionality for file menu
- Improved footer organization with grouped file operations
- Both context menus now use consistent styling and behavior

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
