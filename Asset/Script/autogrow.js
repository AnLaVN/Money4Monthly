// Tự động tăng chiều cao textarea
function auto_grow(element) {
	element.style.height = "";
	element.style.height = (element.scrollHeight+3) + "px";
}