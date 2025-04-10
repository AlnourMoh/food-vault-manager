
export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  created_at: string;
  image_url?: string;
}

export interface Movement {
  id: string;
  product_id: string;
  product_name: string;
  scan_type: 'in' | 'out' | 'check';
  created_at: string;
  scanned_by: string;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}
