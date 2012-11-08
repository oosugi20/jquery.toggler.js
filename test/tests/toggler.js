'use strict';

describe('$.fn.toggler', function () {
	var html, $html, $mod;

	beforeEach(function () {
		html = [
			'<div class="area-html">',
				'<div class="mod-toggleUnit">',
					'<a href="#" data-toggler-btn="toggle">開閉</a>',
					'<a href="#" data-toggler-btn="open">開く</a>',
					'<a href="#" data-toggler-btn="close">閉じる</a>',
					'<div data-toggler-contents>',
						'<p style="height: 200px;">This is toggler contents.</p>',
					'</div>',
				'</div>',

				'<div class="mod-toggleUnit">',
					'<a href="#" data-toggler-btn="toggle">開閉</a>',
					'<a href="#" data-toggler-btn="open">開閉</a>',
					'<a href="#" data-toggler-btn="close">開閉</a>',
					'<div data-toggler-contents>',
						'<p style="height: 200px;">This is toggler contents.</p>',
					'</div>',
				'</div>',
			'</div>'
		].join('');
		$html = $(html).filter('.area-html');
		$mod = $html.find('.mod-toggleUnit');
	});

	it('jQueryオブジェクトを返すこと', function () {
		var $toggler = $mod.toggler();
		expect($toggler).to.be.a(jQuery);
	});

	it('$toggler.data(\'toggler\')をセットすること', function () {
		var $toggler = $mod.toggler();
		var toggler = $toggler.data('toggler');
		expect(toggler).to.be.ok();
	});

	it('$toggler.data(\'toggler\')は Toggler のインスタンスであること', function () {
		var $toggler = $mod.toggler();
		var toggler = $toggler.data('toggler');
		expect(toggler.constructor.name).to.be.equal('Toggler');
	});

	it('インスタンスがすでに存在する場合は新しく生成しないこと', function () {
		var $toggler = $mod.toggler();
		var toggler = $toggler.data('toggler');
		var newToggler = $mod.toggler().data('toggler');
		expect(newToggler).to.be.equal(toggler);
	});
});
