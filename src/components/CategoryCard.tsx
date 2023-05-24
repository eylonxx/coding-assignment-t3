import { Category } from '@prisma/client';
import React from 'react';
interface CategoryProps {
  category: Category;
}
const CategoryCard = ({ category }: CategoryProps) => {
  return (
    <div key={category.id} className="flex items-center gap-3">
      <div style={{ backgroundColor: category.color }} className="w-6 h-6 rounded-full" />
      <p className="uppercase">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
