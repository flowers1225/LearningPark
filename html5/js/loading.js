
$(function() {
	$(".meter > span").each(function() {
		$(this)
			.data("origWidth", $(this).width())
			.width(0)
			.animate({
				width: $(this).data("origWidth")
			}, 2200);
	});
})
function removeElemt () {
		$('#page-wrap').remove();
}