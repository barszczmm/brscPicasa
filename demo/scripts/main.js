$(document).ready(function() {

	$.fn.brscPicasa.defaults = {
		photos_thumbsize: '64c',
		photo_displaysize: '320'
	};

	// link replacing example #1: public albums
	$('#example1 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				max_results: 5,
				start_index: 3,
				classes: {
					link_with_image: 'loaded-link'
				}
			});
			$(this).remove();
		}
	);

	// link replacing example #2: public album
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

	// link replacing example #3: private photos
	$('#example3 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				classes: {
					link_with_image: 'loaded-link'
				},
				callback: function() {
					$('a.loaded-link', this).colorbox({
						rel:'example3',
						title: function() {
							return $('img', this).attr('title');
						}
					});
				}
			});
			$(this).remove();
		}
	);

	// pure options example #1: 50 last user public photos
	$('#example4 .trigger').click(
		function() {
			$(this).parent().brscPicasa({
				user: 'barszczmm',
				mode: 'photos',
				photos_linkedsize: 'none',
				max_results: 50
			});
			$(this).remove();
		}
	);

	// pure options example #2: private photo
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