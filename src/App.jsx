import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import './App.css';

function App() {
  const [todoItem, setToDOItem] = useState('');
  const [toDoList, setToDOList] = useState([]);

  const handleAdd = () => {
    if (!todoItem.trim()) return;

    setToDOList([
      ...toDoList,
      { id: Date.now(), text: todoItem, isEdit: false },
    ]);
    setToDOItem('');
  };
  const handleDelete = (itemId) => {
    setToDOList((prev) => prev.filter((item) => item.id !== itemId));
  };
  const handleEdit = (id) => {
    setToDOList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEdit: true } : item))
    );
  };
  const handleChange = (id, value) => {
    setToDOList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item))
    );
  };
  const handleSave = (id) => {
    setToDOList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isEdit: false } : item))
    );
  };

  return (
    <main>
      <Helmet>
        <title>Todo List App | Organize Daily Tasks</title>
        <meta
          name="description"
          content="Simple and fast Todo List app to add, edit, and delete daily tasks. Stay productive with an easy task manager built with React."
        />
        <meta
          property="og:title"
          content="Todo List App | Organize Daily Tasks"
        />
        <meta
          property="og:description"
          content="Simple and fast Todo List app to add, edit, and delete daily tasks."
        />
      </Helmet>

      <h1>Todo List App</h1>

      <section aria-label="Add todo section">
        <label htmlFor="todo-input">Add todo item</label>{' '}
        <input
          id="todo-input"
          type="text"
          value={todoItem}
          onChange={(e) => {
            const todoItemValue = e.target.value;
            setToDOItem(todoItemValue);
          }}
        />
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </section>

      <section aria-label="Todo list section">
        <h2>Todo Items</h2>
        <ul>
          {toDoList.map((item) => {
            return (
              <li key={item.id}>
                {item.isEdit ? (
                  <input
                    type="text"
                    aria-label={`Edit ${item.text}`}
                    value={item.text}
                    onChange={(e) => {
                      handleChange(item.id, e.target.value);
                    }}
                  />
                ) : (
                  item.text
                )}{' '}
                <button type="button" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>{' '}
                <button type="button" onClick={() => handleEdit(item.id)}>
                  Edit
                </button>{' '}
                <button type="button" onClick={() => handleSave(item.id)}>
                  Save
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default App;
