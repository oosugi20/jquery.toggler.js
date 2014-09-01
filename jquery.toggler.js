/*! jquery.toggler.js (git://github.com/oosugi20/jquery.toggler.js.git)
 * lastupdate: 2014-09-01
 * version: 0.1.4
 * author: Makoto OOSUGI <oosugi20@gmail.com>
 * License: MIT
 */
;(function ($, window, undefined) {
'use strict';

var $window = $(window);
var MODULE_NAME = 'Toggler';
var PLUGIN_NAME = 'toggler';
var Module;
var DEFAULT_OPTIONS = {
	openedClassName: 'opened',
	closedClassName: 'closed',
	autoClose: false,
	effect: 'slide',
	easing: 'swing',
	adjustPosition: false,
	openSpeed: 250,
	closeSpeed: 100,
	enableMouseEnter: false
};


/**
 * Module
 * @constructor
 */
Module = function Module (element, options) {
	this.el = element;
	this.options = $.extend({}, DEFAULT_OPTIONS, options);
	this.$el = $(element);
	this.$contents = this.$el.find('[data-toggler-contents]');
	this.$btn = this.$el.find('[data-toggler-btn]');
	return this;
};


(function (fn) {

	/**
	 * fn._eventify
	 * @chainable
	 */
	fn._eventify = function () {
		var _this = this;
		var event = (this.options.enableMouseEnter) ? 'click mouseenter' : 'click';

		// ボタンに対してイベントをデリゲート。
		// data-toggler-btn属性の値をボタンのタイプとし、タイプごとのメソッドを呼ぶ。
		// メソッドを呼ぶときには引数として data-toggler-targetの値を渡す。
		// これが渡された場合は、data-toggler-contentsの値が一致するものだけ開閉する。
		// undefinedが渡された場合は、data-toggler-contents全部が対象となる。
		this.$el.on(event, '[data-toggler-btn]', function (e) {
			var $this = $(this)
			var type = $this.attr('data-toggler-btn');
			var target = $this.attr('data-toggler-target');
			_this[type](target);
			if (type === 'toggle') {
				_this.refreshLabel();
			}
			e.preventDefault();
		});

		return this;
	};


	/**
	 * init
	 * @chainable
	 */
	fn.init = function () {
		var _this = this;
		var initClass = this.$el.attr('class');
		var reg = new RegExp(this.options.openedClassName + '\ |' + this.options.openedClassName + '$');
		var isInitOpen = reg.test(initClass);

		// 開いておくclassが合った場合
		if (isInitOpen) {
			this.$contents.show();
			this.$contents.data('toggler:state', 'opened');

		// ソレ以外なら
		} else {
			// 開いとく個別のclassがあるなら開いて無いなら閉じる。
			this.$contents.each(function (i) {
				var $contents = $(this);
				var id = $contents.attr('data-toggler-contents')
				var regI = new RegExp(_this.options.openedClassName + '-' + id + '\ |'
					+ _this.options.openedClassName + '-' + id + '$');
				var isInitOpenI = regI.test(initClass);

				if (isInitOpenI) {
					$contents.show();
					$contents.data('toggler:state', 'opened');
				} else {
					$contents.hide();
					$contents.data('toggler:state', 'closed');
				}
			});
		}

		// クラスを更新
		this.updateStateClass();

		// イベントをバインド
		this._eventify();

		return this;
	};


	/**
	 * fn.hasOpened
	 * 開いてるコンテンツがあるかないかを調べて返す。
	 * @return {Boolean}
	 */
	fn.hasOpened = function () {
		// 開いてる要素を取得して
		var $opened = this.$contents.filter(function () {
			return $(this).data('toggler:state') === 'opened';
		});

		// 存在したら ture, なかったら false
		return $opened.length ? true : false;
	};


	/**
	 * fn.updateStateClass
	 */
	fn.updateStateClass = function () {
		var openedClass = this.options.openedClassName
		  , closedClass = this.options.closedClassName
		  , _this = this
		;

		// 各コンテンツごとのstateを参照してclassを更新
		this.$contents.each(function (i) {
			var id = $(this).attr('data-toggler-contents');

			if ($.data(this, 'toggler:state') === 'opened') {
				_this.$el.addClass(openedClass + '-' + id);
				_this.$el.removeClass(closedClass + '-' + id);
			}

			if ($.data(this, 'toggler:state') === 'closed') {
				_this.$el.addClass(closedClass + '-' + id);
				_this.$el.removeClass(openedClass + '-' + id);
			}
		});

		// 開いてる状態のコンテンツが一つでもあったらopenedClassつける。
		if (this.hasOpened()) {
			this.$el.addClass(openedClass);
			this.$el.removeClass(closedClass);

		// ひとつもなかったらclosedClassつける。
		} else {
			this.$el.addClass(closedClass);
			this.$el.removeClass(openedClass);
		}

		return this;
	};


	/**
	 * fn.filterContents
	 * 引数に渡された値から this.$contents をフィルタリングして返す。
	 * this.$contents の data-toggler-contents の値と、渡された引数が同じものだけ返す。
	 * @param {String} target
	 * @return {jQuery object}
	 */
	fn.filterContents = function (target) {
		var $target;

		if (target) {
			$target = this.$contents.filter('[data-toggler-contents=' + target + ']');
		} else {
			$target = this.$contents;
		}

		return $target;
	};


	/**
	 * fn.open
	 * @param {String} target - data-toggler-btn の data-toggler-target が渡される想定。
	 *   this.$contents の data-toggler-contents の値が一致するものだけフィルタリングする。
	 */
	fn.open = function (target) {
		var _this = this;
		var effect = this.options.effect;
		var speed = this.options.openSpeed;
		var easing = this.options.easing;
		var isAutoClose = this.options.autoClose;
		var $target = this.filterContents(target);
		var $others = this.$contents.not($target);
		var defer = $.Deferred();


		if ($target.data('toggler:state') !== 'opened') {

			this.$el.trigger('toggler:beforeopen');

			$others.data('toggler:state', 'closed');
			if (isAutoClose) {
				switch (effect) {
					case 'fade':
						$others.stop(false, true).fadeOut({
							duration: speed,
							easing: easing
						});
						break;
					case 'slide':
						$others.stop(false, true).slideUp({
							duration: speed,
							easing: easing
						});
						break;
					case 'none':
						$others.stop(false, true).hide();
						break;
					default:
						$others.stop(false, true).slideUp({
							duration: speed,
							easing: easing
						});
						break;
				}
			}

			$target.data('toggler:state', 'opened');
			this.updateStateClass();

			// 開いた時のスクロール量を保持しておき、
			// 閉じた時にこの位置に戻す。
			this._scrollTop = $window.scrollTop();

			$target.hide();

			switch (effect) {
				case 'fade':
					$target.stop(false, true).fadeIn({
						duration: speed,
						easing: easing,
						complete: defer.resolve
					});
					break;
				case 'slide':
					$target.stop(false, true).slideDown({
						duration: speed,
						easing: easing,
						complete: defer.resolve
					});
					break;
				case 'none':
					$target.stop(false, true).show();
					defer.resolve();
					break;
				default:
					$target.stop(false, true).slideDown({
						duration: speed,
						easing: easing,
						complete: defer.resolve
					});
					break;
			}

			defer.done(function () {
				_this.$el.trigger('toggler:afteropen');
			});
		}

		return this;
	};

	/**
	 * fn.close
	 * @param {String} target - data-toggler-btn の data-toggler-target が渡される想定。
	 *   this.$contents の data-toggler-contents の値が一致するものだけフィルタリングする。
	 */
	fn.close = function (target) {
		var _this = this;
		var effect = this.options.effect;
		var speed = this.options.closeSpeed;
		var easing = this.options.easing;
		var adjustPosition = this.options.adjustPosition;
		var $target = (target) ? this.filterContents(target) : this.$contents;

		if ($target.data('toggler:state') !== 'closed') {

			this.$el.trigger('toggler:beforeclose');

			$target.data('toggler:state', 'closed');
			this.updateStateClass();

			$target.show();

			switch (effect) {
				case 'fade':
					$target.stop(false, true).fadeOut({
						duration: speed,
						easing: easing
					});
					break;
				case 'slide':
					$target.stop(false, true).slideUp({
						duration: speed,
						easing: easing
					});
					break;
				case 'none':
					$target.stop(false, true).hide();
					break;
				default:
					$target.stop(false, true).slideUp({
						duration: speed,
						easing: easing
					});
					break;
			}

			// オプションがtrueの場合、開いた時のスクロール量に戻す
			if (adjustPosition) {
				// 開いた時のスクロール量が保持されていない場合
				// （初期状態で開いていた場合）
				// 要素がウィンドウの真ん中にくるようにする。
				this._scrollTop = this._scrollTop || this.$el.offset().top - ($window.height() / 2);
				$window.scrollTop(this._scrollTop);
			}

			this.$el.trigger('toggler:afterclose');
		}

		return this;
	};

	/**
	 * fn.toggle
	 * 呼ばれた時のターゲットの toggler:state の値によって、
	 * this.close か this.open が呼ばれる。
	 * @param {String} target
	 */
	fn.toggle = function (target) {
		var $target = this.filterContents(target);
		var state = $target.data('toggler:state');

		switch (state) {
			case 'opened':
				this.close(target);
				break;

			case 'closed':
				this.open(target);
				break;

			case 'animating':
				break;
		}

		return this;
	};


	/**
	 * fn.refreshLabel
	 * ボタンのラベルを更新する。
	 * [data-toggler-togglelable]の値を参照し、存在しない場合は、
	 * ボタン自体のテキストを返す。
	 *
	 * @chainable
	 */
	fn.refreshLabel = function () {
		var $btn = this.$btn.filter('[data-toggler-togglelabel]');
		var label = $btn.attr('data-toggler-togglelabel') || $btn.text();
		var defaultLabel = $btn.text();
		$btn.attr('data-toggler-togglelabel', defaultLabel);
		$btn.text(label);
		return this;
	};


	/**
	 * fn.state
	 * [TODO] 現状使ってないけど、target渡したらその分の状態、渡さなかったら全部の〜
	 *        って感じに調整した方がヨサゲ。
	 * 現在の状態を返す。
	 *   - opened: 開いている状態。
	 *   - closed: 閉じている状態。
	 *   - animating: アニメーション中。
	 * @return {String} - opened | closed | animating
	 */
	//fn.state = function () {
	//	var isAnimating = (this.$contents.filter(':animated').length) ? true : false;
	//	if (isAnimating) {
	//		this._state = 'animating';
	//	}
	//	return this._state;
	//};

})(Module.prototype);


// set jquery.fn
$.fn[PLUGIN_NAME] = function (options) {
	return this.each(function () {
		var module;
		module = new Module(this, options);
		$.data(this, PLUGIN_NAME, module);
		module.init();
	});
};

// set global
$[MODULE_NAME] = Module;

})(jQuery, this);
