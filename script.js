const columns = document.querySelectorAll('.task-column')

function updateCounts() {
    columns.forEach(col => {
        const count = col.querySelector('.heading .right')
        const tasks = col.querySelectorAll('.task').length
        count.innerText = tasks
    })
}

function saveToLocalStorage() {
    const tasksData = {}

    columns.forEach(col => {
        const list = col.querySelector('.task-list')
        const tasks = list.querySelectorAll('.task')

        tasksData[col.id] = Array.from(tasks).map(task => ({
            title: task.querySelector('h2').innerText,
            desc: task.querySelector('p').innerText
        }))
    })

    localStorage.setItem('tasks', JSON.stringify(tasksData))
}

function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('tasks'))
    if (!data) return

    columns.forEach(col => {
        const list = col.querySelector('.task-list')
        list.innerHTML = ""

        if (data[col.id]) {
            data[col.id].forEach(task => {
                list.appendChild(createTask(task.title, task.desc))
            })
        }
    })
}

function createTask(title, desc) {
    const div = document.createElement('div')
    div.classList.add('task')

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    div.querySelector('button').addEventListener('click', () => {
        div.remove()
        updateCounts()
        saveToLocalStorage()
    })

    return div
}

// SortableJS
columns.forEach(col => {
    const list = col.querySelector('.task-list')

    new Sortable(list, {
        group: 'shared',
        animation: 150,
        ghostClass: 'dragging',
        onEnd: () => {
            updateCounts()
            saveToLocalStorage()
        }
    })
})

loadFromLocalStorage()
updateCounts()

// Modal Logic
const toggleModalBtn = document.querySelector('#toggle-modal')
const modalBg = document.querySelector('.bg')
const modal = document.querySelector('.modal')
const addTaskBtn = document.querySelector('#add-new-task')

toggleModalBtn.addEventListener('click', () => {
    document.querySelector('#task-title-input').value = ""
    document.querySelector('#task-desc-input').value = ""
    modal.classList.toggle('active')
})

modalBg.addEventListener('click', () => {
    modal.classList.remove('active')
})

addTaskBtn.addEventListener('click', () => {
    const titleInput = document.querySelector('#task-title-input')
    const descInput = document.querySelector('#task-desc-input')

    const title = titleInput.value.trim()
    const desc = descInput.value.trim()

    if (!title) return

    document.querySelector('#todo .task-list')
        .appendChild(createTask(title, desc))

    updateCounts()
    saveToLocalStorage()

    modal.classList.remove('active')
})

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW registration failed", err));
  });
}