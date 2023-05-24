import { Category } from "@prisma/client";
import React from "react";
import CategoryCard from "./CategoryCard";
import NewCategoryCard from "./NewCategoryCard";
import Spinner from "./Spinner";

interface CategoriesListProps {
  filterTodos: (catId: string) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
}

const CategoriesList = ({
  categories,
  filterTodos,
  addCategory,
}: CategoriesListProps) => {
  return (
    <>
      <CategoryCard filterTodos={filterTodos} />
      {categories.length ? (
        categories.map((category) => {
          return (
            <CategoryCard
              key={category.id}
              id={category.id}
              color={category.color}
              name={category.name}
              filterTodos={filterTodos}
            />
          );
        })
      ) : (
        <div className="mt-10 flex h-full w-full justify-center overflow-hidden">
          <Spinner />
        </div>
      )}
      <NewCategoryCard handleAddCategory={addCategory} />
    </>
  );
};

export default CategoriesList;
