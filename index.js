const state = {
  tasklist: [],
};

// adding new task to the frontend

// referencing to the place where we need tasks
const taskContainer = document.querySelector(".task_contents");

const taskModal = document.querySelector(".task_modal_body");

const htmlTaskContents = ({ id, title, description, type, url, data }) => {
  var da = ''
  if (data === "true") da = "fa-solid"
  else da = "fa-regular"
  // console.log(da);

  return `
       <div class ="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
            <div class="card shadow-sm task__card">
                <div class="card-header gap-2 d-flex justify-content-end task__card__header">
                
                    <button type="button" class="btn btn-outline-success mr-2" name=${id} data=${data} onclick='doneTask.apply(this,arguments)'>
                        <i class="${da} fa-square-check" name=${id}></i>
                    </button>
                    <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick= 'editTask.apply(this,arguments)'>
                        <i class="fas fa-pencil-alt" name=${id}></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick='deleteTask.apply(this,arguments)'>
                        <i class="fas fa-trash-alt"   name=${id}></i>
                    </button>
                </div>
                <div class="card-body">
                ${url
      ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
      : `
                     <img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='object-fit place__holder__image mb-3' />
                    `
    }
                <h4 calss="task__card__title">${title}</h4>
                    <p calss="description trim-3-lines text-muted" data-gram_editor = "false">${description}</p>
                <div calss="tags text-white d-flex flex-wrap">
                    <span class="badge bg-primary m-1">${type}</span>
                </div>

              </div>
                <div class="card-footer">
                    <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle ='modal' data-bs-target='#showTask' id=${id} onclick='openTask.apply(this, arguments)' >Open Task</button>
                </div>
            </div>
        </div>
  `;
};
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));

  return `
    <div id=${id}>
    ${url
      ? `
        <img width='100%' height='300px' src=${url} alt='card image cap' class='object-fit place__holder__image mb-3' />
      `
      : `
      <img width='100%' height="300px" src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='object-fit place__holder__image mb-3' />
      `
    }
    <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
    <h2 class='my-3'>${title}</h2>
    <p class='lead'>
      ${description}
    </p>
    </div>
  `;
};
const updatelocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.tasklist,
    })
  );
};

const checkBoxClick = () => {
  const element = document.getElementById("taskDone")
  // console.log("click", element);
  // console.log(element.getAttribute("data"));
  if (element.getAttribute("data") === "false") {

    element.setAttribute("data", "true")
  }
  else {
    element.setAttribute("data", "false")
  }

}

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.tasks);

  if (localStorageCopy) state.tasklist = localStorageCopy.tasks;

  state.tasklist.map((cardDate) => {
    taskContainer.insertAdjacentHTML("beforeend", htmlTaskContents(cardDate));
  });
};


const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageurl").value,
    title: document.getElementById("tasktitle").value,
    description: document.getElementById("taskdescription").value,
    type: document.getElementById("tasktype").value,
    data: document.getElementById("taskDone").getAttribute("data"),
  };

  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Please fill all the fields");
  }

  taskContainer.insertAdjacentHTML(
    "beforeend",
    htmlTaskContents({
      ...input,
      id,
    })
  );

  state.tasklist.push({ ...input, id });
  updatelocalStorage();
};
const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.tasklist.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  // console.log(targetID);
  const type = e.target.tagName;
  const removeTask = state.tasklist.filter(({ id }) => id !== targetID);
  state.tasklist = removeTask;
  updatelocalStorage();

  if (type === "BUTTON") {
    taskTitle
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const doneTask = (e) => {
  const tags = e.target;
  const ele = tags.parentNode;
  const targetId = tags.getAttribute("name")
  let stateCopy = state.tasklist
  stateCopy = stateCopy.map((task) =>
  (
    (task.id === targetId) ? { ...task, data: saveDone(ele) } : task

  )
  )

  state.tasklist = stateCopy;
  updatelocalStorage();

}
function saveDone(ele) {
  if (ele.getAttribute("data") === "false") {

    ele.innerHTML = `<i class="fa-solid fa-square-check"></i>`
    ele.setAttribute("data", "true");

  }
  else {
    ele.innerHTML = `<i class="fa-regular fa-square-check"></i>`
    ele.setAttribute("data", "false");
  }
  return ele.getAttribute("data")
}

const editTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.id;
  const tags = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (tags === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.tasklist;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
        id: task.id,
        title: updateData.taskTitle,
        description: updateData.taskDescription,
        type: updateData.taskType,
        url: task.url,
      }
      : task
  );

  state.tasklist = stateCopy;
  updatelocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) e = window.event;
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);

  }
  const resultData = state.tasklist.filter(({ title }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  })
  // console.log(resultData);

  resultData.map((cardData) => {
    taskContainer.insertAdjacentHTML("beforeend", htmlTaskContents(cardData))
  });
}

var clearAll = document.getElementById("clear-all")
clearAll.onclick = function () {
  // console.log("click");
  localStorage.removeItem("tasks")
  window.location.reload()
}
var completeTask = document.getElementById("complete")
completeTask.onclick = function () {
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);

  }

  const resultData = state.tasklist.filter((task) => task.data === "true")
  // console.log(resultData);
  resultData.map((cardData) => {
    taskContainer.insertAdjacentHTML("beforeend", htmlTaskContents(cardData))
  });
}
var incompleteTask = document.getElementById("incomplete")
incompleteTask.onclick = function () {
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
  const resultData = state.tasklist.filter((task) => task.data === "false")
  // console.log(resultData);
  resultData.map((cardData) => {
    taskContainer.insertAdjacentHTML("beforeend", htmlTaskContents(cardData))
  });
}