 
(function($) {
	$.fn.audioPlay = function(options) {
		var defaults = {
			name: "audioPlay",
			urlMp3: "",
			//urlOgg: "",
			//urlWav:"",
			clone: false
			//loop:true
		};
		var params = $.extend(defaults, options || {}), audioHtml = "";
		
		$(this).each(function(i) {
			
			var strIdRoot = params.name;
				tmpAutioHtml = '<audio id="'+ strIdRoot + i +'" controls="controls" preload="auto" >' +
					'<source src="'+ params.urlMp3 +'"></source>' +
					//'<source src="'+ params.urlOgg +'"></source>' +
					//'<source src="'+ params.urlWav +'"></source>' +
				'</audio>';
			if (params.clone) {
				audioHtml = audioHtml + tmpAutioHtml;
				$(this).data("targetId", strIdRoot + i);
			} else {
				if (!i) {
					audioHtml = tmpAutioHtml;
				}
				$(this).data("targetId", strIdRoot + "0");
			}
		});
		$("body").append(audioHtml);
		$(this).mousedown (function() {
			$(this).find('.hv').css('z-index','3');
			var targetId = $(this).data("targetId");
			var aa = $("#" + targetId).get(0);
		//	console.log(aa);
			aa.play();
		});
		$(this).mouseup (function() {
			 _this = $(this);
			setTimeout(plays,500)
				 function plays() {
					_this.find('.hv').css('z-index','1');
				}
		});
	};
})(jQuery);
 
 
 
 