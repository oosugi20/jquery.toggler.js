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

				'<div class="mod-toggleUnit" data-toggler-init="open">',
					'<a href="#" data-toggler-btn="toggle">開閉</a>',
					'<a href="#" data-toggler-btn="open">開く</a>',
					'<a href="#" data-toggler-btn="close">閉じる</a>',
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

	describe('Event', function () {
		context('ボタンをクリックしたとき', function () {
			describe('トグルボタン', function () {
				context('閉じてる場合', function () {
					it('開くこと');
				});
				context('開いてる場合', function () {
					it('閉じること');
				});
			});

			describe('クローズボタン', function () {
				context('閉じてる場合', function () {
					it('何も起きないこと');
				});
				context('開いてる場合', function () {
					it('閉じること');
				});
			});

			describe('オープンボタン', function () {
				context('閉じてる場合', function () {
					it('開くこと', function () {
						var $toggler = $mod.toggler();
						var $openBtn = $toggler.find('[data-toggler-btn="open"]');
						var toggler = $toggler.data('toggler');
						var spy = sinon.spy(toggler, 'open');
						$openBtn.trigger('click');
						expect(spy.calledOnce).to.be.ok();
					});
				});
				context('開いてる場合', function () {
					it('何も起きないこと');
				});
			});
		});
	});


	describe('Toggler', function () {
		describe('_eventify()', function () {
			it('ボタンクリックでボタンタイプのメソッドが呼ばれること', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var $openBtn   = toggler.$el.find('[data-toggler-btn="open"]');
				var $closeBtn  = toggler.$el.find('[data-toggler-btn="close"]');
				var $toggleBtn = toggler.$el.find('[data-toggler-btn="toggle"]');
				var stubOpen   = sinon.stub(toggler, 'open');
				var stubClose  = sinon.stub(toggler, 'close');
				var stubToggle = sinon.stub(toggler, 'toggle');

				$openBtn.trigger('click');
				$closeBtn.trigger('click');
				$toggleBtn.trigger('click');

				expect(stubOpen.calledOnce).to.be.ok();
				expect(stubClose.calledOnce).to.be.ok();
				expect(stubToggle.calledOnce).to.be.ok();
			});
		});

		describe('init()', function () {
			it('data-toggler-initの値がopenだったら開いておくこと', function () {
				var $toggler = $mod.eq(0);
				$toggler.attr('data-toggler-init', 'open');
				var toggler = $toggler.toggler().data('toggler');
				var state = toggler.state();
				expect(toggler.$contents.css('display')).to.not.be.equal('none');
				expect(state).to.be.equal('opened');
			});

			it('data-toggler-initの値がopen以外だったら閉じておくこと', function () {
				var $toggler = $mod.eq(0);
				$toggler.attr('data-toggler-init', 'close');
				var toggler = $toggler.toggler().data('toggler');
				var state = toggler.state();
				expect(toggler.$contents.css('display')).to.be.equal('none');
				expect(state).to.be.equal('closed');
			});

			it('data-toggler-init属性がなくても閉じておくこと', function () {
				var $toggler = $mod.eq(0);
				$toggler.removeAttr('data-toggler-init');
				var toggler = $toggler.toggler().data('toggler');
				var state = toggler.state();
				expect(toggler.$contents.css('display')).to.be.equal('none');
				expect(state).to.be.equal('closed');
			});
		});

		describe('updateStateClass', function () {
			context('_stateがopenedの場合', function () {
				it('options.openedClassNameをつけること', function () {
					var $toggler = $mod.eq(0);
					var toggler = $toggler.toggler().data('toggler');
					toggler._state = 'opened';
					toggler.updateStateClass();
					expect($toggler.attr('class')).to.contain(toggler.options.openedClassName);
				});
				it('options.closedClassNameを外すこと', function () {
					var $toggler = $mod.eq(0);
					var toggler = $toggler.toggler().data('toggler');
					toggler._state = 'opened';
					toggler.updateStateClass();
					expect($toggler.attr('class')).to.not.contain(toggler.options.closedClassName);
				});
			});

			context('_stateがclosedの場合', function () {
				it('options.closedClassNameをつけること', function () {
					var $toggler = $mod.eq(0);
					var toggler = $toggler.toggler().data('toggler');
					toggler._state = 'closed';
					toggler.updateStateClass();
					expect($toggler.attr('class')).to.contain(toggler.options.closedClassName);
				});
				it('options.openedClassNameを外すこと', function () {
					var $toggler = $mod.eq(0);
					var toggler = $toggler.toggler().data('toggler');
					toggler._state = 'closed';
					toggler.updateStateClass();
					expect($toggler.attr('class')).to.not.contain(toggler.options.openedClassName);
				});
			});
		});

		describe('open()', function () {
			it('コンテンツが開くこと', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideDown');

				toggler.open();
				expect(stub.calledOnce).to.be.ok();

				stub.restore();
			});

			it('開いたあとに状態を更新すること');

			it('連続でクリックしても大丈夫なこと');
		});

		describe('close()', function () {
			it('コンテンツが閉じること', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideUp');

				toggler.close();
				expect(stub.calledOnce).to.be.ok();

				stub.restore();
			});

			it('開いたあとに状態を更新すること');

			it('連続でクリックしても大丈夫なこと');
		});

		describe('toggle()', function () {
			context('開いてたとき', function () {
				it('close()が呼ばれること', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'close');
					var fakeState = sinon.stub(toggler, 'state', function () {
						return 'opened';
					});
					toggler.toggle();
					expect(stub.calledOnce).to.be.ok();
				});
				it('open()は呼ばれないこと', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'open');
					var fakeState = sinon.stub(toggler, 'state', function () {
						return 'opened';
					});
					toggler.toggle();
					expect(stub.calledOnce).to.not.be.ok();
				})
			});
			context('閉じてたとき', function () {
				it('open()が呼ばれること', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'open');
					var fakeState = sinon.stub(toggler, 'state', function () {
						return 'closed';
					});
					toggler.toggle();
					expect(stub.calledOnce).to.be.ok();
				});
				it('close()は呼ばれないこと', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'close');
					var fakeState = sinon.stub(toggler, 'state', function () {
						return 'closed';
					});
					toggler.toggle();
					expect(stub.calledOnce).to.not.be.ok();
				})
			});

			it('連続でクリックしても大丈夫なこと');
		});


		describe('state()', function () {
			it('opened|closed|animatingを返すこと', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var state = toggler.state();
				var test = /opened|closed|animating/.test(state);
				expect(test).to.be.ok();
			});

			it('this._stateの値を返すこと', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var state = toggler.state();
				expect(state).to.be.equal(toggler._state)
			});

			it('アニメーション中ならanimatingを返すこと', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				toggler.$contents.show();
				toggler.$contents.slideDown(100);
				expect(toggler.state()).to.be.equal('animating')
			});

			it('アニメーションが終わった後はanimatingを返さないこと', function (done) {
				var toggler = $mod.toggler().eq(0).data('toggler');
				toggler.$contents.show();
				toggler.$contents.slideDown(100, function () {
					expect(toggler.state()).to.not.be.equal('animating');
					done();
				});
			});
		});
	});
});
