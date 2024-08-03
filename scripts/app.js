function updateImagePreview(fileInputName, previewImageName) {
    var fileInput = document.getElementById(fileInputName);
    var previewImage = document.getElementById(previewImageName);
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // Set to default image if no file is selected
        // previewImage.src = '/path/to/default/image.jpg';
    }
}

// Event listener for file input change
document.getElementById('fileInput').addEventListener('change', () => updateImagePreview("fileInput", "previewImage"));


const externalImage = document.getElementById('external_image');
if(externalImage) {
    externalImage.addEventListener('change', () => updateImagePreview("external_image", "external-preview__image"));
}

