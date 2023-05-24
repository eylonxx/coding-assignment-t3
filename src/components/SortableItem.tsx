import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category, Todo } from "@prisma/client";
import React, { useEffect } from "react";
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
        <div className="flex w-full items-center justify-between">
          <div className="flex w-5/6 flex-col justify-between text-lightGray md:flex-row">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: getCategoryColor(todo.catId) }}
                className="h-6 w-6 rounded-full border-2 border-lightGray"
              />
              <p className="truncate text-lg font-medium">{todo.title}</p>
            </div>
            <p className="truncate text-base">
              {new Date(todo.scheduledDate).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                deleteTodo?.(todo.id);
              }}
              className="z-10 rounded-md bg-[#eee] p-2"
            >
              <FiTrash2 />
            </button>
            <button
              onClick={() => {
                editTodo?.(true, todo);
              }}
              className="rounded-md bg-[#eee] p-2"
            >
              <FiEdit2 />
            </button>
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
