import "./App.css";
import React, { useState, useEffect } from "react";

const initialTodos = [
  {
    id: 0,
    label: "Learn Javascript",
    completed: true,
  },
  {
    id: 1,
    label: "Give talks",
    completed: false,
  },
  {
    id: 2,
    label: "Have a life!",
    completed: false,
  },
];

const filters = ["All", "Active", "Completed"];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filteredTodos, setFilteredTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [checkStatu, setCheckStatu] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    handleFilterChange();
  }, [todos, selectedFilter]);

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    window.addEventListener("keydown", handleKeyDownESC);
    return () => {
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("keydown", handleKeyDownESC);
    };
  }, []);

   // On Press Body Close Input Area
  const handleWindowClick = (event) => {
    console.log(event.target.tagName);
    if (event.target.tagName === "HTML") {
      setEditingTodo(null);
    }
  };

  // On Press ESC Close Input Area
  const handleKeyDownESC = (event) => {
    if (event.keyCode === 27) {
      setEditingTodo(null);
    }
  };

  // On Press Checkbox
  const handleCheckboxChange = (id) => {
    const newTodos = [...todos];
    let index = newTodos.map((todo) => todo.id).indexOf(id);
    newTodos[index] = {
      ...newTodos[index],
      completed: !newTodos[index].completed,
    };
    setTodos(newTodos);
  };

  // Add New Todo
  const handleNewTodoSubmit = (event) => {
    event.preventDefault();
    if (newTodo.trim() === "") return;
    setTodos([
      ...todos,
      {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 0,
        label: newTodo,
        completed: false,
      },
    ]);
    setNewTodo("");
  };

  // Set User Input To State For New Todo
  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  // Delete New Todo
  const handleDeleteTodo = (id) => {
    const newTodos = [...todos];
    let index = newTodos.map((todo) => todo.id).indexOf(id);
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  // Filter Select
  const handleFilterChange = () => {
    const newTodos = [...todos];
    if (selectedFilter == "All") {
      setFilteredTodos(newTodos);
    } else {
      const isCompleted = selectedFilter == "Completed" ? true : false;
      setFilteredTodos(
        newTodos.filter((todo) => todo.completed == isCompleted)
      );
    }
  };

  // Delete Completed Todos
  const handleDeleteCompletedTodos = () => {
    const remainingTodos = todos.filter((todo) => !todo.completed);
    setTodos(remainingTodos);
  };

  // Mark All As Complete
  const handleCheckAll = () => {
    const newTodos = [...todos];
    newTodos.map((todo) => (todo.completed = checkStatu));
    setTodos(newTodos);
    setCheckStatu(!checkStatu);
  };

  // Edit Todo
  const handleEditTodo = (todo) => {
    setEditingTodo(todo.id);
    setNewText(todo.label);
  };

  // In Input Press ENTER To Save
  const handleKeyDownENTER = (event, todo) => {
    if (event.key === "Enter") {
      handleSave(todo);
    }
  };

  // Save Edited Todo
  const handleSave = (todo) => {
    const newTodos = [...todos];
    let index = newTodos.map((item) => item.id).indexOf(todo.id);
    console.log(index);
    newTodos[index].label = newText.trim();

    setTodos(newTodos);
    setNewText("");
    setEditingTodo(null); // Düzenleme modu kapatıldı
  };

  return (
    <div className="App">
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={handleNewTodoSubmit}>
            <input
              className="new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodo}
              onChange={handleNewTodoChange}
            />
          </form>
        </header>

        <section className="main">
          <input className="toggle-all" type="checkbox" />
          <label for="toggle-all" onClick={handleCheckAll}>
            Mark all as complete
          </label>

          <ul className="todo-list">
            {filteredTodos.map((todo, index) => {
              return (
                <li key={index} className={todo.completed ? "completed" : ""}>
                  <div className="view">
                    <input
                      className="toggle"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(todo.id)}
                    />
                    {editingTodo === todo.id ? (
                      <input
                        //property="text"
                        className="editor new-todo"
                        value={newText}
                        onChange={(event) => setNewText(event.target.value)}
                        onBlur={() => handleSave(todo)}
                        onKeyDown={(event) => handleKeyDownENTER(event, todo)}
                      />
                    ) : (
                      <label
                        property="text"
                        onClick={() => handleEditTodo(todo)}
                      >
                        {todo.label}
                      </label>
                    )}

                    <button
                      className="destroy"
                      onClick={() => handleDeleteTodo(todo.id)}
                    ></button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="footer">
          <span className="todo-count">
            <strong>{filteredTodos.length} </strong>
            items left
          </span>

          <ul className="filters">
            {filters.map((item, index) => {
              return (
                <li key={index}>
                  <a
                    href="#/"
                    className={selectedFilter === item ? "selected" : ""}
                    onClick={() => setSelectedFilter(item)}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>

          {todos.some((todo) => todo.completed === true) && (
            <button
              className="clear-completed"
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

export default App;
