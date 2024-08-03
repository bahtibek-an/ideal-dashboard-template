
const ADD_FORM = 'ADD_FORM';
const ADD_VARIATION_FORM = "ADD_VARIATION_FORM";
const ADD_FEATURE_FORM = "RENDER_FEATURE_FORM";
const ADD_IMAGE_FORM = "ADD_IMAGE_FORM";
const SET_FORM_DATA = 'SET_FORM_DATA';
const SET_FORM_IS_EDITING = "SET_FORM_IS_EDITING";
const REMOVE_FORM = "REMOVE_FORM";

const addForm = () => ({type: ADD_FORM});
const addVariationForm = () => ({type: ADD_VARIATION_FORM});
const addFeatureForm = () => ({type: ADD_FEATURE_FORM});
const addImageForm = () => ({type: ADD_IMAGE_FORM});

const setFormData = (id, formData, formType) => ({type: SET_FORM_DATA, payload: {id, formData, formType}});
const setFormIsEditing = (id, formType) => ({type: SET_FORM_IS_EDITING, payload: {id, formType}});
const removeForm = (id, formType) => ({type: REMOVE_FORM, payload: {id, formType}});

const getInitialStateForm = (formSelector) => {
    const forms = document.querySelectorAll(formSelector);
    const result = [];
    forms.forEach((form) => {
        const formData = new FormData(form);
        const item = {
            id: Date.now() + Math.floor(Math.random() * 10000),
            data: {},
            isEditing: false
        }
        for (let [name, value] of formData) {
            item.data[name] = value || null;
        }
        result.push(item);
    })
    return result;
}

const initialState = {
    descriptionForm: getInitialStateForm(".description__form"),
    variations: getInitialStateForm(".variation__form"),
    features: getInitialStateForm(".characteristic__form"),
    images: getInitialStateForm(".image__form")
};

function formReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_FORM:
            return {
                ...state,
                descriptionForm: [...state.descriptionForm, {
                    id: Date.now(),
                    data: {
                        description_ru: '',
                        description_uz: '',
                        description_image: null
                    },
                    isEditing: true
                }]
            };
        case ADD_VARIATION_FORM:
            return {
                ...state,
                variations: [...state.variations, {
                    id: Date.now(),
                    data: {
                        name_ru: '',
                        name_uz: '',
                        variation_color: '',
                        variation_image: null,
                    },
                    isEditing: true
                }]
            };
        case ADD_FEATURE_FORM:
            return {
                ...state,
                features: [...state.features, {
                    id: Date.now(),
                    data: {
                        feature_id: "",
                        feature_name: ""
                    },
                    isEditing: true
                }]
            }
        case ADD_IMAGE_FORM:
            return {
                ...state,
                images: [...state.images, {
                    id: Date.now(),
                    data: {
                        image: null,
                    },
                    isEditing: true
                }]
            };
        case SET_FORM_DATA:
            return {
                ...state,
                [action.payload.formType]: state[action.payload.formType].map(form => form.id === action.payload.id ? {
                    ...form,
                    data: {...form.data, ...action.payload.formData}
                } : form)
            };
        case SET_FORM_IS_EDITING:
            return {
                ...state,
                [action.payload.formType]: state[action.payload.formType].map(form => form.id === action.payload.id ? {
                    ...form,
                    isEditing: !form.isEditing
                } : form)
            }
        case REMOVE_FORM:
            return {
                ...state,
                [action.payload.formType]: state[action.payload.formType].filter((form) => form.id !== action.payload.id)
            }
        default:
            return state;
    }
}

const store = Redux.createStore(formReducer);
store.subscribe(renderForms);

const addDescriptionField = () => {
    const state = store.getState();
    if (state.descriptionForm.find(item => item.isEditing === true)) {
        return;
    }
    store.dispatch(addForm());
}

const addVariationField = () => {
    const state = store.getState();
    if (state.variations.find(item => item.isEditing === true)) {
        return;
    }
    store.dispatch(addVariationForm());
}

const addFeatureField = () => {
    const state = store.getState();
    if (state.features.find(item => item.isEditing === true)) {
        return;
    }
    store.dispatch(addFeatureForm());
}

const addImageField = () => {
    const state = store.getState();
    if (state.images.find(item => item.data.image == null)) {
        return;
    }
    store.dispatch(addImageForm());
}

const handleChange = (id, event, formType) => {
    const name = event.target.name;
    const value = event.target.value;
    store.dispatch(setFormData(id, {[name]: value}, formType));
}

const handleImageChange = (id, event, formType) => {
    const name = event.target.name;
    const file = event.target.files[0];
    store.dispatch(setFormData(id, {[name]: file}, formType));
}

const getBase64FromImageFile = (file) => {
    if (typeof file === "string") {
        return file;
    }
    if (!file) {
        return "./assets/default-input-image.jpg";
    }
    return URL.createObjectURL(file);
}

const applyChanges = (id, formType, isAllFieldsFilled, parentElement) => {
    if (!isAllFieldsFilled) {
        return;
    }
    if (parentElement) {
        sendData(parentElement);
    }
    store.dispatch(setFormIsEditing(id, formType));
}

function deleteFormById(id, formType) {
    store.dispatch(removeForm(id, formType));
}

const getEditDescriptionField = (
    formId,
    formImageUrl,
    formDescriptionUz,
    formDescriptionRu,
) => {
    const isAllFieldsFilled = formImageUrl !== "./assets/default-input-image.jpg" && (formDescriptionUz.trim().length > 0) && (formDescriptionRu.trim().length > 0);
    const btnColor = isAllFieldsFilled ? "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" : "dark:bg-gray-600";

    return `
                <div class="flex items-center gap-6 flex-wrap">
                    <div class="flex-1" style="min-width: 300px">
                        <div>
                            <label
                                for="description_ru_${formId}"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Описание РУ
                            </label>
                            <textarea
                                onchange="handleChange(${formId}, event, 'descriptionForm')"
                                name="description_ru"
                                id="description_ru_${formId}"
                                rows="4"
                                class="description_fields block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >${formDescriptionRu}</textarea>
                        </div>
                        <div class="mt-4">
                            <label
                                for="description_uz_${formId}"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Описание УЗ
                            </label>
                            <textarea
                                onchange="handleChange(${formId}, event, 'descriptionForm')"
                                name="description_uz"
                                id="description_uz_${formId}"
                                rows="4"
                                class="description_fields block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >${formDescriptionUz}</textarea>
                        </div>
                    </div>
                    <div class="max-w-96" style="height: 250px;width: 300px;">
                        <label for="description_image_${formId}">
                            <img
                                class="w-full h-full object-cover cursor-pointer"
                                src="${formImageUrl}"
                                id="image_${formId}"
                                alt=""
                            />
                        </label>
                        <input
                            name="description_image"
                            class="description_fields hidden"
                            id="description_image_${formId}"
                            type="file"
                            onchange="handleImageChange(${formId}, event, 'descriptionForm')"/>
                    </div>
                </div>
                <button
                    type="button"
                    onclick="deleteFormById(${formId}, 'descriptionForm')"
                    class="mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                    Удалить
                </button>
                <button
                    type="button"
                    class="apply-button focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${btnColor}"
                    onclick="applyChanges(${formId}, 'descriptionForm', ${isAllFieldsFilled}, this.parentElement)"
                >
                    Применить
                </button>
            `;
}


const getDescriptionField = (
    formImageUrl,
    formId,
    formDescriptionRu,
    formDescriptionUz,
) => {
    return (`
                <div class="flex items-center gap-6 flex-wrap">
                    <div class="flex-1" style="min-width: 300px">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание РУ</label>
                            <p class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${formDescriptionRu}</p>
                        </div>
                        <div class="mt-4">
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Описание Уз</label>
                            <p class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${formDescriptionUz}</p>
                        </div>
                    </div>
                    <div class="max-w-96" style="height: 250px;width: 300px;">
                        <img class="w-full h-full object-cover" src="${formImageUrl}" alt=""/>
                    </div>
                </div>
                <button
                    type="button"
                    class="edit-button focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onclick="applyChanges(${formId}, 'descriptionForm', true)"
                >
                    Редактировать
                </button>
            `
    )
}

const renderDescriptionForms = (state) => {
    const descriptionsDiv = document.getElementById('descriptions');
    descriptionsDiv.innerHTML = '';
    state.descriptionForm.forEach(form => {
        const descriptionImage = form.data.description_image;
        const formActionUrl = "/url";
        const formElement = document.createElement('form');
        formElement.classList.add('w-full', 'mt-4');

        formElement.method = 'POST';
        formElement.action = formActionUrl;

        const imageUrl = getBase64FromImageFile(descriptionImage);
        if (form.isEditing) {
            formElement.innerHTML = getEditDescriptionField(form.id, imageUrl, form.data.description_uz, form.data.description_ru);
        } else {
            formElement.innerHTML = getDescriptionField(imageUrl, form.id, form.data.description_ru, form.data.description_uz);
        }
        descriptionsDiv.appendChild(formElement);
    });
}


const getEditVariationField = (
    formId,
    formNameRu,
    formNameUz,
    formVariationColor,
    formImageUrl,
) => {
    const isAllFieldsFilled = formImageUrl !== "./assets/default-input-image.jpg" && (formNameRu.trim().length > 0) && (formNameUz.trim().length > 0) && (formVariationColor.trim().length > 0);
    const btnColor = isAllFieldsFilled ? "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" : "dark:bg-gray-600";

    return (`
            <div class="flex flex-wrap gap-6 w-full">
                <div class="flex-1">
                    <div class="mb-5">
                        <label
                            for="name_ru_${formId}"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Название РУ</label>
                        <input
                            name="name_ru"
                            type="text"
                            id="name_ru_${formId}"
                            value="${formNameRu}"
                            onchange="handleChange(${formId}, event, 'variations')"
                            class="variaion_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                    </div>
                    <div class="mb-5">
                        <label
                            for="name_uz_${formId}"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Название УЗ</label>
                        <input
                            name="name_uz"
                            type="text"
                            id="name_uz_${formId}"
                            class="variaion_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value="${formNameUz}"
                            onchange="handleChange(${formId}, event, 'variations')"
                        >
                    </div>
                    <div>
                        <input
                            name="variation_color"
                            type="color"
                            name="color"
                            class="variation_fields"
                            value="${formVariationColor}"
                            onchange="handleChange(${formId}, event, 'variations')"
                        />
                    </div>
                </div>
                <div class="max-w-96" style="height: 250px;width: 300px;">
                    <label for="variation_image_${formId}">
                        <img
                            class="w-full h-full object-cover cursor-pointer"
                            src="${formImageUrl}"
                            id="image-${formId}"
                            alt="image-${formId}"
                        />
                    </label>
                    <input
                        name="variation_image"
                        class="variaion_fields hidden"
                        id="variation_image_${formId}"
                        type="file"
                        onchange="handleImageChange(${formId}, event, 'variations')"
                    />
               </div>
            </div>
            <button
                type="button"
                onclick="deleteFormById(${formId}, 'variations')"
                class="mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
                Удалить
            </button>
            <button
                type="button"
                class="apply-button focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${btnColor}"
                onclick="applyChanges(${formId}, 'variations', ${isAllFieldsFilled}, this.parentElement)"
            >
                Применить
            </button>
            `
    );
}

const getVariationField = (
    formId,
    formNameRu,
    formNameUz,
    formVariationColor,
    formImageUrl,
) => {

    return (`
            <div class="flex flex-wrap gap-6 w-full">
                <div class="flex-1">
                    <div class="mb-5">
                        <label
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Название РУ</label>
                        <p
                            onchange="handleChange(${formId}, event, 'variations')"
                            class="variaion_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >${formNameRu}</p>
                    </div>
                    <div class="mb-5">
                        <label
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Название УЗ</label>
                        <p
                            class="variaion_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onchange="handleChange(${formId}, event, 'variations')"
                        >${formNameUz}</p>
                    </div>
                    <div>
                        <input
                            name="variation_color"
                            type="color"
                            name="color"
                            class="variation_fields"
                            disabled
                            value="${formVariationColor}"
                        />
                    </div>
                </div>
                <div class="max-w-96" style="height: 250px;width: 300px;">
                    <img
                        class="w-full h-full object-cover"
                        src="${formImageUrl}"
                        id="image-${formId}"
                        alt="image-${formId}"
                    />
               </div>
            </div>
            <button
                type="button"
                class="edit-button focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onclick="applyChanges(${formId}, 'variations', true)"
            >
                Редактировать
            </button>
            `
    );
}

const renderVariationForms = (state) => {
    const variationList = document.getElementById('variation');
    variationList.innerHTML = '';
    state.variations.forEach(form => {
        const variationImage = form.data.variation_image;
        const formActionUrl = "/url";
        const formElement = document.createElement('form');
        formElement.classList.add('w-full', 'mt-4');

        formElement.method = 'POST';
        formElement.action = formActionUrl;
        const imageUrl = getBase64FromImageFile(variationImage);
        if (form.isEditing) {
            formElement.innerHTML = getEditVariationField(form.id, form.data.name_ru, form.data.name_uz, form.data.variation_color, imageUrl);
        } else {
            formElement.innerHTML = getVariationField(form.id, form.data.name_ru, form.data.name_uz, form.data.variation_color, imageUrl);
        }
        variationList.appendChild(formElement);
    });
}

const getFeatureField = (
    formId,
    formFeatureId,
    formFeatureName
) => {

    return `
            <div class="flex gap-4 my-2">
                <select
                    onchange="handleChange(${formId}, event, 'features')"
                    name="feature_id"
                    value="${formFeatureId}"
                    disabled
                    class="feature_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option selected disabled>Выберите характеристики</option>
                    <option value="US" ${formFeatureId === "US" ? "selected" : ""}>United States</option>
                    <option value="CA" ${formFeatureId === "CA" ? "selected" : ""}>Canada</option>
                    <option value="FR" ${formFeatureId === "FR" ? "selected" : ""}>France</option>
                    <option value="DE" ${formFeatureId === "DE" ? "selected" : ""}>Germany</option>
                </select>
                <p
                    class="feature_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >${formFeatureName}</p>
            </div>
            <button
                type="button"
                class="edit-button focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onclick="applyChanges(${formId}, 'features', true)"
            >
                Редактировать
            </button>
        `;
}

const getEditFeatureField = (
    formId,
    formFeatureId,
    formFeatureName
) => {
    const isAllFieldsFilled = (formFeatureId.trim().length > 0) && (formFeatureName.trim().length > 0);
    const btnColor = isAllFieldsFilled ? "dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" : "dark:bg-gray-600";

    return `
            <div class="flex gap-4 my-2">
                <select
                    onchange="handleChange(${formId}, event, 'features')"
                    name="feature_id"
                    value="${formFeatureId}"
                    class="feature_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    <option selected disabled>Выберите характеристики</option>
                    <option value="US" ${formFeatureId === "US" ? "selected" : ""}>United States</option>
                    <option value="CA" ${formFeatureId === "CA" ? "selected" : ""}>Canada</option>
                    <option value="FR" ${formFeatureId === "FR" ? "selected" : ""}>France</option>
                    <option value="DE" ${formFeatureId === "DE" ? "selected" : ""}>Germany</option>
                </select>
                <input
                    value="${formFeatureName}"
                    onchange="handleChange(${formId}, event, 'features')"
                    name="feature_name"
                    type="text"
                    class="feature_fields bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
            </div>
             <button
                type="button"
                onclick="deleteFormById(${formId}, 'features')"
                class="mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
                Удалить
            </button>
            <button
                type="button"
                class="apply-button focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${btnColor}"
                onclick="applyChanges(${formId}, 'features', ${isAllFieldsFilled}, this.parentElement)"
            >
                Применить
            </button>
        `;
}

const getEditImagesField = (formId, image) => {
    return `
            <div class="w-full max-w-96" style="height: 250px;max-width: 400px;">
                <label for="image_${formId}">
                    <img class="w-full h-full object-cover cursor-pointer" src="${image}" id="image-${formId}" alt="image"/>
                </label>
                <input
                    name="image"
                    class="images hidden"
                    id="image_${formId}"
                    type="file"
                    onchange="handleImageChange(${formId}, event, 'images')"
                />
            </div>
            <button
                type="button"
                onclick="deleteFormById(${formId}, 'images')"
                class="mt-4 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
                Удалить
            </button>
        `
}

const renderImagesForms = (state) => {
    const imageList = document.getElementById('images');
    imageList.innerHTML = '';
    state.images.forEach(form => {
        const image = form.data.image;
        const formActionUrl = "/url";
        const formElement = document.createElement('form');
        formElement.classList.add('w-full', 'mt-4');

        formElement.method = 'POST';
        formElement.action = formActionUrl;
        const imageUrl = getBase64FromImageFile(image);
        formElement.innerHTML = getEditImagesField(form.id, imageUrl);
        imageList.appendChild(formElement);
    });
}

function renderFeatureForms(state) {
    const featuresList = document.getElementById('characteristics');
    featuresList.innerHTML = '';
    state.features.forEach(form => {
        const formActionUrl = "/url";
        const formElement = document.createElement('form');
        formElement.classList.add('w-full', 'mt-4');

        formElement.method = 'POST';
        formElement.action = formActionUrl;

        if (form.isEditing) {
            formElement.innerHTML = getEditFeatureField(form.id, form.data.feature_id, form.data.feature_name);
        } else {
            formElement.innerHTML = getFeatureField(form.id, form.data.feature_id, form.data.feature_name);
        }
        featuresList.appendChild(formElement);
    });
}

function checkForFieldsFilled(state) {
    const descriptionBtn = document.getElementById("description__btn");
    const featuresBtn = document.getElementById("features__btn");
    const variationBtn = document.getElementById("variation__btn");
    const imageBtn = document.getElementById("image__btn");

    if (!state.descriptionForm.find(item => item.isEditing === true)) {
        descriptionBtn.classList.add("dark:bg-blue-600", "dark:hover:bg-blue-700")
        descriptionBtn.classList.remove("dark:bg-gray-600");
    } else {
        descriptionBtn.classList.remove("dark:bg-blue-600", "dark:hover:bg-blue-700");
        descriptionBtn.classList.add("dark:bg-gray-600");
    }

    if (!state.features.find(item => item.isEditing === true)) {
        featuresBtn.classList.add("dark:bg-blue-600", "dark:hover:bg-blue-700")
        featuresBtn.classList.remove("dark:bg-gray-600");
    } else {
        featuresBtn.classList.remove("dark:bg-blue-600", "dark:hover:bg-blue-700");
        featuresBtn.classList.add("dark:bg-gray-600");
    }

    if (!state.variations.find(item => item.isEditing === true)) {
        variationBtn.classList.add("dark:bg-blue-600", "dark:hover:bg-blue-700")
        variationBtn.classList.remove("dark:bg-gray-600");
    } else {
        variationBtn.classList.remove("dark:bg-blue-600", "dark:hover:bg-blue-700");
        variationBtn.classList.add("dark:bg-gray-600");
    }
    if (!state.images.find(item => item.data.image == null)) {
        imageBtn.classList.add("dark:bg-blue-600", "dark:hover:bg-blue-700")
        imageBtn.classList.remove("dark:bg-gray-600");
    } else {
        imageBtn.classList.remove("dark:bg-blue-600", "dark:hover:bg-blue-700");
        imageBtn.classList.add("dark:bg-gray-600");
    }

}

function renderForms() {
    const state = store.getState();
    renderDescriptionForms(state);
    renderVariationForms(state);
    renderFeatureForms(state);
    checkForFieldsFilled(state);
    renderImagesForms(state);
}

renderForms();

function sendData(form) {
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            console.log('Data sent successfully', data);
        }).catch(error => console.error('Error:', error));
}