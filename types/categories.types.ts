export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type?: 'income' | 'expense';
}

export interface AddCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  txType: 'income' | 'expense';
  onSave: (category: any) => void;
}