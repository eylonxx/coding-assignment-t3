import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Category, Todo } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CategoryCard from "~/components/CategoryCard";
import Header from "~/components/Header";
import Modal from "~/components/NewAndEditModal";
import NewCategoryCard from "~/components/NewCategoryCard";
import SortableItem from "~/components/SortableItem";
import User from "~/components/User";
import { api } from "~/utils/api";

const Home: React.FC = () => {
  const { data: sessionData } = useSession({ required: true });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();

  const {
    data: fetchedTodos,
    isLoading: isLoadingTodos,
    refetch: refetchTodos,
  } = api.todo.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Todo[]) => setTodos(data),
  });

  const {
    data: fetchedCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = api.category.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Category[]) => setCategories(data),
  });

  const addTodo = api.todo.addTodo.useMutation({});
  const updateTodo = api.todo.updateTodo.useMutation({
    onSuccess: (updatedTodo: Todo) => {
      setTodos((todos) => {
        const todoToUpdateIndex = todos
          .map((todo) => todo.id)
          .indexOf(updatedTodo.id);
        const newTodos = [...todos];
        newTodos[todoToUpdateIndex] = updatedTodo;
        return newTodos;
      });
    },
  });
  const toggleTodo = api.todo.toggleTodo.useMutation({});
  const updateRanks = api.todo.updateRanks.useMutation({});
  const addCategory = api.category.addCategory.useMutation({
    onSuccess: (newCategory: Category) => {
      setCategories([...categories, newCategory]);
    },
  });
  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  const handleEditTodo = (todo: Todo) => {
    updateTodo.mutate(todo);
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo.mutate({ id: todoId });
  };

  const handleAddTodo = (todo: Todo) => {
    addTodo.mutate(todo);
  };

  const handleCompleteTodo = (id: string, isDone: boolean) => {
    toggleTodo.mutate({ id, isDone });
  };

  const handleAddCategory = (category: Category) => {
    addCategory.mutate(category);
  };

  const handleDragEnd = () => {
    updateRanks.mutate([...todos]);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    const overId = over?.id;
    if (overId == null) return;

    if (active.id !== overId) {
      const activeTodoIndex = todos
        .map((todo) => todo.id)
        .indexOf(active.id as string);
      const overTodoIndex = todos
        .map((todo) => todo.id)
        .indexOf(overId as string);
      const overTodo = todos[overTodoIndex];
      const activeTodoRank = todos[activeTodoIndex].rank;

      setTodos((todos) => {
        const newRank = overTodo.rank;
        todos[activeTodoIndex].rank = newRank;
        todos[overTodoIndex].rank = activeTodoRank;
        return [...todos];
      });
    }
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    const activeTodo = todos.find((todo) => todo.id === id);
    if (activeTodo !== undefined) {
      setActiveTodo(activeTodo);
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditModal(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleEditModal = (edit: boolean, todo?: Todo) => {
    if (edit) {
      setSelectedTodo(todo);
    }
    setIsEditModal(edit);
    setIsOpen(true);
  };

  return (
    <>
      {todos.length && (
        <Modal
          categories={categories}
          isOpen={isOpen}
          closeModal={handleCloseModal}
          openModal={handleOpenModal}
          isEdit={isEditModal}
          todo={selectedTodo}
          editTodo={handleEditTodo}
          addTodo={handleAddTodo}
          lastTodoRank={
            todos.sort((a, b) => a.rank.localeCompare(b.rank))[todos.length - 1]
              .rank
          }
        />
      )}
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-darkPurple">
        <div className="flex h-full w-full min-w-[395px] max-w-[960px] rounded-2xl border-8 border-white xs:h-2/3 xs:w-2/3">
          <div className="flex w-[27.5%] flex-col bg-white p-2">
            <User
              image={sessionData?.user?.image as string}
              name={sessionData?.user?.name}
            />
            <div className="mx-auto h-[2px] w-5/6 bg-lightPurple" />
            <div className="flex flex-col items-start justify-center gap-2">
              {categories.map((category) => {
                return <CategoryCard key={category.id} category={category} />;
              })}

              <NewCategoryCard handleAddCategory={handleAddCategory} />
            </div>
          </div>
          <div className="flex w-[72.5%] min-w-[295px] max-w-[720px] flex-col rounded-lg bg-lightPurple">
            <div className="flex flex-col">
              <Header />
              <button
                className=""
                onClick={() => {
                  handleEditModal(false);
                }}
              >
                add todo
              </button>
            </div>

            <div className="overflow-y-auto">
              {todos.length ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragOver={handleDragOver}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={todos}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="w-full py-4">
                      <div className="mx-auto flex w-11/12 flex-col gap-2 ">
                        <AnimatePresence initial={false}>
                          {todos
                            .sort((a, b) => a.rank.localeCompare(b.rank))
                            .map((todo) => {
                              return (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ opacity: { duration: 0.2 } }}
                                  key={todo.id}
                                  className="relative"
                                >
                                  <div className="py-0.5">
                                    <SortableItem
                                      todo={todo}
                                      deleteTodo={handleDeleteTodo}
                                      completeTodo={handleCompleteTodo}
                                      editTodo={handleEditModal}
                                    />
                                  </div>
                                </motion.div>
                              );
                            })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeTodo && <SortableItem todo={activeTodo} />}
                  </DragOverlay>
                </DndContext>
              ) : (
                <div>spinner</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
