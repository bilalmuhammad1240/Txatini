'use client';

import { ProductCategory } from '@/types/product';

interface CategoryFilterProps {
  selected: ProductCategory | 'todos';
  onChange: (category: ProductCategory | 'todos') => void;
}

const CATEGORIES: { value: ProductCategory | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'tempero', label: 'Temperos' },
  { value: 'marinada', label: 'Marinadas' },
  { value: 'especiaria', label: 'Especiarias' },
  { value: 'condimento', label: 'Condimentos' },
  { value: 'outro', label: 'Outros' },
];

export default function CategoryFilter({
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            selected === cat.value
              ? 'bg-txatini-green text-white'
              : 'bg-white text-txatini-ink border border-txatini-green/20'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
