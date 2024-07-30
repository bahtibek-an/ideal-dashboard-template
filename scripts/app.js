function updateImagePreview() {
    var fileInput = document.getElementById('fileInput');
    var previewImage = document.getElementById('previewImage');
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
document.getElementById('fileInput').addEventListener('change', updateImagePreview);