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
	 * fn._eventify
	 * @chainable
	 */
	fn._eventify = function () {
		var _this = this;

		// ボタンに対してイベントをデリゲート。
		// data-toggler-btn属性の値をボタンのタイプとし、タイプごとのメソッドを呼ぶ。
		// メソッドを呼ぶときには引数として data-toggler-targetの値を渡す。
		// これが渡された場合は、data-toggler-contentsの値が一致するものだけ開閉する。
		// undefinedが渡された場合は、data-toggler-contents全部が対象となる。
		this.$el.on('click', '[data-toggler-btn]', function (e) {
			var type = $(this).attr('data-toggler-btn');
			var target = $(this).attr('data-toggler-target');
			_this[type](target);
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
		var $target = this.filterContents(target);

		$target.data('toggler:state', 'opened');
		this.updateStateClass();

		$target.hide();
		$target.slideDown(250);

		return this;
	};

	/**
	 * fn.close
	 * @param {String} target - data-toggler-btn の data-toggler-target が渡される想定。
	 *   this.$contents の data-toggler-contents の値が一致するものだけフィルタリングする。
	 */
	fn.close = function (target) {
		var _this = this;
		var $target = this.filterContents(target);

		$target.data('toggler:state', 'closed');
		this.updateStateClass();

		$target.show();
		$target.slideUp(100);

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
