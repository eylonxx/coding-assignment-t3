/* eslint-disable @typescript-eslint/no-misused-promises */
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface NewCategoryCardProps {
  handleAddCategory: (category: Category) => void;
}

const NewCategoryCard = ({ handleAddCategory }: NewCategoryCardProps) => {
  const [newCategory, setNewCategory] = useState("");
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Category>();

  const onSubmit: SubmitHandler<Category> = (data): void => {
    if (session) {
      const newCategory = { ...data, userId: session.user.id };
      handleAddCategory(newCategory);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex items-center justify-between">
            <div className="flex h-6 w-6 items-start justify-start overflow-hidden rounded-full bg-red-500">
              <input
                type="color"
                {...register("color", { required: true })}
                className="color-input"
              />
            </div>
            <input
              placeholder="Add category..."
              className="w-3/4 outline-none"
              type="text"
              {...register("name", { required: true })}
            />
            <button type="submit">+</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCategoryCard;
