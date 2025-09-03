I want you to make a kanban like board where I can move around Cards, just like Trello, but for Job Applications.

I already setup a clean Nuxt v4 project with `pnpm`.

If you don’t know how to add stuff in Nuxt v4 please read some documentation online.


My first goal is the frontend. 

I have Types information and I hope you have better insight



```ts
export interface IColumn {
  id: string;
  title: string;
  order: number;
}

export interface ICardHistory {
  id: string;
  columnId: string;
  columnTitle: string;
  timestamp: string; // ISO date string
}

export interface INote {
  id: string;
  createdAt: string; // ISO date string
  title: string;
  body?: string;
}

export interface ICard {
  id: string;
  title: string;
  via?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  link?: string;
  contact?: string;
  description?: string;
  columnId: string;
  createdAt: string; // ISO date string
  lastMoved: string; // ISO date string
  history: ICardHistory[];
  notes: INote[];
}

export interface IBoardData {
  id: string;
  columns: IColumn[];
  cards: ICard[];
}

// Additional utility types
export interface DragState {
  isDragging: boolean;
  draggedCard: ICard | null;
  sourceColumnId: string | null;
}

export interface BoardState {
  board: IBoardData;
  dragState: DragState;
  isLoading: boolean;
  error: string | null;
}
```