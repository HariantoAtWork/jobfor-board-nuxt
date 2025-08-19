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
  createdAt: string;
  title: string;
  body: string;
}

export interface ICard {
  id: string;
  title: string;
  via?: string;
  company?: string;
  jobTitle?: string;
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
