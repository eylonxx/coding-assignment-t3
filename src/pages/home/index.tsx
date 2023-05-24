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
import CategoriesList from "~/components/CategoriesList";
import CategoryCard from "~/components/CategoryCard";
import Header from "~/components/Header";
import Modal from "~/components/NewAndEditModal";
import NewCategoryCard from "~/components/NewCategoryCard";
import SortableItem from "~/components/SortableItem";
import Spinner from "~/components/Spinner";
import User from "~/components/User";
import { api } from "~/utils/api";

const Home: React.FC = () => {
  const { data: sessionData } = useSession({ required: true });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();

  //CATEGORIES
  const {
    data: fetchedCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = api.category.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Category[]) => setCategories(data),
  });

  const addCategory = api.category.addCategory.useMutation({
    onSuccess: (newCategory: Category) => {
      setCategories([...categories, newCategory]);
    },
  });
  //**CATEGORIES */

  //TODOS
  const {
    data: fetchedTodos,
    isLoading: isLoadingTodos,
    refetch: refetchTodos,
  } = api.todo.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    onSuccess: (data: Todo[]) => {
      setTodos(data);
      setFilteredTodos(data);
    },
  });

  //MUTATIONS
  const addTodo = api.todo.addTodo.useMutation({
    onSuccess: (newTodo: Todo) => {
      setTodos(() => [...todos, newTodo]);
      setFilteredTodos(() => [...todos, newTodo]);
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
    },
  });
  const updateRanks = api.todo.updateRanks.useMutation({});

  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: (deletedTodo: Todo) => {
      setTodos(() => {
        todos.filter((todo) => todo.id !== deletedTodo.id);
        return [...todos];
      });
      setFilteredTodos(() => {
        todos.filter((todo) => todo.id !== deletedTodo.id);
        return [...todos];
      });
    },
  });
  //**MUTATIONS */

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

  const filterTodos = (catId: string) => {
    setFilteredTodos(() => {
      if (catId === "all") {
        return [...todos];
      } else {
        const todoCopy = [...todos].filter((todo) => {
          console.log(todo.catId, catId);

          return todo.catId === catId;
        });
        console.log(todoCopy);

        return [...todoCopy];
      }
    });
  };

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

  const getLastTodoRank = () => {
    return todos.sort((a, b) => a.rank.localeCompare(b.rank))[todos.length - 1]
      .rank;
  };
  // MODAL */

  return (
    <>
      {todos.length ? (
        <Modal
          categories={categories}
          isOpen={isOpen}
          closeModal={handleCloseModal}
          openModal={handleOpenModal}
          isEdit={isEditModal}
          todo={selectedTodo}
          editTodo={handleEditTodo}
          addTodo={handleAddTodo}
          lastTodoRank={getLastTodoRank()}
        />
      ) : null}
      <div className="box-border flex h-screen w-screen flex-col items-center justify-center bg-darkPurple">
        <div className="box-border flex h-full w-full min-w-[390px] max-w-[960px] xs:h-2/3 xs:w-2/3 xs:rounded-2xl xs:border-8 xs:border-white">
          <div className="flex w-[24%] flex-col bg-white p-2 pl-[1px]">
            <User
              image={sessionData?.user?.image as string}
              name={sessionData?.user?.name}
            />
            <div className="mx-auto my-3 h-[2px] w-5/6 bg-lightPurple" />
            <div className="flex h-full flex-col items-start justify-start gap-2">
              <CategoriesList
                categories={categories}
                filterTodos={filterTodos}
                addCategory={handleAddCategory}
              />
            </div>
          </div>
          <div className="box-border flex w-[76%] min-w-[280px] max-w-[720px] flex-col bg-lightPurple xs:rounded-lg">
            <div className="flex min-h-[10%] w-full flex-col gap-1 p-2">
              <Header />
              <div className="mx-auto w-11/12">
                <button
                  className="box-border w-1/6 min-w-[70px] rounded-xl border-4 border-white bg-lightPurple py-2 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-white hover:text-lightPurple"
                  onClick={() => {
                    handleEditModal(false);
                  }}
                >
                  new todo
                </button>
              </div>
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
                    items={filteredTodos}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="w-full py-4">
                      <div className="mx-auto flex w-11/12 flex-col gap-2 ">
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
                <div className="mt-10 flex h-full w-full justify-center overflow-hidden">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
