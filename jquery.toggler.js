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
Toggler = function Toggler (element) {
	this.el = element;
	this.$el = $(element);
	this.$contents = this.$el.find('[data-toggler-contents]');
	this.init();
	return this;
};


(function (fn) {

	/**
	 * fn._state
	 * 状態を保持する。
	 * @private
	 */
	fn._state = null;


	/**
	 * fn._eventify
	 * @chainable
	 */
	fn._eventify = function () {
		var _this = this;

		// ボタンに対してイベントをデリゲート。
		// data-toggler-btn属性の値をボタンのタイプとし、タイプごとのメソッドを呼ぶ。
		this.$el.on('click', '[data-toggler-btn]', function (e) {
			var type = $(this).attr('data-toggler-btn');
			_this[type]();
			e.preventDefault();
		});

		return this;
	};


	/**
	 * init
	 * @chainable
	 */
	fn.init = function () {
		var initState = this.$el.attr('data-toggler-init');

		// data-toggler-initの値が、openなら開いておき、それ以外なら閉じておく。
		if (initState === 'open') {
			this.$contents.show();
			this._state = 'opened';
		} else {
			this.$contents.hide();
			this._state = 'closed';
		}

		// イベントをバインド
		this._eventify();

		return this;
	};


	/**
	 * fn.open
	 */
	fn.open = function () {
		var _this = this;
		this.$contents.slideDown(250, function () {
			_this._state = 'opened';
		});
		return this;
	};

	/**
	 * fn.close
	 */
	fn.close = function () {
		var _this = this;
		this.$contents.slideUp(100, function () {
			_this._state = 'closed';
		});
		return this;
	};

	/**
	 * fn.toggle
	 */
	fn.toggle = function () {
		var state = this.state();

		switch (state) {
			case 'opened':
				this.close();
				break;

			case 'closed':
				this.open();
				break;

			case 'animating':
				break;
		}

		return this;
	};

	/**
	 * fn.state
	 * 現在の状態を返す。
	 *   - opened: 開いている状態。
	 *   - closed: 閉じている状態。
	 *   - animating: アニメーション中。
	 * @return {String} - opened | closed | animating
	 */
	fn.state = function () {
		var isAnimating = (this.$contents.filter(':animated').length) ? true : false;
		if (isAnimating) {
			this._state = 'animating';
		}
		return this._state;
	};

})(Toggler.prototype);


/**
 * $.fn.toggler
 */
$.fn[PLUGIN_NAME] = function () {
	return this.each(function () {
		if (!$.data(this, PLUGIN_NAME)) {
			$.data(this, PLUGIN_NAME, new Toggler(this));
		}
	});
};

})(jQuery, this);
