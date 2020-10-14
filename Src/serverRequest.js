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

const makeLabel = (value, formClassName, i) => {
    // блок <label>

    let newLabel = document.createElement("label"); //создадим блок


    // настроим блок
    newLabel.innerText = value;
    newLabel.className = `label ${formClassName}__label-${i}`;

    // вставим блок в DOM
    let form = document.querySelector(`.${formClassName}`);
    form.appendChild(newLabel);

};
const makeInput = (value, formClassName, i) => {
    // блок <input>
    let type = value.type ? value.type : undefined;
    let isRequired = value.required ? value.required : false;
    let placeholder = value.placeholder ? value.placeholder : "";
    let mask = value.mask ? value.mask : undefined;
    let pattern = mask ? getPattern(mask) : undefined;
    let fileType = value.filetype ? "." + value.filetype.join(", .") : "";
    let technologies = value.technologies ? value.technologies : "";
    let isMultiple = value.multiple ? value.multiple : false;
    let isChecked = value.checked ? value.checked : false;

    const makeRegularInput = (type, isRequired, placeholder) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок

        // настроим блок
        newInput.className = `input ${formClassName}__input-${i}`;
        newInput.style.display = "block";
        if (type) newInput.type = type;
        if (isRequired) newInput.required = isRequired;
        if (placeholder) newInput.placeholder = placeholder;
        if (pattern) newInput.pattern = pattern;
        if (fileType) newInput.accept = fileType;
        if (isMultiple) newInput.multiple = isMultiple;

        // вставим блок в DOM
        let form = document.querySelector(`.${formClassName}`); // вставим блок в DOM
        form.appendChild(newInput);
    };
    const makeSelectInput = (optionList, isRequired, isMultiple) => {
        // Блок <select>

        let newSelect = document.createElement("select"); //создадим блок

        // настроим блок
        newSelect.className = `select ${formClassName}__select-${i}`;
        newSelect.style.display = "block";
        if (isRequired) newSelect.required = isRequired;
        if (isMultiple) newSelect.multiple = isMultiple;


        // вставим блок в DOM
        let form = document.querySelector(`.${formClassName}`); // вставим блок в DOM
        form.appendChild(newSelect);

        // вставим варианты выбора <option> в <select>
        let newOption = null;
        optionList.forEach((option) => {
            newOption = document.createElement("option");
            newOption.className = `option ${newSelect.className}__option-${i}`;
            newOption.innerHTML = option;
            newSelect.appendChild(newOption);
        });
    };
    const makeCheckInput = (type, isChecked) => {
        //блок Checkbox

        let newInput = document.createElement("input"); //создадим блок

        // настроим блок
        newInput.className = `checkbox ${formClassName}__checkbox-${i}`;
        if (type) newInput.type = type;
        if (isChecked) newInput.checked = isChecked;

        // вставим блок в DOM
        let form = document.querySelector(`.${formClassName}`); // вставим блок в DOM

        form.appendChild(newInput);
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
const makeText = (value, formClassName, i) => {
// блок <text>

    let newText = document.createElement("span"); //создадим блок


    // настроим блок
    newText.innerText = value + " ";
    newText.className = `text ${formClassName}__text-${i}`;

    // вставим блок в DOM
    let form = document.querySelector(`.${formClassName}`);

    form.appendChild(newText);
};
const makeLink = (value, formClassName, i) => {
    // блок <text>

    let newLink = document.createElement("a"); //создадим блок


    // настроим блок
    newLink.innerHTML = value;
    newLink.className = `link ${formClassName}__link-${i}`;

    // вставим блок в DOM
    let form = document.querySelector(`.${formClassName}__text-${i}`);
    form.appendChild(newLink);
};
const addRefToLink = (value, formClassName, i) => {
    let link = document.querySelector(`.${formClassName}__link-${i}`);
    link.href = value;
};

const createField = (key, value, formClassName, i) => {

    switch (key) {
        case "label":
            makeLabel(value, formClassName, i);
            break;
        case "input":
            makeInput(value, formClassName, i);
            break;
    }
};
const createButton = (key, value, formClassName, i) => {
    //простой блок Button

    let newButton = document.createElement("button"); //создадим блок

    // настроим блок
    newButton.innerText = value;
    newButton.className = `button ${formClassName}__button-${i}`;

    // вставим блок в DOM
    let form = document.querySelector(`.${formClassName}`);

    form.appendChild(newButton);
};
const createReference = (key, value, formClassName, i) => {

    if (key === "input") makeInput(value, formClassName, i);
    if (key === "text without ref") makeText(value, formClassName, i);
    if (key === "text") makeLink(value, formClassName, i);
    if (key === "ref") addRefToLink(value, formClassName, i)
};

const createForm = (data) => {

    //очистка от старой формы
    let place = document.getElementById("form");
    if (place) {
        place.remove()
    }

    let form = document.createElement("form");
    let formClassName = data.name;
    form.className = "form " + formClassName;
    form.id = "form";
    form.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    `;
    document.body.append(form);


    for (let i = 0; i < data.fields.length; i++) {
        makeMap(data.fields[i]).forEach((value, key) => {
            createField(key, value, formClassName, i)
        })
    }

    for (let i = 0; i < data.references.length; i++) {
        makeMap(data.references[i]).forEach((value, key) => {
            createReference(key, value, formClassName, i)
        })
    }

    for (let i = 0; i < data.buttons.length; i++) {
        makeMap(data.buttons[i]).forEach((value, key) => {
            createButton(key, value, formClassName, i)
        })
    }
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