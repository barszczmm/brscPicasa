$(document).ready(function() {

	$.fn.brscPicasa.defaults = {
		photos_thumbsize: '64c',
		photo_displaysize: '320',
		callback: function() {
			$('a.loaded-link img', this).parent().click(function() {
				alert('some lightbox clone could be openening now');
				return false;
			});
		}
	};

	$('.example .trigger').click(function() {
		$(this).parent().brscPicasa({
			classes: {
				link_with_image: 'loaded-link'
			}
		});
		$(this).remove();
	});

	$('#code1 .code-trigger').click(function() {
		$(this).parent().brscPicasa({
			user: 'barszczmm',
			mode: 'photos',
			photos_linkedsize: 'none'
		});
		$(this).remove();
	});

	$('#code2 .code-trigger').click(function() {
		$(this).parent().brscPicasa({
			user: 'barszczmm',
			album_name: '200408250902GRy',
			photo_id: '5290919539705066066',
			authkey: 'Gv1sRgCMb_uNzer526uAE',
			mode: 'photo'
		});
		$(this).remove();
	});

});