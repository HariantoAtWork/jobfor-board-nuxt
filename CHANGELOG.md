# Changelog

All notable changes to the Job Application Tracker project will be documented in this file.

## [Unreleased]

### Fixed - 2025-09-25T15:48:05+0200
- **Better Auth API Endpoint Correction** - Fixed session forwarding to use correct Better Auth API endpoint
  - **Corrected Endpoint**: Changed from `/api/auth/session` to `/api/auth/get-session`
  - **API Documentation**: Used Context7 to verify correct Better Auth API endpoints
  - **Session Structure**: Confirmed Better Auth returns `{ user, session }` structure
  - **Response Handling**: Updated session parsing to match Better Auth response format
  - **Error Prevention**: Prevents 404 errors when forwarding session requests to external server

### Added - 2025-09-25T15:32:24+0200
- **Proxy Authentication Support** - Enhanced authentication system to work with external Account Server
  - **Session Forwarding**: Created `sessionForwarding.server.js` for seamless proxy authentication
    - Automatically detects when `BETTER_AUTH_PROXY_URL` is configured
    - Forwards session requests to external auth server while maintaining local session format
    - Falls back to local authentication when proxy is not configured
    - Handles session cookie forwarding and response parsing
    - Provides consistent session data structure for both local and proxied authentication
  - **Enhanced Session Management**: Updated `session.server.js` to use new forwarding system
    - Seamless integration with existing authentication code
    - No changes required to existing API endpoints or components
    - Maintains backward compatibility with local authentication
  - **Status Endpoint Enhancement**: Updated `/api/status` to work with both local and proxy authentication
    - Added `authMode` field to response indicating whether using 'proxy' or 'local' authentication
    - Enhanced error handling for both authentication modes
    - Consistent response format regardless of authentication source
  - **Environment Configuration**: Added `BETTER_AUTH_PROXY_URL` to environment variables
    - Documented in `env.example` with usage instructions
    - Enables easy switching between local and proxy authentication
    - Supports development and production environments
  - **Boards Integration**: All board operations now work seamlessly with proxy authentication
    - User ID extraction works correctly from proxied sessions
    - Database operations maintain user isolation
    - No changes required to existing board management code
  - **Backward Compatibility**: System works with both authentication modes
    - Local authentication continues to work when proxy URL is not set
    - Automatic fallback ensures no breaking changes
    - Development and production environments supported

### Added - 2025-09-24T21:08:56+0200
- **Backend Authentication Status Checker** - Created server-side authentication verification system
  - **API Endpoint**: New `/api/auth/status` endpoint for checking user authentication status
    - Uses `better-auth` session management from `modules/0000-auth`
    - Returns comprehensive authentication information including user details and session data
    - Proper error handling with graceful fallback for unauthenticated users
    - Consistent API response format with success/error states and timestamps
  - **Enhanced Test Page**: Updated `/test-auth/is-logged-in` page with comprehensive UI
    - **Backend Integration**: Uses server-side API instead of frontend authentication checks
    - **Visual Status Indicators**: Clear authenticated/not authenticated states with icons and colours
    - **User Information Display**: Shows detailed user data when authenticated (ID, email, name, verification status)
    - **Session Information**: Displays session expiry time with proper date formatting
    - **Interactive Features**: Refresh button to re-check authentication status
    - **Navigation Links**: Direct links to sign-in and sign-up pages when not authenticated
    - **Debug Information**: JSON display of full API response for development purposes
    - **Error Handling**: Comprehensive error display with user-friendly messages
    - **Loading States**: Proper loading indicators during authentication checks
    - **Responsive Design**: Mobile-friendly layout with proper spacing and typography
  - **Server-Side Security**: Authentication verification happens on the server, not client-side
    - Prevents client-side manipulation of authentication status
    - Uses secure session cookies and server-side session validation
    - Follows existing project patterns for API authentication
  - **TypeScript Integration**: Full type safety with proper interfaces for API responses
  - **Consistent Styling**: Matches project design system with Tailwind CSS classes

### Enhanced - 2025-09-16T01:07:24+0200
- **Custom v-sanitize-html Directive** - Created reusable Vue directive for HTML sanitization
  - **Plugin Implementation**: Created `plugins/sanitize-html.client.js` with comprehensive sanitization
  - **Directive Registration**: Automatically available throughout the application
  - **Cleaner Code**: Replaced manual `makeHtml()` calls with semantic `v-sanitize-html` directive
  - **Consistent Security**: Same DOMPurify configuration across all HTML rendering
  - **Component Updates**: Updated all components to use the new directive
    - `CardNotes.vue`: Note body rendering
    - `BoardColumn.vue`: Card description rendering
    - `Board.vue`: Activity description rendering
    - `shared/[token].vue`: All HTML content rendering
  - **Code Cleanup**: Removed redundant `makeHtml` imports from components
  - **Better Developer Experience**: More semantic and maintainable HTML sanitization
  - **Future-Proof**: Centralized sanitization logic for easy updates and configuration

### Enhanced - 2025-09-16T00:57:47+0200
- **Security Enhancement** - Upgraded HTML sanitization with DOMPurify for better XSS protection
  - **DOMPurify Integration**: Replaced marked's basic sanitize with comprehensive DOMPurify sanitization
  - **Enhanced Security**: Added DOMPurify package with advanced HTML sanitization capabilities
  - **Comprehensive Tag Allowlist**: Configured specific allowed HTML tags for safe markdown rendering
    - Text formatting: `p`, `br`, `strong`, `em`, `u`, `b`, `i`, `s`, `strike`
    - Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
    - Lists: `ul`, `ol`, `li`
    - Code: `blockquote`, `pre`, `code`
    - Links and media: `a`, `img`
    - Tables: `table`, `thead`, `tbody`, `tr`, `th`, `td`
  - **Attribute Security**: Restricted allowed attributes to safe ones only
    - Links: `href`, `title`, `target`, `rel`
    - Images: `src`, `alt`, `width`, `height`
    - General: `class`, `id`
  - **Security Configuration**: Disabled dangerous features
    - `ALLOW_DATA_ATTR: false` - Prevents data attribute injection
    - `ALLOW_UNKNOWN_PROTOCOLS: false` - Blocks dangerous protocols
    - `SANITIZE_DOM: true` - Comprehensive DOM sanitization
    - `KEEP_CONTENT: true` - Preserves safe content while removing dangerous elements
  - **XSS Prevention**: Protects against JavaScript injection in markdown content
  - **Maintained Functionality**: All existing markdown features work while being more secure
  - **Future-Ready**: Foundation for safe JavaScript-enabled content when needed

### Added - 2025-09-15T23:54:21+0200
- **Cursor Rules System** - Comprehensive development guidelines and project structure documentation
  - **Project Structure Rules** (`.cursor/rules/project-structure.mdc`): Core architecture and technology stack guidelines
    - Always-applied rules for project structure and development conventions
    - Technology stack documentation (Nuxt 4, Vue 3, TypeScript, Tailwind CSS)
    - Package management guidelines (pnpm instead of npm)
    - File structure and directory organization patterns
  - **Nuxt Vue Conventions** (`.cursor/rules/nuxt-vue-conventions.mdc`): Vue 3 and Nuxt 4 development patterns
    - Script setup syntax and Composition API best practices
    - Component structure and template conventions
    - File naming conventions and import/export rules
    - TypeScript conventions and type definitions
  - **Component Patterns** (`.cursor/rules/component-patterns.mdc`): UI component development guidelines
    - Standard component templates and structure
    - Board and UI component organization
    - Styling guidelines with Tailwind CSS
    - Accessibility requirements and best practices
  - **State Management** (`.cursor/rules/state-management.mdc`): Composables and state management patterns
    - Composable architecture and structure
    - Command pattern implementation for undo/redo
    - Data persistence and storage management
    - Type definitions and interfaces
  - **API Server Patterns** (`.cursor/rules/api-server-patterns.mdc`): Server-side development guidelines
    - API route structure and error handling
    - Module architecture and configuration
    - Database patterns with Knex.js
    - Authentication and session management
  - **Development Workflow** (`.cursor/rules/development-workflow.mdc`): Tooling and workflow guidelines
    - Package management with pnpm
    - Development commands and scripts
    - File management and changelog updates
    - Code quality and testing requirements
  - **Kanban Board Logic** (`.cursor/rules/kanban-board-logic.mdc`): Board functionality and patterns
    - Board architecture and component structure
    - Drag and drop implementation
    - Command pattern for undo/redo operations
    - Card and column management patterns
    - Data persistence and performance optimizations
  - **Comprehensive Coverage**: Rules cover all aspects of the project from frontend to backend
  - **File References**: Each rule includes proper file references using `[filename](mdc:filename)` syntax
  - **Metadata Configuration**: Proper frontmatter with `alwaysApply`, `globs`, and `description` properties
  - **Development Consistency**: Ensures consistent development practices across the entire project

### Changed - 2025-09-15T12:15:30+0200
- **Project Naming Update** - Changed from "Job Application Tracker" to "Job Application Organiser"
  - **README.md**: Updated title, descriptions, and all references to use "Organiser"
  - **nuxt.config.ts**: Updated app title and meta description
  - **Board.vue**: Updated main header title
  - **CHANGELOG.md**: Updated project references
  - **Rationale**: "Organiser" better reflects the manual organisation aspect vs automatic tracking
  - **User Psychology**: "Organiser" is more appealing and accurate for a tool that requires user input
  - **Clarity**: Eliminates confusion about whether the system automatically tracks vs requires manual organisation

### Added - 2025-09-15T12:04:14+0200
- **Comprehensive Project Description** - Created detailed project documentation and README
  - **Complete README.md Rewrite**: Replaced generic Nuxt starter content with comprehensive project description
  - **Project Overview**: Clear explanation of the Job Application Organiser's purpose and functionality
  - **Feature Documentation**: Detailed breakdown of all application features including:
    - Kanban Board Management with visual progress tracking and customisable columns
    - Application Tracking with history, notes system, and activity timeline
    - Data Management with local storage, database integration, and import/export
    - User Management with authentication, multi-board support, and sharing
    - User Experience features including responsive design, undo/redo, and keyboard shortcuts
  - **Technology Stack Documentation**: Complete breakdown of frontend, backend, and development tools
  - **Quick Start Guide**: Step-by-step installation and setup instructions
  - **Project Structure**: Clear file organisation and directory structure explanation
  - **Usage Instructions**: Comprehensive guide for creating boards, managing applications, and using advanced features
  - **Development Documentation**: Available scripts, environment variables, and development guidelines
  - **Contributing Guidelines**: Clear instructions for contributing to the project
  - **Professional Presentation**: Modern formatting with emojis, code blocks, and clear sections
  - **User-Friendly Language**: Accessible documentation suitable for both technical and non-technical users

### Fixed - 2025-09-14T23:45:12+0200
- **Confirm Reset Modal** - Fixed missing confirm button in reset confirmation dialog
  - **Modal Component Enhancement**: Added `confirmClass` prop to UIModal component for custom button styling
  - **Confirm Button Display**: Fixed `showConfirmButton` prop not being set to `true` in reset confirmation
  - **Button Styling**: Added red styling for destructive reset action with proper hover states
  - **Function Naming**: Resolved naming conflict between imported and local `restoreFromBackup` functions
  - **User Experience**: Users can now properly confirm or cancel the reset operation

### Enhanced - 2025-09-14T23:30:45+0200
- **Export All Data Option** - Added comprehensive localStorage export as first recovery option
  - **New First Option**: "Export All Data (Recommended)" appears as the top recovery option
  - **Complete Backup**: Exports all localStorage data regardless of source or format
  - **JSON Format**: Downloads as structured JSON file with proper formatting
  - **Smart Parsing**: Automatically detects and parses JSON data, falls back to strings
  - **Visual Highlighting**: Blue-themed option with clear "Recommended" labeling
  - **User Guidance**: Clear instructions to backup data before attempting recovery
  - **File Naming**: Automatic timestamp-based file naming for easy organization

### Fixed - 2025-09-14T23:15:30+0200
- **Import Error Fix** - Fixed `recoverFromCorruption` import error in StorageRecovery component
  - **Composable Integration**: Properly integrated `useBoardWithCommands` composable in StorageRecovery component
  - **Function Separation**: Created separate `restoreFromAutomaticBackup()` function for automatic backup restoration
  - **Import Resolution**: Fixed all import/export issues between storage utilities and UI components
  - **Build Success**: Resolved all build warnings and errors for clean production builds
  - **Fresh Browser Support**: Storage recovery system now works correctly for fresh browsers without localStorage data

### Added - 2025-09-14T22:55:18+0200
- **Storage Recovery System** - Comprehensive browser storage backup and recovery solution
  - **Storage Backup Utility** (`storageBackup.ts`): Complete backup and recovery system
    - Manual backup creation with timestamps and descriptions
    - Automatic backup management with corruption detection
    - Export/import functionality for backup files
    - Storage information and health monitoring
    - Recovery data management for emergency situations
  - **Storage Recovery UI** (`UI.StorageRecovery.vue`): User-friendly recovery interface
    - Automatic corruption detection with visual error banners
    - Multiple recovery options: automatic, backup restore, manual backups, file import
    - Storage status dashboard with detailed information
    - Manual backup management with creation, restoration, and deletion
    - File-based backup export/import with validation
    - Emergency reset option with confirmation dialogs
  - **Board Integration**: Seamless integration with main Board component
    - Storage Recovery option in File context menu
    - Automatic error detection and recovery prompts
    - Real-time storage health monitoring
    - Recovery event handling with board reload
  - **Enhanced Error Handling**: Improved localStorage corruption recovery
    - Graceful degradation when storage is corrupted
    - Multiple fallback mechanisms for data recovery
    - User-friendly error messages and recovery guidance
    - Prevention of 500 errors from corrupted browser storage
  - **Backup Management**: Comprehensive backup system
    - Automatic backup creation before data operations
    - Manual backup creation with custom descriptions
    - Backup listing and management interface
    - Storage size monitoring and optimization
    - Recovery data preservation during cleanup operations

### Added
- **URL Status Checker** - Added real-time URL accessibility and content checking for job links
  - **2025-09-10T11:51:08+0200**: Implemented URL status checking functionality
  - **2025-09-10T12:14:03+0200**: Enhanced with content checking using existing bulk links API
  - **URL Status Composable** (`useUrlStatus.ts`): Centralised URL status management
    - Reuses existing `/api/fetch-title` endpoint for robust URL checking
    - Checks both URL accessibility and content availability
    - Extracts page titles for better status information
    - Caches status results with timestamps to avoid repeated checks
    - Supports parallel checking of multiple URLs
    - Handles cross-origin URL checking gracefully
  - **Enhanced Visual Status Indicators**: Icon buttons next to URLs showing comprehensive status
    - 🟢 Green check circle: URL is accessible with content
    - 🟡 Yellow alert circle: URL is accessible but has no content
    - 🔴 Red X circle: URL is not accessible  
    - ⚪ Gray help circle: Status unknown (click to check)
    - 🔄 Spinning loading icon: Currently checking
  - **Rich Tooltips**: Detailed status information with page titles
    - Shows page title when available
    - Indicates content availability status
    - Provides clear error messages
  - **BoardCard.vue Integration**: Status icon in card link section
    - Automatic status check when card loads
    - Click to refresh status manually
    - Enhanced hover tooltips with content information
  - **BoardColumn.vue Integration**: Status icon in card details modal
    - Automatic status check when card is selected
    - Manual refresh capability
    - Consistent styling with card view
  - **Smart URL Formatting**: Proper protocol handling for status checks
    - Adds `https://` for URLs without protocol
    - Handles `www.` prefixed URLs correctly
    - Preserves existing protocols
  - **Reused Existing Infrastructure**: Leverages proven bulk links functionality
    - Uses same robust API endpoint with proper error handling
    - Benefits from existing timeout and header configurations
    - Maintains consistency with bulk import feature

### Enhanced - 2025-09-11T11:26:37+0200
- **URL Content Analysis Enhancement** - Better detection of meaningful content vs. redirect/loading pages
  - **Enhanced Content Detection**: Added `analyzeContentQuality()` function to detect meaningful content
  - **Google Share Link Detection**: Correctly identifies Google Share/Jobs links as having no meaningful content
  - **Generic Title Filtering**: Filters out generic titles like "Loading...", "Redirecting", etc.
  - **Content Analysis**: Analyzes HTML body content to detect JavaScript-heavy or empty pages
  - **API Response Enhancement**: Added `hasContent` field to `/api/fetch-title` response
  - **Frontend Integration**: Updated `useUrlStatus` composable to use enhanced content analysis
  - **Improved Accuracy**: Now correctly shows Google Share links as "alive but no content" instead of "alive with content"

### Improved - 2025-09-10T13:48:19+0200
- **Save Board Modal Enhancement** - Auto-select single board for overwrite
  - **Smart Default Selection**: When only one board exists, automatically selects "Overwrite Existing Board"
  - **Pre-selected Board**: Single board is automatically selected in the dropdown
  - **Improved UX**: Reduces clicks and streamlines the save process for single-board users
  - **Fallback Logic**: Still defaults to "Create New Board" for multiple boards or no boards

### Improved - 2025-09-10T12:42:57+0200
- **Notes Enhancement** - Made note body content optional
  - **CardNotes.vue**: Updated validation logic to only require title
  - **Optional Body Field**: Notes can now be created with just a title
  - **UI Updates**: Form labels now indicate "Content (optional)"
  - **Display Logic**: Shows "No content" for notes without body text
  - **Validation**: Removed requirement for body content in both add and edit modes
  - **User Experience**: More flexible note creation for quick title-only notes
- **Copy URLs Feature** - Added ability to copy URLs from column cards to clipboard
  - **2025-09-09T13:59:46+0200**: Added "Copy URLs" button to Column context menu
  - **Copy URLs Modal**: Comprehensive modal displaying all URLs from cards in the column
    - Shows card title, company, and clickable URL for each card with a link
    - Individual copy buttons for each URL with visual feedback
    - "Copy All URLs" button to copy all URLs at once (one per line)
    - Empty state message when no URLs are found in the column
    - Scrollable list for columns with many cards
  - **Smart URL Formatting**: Automatically formats URLs with proper protocols
    - Adds `https://` prefix for URLs without protocol
    - Handles `www.` prefixed URLs correctly
    - Preserves existing `http://` and `https://` URLs
  - **Clipboard Integration**: Modern clipboard API with fallback for older browsers
    - Uses `navigator.clipboard.writeText()` for modern browsers
    - Falls back to `document.execCommand('copy')` for older browsers
    - Proper error handling and user feedback
  - **Enhanced UX**: 
    - Green-themed "Copy URLs" button in column context menu
    - Modal automatically closes column menu when opened
    - Clean, professional modal design matching application style
    - Responsive layout with proper spacing and typography
- **Environment Variables Validation Script** - Created `scripts/check-env.mjs` for validating required environment variables
  - **2025-09-08T14:42:16+0200**: Added comprehensive environment variable validation script
  - Checks always required variables: `BETTER_AUTH_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `DB_TYPE`
  - Database-specific validation based on `DB_TYPE`:
    - SQLite: Validates `SQLITE_PATH`
    - PostgreSQL: Validates `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE`
  - Automatic `.env` file loading with fallback to system environment variables
  - Clear error reporting with missing variable lists
  - Executable script with proper shebang and chmod +x permissions
  - Exit codes: 0 for success, 1 for validation failures
  - Comprehensive logging with emoji indicators for better readability

- **Database Seeds System** - Created comprehensive database seeding system for development and testing
  - **2025-09-08T19:12:00+0200**: Added `database/seeds/` directory with sample data
  - **Sample Boards Seed** (`01_sample_boards.cjs`): Creates realistic job application boards
    - Software Engineer Applications board with cards in different stages (Applied, Interview, Offer, Rejected)
    - DevOps Engineer Applications board with interested/applied workflow
    - Includes sample cards with notes, job links, company information, and locations
    - Uses proper data structure matching the application's board format
  - **Shared Boards Seed** (`02_shared_boards.cjs`): Creates sample shared boards for testing
    - Public job board example with share token for testing sharing functionality
    - Demonstrates how boards can be shared publicly with proper share_token and is_public fields
    - Only runs in development environment (skipped in production)
  - **Seeding Script** (`scripts/seed.sh`): Executable script for running database seeds
    - Loads environment variables from .env file
    - Runs all seeds with proper error handling
    - Clear success/failure reporting with emoji indicators
  - **Comprehensive Documentation** (`database/seeds/README.md`): Complete guide for using seeds
    - Explains difference between migrations and seeds
    - Usage instructions for running seeds individually or all at once
    - Guidelines for creating new seed files
    - Development vs production considerations
  - **Knex Integration**: Properly configured in knexfile.js for seeds directory
  - **Ordered Execution**: Seeds run in alphabetical order with numbered prefixes

### Changed
- **2025-09-07T21:50:06+0200**: Updated shared board history to group activities by month (e.g., "January 2025") instead of by day, matching the main Board component's behaviour
- **2025-09-07T21:50:06+0200**: Restored proper function calls in shared board page (makeHtml, cardFormatTime, nowStore) to match main Board component functionality - 2025-09-06T16:06:59+0200
- **Board Sharing System** - Complete sharing functionality for database boards
- **Share Button**: Generate shareable links for any board in the Database/Manage Boards modal
- **Allow View Share Toggle**: Toggle button to control public access to boards (default: private)
- **Public Board Access**: Anyone with the share link can view the board without authentication
- **Share Token Management**: 
  - Automatic share token generation when making boards public
  - Revoke share tokens to make boards private again
  - Unique share tokens for each board
- **Database Schema Updates**:
  - Added `share_token` field (unique) to boards table
  - Added `is_public` field (boolean) to boards table
  - Added database indexes for efficient share token and public board queries
- **API Endpoints**:
  - `POST /api/boards/[id]/share` - Generate share token for a board
  - `DELETE /api/boards/[id]/share` - Revoke share token for a board
  - `PUT /api/boards/[id]/public` - Toggle public access for a board
  - `GET /api/shared/[token]` - Get shared board by token (public access)
- **Shared Board View Page**: 
  - New page at `/shared/[token]` for viewing shared boards
  - Read-only view with all board content (cards, columns, notes)
  - Responsive design with proper loading and error states
  - Card detail modal for viewing full card information
  - Clean, professional interface for public sharing
  - **History Footer**: Added footer with History button to shared pages
  - **Activity History Modal**: Complete history functionality for shared boards
    - Shows card movements between columns with timestamps
    - Displays notes added to cards with creation dates
    - Groups activities by date for better organization
    - Same functionality as main app history modal
    - Clean modal design with proper scrolling and responsive layout
  - **Board Info Context Menu**: Improved footer with Board Info button
    - Moved board information from main content to footer context menu
    - Shows board title, creation date, last updated, card count, column count
    - Displays public status with visual indicator
    - Clean, organized context menu design
    - Click-outside functionality to close menu
  - **Fixed Layout Structure**: Improved shared page layout
    - Full viewport layout (100vh, 100vw) for shared pages
    - Fixed header always at top of screen
    - Scrollable main content area in the middle
    - Fixed footer always at bottom of screen
    - CSS Grid layout for proper header/body/footer structure
    - Matches default layout behavior for consistency
  - **Restored Board Structure with Icons**: Brought back proper board layout
    - Restored board-columns structure matching main Board component
    - Added back all icons including note icons and external link icons
    - Proper card styling with hover effects and transitions
    - Clean column headers and organized card content
    - Full horizontal and vertical scrolling capabilities
  - **Applied Main Board Icons**: Enhanced shared board with consistent iconography
    - Added company icon (`mdi-light:factory`) for company names
    - Added briefcase icon (`mdi-light:briefcase`) for job titles
    - Added location icon (`mdi-light:map-marker`) for job locations
    - Added link icon (`mdi-light:link`) for external job links
    - Added share icon (`mdi-light:share-variant`) for application source
    - Added note icon (`mdi-light:note`) for card notes
    - Added column count badges matching main Board component
    - Consistent visual design with main application
- **Enhanced Board Management UI**:
  - Visual indicators for public/private boards (eye icons)
  - Share button with clipboard integration
  - Revoke button for removing share access
  - Toggle switch for enabling/disabling public access
  - Improved board layout with sharing controls section
- **User Experience Improvements**:
  - Automatic clipboard copying of share URLs
  - Confirmation dialogs for destructive actions
  - Real-time UI updates when toggling sharing settings
  - Clear visual feedback for sharing status
  - Error handling with user-friendly messages

### Improved - 2025-09-06T14:51:53+0200
- **Bulk Links Usability Enhancement** - Improved bulk links import to accept full text instead of URL-per-line format
- **Smart URL Extraction**: Automatically extracts all URLs from pasted text using regex pattern matching
- **Flexible Input**: Users can now paste any text containing job links (emails, job board pages, documents, etc.)
- **Enhanced User Experience**: 
  - Updated modal label to "Paste Text with Job Links"
  - New placeholder with realistic example showing mixed text and URLs
  - Updated help text to explain automatic URL extraction
  - Improved processing status message: "Extracting URLs and fetching page titles..."
- **Robust URL Detection**: Uses comprehensive regex pattern to find all HTTP/HTTPS URLs in text
- **Duplicate Removal**: Automatically removes duplicate URLs found in the text
- **Better Error Messages**: Updated error message for when no URLs are found in the text
- **Maintained Functionality**: All existing features (title fetching, card creation, status tracking) work unchanged

### Added - 2025-09-06T14:27:00+0200
- **Bulk Links Import** - Added ability to import multiple job links at once with automatic title fetching
- **Column Context Menu Enhancement**: Added "Add Bulk Links" button to column context menu
- **Bulk Links Modal**: Comprehensive modal for processing multiple URLs
  - Large textarea for pasting multiple links (one per line)
  - Real-time processing status with loading indicators
  - Live preview of processed links with success/error status
  - Color-coded status indicators (green for success, red for error, yellow for pending)
- **Automatic Title Fetching**: Server-side API endpoint to fetch page titles from URLs
  - `/api/fetch-title` endpoint with proper error handling and timeouts
  - Intelligent title cleaning (removes job board suffixes like "LinkedIn", "Indeed", etc.)
  - 10-second timeout to prevent hanging requests
  - Proper User-Agent headers for better compatibility
- **Smart Card Creation**: Automatically creates cards with fetched data
  - Uses fetched page title as card title and job title
  - Extracts company name from URL domain
  - Adds source URL as job link
  - Includes import metadata in description
- **URL Validation**: Validates URLs before processing
- **Error Handling**: Comprehensive error handling for failed title fetches
- **User Feedback**: Clear success/error messages and processing status
- **Batch Processing**: Processes multiple links sequentially with individual status tracking

### Improved - 2025-09-06T14:19:18+0200
- **Import from URL Reorganization** - Moved Import from URL functionality to File context menu
- **UI Consolidation**: Removed standalone "Import from URL" button from main footer
- **File Menu Enhancement**: Added "Import from URL" option to File context menu with proper icon
- **Better Organization**: All import/export functionality now grouped under File menu
  - Import File
  - Export File  
  - Import from URL (newly added)
- **Menu Positioning**: Updated File context menu height calculation for new menu item
- **Consistent UX**: Import from URL now follows same pattern as other file operations
- **Cleaner Footer**: Reduced footer clutter by consolidating related functionality

### Cleaned Up - 2025-09-06T14:00:52+0200
- **Data Button Removal** - Removed redundant "Data" button and context menu from UI
- **UI Cleanup**: Removed Data button with "Load Data" and "Save Data" options from footer
- **Code Cleanup**: Removed all Data-related reactive variables and functions
  - Removed `showDataMenu` reactive variable
  - Removed `toggleBoardMenu()` function
  - Removed `onLoadData()` and `onSaveData()` functions
  - Removed Data-related click-outside handling
- **API Cleanup**: Completely removed `/api/data` endpoints and server files
  - Deleted entire `server/api/data/` directory
  - Removed all Data API endpoints (GET, POST, PUT, DELETE, etc.)
  - Removed backup, exists, info, and search endpoints
- **Simplified Architecture**: App now uses only Database functionality for server-side operations
- **Maintained Functionality**: All Data operations now handled through comprehensive Database system
- **Cleaner UI**: Footer now shows only File and Database buttons for better user experience

### Enhanced - 2025-09-06T02:21:14+0200
- **Save Board Modal Enhancement** - Added choice between creating new board or overwriting existing
- **Save Type Selection**: Added radio buttons for "Create New Board" vs "Overwrite Existing Board"
- **Dynamic Form Fields**: Form adapts based on selected save type
  - Create New: Shows title input field with placeholder
  - Overwrite: Shows dropdown to select existing board
- **Board Loading**: Automatically loads existing boards when save modal opens
- **Smart Validation**: Save button is disabled when overwrite is selected but no board is chosen
- **Enhanced UX**: 
  - Empty state message when no existing boards are found
  - Board titles show creation dates in dropdown
  - Different button text based on save type ("Create Board" vs "Overwrite Board")
- **API Integration**: Uses POST for new boards, PUT for overwriting existing boards
- **Form Reset**: Properly resets form state when modal closes
- **Error Handling**: Comprehensive error handling for both create and update operations

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
