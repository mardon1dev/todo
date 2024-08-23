let toDo = document.querySelector(".form");
let input = document.querySelector(".input");
let list = document.querySelector(".list");
let time = document.querySelector(".time");

let allToDo = document.querySelector(".allToDo .count");
let completed = document.querySelector(".completed .count");
let unCompleted = document.querySelector(".unCompleted .count");
let allToDoWrap = document.querySelector(".allToDo");
let completedWrap = document.querySelector(".completed");
let unCompletedWrap = document.querySelector(".unCompleted");

// Real vaqt joylashtirish uchun
function showTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    let todayTime = `${h} : ${m} : ${s} ${ampm}`;
    time.textContent = todayTime; 
}
showTime()
setInterval(showTime, 1000);

let todos = JSON.parse(localStorage.getItem("todos")) || [];
// Input qiymatini massivga joylashtiladi
toDo.addEventListener("submit", (e)=>{
    e.preventDefault();

    let notification = document.querySelector(".notification");

    // Agar input qiymati bo'sh stringga teng bo'lmasligini tekshiradi va xabar yuboradi 
    if (input.value.trim() === "") {
        let notificationText = notification.querySelector("span");
        notificationText.textContent = "Please enter a task";
        notificationText.classList.add("text-red-700");
        notification.classList.add("right-4");
        notification.classList.remove("right-[-100%]");
    
        setTimeout(() => {
            notification.classList.remove("right-4");
            notification.classList.add("right-[-100%]");
        }, 1500);
        return;
    }
    
    const data = {
        id: todos.length +1,
        title: input.value,
        isCompleted: false
    }
    
    todos.push(data);
    input.value = ""
    renderToDo(todos)
    localStorage.setItem("todos", JSON.stringify(todos));
})
// DOM ga ma'lumotlarni joylash
function renderToDo(arr){
    list.innerHTML = "";
    list.classList.add("p-3");
    // Agar ma'lumot topilmasa ya'ni birorta ham to-do bo'lmasa 
    if (arr.length === 0) {
        list.innerHTML = `<li class="text-center text-lg">No todo.</li>`;
    } else {
        const mappedtodos = arr.map((item, index) => {
            return `
            <li class="todo-item-wrapper w-full flex items-center justify-between backdrop-blur-[2px] p-2 rounded-lg ${item.isCompleted? "opacity-70" : ""}"  data-id="${item.id}">
                <div class="todo-item flex items-center justify-between w-full gap-2">
                    <div class="todo-info flex items-center sm:w-[48%] w-full">
                        <div data-id="${item.id}" class="complete-wrapper w-[20px] h-[19px] border-2 border-green-800 rounded-full flex items-center justify-center cursor-pointer">
                            <div class="complete w-[100%] h-[100%] ${item.isCompleted ? "bg-green-800 border-2 border-white" : ""} rounded-full"></div>
                        </div>
                        <div class="flex items-center gap-2 ml-2">
                            <span>${index + 1}. </span>
                            <p class="font-bold ${item.isCompleted ? "line-through" : ""} sm:w-[100%] ww-full break-words">${item.title}</p>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 todo-buttons sm:w-[48%] w-full">
                        <button data-id="${item.id}" class="delete text-center w-[100px] bg-red border  rounded-lg p-2 hover:bg-white hover:text-red-800 duration-200">Delete</button>
                        <button data-id="${item.id}" class="update text-center w-[100px] bg-red border  rounded-lg p-2 hover:bg-white hover:text-blue-800 duration-200">Update</button>
                    </div>
                </div>
            </li>
            `;
        }).join('');
        
        list.innerHTML = mappedtodos;
    }    
    allToDo.textContent = todos.length;
    unCompleted.textContent = todos.filter(item => !item.isCompleted).length;
    completed.textContent = todos.filter(item => item.isCompleted).length;
}
renderToDo(todos)

list.addEventListener("click", (e)=>{
    // Todo ni o'chirish
    if(e.target.classList.contains("delete")){
        const liElement = e.target.closest('li');
        throwItem(liElement);

        let notification = document.querySelector(".notification");
        let notificationText = notification.querySelector("span");
        notificationText.textContent = "To Do is deleted!";
        notificationText.classList.add("text-red-700");
        notification.classList.add("right-4");
        notification.classList.remove("right-[-100%]");
    
        setTimeout(() => {
            notification.classList.remove("right-4");
            notification.classList.add("right-[-100%]");
        }, 1500);

        setTimeout(() => {
            const id = e.target.dataset.id
            todos = todos.filter(item => item.id !== parseInt(id));
            renderToDo(todos);
            localStorage.setItem("todos", JSON.stringify(todos));
        }, 300);


    }
    // Todo ni bajarilgan yoki bajarilmaganligi
    if (e.target.classList.contains("complete")){
        const id = e.target.closest(".complete-wrapper").dataset.id;
        const item = todos.find(item => item.id === parseInt(id));
        item.isCompleted = !item.isCompleted;
        renderToDo(todos);
        localStorage.setItem("todos", JSON.stringify(todos));

    }
    // Todo ni update ya'ni o'zgartirish
    if (e.target.classList.contains("update")) {
        const id = e.target.dataset.id;
        const item = todos.find(item => item.id === parseInt(id));

        let modalUpdate = document.querySelector(".update-outer");
        modalUpdate.classList.remove("scale-0");
        modalUpdate.classList.add("duration-300");
        let updateInput = document.querySelector(".update-input");
        updateInput.value = item.title;

        let updateButton = document.querySelector(".update-button");
        let notification = document.querySelector(".notification");
        updateButton.onclick = () => {
            let notificationText = notification.querySelector("span");
            
            if (item.title === updateInput.value) {
                notificationText.textContent = "Nothing changed";
                notificationText.classList.remove("text-green-700");
                notificationText.classList.add("text-blue-700");
            } else {
                item.title = updateInput.value;
                item.isCompleted = false;
                renderToDo(todos);
                modalUpdate.classList.add("scale-0");
                
                notificationText.textContent = "To Do is updated";
                notificationText.classList.remove("text-blue-700");
                notificationText.classList.add("text-green-700");
            }
        
            notification.classList.add("right-4");
            notification.classList.remove("right-[-100%]");
        
            setTimeout(() => {
                notification.classList.remove("right-4");
                notification.classList.add("right-[-100%]");
            }, 1500);
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                modalUpdate.classList.add("scale-0");
            }
        });
        
        let closeModalBtn = document.querySelector(".close-modal");
        closeModalBtn.onclick = () => {
            modalUpdate.classList.add("scale-0");   
        }
    }
})
// Xabar yuboradigan funksiya
function throwItem(item){
    item.classList.add("throw")
}
// Barcha todo larni chiqaruvchi funksiya
allToDoWrap.addEventListener("click", ()=>{
    renderToDo(todos)
})

// Bajarilgan todo larni chiqaruvchi funksiya
completedWrap.addEventListener("click", ()=>{
    const completedToDos = todos.filter(item => item.isCompleted == true);
    renderToDo(completedToDos);
})

// Bajarilmagan todo larni chiqaruvchi funksiya
unCompletedWrap.addEventListener("click", ()=>{
    const unCompletedToDos = todos.filter(item => item.isCompleted == false);
    renderToDo(unCompletedToDos)
});
