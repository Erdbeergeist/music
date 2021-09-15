/**
 * ownCloud - Music app
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Pauli Järvinen <pauli.jarvinen@gmail.com>
 * @copyright Pauli Järvinen 2018 - 2021
 */

OCA.Music = OCA.Music || {};

/** @namespace */
OCA.Music.Utils = {

	/**
	 * Nextcloud 14 has a new overall layout structure which requires some
	 * changes on the application logic.
	 */
	newLayoutStructure: function() {
		// Detect the new structure from the presence of the #content-wrapper element.
		return $('#content-wrapper').length === 0;
	},

	/**
	 * Newer versions of Nextcloud come with a "dark theme" which may be activated
	 * from the accessibility settings. Test if the theme is active.
	 */
	darkThemeActive: function() {
		// The name of the theme was originally 'themedark' but changed to simply 'dark' in NC18.
		return Object.prototype.hasOwnProperty.call(OCA, 'Accessibility')
			&& (OCA.Accessibility.theme == 'themedark' || OCA.Accessibility.theme == 'dark');
	},

	/**
	 * Capitalizes the firts character of the given string
	 */
	capitalize: function(str) {
		return str && str[0].toUpperCase() + str.slice(1); 
	},

	/**
	 * Creates a track title from the file name, dropping the file extension and any
	 * track number possibly found from the beginning of the file name.
	 */
	titleFromFilename: function(filename) {
		// parsing logic is ported form parseFileName in utility/scanner.php
		var match = filename.match(/^((\d+)\s*[.-]\s+)?(.+)\.(\w{1,4})$/);
		return match ? match[3] : filename;
	},

	/**
	 * Given a file base name, returns the "stem" i.e. the name without extension
	 */
	dropFileExtension: function(filename) {
		return filename.replace(/\.[^/.]+$/, '');
	},

	/**
	 * Join two path fragments together, ensuring there is a single '/' between them.
	 * The first fragment may or may not end with '/' and the second fragment may or may
	 * not start with '/'.
	 */
	joinPath: function(first, second) {
		if (first.endsWith('/')) {
			first = first.slice(0, -1);
		}
		if (second.startsWith('/')) {
			second = second.slice(1);
		}
		return first + '/' + second;
	},

	/**
	 * Format the given seconds value as play time. The format includes hours if and only if the
	 * given input time is more than one hour. The output format looks like 1:01 or 1:01:01.
	 * That is, unlike the rest of the parts, the part before the first ':' does not have a leading zero.
	 */
	formatPlayTime: function(input_s) {
		// Format the given integer with two digits, prepending with a leading zero if necessary
		var fmtTwoDigits = function(integer) {
			return (integer < 10 ? '0' : '') + integer;
		};

		var hours = Math.floor(input_s / 3600);
		var minutes = Math.floor((input_s - hours*3600) / 60);
		var seconds = Math.floor(input_s % 60);

		if (hours > 0) {
			return hours + ':' + fmtTwoDigits(minutes) + ':' + fmtTwoDigits(seconds);
		} else {
			return minutes + ':' + fmtTwoDigits(seconds);
		}
	},

	/**
	 * Given a date-and-time string in UTC, return it in local timezone following the locale settings
	 * of the user (from Nextcloud/ownCloud personal settings).
	 */
	formatDateTime: function(timestamp) {
		if (!timestamp) {
			return null;
		} else {
			var date = new Date(timestamp + 'Z');
			var locale = OC.getLocale().replaceAll('_', '-'); // OC returns e.g. 'en_US' but toLocaleString expects 'en-US'
			return date.toLocaleString(locale);
		}
	},

	/**
	 * Format a file size given as bytes in human-readable format.
	 * Source: https://stackoverflow.com/a/20732091/4348850
	 */
	formatFileSize: function(size) {
		var i = (size == 0) ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
		return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KiB', 'MiB', 'GiB', 'TiB'][i];
	},

	/**
	 * Format baud rate given as bit per second to kilobits per second with integer precission
	 */
	formatBitrate: function(bitsPerSecond) {
		return (bitsPerSecond / 1000).toFixed() + ' kbps';
	}
};