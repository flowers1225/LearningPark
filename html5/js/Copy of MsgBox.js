(function($) {

	$.fn.msgBox = function  (msg,callback) {
		if (!msg || typeof msg !='object') {msg = {}};
		if (!callback) {
			callback = null;
		};
	$('body').append($('<div>').attr('id','msgbox')
				.append($('<div>').attr('id','msg')
					.append($('<div>').attr('class','m-text').html(msg.msgText))
					.append($('<div>').attr('class','m-btn')
				)
			)		
		)
		if (msg.msgType == 'Confirm') {
			$('.m-btn').append($('<span>').attr('class','ok').html(msg.buttonOk)
				.click(function  (e) {
					$('#msgbox').remove();
					if (callback != null) {
						callback('true');
					}
				})			
			)
					   .append($('<span>').attr('class','cancel').html(msg.buttonCancel)
				.click(function  (e) {
					$('#msgbox').remove();
					if (callback != null) {
						callback('false');
					}
				})	
			)	
		}else if (msg.msgType == 'Alerta') {
			$('.m-btn').append($('<span>').attr('class','ok').html(msg.buttonOk)
				.click(function  (e) {
				console.log(this)
					$('#msgbox').remove();
				})			
			)
		}
	}

})(jQuery)