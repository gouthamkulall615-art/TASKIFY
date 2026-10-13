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

// SortableJS with smooth animation & mobile touch handling
columns.forEach(col => {
    const list = col.querySelector('.task-list')

    new Sortable(list, {
        group: 'shared',
        animation: 200,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        ghostClass: 'dragging',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        delay: 50,
        delayOnTouchOnly: true,
        touchStartThreshold: 5,
        fallbackTolerance: 3,
        swapThreshold: 0.65,
        invertSwap: true,
        emptyInsertThreshold: 20,
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

// ==========================================================================
// PWA Service Worker & Install Prompt Logic
// ==========================================================================
let deferredInstallPrompt = null;
const installBtn = document.querySelector('#install-app-btn');
const installBanner = document.querySelector('#install-banner');
const bannerInstallBtn = document.querySelector('#banner-install-btn');
const bannerCloseBtn = document.querySelector('#banner-close-btn');
const bannerDesc = document.querySelector('#install-banner-desc');

// Check if app is running in standalone mode (already installed)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// 1. Capture the beforeinstallprompt event (Android / Chrome / Edge)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    // Show the install button in the nav and the prompt banner
    if (installBtn) installBtn.style.display = 'inline-flex';
    if (installBanner && !sessionStorage.getItem('installBannerDismissed')) {
        installBanner.style.display = 'flex';
    }
    console.log('Taskify: beforeinstallprompt captured, ready to install');
});

// Trigger the native install prompt
async function triggerPwaInstall() {
    if (!deferredInstallPrompt) {
        alert("To install Taskify, open your browser menu (⋮) and tap 'Install app' or 'Add to Home screen'.");
        return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log(`Taskify install prompt outcome: ${outcome}`);
    if (outcome === 'accepted') {
        if (installBanner) installBanner.style.display = 'none';
        if (installBtn) installBtn.style.display = 'none';
    }
    deferredInstallPrompt = null;
}

if (installBtn) {
    installBtn.addEventListener('click', triggerPwaInstall);
}

if (bannerInstallBtn) {
    bannerInstallBtn.addEventListener('click', triggerPwaInstall);
}

if (bannerCloseBtn) {
    bannerCloseBtn.addEventListener('click', () => {
        if (installBanner) installBanner.style.display = 'none';
        sessionStorage.setItem('installBannerDismissed', 'true');
    });
}

// 2. iOS Safari detection (Safari doesn't support beforeinstallprompt)
const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIos && !isStandalone && !sessionStorage.getItem('installBannerDismissed')) {
    if (installBanner) {
        if (bannerDesc) {
            bannerDesc.innerHTML = 'Tap the Share button <strong>(⎋)</strong> then <strong>"Add to Home Screen"</strong>.';
        }
        if (bannerInstallBtn) bannerInstallBtn.style.display = 'none';
        installBanner.style.display = 'flex';
    }
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
            alert('To install on iPhone/iPad: tap the Share button at the bottom of Safari, then choose "Add to Home Screen".');
        });
    }
}

// 3. Listen for appinstalled
window.addEventListener('appinstalled', () => {
    console.log('Taskify was successfully installed!');
    if (installBanner) installBanner.style.display = 'none';
    if (installBtn) installBtn.style.display = 'none';
    deferredInstallPrompt = null;
});

// 4. Register Service Worker with relative path
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Taskify Service Worker Registered, scope:', reg.scope);
                reg.update();
            })
            .catch(err => console.error('Taskify SW registration failed:', err));
    });
}