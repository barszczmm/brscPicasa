$(document).ready(function() {

	$.fn.brscPicasa.defaults = {
		photos_thumbsize: '64c',
		photo_displaysize: '320'
	};

	$('#example1 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				classes: {
					link_with_image: 'loaded-link'
				}
			});
			$(this).remove();
		}
	);

	$('#example2 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				classes: {
					link_with_image: 'loaded-link'
				}
			});
			$(this).remove();
		}
	);

	$('#example3 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				classes: {
					link_with_image: 'loaded-link'
				},
				callback: function() {
					$('a.loaded-link', this).colorbox({rel:'example3'});
				}
			});
			$(this).remove();
		}
	);

	$('#example4 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				user: 'barszczmm',
				mode: 'photos',
				photos_linkedsize: 'none'
			});
			$(this).remove();
		}
	);

	$('#example5 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				user: 'barszczmm',
				album_name: '200408250902GRy',
				photo_id: '5290919539705066066',
				authkey: 'Gv1sRgCMb_uNzer526uAE',
				mode: 'photo',
				callback: function() {
					$('a.brscPicasaLinkWithImage', this).colorbox({rel:'example5'});
				}
			});
			$(this).remove();
		}
	);

});