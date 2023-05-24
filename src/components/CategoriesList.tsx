import { Category } from "@prisma/client";
import React from "react";
import CategoryCard from "./CategoryCard";
import NewCategoryCard from "./NewCategoryCard";
import Spinner from "./Spinner";

interface CategoriesListProps {
  filterTodos: (catId: string) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  selectedCategoryId: string;
  isLoading: boolean;
}

const CategoriesList = ({
  categories,
  filterTodos,
  addCategory,
  selectedCategoryId,
  isLoading,
}: CategoriesListProps) => {
  return (
    <>
      <CategoryCard
        filterTodos={filterTodos}
        isSelected={selectedCategoryId === "all"}
      />
      {isLoading ? (
        <div className="mt-10 flex h-full w-full justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : categories.length ? (
        categories.map((category) => {
          return (
            <CategoryCard
              isSelected={selectedCategoryId === category.id}
              key={category.id}
              id={category.id}
              color={category.color}
              name={category.name}
              filterTodos={filterTodos}
            />
          );
        })
      ) : (
        <div className="mt-10 flex h-full w-full justify-center text-2xl uppercase tracking-wider text-white">
          No other categories yet...
        </div>
      )}
      <NewCategoryCard handleAddCategory={addCategory} />
    </>
  );
};

export default CategoriesList;
