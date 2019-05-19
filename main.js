let $list,$addTaskForm,$addItem,$addOrUpdateItemBtn,$showAddFormBtn,$cancelBtn,$highPrioQuantity,$normalPrioQuantity,$lowPrioQuantity,$doneQuantity;
let $badgeAllWip,$badgeHigh,$badgeNormal,$badgeLow,$badgeDone, $todo_menu;
const PRIORITY ={
    'high':'0',
    'normal':'10',
    'low':'20',
}
const BASE_URL = 'http://195.181.210.249:3000/todo/';

function main(){
    
    prepareDOMElement();
    prepareDOMEvents();
    getAllTodos();




}
async function getAllTodos(){
    try{
        let result = await axios.get(BASE_URL);
        prepareTodos(result.data);
        showAllWip();
    } catch(error){
        console.log('Wystapil bład podczas połączenia z serwerem' + error);
    }
 
}

//zliczanie wedlug priorytetu i zakonczonych zadan
function coutByPriority($list){
    let  elements = Array.from($list.children);
    let elementsActive =elements.filter(el => el.dataset.extra != 'done')
    $doneQuantity = elements.filter(el => el.dataset.extra === 'done').length;
    $highPrioQuantity = elementsActive.filter(el => (el.dataset.priority === '0')).length;
    $normalPrioQuantity = elementsActive.filter(el => (el.dataset.priority === '10')).length;
    $lowPrioQuantity = elementsActive.filter(el => el.dataset.priority === '20').length;
    $allWip= $highPrioQuantity + $normalPrioQuantity + $lowPrioQuantity;
    fillMenu();
 }
 function fillMenu(){
    $badgeAllWip.innerText=$allWip;
    $badgeHigh.innerText =$highPrioQuantity;
    $badgeNormal.innerText =$normalPrioQuantity
    $badgeLow.innerText = $lowPrioQuantity;
    $badgeDone.innerText =$doneQuantity;
}
//dodanie elementów do listy todo
function prepareTodos(elements){
    elements.forEach(element => {
        addElementToList($list,element)
    });
    coutByPriority($list);
}
function addElementToList($listWhereAdd,todo){
    var createElement =createTodoDiv(todo);
    $listWhereAdd.appendChild(createElement);
}
//zamiana wartosci liczbowej priorytetu na tekstowa 0-wysoki,10- normalny,20-niski
function textPriority(priority){
    switch(priority){
        case 0 :
            return 'Wysoki';
            break;
        case 10 :
            return 'Normalny';
            break;
        case 20 :
            return 'Niski';
            break;
        default:
        return 'Normalny';
    }
}

//tworzenie tabeli dla jednego zadania
function createTodoTable(todo){
    
    let tbl =createTableHeader(todo.title, todo.priority,todo.extra);
    createTableBody(tbl,todo.description,todo.url,todo.author);
    createTableFooter(tbl,todo.id);
    return tbl;
}
//tworzenie tabeli i nadanie styli
function createTableHeader(title,priority){
    let tbl = document.createElement("table");
    tbl.classList.add("table","table-dark","table-bordered");
    //tworzenie nagłówka tabeli
    let tblH = tbl.createTHead();
    let tblHr = tblH.insertRow(0);
    let tblHc = tblHr.insertCell(0);
    tblHc.innerText = title;
    tblHc = tblHr.insertCell(1);
    tblHc.classList.add("text-right","w-25");
    tblHc.id = 'priority';
    tblHc.innerText = 'Priorytet: '+ textPriority(priority);
    return tbl;
}
//tworzenie body tabeli w zalezonosci od tego czy pola sa nullem dodawanie kolejnych wierszy
function createTableBody(table,description,url,author){
    let tblBody = table.createTBody();
    let rowCounter = 0;
    if(description != null){
        let tlbDescRow = tblBody.insertRow(rowCounter);
        let tlbDescCell =tlbDescRow.insertCell(0);
        tlbDescCell.colSpan =2;
        tlbDescCell.dataset.id ='description';
        tlbDescCell.innerText = 'Opis zadania: '+ description;
        rowCounter++;
    }
    if(url !== null){
        let tlbUrlRow = tblBody.insertRow(rowCounter);
        let tlbUrlCell =tlbUrlRow.insertCell(0);
        tlbUrlCell.colSpan =2;
        tlbUrlCell.dataset.id ='url';
        tlbUrlCell.innerText ="Url: "+ url;
        rowCounter++;
    }
    if(author != ''){
        let tlbAuthorRow = tblBody.insertRow(rowCounter);
        let tlbAuthorCell =tlbAuthorRow.insertCell(0);
        tlbAuthorCell =tlbAuthorRow.insertCell(1);
        tlbAuthorCell.dataset.id='author';
        tlbAuthorCell.innerText = 'Autor: '+ author;
        tlbAuthorCell.classList.add("text-right")
        rowCounter++;
    }
}
//tworzenie footera tabeli z przyciskami do edycji i usuwania
function createTableFooter(table,id){
    let tblFooter = table.createTFoot();
    let tblFooterRow = tblFooter.insertRow(0);
    let tblFooterCell = tblFooterRow.insertCell(0);
    tblFooterCell.colSpan =2;
    //dodanie przyciskow usuwania i edycji
    let editButton = document.createElement('button');
    editButton.textContent = 'Edytuj zadanie';
    editButton.dataset.id = id;
    editButton.dataset.name = 'edit';
    editButton.dataset.type='edit';
    editButton.classList.add("btn","btn-outline-info","btm-sm","m-1");
    tblFooterCell.appendChild(editButton);
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń zadanie';
    deleteButton.classList.add("btn","btn-outline-danger","btm-sm","m-1");
    deleteButton.dataset.id = id;
    deleteButton.dataset.name ='delete';
    tblFooterCell.appendChild(deleteButton);
}




function createTodoDiv(todo){
    let newDivElement = document.createElement('div');
    newDivElement.id = todo.id;
    if(todo.extra === 'active' || todo.extra ==='done'){
        newDivElement.dataset.extra = todo.extra;
    }else{
        newDivElement.dataset.extra = 'active'
    }
    if(todo.priority === 0 || todo.priority === 10 || todo.priority === 20 ){
        newDivElement.dataset.priority = todo.priority;    
    } else{
        newDivElement.dataset.priority = '10';
    }
    
    newDivElement.classList.add("todo_task");
    newDivElement.appendChild(createTodoTable(todo));
    return newDivElement;
}

//przygotowanie elementow DOM
function prepareDOMElement(){
    $list = document.getElementById('taskList');
    $addTaskForm = document.getElementById('addListForm');
    $addOrUpdateItemBtn = document.getElementById('addItemForm');
    //obsluga menu
    $todoMenu = document.getElementById('todoMenu');
    $badgeAllWip = document.getElementById('badgeAllWip');
    $badgeHigh = document.getElementById('badgeHigh');
    $badgeNormal = document.getElementById('badgeNormal');
    $badgeLow = document.getElementById('badgeLow');
    $badgeDone = document.getElementById('badgeDone');
    $cancelBtn = document.getElementById('cancelBtn');
    $addTaskForm.style.display = 'none';
    $list.style.display = 'block';

}
function listClickHandler(event){
    switch (event.target.dataset.name){
        case 'delete':
            deleteTodo(event.target.dataset.id);
        break;
        case 'edit':
            prepareFormEdit(event.target.dataset.id)
        break;
        default: return;


    }
}
//usuwanie zadan
 function deleteTodo(elementId){
     axios.delete(BASE_URL + elementId);
    document.getElementById(elementId).remove();
    coutByPriority($list);
}
//edycja zadania
function prepareFormEdit(elementId){
    try{
       axios.get(BASE_URL + elementId)
       .then(result => fillForm(result.data));
    } catch(error){
        console.log('Wystapil bład podczas połączenia z serwerem' + error);
    }
 
}
 function fillForm(element){
    let todo =element[0];
    document.getElementById('formTitle').value =todo.title;
    document.getElementById('formPriority').value = todo.priority;
    document.getElementById('formUrl').value =todo.url;
    document.getElementById('formAuthor').value = todo.author
    document.getElementById('formDesc').value = todo.description;
    document.getElementById("formExtra").value = todo.extra;
    $addOrUpdateItemBtn.textContent = 'Zapisz zmiany';
    $addOrUpdateItemBtn.dataset.name = 'update';
    $addOrUpdateItemBtn.dataset.id = todo.id;
    showAddFormBtnHandler();
}
async function updateTodo(){
    let formTitle = document.getElementById('formTitle').value;
    let formPriority = document.getElementById('formPriority').value;
    let formUrl = document.getElementById('formUrl').value;
    let formAuthor = document.getElementById('formAuthor').value;
    let formDesc = document.getElementById('formDesc').value;
    let formExtra = document.getElementById('formExtra').value;
    await axios.put(BASE_URL + $addOrUpdateItemBtn.dataset.id, {
        title:formTitle,
        priority:formPriority,
        description:formDesc,
        url:formUrl,
        author:formAuthor,
        extra:formExtra,
}).then(() => {
    $list.style.display = 'block';
    $addTaskForm.style.display = 'none';
    $list.innerHTML ='';
    $addOrUpdateItemBtn.textContent = 'Dodaj';
    $addOrUpdateItemBtn.dataset.name ='add';
    $addOrUpdateItemBtn.dataset.id ='';
    document.getElementById('addForm').reset();
    getAllTodos();

})


}
function prepareDOMEvents(){
    $showAddFormBtn = document.getElementById('showAddForm');
    $addOrUpdateItemBtn = document.getElementById('addOrUpdateItemForm');
    $addOrUpdateItemBtn.dataset.name = 'add';
    $showAddFormBtn.addEventListener('click',showAddFormBtnHandler);
    $addOrUpdateItemBtn.addEventListener('click',addOrUpdateItemHandler);
    $cancelBtn.addEventListener('click',cancelBtnHandler);
    $list.addEventListener('click',listClickHandler);
    $todoMenu.addEventListener('click',menuClickHandler);


}
function cancelBtnHandler(){
    document.getElementById('addForm').reset();
    hideAddForm();


}
function menuClickHandler(event){
    switch(event.target.id){
        case 'allWip':
            $list.innerHTML ='';
            getAllTodos();
            showAllWip();
        break;
        case 'allHigh':
            showAllofPriority(PRIORITY.high);
        break;
        case 'allNormal':
            showAllofPriority(PRIORITY.normal);
        break;
        case 'allLow':
            showAllofPriority(PRIORITY.low);
        break;
        case 'allDone':
            showAllDone();
        break;
        default: return;
    }



}//wyswietlanie wszystkich todos do zrobienia
function showAllWip(){
    let  elements = Array.from($list.children);
    elements.forEach(el => {
        if(el.dataset.extra === 'active'){
            el.style.display = 'block';
        } else if(el.dataset.extra === 'done'){
            el.style.display ='none';
        }

        
    })
}
//wyswietlanie todos wedlug prioryteru
function showAllofPriority(prio){
    let  elements = Array.from($list.children);
    elements.forEach(el => {
        if(el.dataset.priority === prio && el.dataset.extra ==='active'){
            el.style.display = 'block';
        } else {
            el.style.display= 'none';
        }
    })
}
function showAllDone(){
    let  elements = Array.from($list.children);
    elements.forEach(el => {
        if(el.dataset.extra != 'done'){
            el.style.display = 'none';
        } else {
            el.style.display = 'block'
        }
    })

}
async function dataSend(){
    let formTitle = document.getElementById('formTitle').value;
    let formPriority = document.getElementById('formPriority').value;
    let formUrl = document.getElementById('formUrl').value;
    let formAuthor = document.getElementById('formAuthor').value;
    let formDesc = document.getElementById('formDesc').value;
    let formExtra = document.getElementById('formExtra').value;
    await axios.post(BASE_URL, {
        title:formTitle,
        priority:formPriority,
        description:formDesc,
        url:formUrl,
        author:formAuthor,
        extra:formExtra,
}).then(() => {
    $list.style.display = 'block';
    $addTaskForm.style.display = 'none';
    $list.innerHTML ='';
    document.getElementById('addForm').reset();
    getAllTodos();

})
}
 function addOrUpdateItemHandler(event){
    switch(event.target.dataset.name){
        case 'add':
            dataSend();
            coutByPriority($list);
            break;
        case 'update':
            updateTodo();
        break;
        default:return;
        }
    }
function hideAddForm(){
    $list.style.display ='block';
    $addTaskForm.style.display = 'none';
}
function showAddFormBtnHandler(){
        $list.style.display = 'none';
        $addTaskForm.style.display = 'block';
        
}

document.addEventListener('DOMContentLoaded', main);