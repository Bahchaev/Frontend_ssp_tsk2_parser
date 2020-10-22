

const makeLabel = (labelValue) => {

    // блок <label>
    let newLabel = document.createElement("label"); //создадим блок
    newLabel.innerText = labelValue;
    newLabel.style.cssText = `
        margin-bot: 2px;        
    `;
    return newLabel;
};
const makeInput = (inputObj) => {
    // блок <input>

    const getPattern = (mask) => {
        let pattern = "";
        for (let i = 0; i < mask.length; i++) {
            pattern = (mask[i] === "9") ? pattern + "[0-9]{1}" : pattern + mask[i]
        }
        return pattern
    };

    let type = inputObj.type ? inputObj.type : undefined;
    let isRequired = inputObj.required ? inputObj.required : false;
    let placeholder = inputObj.placeholder ? inputObj.placeholder : "";
    let mask = inputObj.mask ? inputObj.mask : undefined;
    let pattern = mask ? getPattern(mask) : undefined;
    let fileType = inputObj.filetype ? "." + inputObj.filetype.join(", .") : "";
    let technologies = inputObj.technologies ? inputObj.technologies : "";
    let isMultiple = inputObj.multiple ? inputObj.multiple : false;
    let isChecked = inputObj.checked ? inputObj.checked : false;
    let colors = inputObj.colors ? inputObj.colors : undefined;

    const makeRegularInput = (type, isRequired, placeholder) => {
        //простой блок Input

        let newInput = document.createElement("input"); //создадим блок

        // настроим блок
        newInput.className = `input`;
        newInput.style.display = "block";
        if (type) newInput.type = type;
        if (isRequired) newInput.required = isRequired;
        if (placeholder) newInput.placeholder = placeholder;
        if (pattern) newInput.pattern = pattern;
        if (fileType) newInput.accept = fileType;
        if (isMultiple) newInput.multiple = isMultiple;

        // вставим блок в DOM
        return newInput
    };
    const makeSelectInput = (optionList, isRequired, isMultiple) => {
        // Блок <select>

        let newSelect = document.createElement("select"); //создадим блок

        // настроим блок
        newSelect.className = `select`;
        newSelect.style.display = "block";
        if (isRequired) newSelect.required = isRequired;
        if (isMultiple) newSelect.multiple = isMultiple;

        // вставим варианты выбора <option> в <select>
        let newOption = null;
        optionList.forEach((option) => {
            newOption = document.createElement("option");
            newOption.className = `option`;
            newOption.innerHTML = option;
            newSelect.appendChild(newOption);
        });

        return newSelect
    };
    const makeCheckInput = (type, isChecked) => {
        //блок Checkbox

        let newInput = document.createElement("input"); //создадим блок

        // настроим блок
        newInput.className = `checkbox`;
        if (type) newInput.type = type;
        if (isChecked) newInput.checked = isChecked;

        // вставим блок в DOM
        return newInput;
    };
    const makeColorInput = (colorList) => {
        // Блок <select>

        let newSelect = document.createElement("select"); //создадим блок

        // настроим блок
        newSelect.className = `select`;
        newSelect.style.display = "block";
        newSelect.style.width = "100px";
        if (isMultiple) newSelect.multiple = isMultiple;

        newSelect.onchange = function () {
            this.style.backgroundColor = this.options[this.selectedIndex].style.backgroundColor
        };

        // вставим варианты выбора <option> в <select>
        let newOption = null;
        colorList.forEach((option) => {
            newOption = document.createElement("option");
            newOption.className = `option`;
            newOption.style.backgroundColor = option;
            newSelect.appendChild(newOption);
        });

        return newSelect
    };
    const makeTextareaInput = (type, isRequired) => {
        //блок textArea

        let newTextArea = document.createElement("textarea"); //создадим блок

        // настроим блок
        newTextArea.className = `textarea`;
        if (type) newTextArea.type = type;
        if (isChecked) newTextArea.checked = isChecked;
        newTextArea.rows = 5;

        return newTextArea
    };

    switch (type) {
        case "text":
        case "email":
        case "password":
        case "file":
        case "date":
            return makeRegularInput(type, isRequired, placeholder);
        case "number":
            if (mask) return makeRegularInput("tel", isRequired, mask);
            return makeRegularInput(type, isRequired, placeholder);
        case "technology":
            return makeSelectInput(technologies, isRequired, isMultiple);
        case "checkbox":
            return makeCheckInput(type, isChecked);
        case "color":
            return makeColorInput(colors, isMultiple);
        case "textarea":
            return makeTextareaInput(type, isRequired)
    }
};

const createNewField = (FieldObj, i) => {
    let label;
    let input;
    let container = document.createElement('div');
    container.className = `container field__container field__container-${i}`;
    if (FieldObj.label) {
        label = makeLabel(FieldObj.label);
        label.className = `label field__label field_label-${i}`
    }
    if (FieldObj.input) {
        input = makeInput(FieldObj.input);
        input.className = `${input.className} field__${input.className} field__${input.className}-${i}`
    }

    if (label) {
        if (input.type === "checkbox") {
            label.insertAdjacentElement("afterbegin", input);
        } else {
            label.insertAdjacentElement("beforeend", input);
            input.insertAdjacentHTML("beforebegin", "</br>")
        }
        container.appendChild(label)
    } else container.appendChild(input);

    return container
};
const createNewReference = (ReferenceObj, i) => {
    let container = document.createElement('div');
    container.className = `container reference__container reference__container-${i}`;
    if (ReferenceObj.input) {
        let input = makeInput(ReferenceObj.input);
        input.className = `${input.className} reference__${input.className} reference__${input.className}-${i}`;
        input.style.display = "inline-block";
        container.appendChild(input)
    } else {
        let newText = document.createElement("span");
        if (ReferenceObj["text without ref"]) {
            newText.innerText = ReferenceObj["text without ref"] + " "
        }
        newText.className = `text reference__text reference__text-${i}`;
        let newLink = document.createElement("a");
        newLink.innerText = ReferenceObj.text;
        newLink.href = ReferenceObj.ref;
        newText.appendChild(newLink);
        container.appendChild(newText)
    }

    return container
};
const createNewButton = (ButtonObj, i) => {
    let container = document.createElement('div');
    container.className = `container button__container button__container-${i}`;

    let newButton = document.createElement("button"); //создадим блок
    // настроим блок
    newButton.innerText = ButtonObj.text;
    if (ButtonObj.text !== "Cancel") newButton.type = "submit";
    else if (ButtonObj.text === "Cancel") {
        newButton.type = "button";
        newButton.onclick = clearForm;
    }
    newButton.className = `button buttons__button buttons__button-${i}`;

    container.appendChild(newButton);
    return container
};

const createForm = (data) => {

    //очистка от старой формы
    let place = document.getElementById("form");
    if (place) {
        clearForm();
    }

    let form = document.createElement("form");
    let formClassName = data.name;
    form.className = "form " + formClassName;
    form.id = "form";

    if (data.fields) {
        let newContainer = document.createElement('div');
        newContainer.className = `container fields-container ${formClassName}__fields-container`;
        form.appendChild(newContainer);
        for (let i = 0; i < data.fields.length; i++) {
            newContainer.appendChild(createNewField(data.fields[i], i))
        }
    }
    if (data.references) {
        let newContainer = document.createElement('div');
        newContainer.className = `container references-container ${formClassName}__references-container`;
        form.appendChild(newContainer);
        for (let i = 0; i < data.references.length; i++) {
            newContainer.appendChild(createNewReference(data.references[i], i))
        }
    }
    if (data.buttons) {
        let newContainer = document.createElement('div');
        newContainer.className = `container buttons-container ${formClassName}__buttons-container`;
        form.appendChild(newContainer);
        for (let i = 0; i < data.buttons.length; i++) {
            newContainer.appendChild(createNewButton(data.buttons[i], i))
        }
    }
    document.body.append(form);
};
const clearForm = () => {
    let place = document.getElementById("form");
    place.remove();
    let fileLoader = document.getElementById("file");
    fileLoader.value = ""
};

let fileLoader = document.getElementById("file");
fileLoader.addEventListener("change", function (event) {
    let file = fileLoader.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    let data;
    reader.onload = function () {
        data = reader.result;
        createForm(JSON.parse(data))
    };
});