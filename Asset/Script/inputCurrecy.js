$("input[data-type='currency']").on({
	keyup: function () {
		formatCurrency($(this));
	}
});
function formatNumber(n) {
	return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatCurrency(input) {
    console.log("sd")
	var input_val = input.val();
	if (input_val === "") return;
	var original_len = input_val.length;
	var caret_pos = input.prop("selectionStart");
	input_val = formatNumber(input_val);
	input.val(input_val);
	var updated_len = input_val.length;
	caret_pos = updated_len - original_len + caret_pos;
	input[0].setSelectionRange(caret_pos, caret_pos);
}