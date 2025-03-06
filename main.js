let myinput = document.querySelector(".txt");
let addTask = document.querySelector("input.add");
let tasks = document.querySelector(".tasks");
let delall = document.querySelector("button.all")

let arrayOfTasks = [];

// solve the problem of reload the page , to save the current status(check if localstorage have itmes)
if(window.localStorage.getItem("tasks")) {
    arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks")); // بنملي ال array بالعناصر الموجوده قبل كدا عشان متبداش فاضيه
}

gettasksfromlocals();

// when click in button to add task
addTask.onclick = function() {
    if(myinput.value !== "") {
        addTasktoarray(myinput.value);
        myinput.value = "";
    }
};

// push task as a object into array of task
function addTasktoarray(task) {
    taskobject = {
        id:Date.now(),
        title:task,
        complete:false,
        checked:false,
    }

    arrayOfTasks.push(taskobject);
    // add task in page
    addTaskindiv(arrayOfTasks);

    //add task in localstorage
    addTaskInLocal(arrayOfTasks)
}

// add task in page
function addTaskindiv (arrayTasks) {
    tasks.innerHTML = "";
    arrayTasks.forEach((task) => {
            let taskDiv = document.createElement("div");
            taskDiv.setAttribute("data-id" , task.id);
            
            if(task.complete) {
                taskDiv.classList.add("done")
            }

            let span = document.createElement("span");
            let textspan = document.createTextNode(task.title);
            span.appendChild(textspan);

            // increace add the checkbox

            let check = document.createElement("input");
            check.type = "checkbox";
            check.classList.add("checked");
            check.checked = task.checked;
        
            check.addEventListener("change" , () => {
                updatacheckinlocals(task.id , check.checked)
                if(check.checked){
                    span.style.textDecoration = "line-through";
                }
                else {
                    span.style.textDecoration = "none";
                }
            });
            
            // to save th line through in span after load if the cheked
            if(task.checked) {
                span.style.textDecoration = "line-through";
            }
        
            

            let mybutton = document.createElement("button");
            mybutton.classList.add("del");
            mybutton.appendChild(document.createTextNode("delete"));

            taskDiv.appendChild(span);
            taskDiv.appendChild(check);
            taskDiv.appendChild(mybutton);

            tasks.appendChild(taskDiv);
    });
}

// add task in localstorage
function addTaskInLocal (arrayOfTasks) {
    window.localStorage.setItem("tasks" , JSON.stringify(arrayOfTasks));
}

// get pervios tasks from local storage to apper in page 

function gettasksfromlocals () {
    let theTasks =window.localStorage.getItem("tasks");
    if(theTasks) {
            let mytasks = JSON.parse(theTasks);
            addTaskindiv(mytasks);
    }
}


tasks.addEventListener("click" , (e) => {
    // REMOVE
    if(e.target.classList.contains("del")) {
        //remove from local storage
        removetask(e.target.parentElement.getAttribute("data-id"));
        //remove from page
        e.target.parentElement.remove();
    }

    // update

    if(e.target) {
        // update in local storage
        updatelocals(e.target.getAttribute("data-id"));
        // update in page
        e.target.classList.toggle("done");
    }

    // checked
    if(e.target.classList.contains("checked")) {
        checkinlocals(e.target.parentElement.getAttribute("data-id"));
    }

});

function removetask (targetId) {
    arrayOfTasks = arrayOfTasks.filter((task) => task.id != targetId);
    addTaskInLocal(arrayOfTasks);
}

function updatelocals (targetid) {
    for(let i=0 ; i < arrayOfTasks.length ; i++) {
        if(arrayOfTasks[i].id == targetid) {
            arrayOfTasks[i].complete == false? (arrayOfTasks[i].complete = true ): (arrayOfTasks[i].complete = false);
        }
    }
    addTaskInLocal(arrayOfTasks);
}

function checkinlocals (targetid) {
    for(let i=0 ; i< arrayOfTasks.length ; i++) {
        if(arrayOfTasks[i].id == targetid) {
            arrayOfTasks[i].checked == false? (arrayOfTasks[i].checked = true) : (arrayOfTasks[i].checked = false);
        }
    }
    addTaskInLocal(arrayOfTasks);
}

function updatacheckinlocals(targetid , checkstatus) {
    for(let i=0; i< arrayOfTasks.length ; i++) {
        if(arrayOfTasks[i].id == targetid) {
            arrayOfTasks[i].checked = checkstatus;
        }
    }
    addTaskInLocal(arrayOfTasks);
}

delall.onclick = function () {
    // remove from local storage
    window.localStorage.removeItem("tasks");
    arrayOfTasks = [];
    // remove from page
    tasks.innerHTML = "";
}
