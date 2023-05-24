/* eslint-disable @typescript-eslint/no-misused-promises */
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";

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
  } = useForm<Category>({ mode: "onTouched" });

  const onSubmit: SubmitHandler<Category> = (data): void => {
    if (session) {
      const newCategory = { ...data, userId: session.user.id };
      handleAddCategory(newCategory);
    }
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-between errorInput:flex-row errorInput:items-center">
          <div className="relative w-3/4 errorInput:w-3/4">
            <input
              placeholder={errors.name ? "" : "Add a category..."}
              className="w-full outline-none"
              type="text"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="pointer-events-none absolute left-0 top-1 min-w-[90px] text-xs font-semibold text-lightPurple">
                This is required
              </span>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-6 w-6 items-start justify-start overflow-hidden rounded-full">
              <input
                type="color"
                {...register("color", { required: true })}
                className="color-input"
              />
            </div>
            <button
              className="flex items-center justify-center rounded-md bg-lightPurple p-1 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-lightPurple/70"
              type="submit"
            >
              Add <FiPlusCircle size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCategoryCard;
