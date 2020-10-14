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

const makeLabel = (value, formClassName, i, container) => {
    // блок <label>

    let newLabel = document.createElement("label"); //создадим блок


    // настроим блок
    newLabel.innerText = value;
    newLabel.className = `label ${formClassName}__label-${i}`;

    // вставим блок в DOM
    container.appendChild(newLabel);

};
const makeInput = (value, formClassName, i, container) => {
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

    //let container = document.querySelector(`.${formClassName}__container-${i}`);

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
        container.appendChild(newInput);
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
        container.appendChild(newSelect);

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
        container.appendChild(newInput);
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
const makeText = (value, formClassName, i, container) => {
// блок <text>

    let newText = document.createElement("span"); //создадим блок

    // настроим блок
    newText.innerText = value + " ";
    newText.className = `text ${formClassName}__text-${i}`;

    // вставим блок в DOM
    container.appendChild(newText);
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

const createField = (key, value, formClassName, i, container) => {

    switch (key) {
        case "label":
            makeLabel(value, formClassName, i, container);
            break;
        case "input":
            makeInput(value, formClassName, i, container);
            break;
    }
};
const makeButton = (key, value, formClassName, i, container) => {
    //простой блок Button

    let newButton = document.createElement("button"); //создадим блок

    // настроим блок
    newButton.innerText = value;
    newButton.className = `button ${formClassName}__button-${i}`;

    // вставим блок в DOM
    container.appendChild(newButton);
};
const createReference = (key, value, formClassName, i, container) => {

    if (key === "input") makeInput(value, formClassName, i, container);
    if (key === "text without ref") makeText(value, formClassName, i, container);
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

    document.body.append(form);

    let newContainer = document.createElement('div');
    newContainer.className = `container fields-container ${formClassName}__fields-container`;
    form.appendChild(newContainer);
    for (let i = 0; i < data.fields.length; i++) {

        let newContainer = document.createElement('div');
        newContainer.className = `container ${formClassName}__field-container-${i}`;
        let fieldsContainer = document.querySelector(`.${formClassName}__fields-container`);
        fieldsContainer.appendChild(newContainer);

        makeMap(data.fields[i]).forEach((value, key) => {
            createField(key, value, formClassName, i, fieldsContainer)
        })
    }

    newContainer = document.createElement('div');
    newContainer.className = `container references-container ${formClassName}__references-container`;
    form.appendChild(newContainer);
    for (let i = 0; i < data.references.length; i++) {

        let newContainer = document.createElement('div');
        newContainer.className = `container ${formClassName}__reference-container-${i}`;
        let referencesContainer = document.querySelector(`.${formClassName}__references-container`);
        referencesContainer.appendChild(newContainer);

        makeMap(data.references[i]).forEach((value, key) => {
            createReference(key, value, formClassName, i, referencesContainer)
        })
    }

    newContainer = document.createElement('div');
    newContainer.className = `container buttons-container ${formClassName}__buttons-container`;
    form.appendChild(newContainer);
    for (let i = 0; i < data.buttons.length; i++) {

        let newContainer = document.createElement('div');
        newContainer.className = `container button-container ${formClassName}__button-container-${i}`;
        let buttonsContainer = document.querySelector(`.${formClassName}__buttons-container`);
        buttonsContainer.appendChild(newContainer);

        makeMap(data.buttons[i]).forEach((value, key) => {
            makeButton(key, value, formClassName, i, buttonsContainer)
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