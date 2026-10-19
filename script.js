// 1. Получить необходимые элементы страницы через querySelector() и сохранить ссылки на них в отдельных переменных.
// DOM
const task_form = document.querySelector("#task-form");
const task_title = document.querySelector("#task-title");
const btn_submit = document.querySelector("#btn-submit");
const task_filter = document.querySelector("#task-filter");
const task_count = document.querySelector("#task-count");
const task_list = document.querySelector("#task-list");

// 2. Создать массив объектов tasks. У каждой задачи должны быть уникальный id, текстовое название и признак completed.
let tasks = [
    { id: 1, title: 'Учить JS', completed: false },
    { id: 2, title: 'Разрабатывать JS', completed: false },
    { id: 3, title: 'Ничерта не делать', completed: true },
    { id: 4, title: 'Улыбашке', completed: false }
];

// 3. Реализовать функцию renderTasks(), которая очищает список и создаёт элементы li для текущих задач.
// 4. При формировании элемента задачи использовать createElement(), textContent и classList. Не вставлять название задачи через innerHTML.
function renderTasks() {

    // 1. Очищаем список
    task_list.replaceChildren();

    // 2. Получаем выбранный фильтр
    const filter = task_filter.value;

    // 3. Создаём массив для отображения
    let filteredTasks = tasks;

    // 4. Фильтруем задачи
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // 5. Перебираем отфильтрованные задачи
    filteredTasks.forEach(task => {

        const li = document.createElement('li');

        li.classList.add('task');
        li.dataset.taskId = task.id;

        const span = document.createElement('span');
        span.textContent = task.title;

        if (task.completed) {
            li.classList.add('completed');
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.action = 'toggle';
        button.textContent = '✓';

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.dataset.action = 'delete';
        deleteButton.textContent = 'X';

        li.append(span, button, deleteButton);

        task_list.append(li);
    });

    if (filteredTasks.length == 0) {
        task_count.textContent = `Задачи отсутствуют`
    } else {
        task_count.textContent = `Всего задач: ${filteredTasks.length}`;
    }

}

renderTasks();

// 5. Обработать событие submit у формы: отменить стандартную отправку, прочитать и обрезать пробелы в названии, проверить значение и добавить новую задачу в массив.
let nextId = 5;
task_form.addEventListener('submit', function (event) {

    event.preventDefault()
    const title = task_title.value.trim();

    const newTask = {
        id: nextId++,
        title: title,
        completed: false
    };

    tasks.push(newTask);

    // 6. После успешного добавления очищать поле ввода и обновлять список.
    task_title.value = '';
    renderTasks();

});

// 7. Реализовать возможность отмечать задачу выполненной и возвращать её в активное состояние.
task_list.addEventListener('click', function(event) {

    const button = event.target.closest('button[data-action]');

    if (!button || !task_list.contains(button)) {
        return;
    }

    const li = button.closest('li');

    if (!li) {
        return;
    }

    const id = Number(li.dataset.taskId);

    if (button.dataset.action === 'toggle') {
        toggleTask(id);
    }

    if (button.dataset.action === 'delete') {
        deleteTask(id);
    }
});

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    renderTasks();
}

// 8. Реализовать удаление задачи. Обработку действий в списке выполнить через делегирование событий.
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    renderTasks();
}
// 9. Реализовать фильтр: все задачи, только активные, только выполненные.
task_filter.addEventListener('change', function() {
    renderTasks();
});
// 10. Отображать общее количество задач и предусмотреть понятное сообщение, если после фильтрации список пуст.