# AI Development Rules for Nuxt 4 + Nuxt Iconify

## Project Overview
This project uses **Nuxt 4** with **Nuxt Iconify** for modern Vue.js development with automatic icon management.

## Core Technologies
- **Nuxt 4** - Latest version with Vue 3 Composition API
- **Nuxt Iconify** - Icon management and optimization
- **Vue 3** - Composition API and modern Vue features
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and better development experience

## Development Rules

### 1. Nuxt 4 Conventions
- Always use **ESM syntax** (`import`/`export`) - never `require()`
- Use **Composition API** with `<script setup>` syntax
- Leverage **Nuxt auto-imports** for composables and utilities
- Use **Nuxt file-based routing** - place pages in `pages/` directory
- Follow **Nuxt 4 directory structure** conventions

### 2. Nuxt Iconify Usage
- Use `<Icon>` component for all icons: `<Icon name="icon-name" />`
- Icons are automatically imported and optimized
- Available icon sets: Heroicons, Lucide, Material Design, etc.
- Use semantic icon names: `user`, `settings`, `arrow-right`, etc.
- Icons are tree-shaken automatically - only used icons are included

### 3. Component Development
- Use **Vue 3 Composition API** with `<script setup>`
- Prefer **TypeScript** for type safety
- Use **Tailwind CSS classes** for styling
- Follow **Vue 3 best practices** for reactivity and lifecycle

### 4. File Structure
```
app/
├── components/     # Reusable Vue components
├── composables/    # Shared logic and state
├── pages/          # Route pages (auto-routing)
├── layouts/        # Page layouts
├── assets/         # Static assets
├── stores/         # State management
└── types/          # TypeScript type definitions
```

### 5. Icon Naming Conventions
- Use **kebab-case** for icon names: `arrow-right`, `user-circle`
- Prefer **semantic names** over specific icon set names
- Common icon patterns:
  - Navigation: `arrow-left`, `arrow-right`, `chevron-down`
  - Actions: `plus`, `minus`, `edit`, `delete`, `save`
  - Status: `check`, `x`, `warning`, `info`
  - UI: `menu`, `close`, `search`, `filter`

### 6. Code Examples

#### Component with Icon
```vue
<template>
  <button class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded">
    <Icon name="plus" class="w-5 h-5" />
    Add Item
  </button>
</template>

<script setup lang="ts">
// Component logic here
</script>
```

#### Icon with Different Sizes
```vue
<Icon name="user" class="w-6 h-6" />
<Icon name="settings" class="w-4 h-4" />
<Icon name="arrow-right" class="w-5 h-5" />
```

### 7. Performance Considerations
- Icons are **automatically tree-shaken** - only used icons are bundled
- **Lazy loading** for dynamic icon usage
- **Optimized SVG output** for better performance
- Use appropriate icon sizes to avoid layout shifts

### 8. Development Commands
- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Preview**: `pnpm preview`
- **Generate**: `pnpm generate`

### 9. Icon Set Management
- Icons are automatically available from popular icon sets
- No need to manually import icon packages
- Icons are optimized and converted to Vue components
- Support for custom icon sets if needed

### 10. Best Practices
- **Always use semantic icon names** for better maintainability
- **Consistent icon sizing** using Tailwind classes
- **Accessibility**: Add `aria-label` for decorative icons when needed
- **Responsive design**: Use appropriate icon sizes for different screen sizes

## Common Icon Names Reference
- `home`, `user`, `settings`, `search`, `menu`
- `plus`, `minus`, `edit`, `delete`, `save`
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`
- `check`, `x`, `warning`, `info`, `success`
- `calendar`, `clock`, `mail`, `phone`, `location`

## Notes
- This project uses **pnpm** as package manager (not npm)
- All dependencies are managed through **pnpm**
- Icons are automatically optimized and tree-shaken
- Follow **en-UK** spelling conventions in documentation


## types

```ts name="types/index.ts"
export interface IColumn {
  id: string
  title: string
  description?: string
  order: number
}

export interface ICardHistory {
  id: string
  columnId: string
  columnTitle: string
  timestamp: string // ISO date string
}

export interface INote {
  id: string
  createdAt: string // ISO date string
  title: string
  body?: string
}

export interface ICard {
  id: string
  title: string
  via?: string
  company?: string
  jobTitle?: string
  location?: string
  link?: string
  contact?: string
  description?: string
  columnId: string
  createdAt: string // ISO date string
  lastMoved: string // ISO date string
  history: ICardHistory[]
  notes: INote[]
}

export interface IBoardData {
  id: string
  columns: IColumn[]
  cards: ICard[]
}

export interface IBoard {
  id: string
  user_id: string
  title: string
  data: IBoardData
  created_at: string // ISO date string
  updated_at: string // ISO date string
}

export interface ICreateBoardRequest {
  title: string
  data: IBoardData
}

export interface IUpdateBoardRequest {
  title?: string
  data?: IBoardData
}

// Additional utility types
export interface DragState {
  isDragging: boolean
  draggedCard: ICard | null
  sourceColumnId: string | null
}

export interface BoardState {
  board: IBoardData
  dragState: DragState
  isLoading: boolean
  error: string | null
}
```