export interface IList {
  text: string;
  checked: boolean;
  id: number;
  __typename?: string;
}

export interface ITodoItemProps {
  item: IList;
  handleRemove: (options: { variables: { id: number } }) => void;
  handleUpdate: (options: { variables: IList }) => void;
}

export interface allTodosCache {
  allTodos: IList[];
}
