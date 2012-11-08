/*!
 * jquery.toggler.js
 * 開閉するUIのjQueryプラグイン
 * @author Makoto OOSUGI <oosugi20@gmail.com>
 * @url https://github.com/oosugi20/jquery.toggler.js
 */
;(function ($, window, undefined) {

'use strict';

var Toggler;
var PLUGIN_NAME = 'toggler';
var DEFAULT_OPTIONS = {
	openedClassName: 'opened',
	closedClassName: 'closed'
};


/**
 * Toggler
 * @constructor
 */
Toggler = function Toggler (element, options) {
	this.el = element;
	this.options = $.extend({}, DEFAULT_OPTIONS, options);
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
		var initClass = this.$el.attr('class');
		var reg = new RegExp(this.options.openedClassName);
		var isInitOpen = reg.test(initClass);

		// オープン時のクラスがHTML側に着いてたら 開いておき、
		// それ以外なら閉じておく。
		if (isInitOpen) {
			this.$contents.show();
			this._state = 'opened';
		} else {
			this.$contents.hide();
			this._state = 'closed';
		}

		// クラスを更新
		this.updateStateClass(this._state);

		// イベントをバインド
		this._eventify();

		return this;
	};


	/**
	 * fn.updateStateClass
	 */
	fn.updateStateClass = function (strategy) {
		var openedClass = this.options.openedClassName
		  , closedClass = this.options.closedClassName
		;

		switch (strategy) {
			case 'opened':
				this.$el.addClass(openedClass);
				this.$el.removeClass(closedClass);
				break;

			case 'closed':
				this.$el.addClass(closedClass);
				this.$el.removeClass(openedClass);
				break;
		}

		return this;
	};


	/**
	 * fn.open
	 */
	fn.open = function () {
		var _this = this;
		this.updateStateClass('opened');
		this.$contents.hide();
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
		this.updateStateClass('closed');
		this.$contents.show();
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
$.fn[PLUGIN_NAME] = function (options) {
	return this.each(function () {
		if (!$.data(this, PLUGIN_NAME)) {
			$.data(this, PLUGIN_NAME, new Toggler(this, options));
		}
	});
};

})(jQuery, this);
