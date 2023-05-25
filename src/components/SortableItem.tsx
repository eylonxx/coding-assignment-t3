import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Category, Todo } from "@prisma/client";
import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import Checkmark from "./Checkmark";
interface SortableItemProps {
  todo: Todo;
  categories?: Category[];
  deleteTodo?: (todoId: string) => void;
  completeTodo?: (todoId: string, isDone: boolean) => void;
  editTodo?: (edit: boolean, todo?: Todo) => void;
}

const SortableItem = ({
  todo,
  deleteTodo,
  completeTodo,
  editTodo,
  categories,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getCategoryColor = (catId: string) => {
    if (categories) {
      const category = categories?.filter((cat) => cat.id === catId);
      if (!category.length) return "gray";
      return category[0].color;
    } else {
      return "gray";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-30" : "opacity-100"} h-16 w-full`}
    >
      <div className="flex h-full w-full cursor-pointer items-center truncate rounded-3xl bg-white py-2 pr-2 text-left">
        <div className="mr-2">
          <div {...attributes} {...listeners}>
            <RxDragHandleDots2 size={24} />
          </div>
        </div>
        <div className="flex w-[90%] items-center justify-between">
          <div className="flex w-2/3 flex-col justify-between text-lightGray sm:w-5/6 lg:flex-row">
            <div className="flex w-full items-center gap-2">
              <div
                style={{ backgroundColor: getCategoryColor(todo.catId) }}
                className="min-h-[24px] min-w-[24px] rounded-full border-2 border-lightGray"
              />
              <p className="w-full truncate text-lg font-medium md:w-4/5">
                {todo.title}
              </p>
            </div>
            <p className="w-full truncate text-left lg:w-2/3 lg:text-right">
              {new Date(todo.scheduledDate).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex w-1/2 items-center justify-end gap-2 md:w-[10%]">
            <div className="flex flex-col gap-1 md:gap-2 xl:flex-row">
              <button
                onClick={() => {
                  deleteTodo?.(todo.id);
                }}
                className="flex min-h-[25px] min-w-[25px] items-center justify-center rounded-full bg-[#eee]"
              >
                <FiTrash2 color="#A18AFF" />
              </button>
              <button
                onClick={() => {
                  editTodo?.(true, todo);
                }}
                className="flex min-h-[25px] min-w-[25px] items-center justify-center rounded-full bg-[#eee]"
              >
                <FiEdit2 color="#A18AFF" />
              </button>
            </div>

            <button
              onClick={() => {
                completeTodo?.(todo.id, !todo.isDone);
              }}
            >
              <Checkmark isDone={todo.isDone} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
