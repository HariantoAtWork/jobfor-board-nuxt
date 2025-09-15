# Job Application Organiser

A modern, full-stack job application organisation system built with Nuxt 4 and Vue 3. Organise your job applications through the entire hiring process using an intuitive Kanban-style board interface.

## 🎯 Overview

The Job Application Organiser helps job seekers organise and monitor their applications through different stages of the hiring process. Move application cards between columns to track progress, add notes, and maintain a comprehensive history of your job search journey.

## ✨ Features

### 📋 Kanban Board Organisation
- **Visual Progress Organisation**: Drag and drop cards between columns to organise application status
- **Customisable Columns**: Add, edit, and reorder columns to match your hiring process
- **Card Details**: Store comprehensive information for each application including company, job title, location, contact details, and links

### 📝 Application Organisation
- **Application History**: Automatic tracking of when applications move between stages
- **Notes System**: Add detailed notes to each application for follow-ups and important information
- **Activity Timeline**: View chronological history of all board activities

### 💾 Data Management
- **Local Storage**: Automatic saving to browser storage for offline access
- **Database Integration**: Save and load boards from a persistent database
- **Import/Export**: Import boards from files or URLs, export for backup
- **Storage Recovery**: Built-in recovery tools for corrupted data

### 🔐 User Management
- **Authentication**: Secure user registration and login system
- **Multi-Board Support**: Create and manage multiple job application boards
- **Board Sharing**: Share boards publicly with shareable links
- **Privacy Controls**: Toggle between public and private board access

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Undo/Redo**: Command pattern implementation for easy mistake correction
- **Keyboard Shortcuts**: Quick actions with Ctrl+Z/Ctrl+Y for undo/redo
- **Modern UI**: Clean, professional interface built with Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **Nuxt 4**: Full-stack Vue.js framework
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Accessible UI components
- **Heroicons**: Beautiful SVG icons

### Backend
- **Better Auth**: Modern authentication system
- **Knex.js**: SQL query builder
- **SQLite/PostgreSQL**: Database support
- **Nodemailer**: Email functionality

### Development Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint**: Code linting and formatting
- **Day.js**: Date manipulation library
- **UUID**: Unique identifier generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobfor-board-nuxt
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
app/
├── components/          # Vue components
│   ├── Board/          # Board-related components
│   └── UI/             # Reusable UI components
├── composables/        # Vue composables for state management
├── layouts/            # Nuxt layouts
├── pages/              # Application pages
├── store/              # Pinia stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

modules/                # Nuxt modules
├── 0000-auth/         # Authentication module
└── 0001-boards/       # Boards management module

server/                 # Server-side API routes
└── api/               # API endpoints
```

## 🎮 Usage

### Creating Your First Board
1. **Sign up** for a new account or **sign in** to existing account
2. **Add columns** to represent different stages (e.g., "Applied", "Interview", "Offer")
3. **Create cards** for each job application
4. **Drag cards** between columns as applications progress
5. **Add notes** to organise important details and follow-ups

### Organising Applications
- **Move cards** between columns to update application status
- **Add notes** for interview feedback, salary discussions, or next steps
- **View history** to see the complete timeline of each application
- **Export data** for backup or analysis

### Advanced Features
- **Create multiple boards** for different job search campaigns
- **Share boards** with career coaches or mentors
- **Import/export** boards for data portability
- **Use keyboard shortcuts** for efficient navigation

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data
pnpm db:migrate:rollback  # Rollback last migration

# Authentication
pnpm auth:generate    # Generate auth configuration
pnpm auth:migrate     # Run auth migrations

# Utilities
pnpm app:reset        # Reset application (clean install)
pnpm ci               # CI installation script
```

### Environment Variables

Key environment variables (see `env.example` for complete list):

```env
# Database
DB_TYPE=sqlite
SQLITE_PATH=./data/auth/auth-dev.sqlite

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Email (optional)
SMTP_HOST=your-smtp-host
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Nuxt.js](https://nuxt.com/)
- UI components from [Headless UI](https://headlessui.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Authentication by [Better Auth](https://www.better-auth.com/)

---

**Happy job hunting! 🎯**
