const dbPath = "../Src/jsonFiles/"; //путь до JSON файлов относительно index.html
let place = document.getElementById("dataField");

const makeMap = (object) => {
    return (new Map(Object.entries(object)))
};

const makeLabel = (value) => {
    //оздать блок <label>
    return (
        `<div><label>${value}</label></div>`
    )
};

const makeInput = (value) => {
    //оздать блок <input>
    let type = value.type ? value.type : null;
    let isRequired = value.required ? value.required : false;
    let placeholder = value.placeholder ? value.placeholder : "";
    let mask = value.mask ? value.mask : null;
    let accept = value.filetype ? value.filetype : "";
    let technologies = value.technologies ? value.technologies : "";
    let multiple = value.multiple ? value.multiple : false;
    let isChecked = value.checked ? value.checked : "";

    const getRegularInput = (type, isRequired, placeholder) => {
        return (`<div><input type=${type} required=${isRequired} placeholder=${placeholder} ></input></div>`)
    };

    const getSelectInput = (optionList, isRequired, isMultiple) => {
        return (
            `<div>
                <select required=${isRequired} multiple=${isMultiple}>
                    ${optionList.forEach((option) => {
                    return (`<option>${option}</option>`)
                })}
                </select>
            </div>`
        )
    };

    const getCheckbox = (isCheked) => {
        return (`<div><input type=${type} checked=${isCheked} ></input></div>`)
    }


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
            return getCheckbox(isChecked);
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
            data.fields.forEach(field => {
                makeMap(field).forEach((value, key) => {

                    if (key === "label") {
                        place.insertAdjacentHTML("beforeend", makeLabel(value))
                    }
                    if (key === "input") {
                        place.insertAdjacentHTML("beforeend", makeInput(value))
                    }
                })
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
