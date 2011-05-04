(function($) {

	$.fn.brscPicasa = function(options) {

		var name = 'brscPicasa',
			settings = {
				user: '',
				album_id: '',
				album_name: '',
				photo_id: '',
				authkey: '',
				// thumbsizes: 32, 48, 64, 72, 104, 144, 150, 160 with 'u' or 'c' suffix (for uncropped (default if no suffix added) or cropped version)
				// sizes: 94, 110, 128, 200, 220, 288, 320, 400, 512, 576, 640, 720, 800, 912, 1024, 1152, 1280, 1440, 1600
				// othersizes: d - original uploaded photo including all original Exif data, 'none' - photo will not be linked to bigger size
				albums_thumbsize: '32c', // values from thumbsizes and sizes
				albums_titles: true,
				photos_thumbsize: '32c', // values from thumbsizes and sizes
				photos_linkedsize: '800', // values from thumbsizes, sizes and othersizes
				photos_titles: false,
				photo_displaysize: '640', // values from thumbsizes and sizes
				photo_linkedsize: 'd', // values from thumbsizes, sizes, othersizes
				photo_title: false,
				mode: 'from_link', // available modes: albums - list all user public albums, photos - list photos from specified album, photo - display one photo, from_link - find links to pisaweb and guess what to display
				from_link_target: '', // if empty 'a' element will be replaced with new content, any other string will be treated as jQuery selector and new content will be added to found element using append method
				classes: {
					link_replacer: '',
					container: '',
					album_list: '',
					photos_list: '',
					list_item: '',
					single_item: '',
					link_with_image: '',
					photo: '',
					title: ''
				},
				callback: false
			},
			opts = $.extend(true, {}, settings, $.fn.brscPicasa.defaults, options),

			feed_base_url = 'http://picasaweb.google.com/data/feed/base/user/',
			entry_base_url = 'http://picasaweb.google.com/data/entry/base/user/',

			to_load_counter = 0; // this one is increased before every request to Picasa and decreased after reqest is finished

		return this.each(function() {

			var elem = this;

			function _start() {

				if (!opts.mode || !opts.user || !methods[opts.mode]) { // fallback to from_link method if mode is empty or user is not set or unknown mode is set
					opts.mode = 'from_link';
				}
				methods[opts.mode].apply(elem, [opts]);

				if ($.isFunction(opts.callback)) {
					var interval_id;
					interval_id = setInterval(function() {
						if (to_load_counter <= 0) {
							clearInterval(interval_id);
							opts.callback.call(elem);
						}
					}
					, 100);
				}

			}

			var methods = {

				albums: function(o) {

					to_load_counter++;

					var $this = $(this),
						data = {
							kind: 'album',
							alt: 'json',
							thumbsize: o.albums_thumbsize,
							fields: 'entry(title,link[@rel=\'alternate\'],media:group/media:thumbnail)',
							visibility: 'all'
						},
						callback = '';

					if (o.authkey) {
						data['authkey'] = o.authkey;
					}

					if (!$.support.cors) {
						callback = '?callback=?';
						data['alt'] = 'json-in-script';
					}

					$.getJSON(
						feed_base_url + o.user + callback,
						data,
						function(root) {
							var entries = root.feed.entry || [],
								$list = $('<ul class="' + name + 'List ' + name + 'Albums ' + o.classes.album_list + '"></ul>');

							for (var i = 0; i < entries.length; ++i) {
								var entry = entries[i];
								$item = $('<li class="' + name + 'ListItem ' + o.classes.list_item + '"><a class="' + name + 'LinkWithImage ' + o.classes.link_with_image + '" href="' + entry.link[0].href + '"><img class="' + name + 'Photo ' + o.classes.thumbnail + '" src="' + entry.media$group.media$thumbnail[0].url + '" width="' + entry.media$group.media$thumbnail[0].width + '" height="' + entry.media$group.media$thumbnail[0].height + '" /></a></li>');
								if (o.albums_titles) {
									$item.children().append('<span class="' + name + 'Title ' + o.classes.title + '">' + entry.title.$t + '</span>');
								}
								$list.append($item);
							}

							$list.wrap('<div class="' + name + 'Container ' + o.classes.container + '" />').parent().appendTo($this);
							to_load_counter--;
						}
					);
				},

				photos: function(o) {

					to_load_counter++;

					var $this = $(this),
						album_url_part = '', // 100 last user photos will be retrieved
						data = {
							kind: 'photo',
							alt: 'json',
							thumbsize: o.photos_thumbsize,
							fields: 'entry(title,media:group(media:thumbnail, media:content))',
							visibility: 'all'
						},
						callback = '';

					if (o.authkey) {
						data['authkey'] = o.authkey;
					}

					if (o.photos_linkedsize !== 'none') {
						data['imgmax'] = o.photos_linkedsize;
					}

					if (!$.support.cors) {
						callback = '?callback=?';
						data['alt'] = 'json-in-script';
					}

					if (o.album_id) {
						album_url_part = '/albumid/' + o.album_id;
					} else if (o.album_name) {
						album_url_part = '/album/' + o.album_name;
					}

					$.getJSON(
						feed_base_url + o.user + album_url_part + callback,
						data,
						function(root) {
							var entries = root.feed.entry || [],
								$list = $('<ul class="' + name + 'List ' + name + 'Photos ' + o.classes.photos_list + '"></ul>');

							for (var i = 0; i < entries.length; ++i) {
								var entry = entries[i];
								$item = $('<li class="' + name + 'ListItem ' + o.classes.list_item + '"><img class="' + name + 'Photo ' + o.classes.thumbnail + '" src="' + entry.media$group.media$thumbnail[0].url + '" width="' + entry.media$group.media$thumbnail[0].width + '" height="' + entry.media$group.media$thumbnail[0].height + '" /></li>');
								if (o.photos_linkedsize !== 'none') {
									$item.children().wrap('<a class="' + name + 'LinkWithImage ' + o.classes.link_with_image + '" href="' + entry.media$group.media$content[0].url + '"></a>');
								}
								if (o.photos_titles) {
									$item.find('img').after('<span class="' + name + 'Title ' + o.classes.title + '">' + entry.title.$t + '</span>');
								}
								$list.append($item);
							}

							$list.wrap('<div class="' + name + 'Container ' + o.classes.container + '" />').parent().appendTo($this);
							to_load_counter--;
						}
					);
				},

				photo: function(o) {

					to_load_counter++;

					var $this = $(this),
						album_url_part = '',
						data = {
							kind :'photo',
							alt: 'json',
							thumbsize: o.photo_displaysize,
							fields: 'title,media:group(media:thumbnail, media:content)',
							visibility: 'all'
						},
						callback = '';

					if (o.authkey) {
						data['authkey'] = o.authkey;
					}

					if (o.photo_linkedsize !== 'none') {
						data['imgmax'] = o.photo_linkedsize;
					}

					if (!$.support.cors) {
						callback = '?callback=?';
						data['alt'] = 'json-in-script';
					}

					if (!o.photo_id) {
						$.error('photo_id option is not set for jQuery.' + name);
						return;
					}
					if (o.album_id) {
						album_url_part = '/albumid/' + o.album_id;
					} else if (o.album_name) {
						album_url_part = '/album/' + o.album_name;
					} else {
						$.error('album_id or album_name option must be set for jQuery.' + name);
						return;
					}

					$.getJSON(
						entry_base_url + o.user + album_url_part + '/photoid/' + o.photo_id + callback,
						data,
						function(root) {
							var entry = root.entry || {},
								$div = $('<div class="' + name + 'SingleItem ' + o.classes.single_item + '"><img class="' + name + 'Photo ' + o.classes.photo + '" src="' + entry.media$group.media$thumbnail[0].url + '" width="' + entry.media$group.media$thumbnail[0].width + '" height="' + entry.media$group.media$thumbnail[0].height + '" /></div>');

							if (o.photo_linkedsize !== 'none') {
								$div.children().wrap('<a class="' + name + 'LinkWithImage ' + o.classes.link_with_image + '" href="' + entry.media$group.media$content[0].url + '"></a>');
							}
							if (o.photo_title) {
								$div.find('img').after('<span class="' + name + 'Title ' + o.classes.title + '">' + entry.title.$t + '</span>');
							}

							$div.wrap('<div class="' + name + 'Container ' + o.classes.container + '" />').parent().appendTo($this);
							to_load_counter--;
						}
					);
				},

				from_link: function(o) {
					var $this = $(this),
						$links;

					if ($this.is('a[href^="http://picasaweb.google."]') || $this.is('a[href^="https://picasaweb.google."]')) {
						$links = $this;
					} else {
						$links = $this.find('a[href^="http://picasaweb.google."], a[href^="https://picasaweb.google."]');
					}

					$links.each(function() {

						o.authkey = '';
						if (this.search) {
							var params = this.search.replace('?', '').split('&');
							for(var i = 0; i < params.length; i++) {
								param = params[i].split('=');
								if (param[0] === 'authkey') {
									o.authkey = param[1];
									break;
								}
							}
						}

						var pathname = this.pathname;
						if (pathname.substr(0, 1) === '/') {
							pathname = pathname.substr(1, pathname.length);
						}
						var path_split = pathname.split('/');
						if (path_split.length == 2) { // there is user and albumname in path
							o.user = path_split[0];
							o.album_name = path_split[1];
							if (this.hash) { // there is photoid in path
								o.photo_id = this.hash.replace('#', '');
								o.mode = 'photo';
							} else {
								o.mode = 'photos';
							}
						} else if (path_split.length == 1 && path_split[0] != '') { // there is only username in path
							o.user = path_split[0];
							o.mode = 'albums';
						} else { // can't find anything usefull in path
							return;
						}

						if (!o.from_link_target) {
							$target = $('<div class="' + name + 'LinkReplacer ' + o.classes.link_replacer + '"></div>');
							$(this).replaceWith($target);
						} else {
							$target = $(o.from_link_target);
						}

						return methods[o.mode].apply($target, [o]);

					});
				}

			}

			_start();

		});

	}

	$.fn.brscPicasa.defaults = {};

})(jQuery);
