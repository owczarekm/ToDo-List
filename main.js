let $list;
let $addTaskForm;
let $addItem;
let $addItemBtn;
let $showAddFormBtn;
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
    } catch(error){
        console.log('Wystapil bład podczas połączenia z serwerem' + error);
    }
 
}

//dodanie elementów do listy todo
function prepareTodos(elements){
    elements.forEach(element => {
        addElementToList($list,element)
    });
}
function addElementToList($listWhereAdd,todo){
    var createElement =createTodoDiv(todo);
    $listWhereAdd.appendChild(createElement);
}
function textPriority(el){
    switch(el){
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
function createTodoTable(todo){
    //tworzenie tabeli i nadanie styli
    let tbl = document.createElement("table");
    tbl.classList.add("table","table-borderless","table-dark");
    //tworzenie nagłówka tabeli
    let tblH = tbl.createTHead();
    let tblHr = tblH.insertRow(0);
    let tblHc = tblHr.insertCell(0);
    tblHc.innerText = todo.title;
    tblHc = tblHr.insertCell(1);
    tblHc.classList.add("text-right")
    tblHc.innerText = 'Priorytet: ';
    // if(todo.priority === null){
    //     tblHc.innerText += 'Normalny';
    // } else {
    //     tblHc.innerText += todo.priority;
    // }
    tblHc.innerText += textPriority(todo.priority);
    //tworzenie body tabeli w zalezonosci od tego czy pola sa nullem dodawanie kolejnych wierszy
    let tblBody = tbl.createTBody();
    let rowCounter = 0;
    if(todo.description != null){
        let tlbDescRow = tblBody.insertRow(rowCounter);
        let tlbDescCell =tlbDescRow.insertCell(0);
        tlbDescCell.innerText = todo.description;
        rowCounter++;
    }
    if(todo.url != null){
        let tlbDescRow = tblBody.insertRow(rowCounter);
        let tlbDescCell =tlbDescRow.insertCell(0);
        tlbDescCell.innerText = todo.url;
        rowCounter++;
    }
    if(todo.author != null){
        let tlbDescRow = tblBody.insertRow(rowCounter);
        let tlbDescCell =tlbDescRow.insertCell(0);
        tlbDescCell =tlbDescRow.insertCell(1);
        tlbDescCell.innerText = 'Autor: '+ todo.author;
        tlbDescCell.classList.add("text-right")
        rowCounter++;
    }
    //tworzenie footera tabeli z przyciskami do edycji i usuwania
    let tblFooter = tbl.createTFoot();
    let tblFooterRow = tblFooter.insertRow(0);
    let tblFooterCell = tblFooterRow.insertCell(0);
    //dodanie przyciskow usuwania i edycji
    let editButton = document.createElement('button');
    editButton.textContent = 'Edytuj zadanie';
    editButton.dataset.id = todo.id;
    editButton.dataset.type='edit';
    editButton.classList.add("btn","btn-outline-info","btm-sm","m-1");
    tblFooterCell.appendChild(editButton);
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń zadanie';
    deleteButton.classList.add("btn","btn-outline-danger","btm-sm","m-1");
    deleteButton.dataset.id = todo.id;
    tblFooterCell.appendChild(deleteButton);
    
    return tbl;
}

function createTodoDiv(todo){
    let newDivElement = document.createElement('div');
    newDivElement.id = todo.id;
    newDivElement.classList.add("todo_task");
    newDivElement.appendChild(createTodoTable(todo));
    return newDivElement;
}

//przygotowanie elementow DOM
function prepareDOMElement(){
    $list = document.getElementById('taskList');
    $addTaskForm = document.getElementById('addListForm');
    $addTaskForm.style.display = 'none';
    $list.style.display = 'block';
    $addItemBtn = document.getElementById('addItemForm');

}
function prepareDOMEvents(){
    $showAddFormBtn = document.getElementById('showAddForm');
    $showAddFormBtn.addEventListener('click',showAddFormBtnHandler);
    $addItemBtn.addEventListener('click',addItemHandler);


}
async function dataSend(){
    let formTitle = document.getElementById('formTitle').value;
    let formPriority = document.getElementById('formPriority').value;
    let formUrl = document.getElementById('formUrl').value;
    let formAuthor = document.getElementById('formAuthor').value;
    let formDesc = document.getElementById('formDesc').value;
    await axios.post(BASE_URL, {
        title:formTitle,
        priority:formPriority,
        description:formDesc,
        url:formUrl,
        author:formAuthor,
}).then(() => {
    $list.style.display = 'block';
    $addTaskForm.style.display = 'none';
    $list.innerHTML ='';
    document.getElementById('addForm').reset();
    getAllTodos();

})
}
 function addItemHandler(){
     try{
             dataSend();
     } catch (event){
         console.log(event);
     }

}
function showAddFormBtnHandler(){
        $list.style.display = 'none';
        $addTaskForm.style.display = 'block';
        
}



document.addEventListener('DOMContentLoaded', main);