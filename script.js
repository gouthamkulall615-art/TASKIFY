const todo = document.querySelector('#todo')
const progress = document.querySelector('#progress')
const done = document.querySelector('#done')
const columns =document.querySelectorAll('.task-list')

// let dragElement = null   //  Old drag system

function updateCounts() {
 document.querySelectorAll('.task-column').forEach(col => {
        const count = col.querySelector('.heading .right')
        const tasks=col.querySelectorAll('.task').length
        count.innerText =tasks
    })
}

function saveToLocalStorage() {
    const tasksData = {}

    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task')
        tasksData[col.id] = Array.from(tasks).map(task => ({
            title: task.querySelector('h2').innerText,
            desc: task.querySelector('p').innerText
        }))
    })

    localStorage.setItem('tasks', JSON.stringify(tasksData))
}

function createTask(title, desc) {
    const div = document.createElement('div')
    div.classList.add('task')

    // div.setAttribute('draggable', 'true')  //  Old system

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    //  Old dragstart
    /*
    div.addEventListener('dragstart', () => {
        dragElement = div
    })
    */

    div.querySelector('button').addEventListener('click', () => {
        div.remove()
        updateCounts()
        saveToLocalStorage()
    })

    return div
}

/* Old Drag Events
function addDragEvents(column) {
    column.addEventListener('dragenter', e => {
        e.preventDefault()
        column.classList.add('hover-over')
    })

    column.addEventListener('dragleave', e => {
        e.preventDefault()
        column.classList.remove('hover-over')
    })

    column.addEventListener('dragover', e => {
        e.preventDefault()
    })

    column.addEventListener('drop', e => {
        e.preventDefault()
        column.appendChild(dragElement)
        column.classList.remove('hover-over')
        updateCounts()
        saveToLocalStorage()
    })
}

columns.forEach(addDragEvents)
*/

// NEW — SortableJS for Mobile + Desktop
columns.forEach(column => {
    new Sortable(column, {
        group: 'shared',
        animation: 150,
        ghostClass: 'dragging',
        onEnd: () => {
            updateCounts()
            saveToLocalStorage()
        }
    })
})

if (localStorage.getItem('tasks')) {
    const data = JSON.parse(localStorage.getItem('tasks'))

    for (const col in data) {
        const column = document.getElementById(col)
        data[col].forEach(task => {
            column.appendChild(createTask(task.title, task.desc))
        })
    }
}

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
    const title = titleInput.value
    const desc = descInput.value

    if (!title.trim()) return

   document.querySelector('#todo .task-list')
   .appendChild(createTask(title,desc))
    updateCounts()
    saveToLocalStorage()

    titleInput.value = ""
    descInput.value = ""
    modal.classList.remove('active')
})

updateCounts()