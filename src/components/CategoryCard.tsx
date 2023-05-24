import React from "react";
interface CategoryProps {
  id?: string;
  color?: string;
  name?: string;
  filterTodos: (id: string) => void;
  isSelected: boolean;
}
const CategoryCard = ({
  id = "all",
  color = "gray",
  name = "all",
  filterTodos,
  isSelected,
}: CategoryProps) => {
  return (
    <div
      onClick={() => {
        filterTodos(id);
      }}
      key={id}
      className={`xs:text-md flex w-full cursor-pointer items-center gap-1 truncate rounded-xl p-1 text-sm font-semibold tracking-wider transition-all hover:bg-darkPurple/70 xs:gap-3 ${
        isSelected ? "bg-[#6f4bff]" : "bg-lightPurple"
      }`}
    >
      <div
        style={{ backgroundColor: color }}
        className="box-border min-h-[24px] min-w-[24px] rounded-full border-2"
      />
      <p className={`truncate uppercase text-[#fff]`}>{name}</p>
    </div>
  );
};

export default CategoryCard;
