import { Category } from "@prisma/client";
import React from "react";
interface CategoryProps {
  category: Category;
}
const CategoryCard = ({ category }: CategoryProps) => {
  return (
    <div
      key={category.id}
      className="flex w-full items-center gap-1 truncate text-sm xs:gap-3 xs:text-lg"
    >
      <div
        style={{ backgroundColor: category.color }}
        className="min-h-[24px] min-w-[24px] rounded-full"
      />
      <p className="truncate uppercase">{category.name}</p>
    </div>
  );
};

export default CategoryCard;
