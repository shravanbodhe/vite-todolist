import { useState } from 'react';

import './App.css';

function App() {
  const [todoItem, setToDOItem] = useState('');
  const [toDoList, setToDOList] = useState([]);

  const handleAdd = () => {
    if (!todoItem.trim()) return;
    let oldList = toDoList;

    setToDOList([
      ...oldList,
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
    <>
      Add To DO Item here :{' '}
      <input
        type="text"
        value={todoItem}
        onChange={(e) => {
          const todoItemValue = e.target.value;
          console.log(' todo Item - ', todoItemValue);
          setToDOItem(todoItemValue);
        }}
      />
      <input type="Button" value="Add" onClick={handleAdd} />
      <div>
        <br />
        TO Do List
        <ul>
          {toDoList.map((item) => {
            return (
              <li key={item.id}>
                {item.isEdit ? (
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      handleChange(item.id, e.target.value);
                    }}
                  />
                ) : (
                  item.text
                )}{' '}
                <input
                  type="button"
                  value="Delete"
                  onClick={() => handleDelete(item.id)}
                />{' '}
                <input
                  type="button"
                  value="Edit"
                  onClick={() => handleEdit(item.id)}
                />{' '}
                <input
                  type="button"
                  value="Save"
                  onClick={() => handleSave(item.id)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
