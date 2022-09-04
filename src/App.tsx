import React, { FC, useState } from "react";
import { allTodosCache, IList } from "./interfaces";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_TODO, GET_TODOS, REMOVE_TODO, UPDATE_TODO } from "./apollo/todos";
import TodoItem from "./components/TodoItem";
import Loader from "./components/Loader";

const App: FC = () => {
  const [input, setInput] = useState("");
  
  const { loading, error, data } = useQuery(GET_TODOS);

  const [addTodo, { error: addError }] = useMutation(ADD_TODO, {
    update(cache, { data: { createTodo } }) {
      const todos = cache.readQuery<allTodosCache>({ query: GET_TODOS })!.allTodos;
      cache.writeQuery({
        query: GET_TODOS,
        data: {
          allTodos: [createTodo, ...todos],
        },
      });
    },
  });

  const [updateTodo, { error: updateError }] = useMutation(UPDATE_TODO);

  const [removeTodo, { error: removeError }] = useMutation(REMOVE_TODO, {
    update(cache, { data: { removeTodo } }) {
      cache.modify({
        fields: {
          allTodos(currentTodos: { __ref: string }[] = []) {
            return currentTodos.filter((todo) => todo.__ref !== `Todo:${removeTodo.id}`);
          },
        },
      });
    },
  });

  const sort = (list: IList[]): IList[] => {
    const newList = [...list];
    return newList.sort((a, b) => +a.checked - +b.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAdd = (): void => {
    addTodo({
      variables: {
        text: input,
        checked: false,
      },
    });
    setInput("");
  };

  const counter = (): string => {
    if (data?.allTodos as IList[]) {
      const completed = (data.allTodos as IList[]).filter((todo) => todo.checked);
      return `${completed.length}/${(data.allTodos as IList[]).length}`;
    }
    return "0/0";
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='mt-5 text-3xl'>One of the millions of To Do Lists</div>
      <div className='w-5/6 md:w-1/2 lg:w-3/5'>
        <div className='flex justify-between text-4xl my-5 p-5 border-2 rounded-md shadow-md'>
          <div className=''>{counter()}</div>
          <input
            placeholder='Write something'
            type='text'
            className='outline-none border-b-[1px] text-xl w-4/6 focus:border-b-[3px]'
            value={input}
            onChange={(e) => handleInputChange(e)}
          />
          <div className='cursor-pointer'>
            <i onClick={handleAdd} className='plus icon'></i>
          </div>
        </div>
        {loading ? <Loader /> : ""}
        {error || updateError || addError || removeError ? <div>NETWORK ERROR</div> : ""}
        <ul className=''>
          {data &&
            sort(data.allTodos as IList[]).map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                handleRemove={removeTodo}
                handleUpdate={updateTodo}
              />
            ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
