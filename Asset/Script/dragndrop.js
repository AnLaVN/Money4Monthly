// Make by AnLa - Bình An
const dropZone = document.querySelector('.drag-n-drop');
const dropInput = document.querySelector('.drag-n-drop input');
const ratioCrop = document.querySelector('.drag-n-drop small');
const imgPreview = document.querySelector('.drag-n-drop img');
const btnSelect = document.querySelector('.drag-n-drop div');
const imgCroped = document.getElementById("ImageCroped");
let imagePreview = null;
let cropper = null;

function renderPreview(file) {
	resetPreview();
	if (imagePreview) URL.revokeObjectURL(imagePreview);
	imagePreview = URL.createObjectURL(file);
	imgPreview.src = imagePreview;
	dropInput.disabled = true;
	imgPreview.classList.remove("d-none");
	btnSelect.classList.remove("d-none");
	cropper = new Cropper(imgPreview, {viewMode: 2, aspectRatio: Number(ratioCrop.innerHTML)});
}
function resetPreview(){
	imagePreview = null;
	imgCroped.removeAttribute('src');
	dropInput.disabled = false;
	imgPreview.classList.add("d-none");
	btnSelect.classList.add("d-none");
	if(cropper){ cropper.destroy(); cropper = null;}
}
btnSelect.children[0].addEventListener('click', function (e) {
	resetPreview();
});
btnSelect.children[1].addEventListener('click', function(e){
	var data = cropper.getCroppedCanvas().toDataURL('image/jpeg');
	resetPreview();
	imgCroped.src = data;
	$('#Modal_CropImage').modal('hide');
});
document.getElementById("CloseCrop").addEventListener('click', function(e){
	resetPreview();
	$('#Modal_CropImage').modal('hide');
});

document.addEventListener('dragover',function(e){e.preventDefault()});
document.addEventListener('drop', function (e) { e.preventDefault()});
dropZone.addEventListener('drop', function (e) { e.preventDefault();
	if (e.dataTransfer.files[0])  renderPreview(e.dataTransfer.files[0]);
});
dropInput.addEventListener('change', function (e) {
	if (e.target.files[0])  renderPreview(e.target.files[0]);
});