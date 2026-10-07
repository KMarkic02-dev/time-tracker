let startTime = null;
let timerId = null;
let running = false;
let sessions = [];
let category = "";
let subcategory = "";
let liveSession = null;
let heartBeatInterval = null;


const startBtn = document.getElementById("Start")
const stopBtn = document.getElementById("Stop")
const listHolder = document.getElementById("list-holder");
const list = document.getElementById("list")
const display = document.getElementById("display")
const totalEl = document.getElementById("total")
const categorySelect = document.getElementById("category");
const subCategorySelect = document.getElementById("subCategory");
const categoryMain = {
    Javascript: ["Build", "Test", "Udemy"],
    Python: ["Build", "Test", "Udemy"],
    React: ["Build", "Test", "Udemy"]
};


Object.keys(categoryMain).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        categorySelect.appendChild(option);
    })

categorySelect.addEventListener("change", () => {

    const selectedCategory = categorySelect.value;
    subCategorySelect.innerHTML = `<option class="nullOption" value="" disabled selected>-- Select Subcategory --</option>`;
    subCategorySelect.disabled = false;
    categoryMain[selectedCategory].forEach(subCategory => {
        const subOption = document.createElement("option");
        subOption.value = subCategory;
        subOption.textContent = subCategory;
        subCategorySelect.appendChild(subOption);
    })})



function pad(n) {
    return String(n).padStart(2,"0");
}

function formatDate(date) {
    let day = String(date.getDate()).padStart(2, `0`);
    let month = String(date.getMonth()+1).padStart(2, `0`);
    let year = date.getFullYear()

    return `${(day)}.${(month)}.${(year)}`
}

function formatTime(ms) {
    const totalSec= Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor(totalSec / 60) % 60;
    const s = totalSec %60;

return `${pad(h)}:${pad(m)}:${pad(s)}`
}


function save () {
    localStorage.setItem("session", JSON.stringify(sessions));
}

function liveSave () {
    localStorage.setItem("liveSession", JSON.stringify(liveSession));
}

function load () {
    const liveRaw = localStorage.getItem("liveSession");
    if (liveRaw) {
        liveSession = JSON.parse(liveRaw)
    }
    const raw = localStorage.getItem("session");
    if (raw) {
        sessions = JSON.parse(raw)
    }
}

    function heartBeat() {
        liveSession.lastHeartbeat = Date.now();
        liveSave();
        heartBeatInterval = setInterval(() => {
            if (running && liveSession) {
                    liveSession.lastHeartbeat = Date.now();
                    liveSave();
            }
        }, 5000);
    }
    

function startTicking () {
    timerId = setInterval(() => {
        const live = Date.now() - startTime;
        display.textContent = formatTime(live);
    }, 1000);
}

function restoreActiveSession(){
    if (liveSession){
        const lastBeat = liveSession.lastHeartbeat || liveSession.startTime;
        const gap = Date.now() - lastBeat;
        let effectiveElapsed = 0;

        if (gap > 10000) {
            effectiveElapsed = lastBeat - liveSession.startTime;}
        else {
            effectiveElapsed = Date.now() - liveSession.startTime;
        }

        category = liveSession.category;
        subcategory = liveSession.subcategory;
        running = true;
        display.textContent = formatTime(effectiveElapsed);
        startTime = Date.now() - effectiveElapsed;
        startTicking();
        heartBeat();
    } 
};


function render() {
    list.innerHTML = "";

    let totalMs = 0;

    sessions.forEach(session => {
    totalMs += session.ms;
    
    const text = document.createElement("span");
    text.classList.add("session-info");
    text.textContent = `${session.category} | ${session.subcategory} | ${formatTime(session.ms)}/${formatDate(new Date(session.date))}`;
    

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => {
        sessions = sessions.filter(s => s.id !== session.id);
        save();
        render();
    });
    const li = document.createElement("li");
    li.appendChild(text);
    li.appendChild(deleteBtn);
    list.appendChild(li)
});
totalEl.textContent = formatTime(totalMs);
}


startBtn.addEventListener("click", () => {

    if (running){
        alert("Timer is already running.");
        return;
    }
   
    category = categorySelect.value;
    subcategory = subCategorySelect.value;
    
    if (!category) {
        categorySelect.classList.add("error");
        setTimeout(() => {
            categorySelect.classList.remove("error");
        },500);
        return;}

    if (!subcategory) {
        subCategorySelect.classList.add("error");
        setTimeout(() => {
            subCategorySelect.classList.remove("error");
        },500);
        return;}



    startTime = Date.now();
    running = true;
    startTicking();   
    liveSession = {
        startTime: startTime,
        category: category,
        subcategory: subcategory
    }
    liveSave();
    heartBeat();

    categorySelect.value= "";
    subCategorySelect.innerHTML = `<option class="nullOption" value="" disabled selected></option>`;
    subCategorySelect.disabled = true;
    

}) 


stopBtn.addEventListener("click", () => {
    if (!running) return;
    clearInterval(timerId);
    elapsed = Date.now() - startTime
     
    sessions.push ({
        id: Date.now(),
        category: category,
        subcategory: subcategory,
        ms: elapsed,
        date: Date.now()

    });
    localStorage.removeItem("liveSession");
    liveSession = null;

    save();
    render();
    startTime = null;
    elapsed = 0;
    running = false;
    display.textContent="00:00:00";
    clearInterval(heartBeatInterval);
})



load();
render();
restoreActiveSession()