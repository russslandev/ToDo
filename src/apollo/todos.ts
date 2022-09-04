import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query getTodos {
    allTodos {
      text
      checked
      id
    }
  }
`;

export const ADD_TODO = gql`
  mutation addTodo($text: String!, $checked: Boolean!) {
    createTodo(text: $text, checked: $checked) {
      text
      checked
      id
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation updateTodo($text: String, $checked: Boolean, $id: ID!) {
    updateTodo(text: $text, checked: $checked, id: $id) {
      text
      checked
      id
    }
  }
`;

export const REMOVE_TODO = gql`
  mutation removeTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`;
