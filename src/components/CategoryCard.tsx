import { Category } from "@prisma/client";
import React from "react";
interface CategoryProps {
  id?: string;
  color?: string;
  name?: string;
  filterTodos: (id: string) => void;
}
const CategoryCard = ({
  id = "all",
  color = "gray",
  name = "all",
  filterTodos,
}: CategoryProps) => {
  return (
    <div
      onClick={() => {
        filterTodos(id);
      }}
      key={id}
      className="flex w-full items-center gap-1 truncate text-sm xs:gap-3 xs:text-lg"
    >
      <div
        style={{ backgroundColor: color }}
        className="min-h-[24px] min-w-[24px] rounded-full"
      />
      <p className="truncate uppercase">{name}</p>
    </div>
  );
};

export default CategoryCard;
