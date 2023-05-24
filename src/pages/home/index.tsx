import {
  DndContext,
  closestCenter,
  DragOverlay,
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
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import CategoriesList from "~/components/CategoriesList";
import Header from "~/components/Header";
import Logger from "~/components/Logger";
import Modal from "~/components/NewAndEditModal";
import SortableItem from "~/components/SortableItem";
import Spinner from "~/components/Spinner";
import User from "~/components/User";
import { useLogger } from "~/hooks/useLogger";
import { api } from "~/utils/api";

const Home: React.FC = () => {
  const { data: sessionData } = useSession({ required: true });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedTodoToEdit, setSelectedTodoToEdit] = useState<Todo>();
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const router = useRouter();
  const { logs, newLog } = useLogger();

  //CATEGORIES
  const {
    data: fetchedCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
    isError: isCategoriesError,
  } = api.category.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Category[]) => setCategories(data),
  });

  const addCategory = api.category.addCategory.useMutation({
    onSuccess: (newCategory: Category) => {
      setCategories([...categories, newCategory]);
      filterTodos(newCategory.id);
      newLog({
        log: `created new category, "${newCategory.name}"`,
        type: "create",
      });
    },
  });

  const deleteCategory = api.category.deleteCategory.useMutation({
    onSuccess: (deletedCategory: Category) => {
      filterTodos("all");
      setCategories((currCategories) => {
        const updatedCategories = currCategories.filter(
          (category) => category.id !== deletedCategory.id
        );
        return [...updatedCategories];
      });
      newLog({
        log: `deleted "${deletedCategory.name}" category and it's todos`,
        type: "create",
      });
    },
  });
  //CATEGORIES */

  //TODOS
  const {
    data: fetchedTodos,
    isLoading: isLoadingTodos,
    refetch: refetchTodos,
    isError: isTodosError,
  } = api.todo.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Todo[]) => {
      setTodos(data);
      setFilteredTodos(data);
      newLog({ log: "Loaded todos", type: "update" });
    },
  });

  //MUTATIONS
  const addTodo = api.todo.addTodo.useMutation({
    onSuccess: (newTodo: Todo) => {
      setTodos(() => [...todos, newTodo]);
      setFilteredTodos(() => [...todos, newTodo]);
      newLog({ log: `created "${newTodo.title}"`, type: "create" });
      // filterTodos(newTodo.catId);
    },
  });

  const updateTodo = api.todo.updateTodo.useMutation({
    onSuccess: (updatedTodo: Todo) => {
      setTodos(() => {
        const todoToUpdateIndex = todos
          .map((todo) => todo.id)
          .indexOf(updatedTodo.id);
        const newTodos = [...todos];
        newTodos[todoToUpdateIndex] = updatedTodo;
        return newTodos;
      });
      setFilteredTodos(() => {
        const todoToUpdateIndex = todos
          .map((todo) => todo.id)
          .indexOf(updatedTodo.id);
        const newTodos = [...todos];
        newTodos[todoToUpdateIndex] = updatedTodo;
        return newTodos;
      });
      newLog({ log: `updated "${updatedTodo.title}"`, type: "update" });
    },
  });

  const toggleTodo = api.todo.toggleTodo.useMutation({
    onSuccess: (updatedTodo: Todo) => {
      setTodos(() => {
        const todoToUpdateIndex = todos
          .map((todo) => todo.id)
          .indexOf(updatedTodo.id);
        const newTodos = [...todos];
        newTodos[todoToUpdateIndex].isDone = updatedTodo.isDone;
        return newTodos;
      });
      setFilteredTodos(() => {
        const todoToUpdateIndex = todos
          .map((todo) => todo.id)
          .indexOf(updatedTodo.id);
        const newTodos = [...todos];
        newTodos[todoToUpdateIndex].isDone = updatedTodo.isDone;
        return newTodos;
      });
      newLog({
        log: `marked "${updatedTodo.title}" as done`,
        type: "update",
      });
    },
  });

  const updateRanks = api.todo.updateRanks.useMutation({
    onSuccess: () => {
      newLog({ log: `Changed todos order`, type: "update" });
    },
  });

  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: (deletedTodo: Todo) => {
      setTodos(() => {
        const newTodos = todos.filter((todo) => todo.id !== deletedTodo.id);
        return [...newTodos];
      });
      setFilteredTodos(() => {
        const newTodos = todos.filter((todo) => todo.id !== deletedTodo.id);
        return [...newTodos];
      });
      newLog({ log: `Deleted "${deletedTodo.title}"`, type: "delete" });
    },
  });
  //MUTATIONS */

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

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate({ id });
  };

  const handleDragEnd = () => {
    updateRanks.mutate([...todos]);
  };

  const filterTodos = (catId: string) => {
    setFilteredTodos(() => {
      if (catId === "all") {
        return [...todos];
      } else {
        const todoCopy = [...todos].filter((todo) => todo.catId === catId);
        return [...todoCopy];
      }
    });
    setSelectedCategoryId(catId);
  };
  //TODOS */

  // DND
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    const overId = over?.id;
    if (overId == null) return;

    if (active.id !== overId) {
      const activeTodoIndex = filteredTodos
        .map((todo) => todo.id)
        .indexOf(active.id as string);
      const overTodoIndex = filteredTodos
        .map((todo) => todo.id)
        .indexOf(overId as string);
      const overTodo = filteredTodos[overTodoIndex];
      const activeTodoRank = filteredTodos[activeTodoIndex].rank;

      setFilteredTodos(() => {
        const newRank = overTodo.rank;
        filteredTodos[activeTodoIndex].rank = newRank;
        filteredTodos[overTodoIndex].rank = activeTodoRank;
        return [...filteredTodos];
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
  //DND */

  // MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModal(false);
  };

  const handleEditModal = (edit: boolean, todo?: Todo) => {
    if (edit) {
      setSelectedTodoToEdit(todo);
    }
    setIsEditModal(edit);
    setIsModalOpen(true);
  };

  const getLastTodoRank = () => {
    return todos.sort((a, b) => a.rank.localeCompare(b.rank))[todos.length - 1]
      .rank;
  };
  // MODAL */

  // ERROR HANDLING
  const handleError = useCallback(async () => {
    await router.push("https://coding-assignment-t3.vercel.app/error");
  }, []);

  useEffect(() => {
    if (isCategoriesError || isTodosError) {
      void handleError();
    }
  }, [handleError, isCategoriesError, isTodosError]);
  // ERROR HANDLING */

  return (
    <>
      {todos.length ? (
        <Modal
          isLoadingUpdate={updateTodo.isLoading}
          isLoadingAdd={addTodo.isLoading}
          isUpdateSuccess={updateTodo.isSuccess}
          isAddSuccess={addTodo.isSuccess}
          categories={categories}
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          isEdit={isEditModal}
          todo={selectedTodoToEdit}
          editTodo={handleEditTodo}
          addTodo={handleAddTodo}
          lastTodoRank={getLastTodoRank()}
        />
      ) : null}
      <div className="box-border flex h-screen w-screen flex-col items-center justify-center bg-darkPurple">
        <div className="box-border flex h-[90%] w-full min-w-[390px] max-w-[960px] xs:h-2/3 xs:w-2/3 xs:rounded-2xl xs:border-8 xs:border-white">
          <div className="flex w-[24%] flex-col overflow-y-auto overflow-x-hidden bg-white p-2 pl-[2px]">
            <User
              image={sessionData?.user?.image as string}
              name={sessionData?.user?.name}
            />
            <div className="mx-auto my-3 h-[2px] w-[5/6] bg-lightPurple" />
            <div className="flex h-full flex-col items-start justify-start gap-2">
              <CategoriesList
                deleteCategory={handleDeleteCategory}
                isLoading={isLoadingCategories}
                categories={categories}
                filterTodos={filterTodos}
                addCategory={handleAddCategory}
                selectedCategoryId={selectedCategoryId}
              />
            </div>
          </div>
          <div className="box-border flex w-[76%] min-w-[280px] max-w-[720px] flex-col bg-lightPurple xs:rounded-lg">
            <div className="flex min-h-[10%] w-full justify-between  gap-1 p-2">
              <Header />
              <button
                className=" box-border flex min-w-[70px] items-center justify-center rounded-xl border-4 border-white bg-lightPurple p-2  text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-white hover:text-lightPurple"
                onClick={() => {
                  handleEditModal(false);
                }}
              >
                new todo
              </button>
            </div>

            <div className="custom-scrollbar max-h-[90%] overflow-y-auto">
              {isLoadingTodos ? (
                <div className="flex h-full w-full justify-center overflow-hidden pt-10">
                  <Spinner />
                </div>
              ) : filteredTodos.length ? (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragOver={handleDragOver}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredTodos}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="w-full">
                      <div className="mx-auto flex w-[95%] flex-col gap-2 ">
                        <AnimatePresence initial={false}>
                          {filteredTodos
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
                                      categories={categories}
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
                <div className="flex h-full w-full justify-center pt-10 text-2xl uppercase tracking-wider  text-white">
                  No todos yet...
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="box-border flex h-[10%] w-full flex-col items-center bg-lightPurple pb-2 xs:w-[60%] xs:rounded-bl-lg xs:rounded-br-lg xs:border-8 xs:border-t-0 xs:border-white sm:w-[60%] md:w-1/3 xl:w-1/4 ">
          <Logger logs={logs} />
        </div>
      </div>
    </>
  );
};
export default Home;
