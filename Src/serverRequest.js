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


    // настроим блок
    newLabel.innerHTML = value;

    // вставим блок в DOM
    let place = document.getElementById("form");

    place.appendChild(newLabel);
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
    let fileType = value.filetype ? "." + value.filetype.join(", .") : "";
    let technologies = value.technologies ? value.technologies : "";
    let isMultiple = value.multiple ? value.multiple : false;
    let isChecked = value.checked ? value.checked : false;

    const makeRegularInput = (type, isRequired, placeholder) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок
        let newDiv = document.createElement("div"); // создадим контейнер блока

        // настроим блок
        if (type) newInput.type = type;
        if (isRequired) newInput.required = isRequired;
        if (placeholder) newInput.placeholder = placeholder;
        if (pattern) newInput.pattern = pattern;
        if (fileType) newInput.accept = fileType;
        if (isMultiple) newInput.multiple = isMultiple;

        // вставим блок в DOM
        let place = document.getElementById("form"); // вставим блок в DOM
        place.appendChild(newDiv);
        newDiv.appendChild(newInput);
    };
    const makeSelectInput = (optionList, isRequired, isMultiple) => {
        // Блок <select>

        let newSelect = document.createElement("select"); //создадим блок
        let newDiv = document.createElement("div"); // создадим контейнер блока

        // настроим блок
        if (isRequired) newSelect.required = isRequired;
        if (isMultiple) newSelect.multiple = isMultiple;


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
    const makeCheckInput = (type, isChecked) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок

        // настроим блок
        if (type) newInput.type = type;
        if (isChecked) newInput.checked = isChecked;

        // вставим блок в DOM
        let place = document.getElementById("form"); // вставим блок в DOM

        place.appendChild(newInput);
    };

    switch (type) {
        case "text":
        case "email":
        case "password":
        case "file":
        case "textarea":
        case "date":
        case "color":
            return makeRegularInput(type, isRequired, placeholder);
        case "number":
            if (mask) return makeRegularInput("tel", isRequired, mask);
            return makeRegularInput(type, isRequired, placeholder);
        case "technology":
            return makeSelectInput(technologies, isRequired, isMultiple);
        case "checkbox":
            return makeCheckInput(type, isChecked)
    }
};
const makeText = (value) => {
// блок <text>

    let newText = document.createElement("text"); //создадим блок


    // настроим блок
    newText.innerHTML = value;

    // вставим блок в DOM
    let place = document.getElementById("form");

    place.appendChild(newText);
};

const makeLink = (value) => {
    // блок <text>

    let newLink = document.createElement("a"); //создадим блок


    // настроим блок
    newLink.innerHTML = value;

    // вставим блок в DOM
    let place = document.getElementById("form");

    place.appendChild(newLink);
};

const addRefToLink = (value) => {

};

const createField = (key, value) => {
    switch (key) {
        case "label":
            makeLabel(value);
            break;
        case "input":
            makeInput(value);
            break;
    }
};
const createButton = (key, value) => {
    //простой блок Button

    let newButton = document.createElement("button"); //создадим блок

    // настроим блок
    newButton.innerText = value;

    // вставим блок в DOM
    let place = document.getElementById("form"); // вставим блок в DOM

    place.appendChild(newButton);
};
const createReference = (key, value) => {

    if (key === "input") makeInput(value);
    if (key === "text without ref") makeText(value);
    if (key === "text") makeLink(value);
    if (key === "ref") addRefToLink(value)
};
const createForm = (data) => {

    //очистка от старой формы
    let place = document.getElementById("form");
    if (place) {
        place.remove()
    }

    let form = document.createElement("form");
    form.id = "form";
    form.name = "data.name";
    document.body.append(form);

    data.fields.forEach((field) => {
        makeMap(field).forEach((value, key, map) => {
            createField(key, value)
        })
    });

    data.references.forEach((reference) => {
        makeMap(reference).forEach((value, key, map) => {
            createReference(key, value);
        })
    });

    data.buttons.forEach((button) => {
        makeMap(button).forEach((value, key, map) => {
            createButton(key, value)
        })
    })
};

function openDB(fileName) {
    // открыть JSON файл с именени fileName
    const url = dbPath + fileName;
    doGetRequest(url)
        .then((data) => {
            createForm(data)
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