/* eslint-disable @typescript-eslint/no-misused-promises */
import { Dialog, Transition } from "@headlessui/react";
import type { Category, Todo } from "@prisma/client";
import { Fragment, useEffect } from "react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LexoRank } from "lexorank";
import { useSession } from "next-auth/react";

interface ModalProps {
  closeModal: () => void;
  isOpen: boolean;
  isEdit: boolean;
  todo: Todo | undefined;
  categories: Category[];
  editTodo: (todo: Todo) => void;
  addTodo: (todo: Todo) => void;
  lastTodoRank: string;
  isLoadingUpdate: boolean;
  isLoadingAdd: boolean;
  isUpdateSuccess: boolean;
  isAddSuccess: boolean;
}
export default function Modal({
  isOpen,
  closeModal,
  isEdit,
  todo,
  categories,
  editTodo,
  addTodo,
  lastTodoRank,
  isLoadingUpdate,
  isLoadingAdd,
  isUpdateSuccess,
  isAddSuccess,
}: ModalProps) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<Todo>();
  const onSubmit: SubmitHandler<Todo> = (data): void => {
    if (isEdit && todo) {
      //Edit todo
      const newTodo = {
        ...data,
        id: todo.id,
        userId: todo.userId,
        isDone: todo.isDone,
        rank: todo.rank,
      };
      editTodo(newTodo);
      closeModal();
    } else {
      const newTodo = {
        //New todo
        ...data,
        isDone: false,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        userId: session?.user.id!,
        rank: LexoRank.parse(lastTodoRank).genNext().toString(),
      };
      addTodo(newTodo);
    }
  };

  useEffect(() => {
    if (isUpdateSuccess || isAddSuccess) {
      closeModal();
    }
  }, [isUpdateSuccess, isAddSuccess]);

  useEffect(() => {
    if (isEdit && todo) {
      setValue("title", todo.title);
      setValue("isDone", todo.isDone);
      setValue("scheduledDate", new Date(todo.scheduledDate));
    }
  }, [todo, isEdit]);

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      beforeEnter={() => {
        if (!isEdit) {
          reset();
          setValue("scheduledDate", new Date());
        }
      }}
    >
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full max-w-lg transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-[#CE93FE]"
                  >
                    {isEdit ? <div>Edit todo</div> : <div>New todo</div>}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    X
                  </button>
                </div>
                <div className="h-full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex h-full w-full flex-col justify-between gap-2">
                      <div className="flex">
                        <div className="w-1/4">Title</div>
                        <input
                          className="w-1/2 rounded-md bg-lightPurple p-1 text-white"
                          {...register("title", { required: true })}
                          id="title"
                        />

                        {errors.title && <span>This field is required</span>}
                      </div>
                      <div className="flex">
                        <div className="w-1/4">When?</div>
                        <div>
                          <Controller
                            control={control}
                            name="scheduledDate"
                            render={({ field }) => (
                              <DatePicker
                                placeholderText="Select date"
                                showTimeSelect
                                minDate={new Date()}
                                timeIntervals={30}
                                className="rounded-md bg-lightPurple p-1 text-white"
                                timeFormat="HH:mm"
                                timeCaption="time"
                                onChange={(date) => {
                                  field.onChange(date);
                                }}
                                selected={field.value}
                                dateFormat="MMMM d, yyyy h:mm aa"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <label className="text-[#ce93fe]">Category</label>
                      <select
                        {...register("catId")}
                        id="catId"
                        className="rounded-md bg-lightPurple p-1 text-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {/* errors will return when field validation fails  */}
                      <button
                        disabled={isLoadingAdd || isLoadingUpdate}
                        className="mt-10 rounded-lg bg-lightPurple p-2 text-2xl text-white outline-none"
                      >
                        {isLoadingAdd || isLoadingUpdate ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
