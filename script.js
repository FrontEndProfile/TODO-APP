const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

function renderTodos(todos) {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.id = todo.id;
    li.textContent = todo.text;

    // Toggle 'completed' class based on todo.completed property
    if (todo.completed) {
      li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    li.appendChild(deleteBtn);

    todoList.prepend(li);
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();

  if (todoText !== '') {
    const newTodo = {
      text: todoText,
      completed: false
    };

    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodo)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error adding todo');
        }
      })
      .then(todo => {
        renderTodos([todo]);
        todoInput.value = '';
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  } else {
    console.error('Todo text is empty');
  }
}



function updateTodoStatus(todoId) {
  fetch(`http://localhost:3000/todos/${todoId}`)
    .then(response => response.json())
    .then(todo => {
      const updatedCompleted = !todo.completed; // Toggle the completed property
      return fetch(`http://localhost:3000/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: updatedCompleted })
      });
    })
    .then(response => response.json())
    .then(updatedTodo => {
      const li = document.getElementById(updatedTodo.id);
      li.classList.toggle('completed'); // Toggle the 'completed' class on the li element
    })
    .catch(error => {
      console.error('Error updating todo:', error);
    });
}


function deleteTodo(todoId) {
  fetch(`http://localhost:3000/todos/${todoId}`, {
    method: 'DELETE'
  })
    .then(response => {
      const li = document.getElementById(todoId);
      li.remove();
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
}

// Update todo status when li element is clicked
todoList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const todoId = parseInt(e.target.id);
    updateTodoStatus(todoId);
  } else if (e.target.classList.contains('delete-btn')) {
    const todoId = parseInt(e.target.parentElement.id);
    deleteTodo(todoId);
  }
});

// Fetch todos from the server and render them
fetch('http://localhost:3000/todos')
  .then(response => response.json())
  .then(todos => {
    renderTodos(todos);
  })
  .catch(error => {
    console.error('Error retrieving todos:', error);
  });
