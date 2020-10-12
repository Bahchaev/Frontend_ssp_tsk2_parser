const dbPath = "../Src/jsonFiles/"; //путь до JSON файлов относительно index.html
let place = document.getElementById("dataField");

const makeMap = (object) => {
    return (new Map(Object.entries(object)))
};

const getPattern = (mask) => {
    let pattern = "";
    for (let i = 0; i < mask.length; i++) {
        pattern = (mask[i] === "9") ? pattern + "[0-9]{1}" : pattern + mask[i]
    }
    return pattern
};

const makeLabel = (value) => {
    // блок <label>

    let newLabel = document.createElement("label"); //создадим блок
    let newDiv = document.createElement("div"); // создадим контейнер блока

    // настроим блок
    newLabel.innerHTML = value;

    // вставим блок в DOM
    let place = document.getElementById("form");
    place.appendChild(newDiv);
    newDiv.appendChild(newLabel);
};

const makeInput = (value) => {
    // блок <input>
    let type = value.type ? value.type : undefined;
    let isRequired = value.required ? value.required : false;
    let placeholder = value.placeholder ? value.placeholder : "";
    let mask = value.mask ? value.mask : undefined;
    let pattern = mask ? getPattern(mask) : undefined;
    // switch (mask) {
    //      case "+7 (999) 99-99-999": pattern = "+7 ([0-9]{3}) [0-9]{2}-[0-9]{2}-[0-9]{3}"; break;
    //      case "99-99 999999": pattern = "[0-9]{2}-[0-9]{2} [0-9]{6}"; break;
    //      case "999-999": pattern = "[0-9]{3}-[0-9]{3}"; break;
    //
    // }
    let accept = value.filetype ? value.filetype : "";
    let technologies = value.technologies ? value.technologies : "";
    let multiple = value.multiple ? value.multiple : false;
    let isChecked = value.checked ? value.checked : false;

    const getRegularInput = (type, isRequired, placeholder) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок
        let newDiv = document.createElement("div"); // создадим контейнер блока

        // настроим блок
        newInput.type = type;
        newInput.required = isRequired;
        newInput.placeholder = placeholder;
        newInput.pattern = pattern;

        // вставим блок в DOM
        let place = document.getElementById("form"); // вставим блок в DOM
        place.appendChild(newDiv);
        newDiv.appendChild(newInput);
    };

    const getSelectInput = (optionList, isRequired, isMultiple) => {
        // Блок <select>

        let newSelect = document.createElement("select"); //создадим блок
        let newDiv = document.createElement("div"); // создадим контейнер блока

        // настроим блок
        newSelect.required = isRequired;
        newSelect.multiple = isMultiple;


        // вставим блок в DOM
        let place = document.getElementById("form"); // вставим блок в DOM
        place.appendChild(newDiv);
        newDiv.appendChild(newSelect);

        // вставим варианты выбора <option> в <select>
        let newOption = null;
        optionList.forEach((option) => {
            newOption = document.createElement("option");
            newOption.innerHTML = option;
            newSelect.appendChild(newOption);
        });
    };

    const getCheckInput = (type, isChecked) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок
        let newDiv = document.createElement("div"); // создадим контейнер блока

        // настроим блок
        newInput.type = type;
        newInput.checked = isChecked;

        // вставим блок в DOM
        let place = document.getElementById("form"); // вставим блок в DOM
        place.appendChild(newDiv);
        newDiv.appendChild(newInput);
    };

    switch (type) {
        case "text":
        case "email":
        case "password":
        case "file":
        case "textarea":
        case "date":
        case "color":
            return getRegularInput(type, isRequired, placeholder);
        case "number":
            if (mask) return getRegularInput("tel", isRequired, mask);
            return getRegularInput(type, isRequired, placeholder);
        case "technology":
            return getSelectInput(technologies, isRequired, multiple);
        case "checkbox":
            return getCheckInput(type, isChecked)
    }
};

function openDB(fileName) {

    //очистка от старой формы
    let place = document.getElementById("form");
    if (place) {
        place.remove()
    }

    let form = document.createElement("form");
    form.id = "form";
    document.body.append(form);

    place = document.getElementById("form");

    // открыть JSON файл с именени fileName

    const url = dbPath + fileName;
    doGetRequest(url)
        .then((data) => {
            console.log(data);
            data.fields.forEach(field => {
                makeLabel(field.label);
                makeInput(field.input);
                })
            })

        .catch((error) => {
            console.log(error.message)
        })
}

// серверные запросы:
function checkResponseStatus(response) {
    //проверка статуса запроса
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        return Promise.resolve(response) //
    } else {
        return Promise.reject(new Error(`Ошибка ${response.status}: ${response.statusText}`))
    }
}

function getJsonObject(response) {
    // получение JSON-объекта
    return response.json()
}

async function doGetRequest(url) {
    // GET-запрос
    return (
        fetch(url)// отправляем запрос на сервер url и ждём ответа
            .then(checkResponseStatus)// после получения ответа - делаем его проверку
            .then(getJsonObject) //если проверка прошла успешно - получаем JSON-объект ответа
    )
}

async function doPatchRequest(url, data) {
    // PATCH-запрос
    return (
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(checkResponseStatus)
            .then(getJsonObject)
    )
}

async function doPostRequest(url, data) {
    // POST-запрос
    return (
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(checkResponseStatus)
            .then(getJsonObject)
    )
}

async function doDeleteRequest(url, item) {
    // DELETE-запрос
    return (
        fetch(url + '/' + item, {
            method: 'DELETE'
        })
            .then(checkResponseStatus)
            .then(getJsonObject)
    )
}
