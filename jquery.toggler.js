/*!
 * jquery.toggler.js
 * 開閉するUIのjQueryプラグイン
 * @author Makoto OOSUGI <oosugi20@gmail.com>
 */
;(function ($, window, undefined) {

'use strict';

var Toggler;
var PLUGIN_NAME = 'toggler';

/**
 * Toggler
 * @constructor
 */
Toggler = function Toggler () {
	return this;
};


(function (fn) {
})(Toggler.prototype);


/**
 * $.fn.toggler
 */
$.fn[PLUGIN_NAME] = function () {
	return this.each(function () {
		if (!$.data(this, PLUGIN_NAME)) {
			$.data(this, PLUGIN_NAME, new Toggler());
		}
	});
};

})(jQuery, this);
