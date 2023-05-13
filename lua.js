// ---------- DOM element
const objectInput = document.querySelector('#input-object')
const selectValise = document.querySelector('#select-valise')
const addObjectButton = document.querySelector('#add-object-button')
const valiseTabs = document.querySelectorAll('.valise-tab')
const contentTabs = document.querySelectorAll('.tab-content')
const toast = document.querySelector('.notification')

const cabineList = document.querySelector('#cabine-list')
const mainList = document.querySelector('#main-list')
const souteList = document.querySelector('#soute-list')

const cabineReste = document.querySelector('#reste-cabine')
const mainReste = document.querySelector('#reste-main')
const souteReste = document.querySelector('#reste-soute')

let cabineObjectsList = document.querySelectorAll('.cabineItem')
let souteObjectsList = document.querySelectorAll('.souteItem')
let mainObjectsList = document.querySelectorAll('.mainItem')

//--------------- const and var
let objectToAdd, valiseToAddIn;

let objectsList = {
    soute: [],
    cabine: [], 
    main: []
}

const modifyItem = (domItemsList, objectsList, reste) => {
    let id;
    domItemsList.forEach(item => {
        item.addEventListener('click', e => {
            id = item.getAttribute('data-position')
            
            ///--------- check or delete
            if(e.target.classList.contains('button')){               
                item.style.display = "none"
                objectsList.splice(id, 1)

                addObjectToList('cabineItem', objectsList.cabine, objectsList, cabineList, toast, cabineReste, false)

            } else {
                item.classList.add('is-active');
                objectsList[id].addedInValiseClass = "is-active";
            }

        })
    })
}

const setIntoLocalStorage = (objectsList) => {
    localStorage.setItem('objectList', JSON.stringify(objectsList))
}


const addObjectToList = (className, objectsList, parentList, parentDomElement, toastElement, reste, firstIteration) => {
    let itemList = []  
    let i = 0;
    let numberRest = 0;

    objectsList.forEach(element => {
        itemList = [...itemList, 
            `<li class="list-item todo columns ${className} ${element.addedInValiseClass}" data-position=${i}>
                <div class="column is-three-quarters">${element.name}</div>
                <div class="column"><button class="button">x</button></div>
            </li>`] 

        element.addedInValiseClass === '' && numberRest++;
        i++;
    })

    parentDomElement.innerHTML = itemList.join('')

    firstIteration && (toastElement.innerHTML = "Objet ajouté !")
    firstIteration && (toastElement.classList.add('active'))
    reste.innerHTML = numberRest

    // setIntoLocalStorage(parentList)

    setTimeout(() => {
        toastElement.classList.remove('active')
    }, 1000)
}

const getFromLocalStorage = (objectList) => {
    let existingObjectList = localStorage.getItem('objectList')
    
    if(existingObjectList){
        objectList = JSON.parse(existingObjectList)
    }
}

//--------- get objectList from localstorage if exist
getFromLocalStorage(objectsList)

//------------- get from localstorage

// ---------- display tab and set active class
valiseTabs.forEach(valiseTab => {
    valiseTab.addEventListener('click', e => {
        const dataTab = valiseTab.getAttribute('data-tab');

        // set active to right tab and remove to other
        valiseTabs.forEach(tab => {
            tab.getAttribute('data-tab') === dataTab ?
                tab.classList.add('is-active') : 
                tab.classList.remove('is-active')
        })

        //set active class to right content tab and remove for others
        contentTabs.forEach(contentTab => {
            contentTab.getAttribute('data-tabcontent') === dataTab ?
                contentTab.classList.add('active') : 
                contentTab.classList.remove('active')
        })
    })
})

//--------------- add an element to a list
addObjectButton.addEventListener('click', e => {
    e.preventDefault()
    objectToAdd = objectInput.value;
    valiseToAddIn = selectValise.value;

    // -------- check if something in input
    if(objectToAdd.length > 0){
        switch(valiseToAddIn){
            case 'soute': 
                objectsList.soute = [...objectsList.soute, {name: objectToAdd, addedInValiseClass: ""}];
                break;

            case 'cabine': 
                objectsList.cabine = [...objectsList.cabine, {name: objectToAdd, addedInValiseClass: ""}];
                break;

            case 'main': 
                objectsList.main = [...objectsList.main, {name: objectToAdd, addedInValiseClass: ""}];
                break;

            default: break;
        }

        //---------- add object intoList
        addObjectToList('cabineItem', objectsList.cabine, objectsList, cabineList, toast, cabineReste, false)
        addObjectToList('souteItem', objectsList.soute, objectsList, souteList, toast, souteReste, false)
        addObjectToList('mainItem', objectsList.main, objectsList, mainList, toast, mainReste, false)

        let cabineObjectsList = document.querySelectorAll('.cabineItem')
        let souteObjectsList = document.querySelectorAll('.souteItem')
        let mainObjectsList = document.querySelectorAll('.mainItem')

        //---------- listen to state update
        modifyItem(cabineObjectsList, objectsList.cabine, cabineReste)
        modifyItem(mainObjectsList, objectsList.main, mainReste)
        modifyItem(souteObjectsList, objectsList.soute, souteReste)
    }
})