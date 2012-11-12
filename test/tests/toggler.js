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

				'<div class="mod-toggleUnit opened">',
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


	/**
	 * Toggler
	 */
	describe('Toggler', function () {

		/**
		 * _eventify()
		 */
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

			context('data-toggler-targetがある場合', function () {
				it('呼び出すメソッドに引数として値を渡すこと', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var $openBtn   = toggler.$el.find('[data-toggler-btn="open"]');
					var stubOpen   = sinon.stub(toggler, 'open');

					$openBtn.attr('data-toggler-target', 'testtarget');
					$openBtn.trigger('click');

					expect(stubOpen.calledWith('testtarget')).to.be.ok();
				});

				it('data-tggler-target属性はあるが値がセットされてない時');
			});
		});


		/**
		 * init()
		 */
		describe('init()', function () {
			it('HTMLにoptions.openedClassNameがついてたら開いておくこと', function () {
				var $toggler = $mod.eq(0);
				$toggler.addClass('opened');
				var toggler = $toggler.toggler().data('toggler');
				var state = toggler.$contents.data('toggler:state');

				expect(toggler.$contents.css('display')).to.not.be.equal('none');
				expect(state).to.be.equal('opened');
				expect($toggler.attr('class')).to.contain('opened');
				expect($toggler.attr('class')).to.not.contain('closed');
			});

			context('HTMLにoptions.openedClassNameのclassがついていなかった場合', function () {
				it('コンテンツごとに opened-id の class が付いてれば開き付いてなければ閉じる', function () {
					var $toggler = $mod.eq(0);

					$toggler.removeClass('opened');
					$toggler.append('<div data-toggler-contents="test"/>');
					$toggler.append('<div data-toggler-contents="test2"/>');
					$toggler.addClass('opened-test');

					var toggler = $toggler.toggler().data('toggler');
					var state0 = toggler.$contents.eq(0).data('toggler:state');
					var state1 = toggler.$contents.eq(1).data('toggler:state');
					var state2 = toggler.$contents.eq(2).data('toggler:state');

					expect(state0).to.be.equal('closed');
					expect(state1).to.be.equal('opened');
					expect(state2).to.be.equal('closed');

					expect(toggler.$contents.eq(0).css('display')).to.be.equal('none');
					expect(toggler.$contents.eq(1).css('display')).to.not.be.equal('none');
					expect(toggler.$contents.eq(2).css('display')).to.be.equal('none');

					expect(/closed |closed$/.test($toggler.attr('class'))).to.not.be.ok();
					expect(/opened |opened$/.test($toggler.attr('class'))).to.be.ok();
				});

				it('開く指定がひとつもなければ閉じておく', function () {
					var $toggler = $mod.eq(0);

					$toggler.removeClass('opened');
					$toggler.append('<div data-toggler-contents="test"/>');
					$toggler.append('<div data-toggler-contents="test2"/>');

					var toggler = $toggler.toggler().data('toggler');
					var state0 = toggler.$contents.eq(0).data('toggler:state');
					var state1 = toggler.$contents.eq(1).data('toggler:state');
					var state2 = toggler.$contents.eq(2).data('toggler:state');

					expect(state0).to.be.equal('closed');
					expect(state1).to.be.equal('closed');
					expect(state2).to.be.equal('closed');

					expect(toggler.$contents.eq(0).css('display')).to.be.equal('none');
					expect(toggler.$contents.eq(1).css('display')).to.be.equal('none');
					expect(toggler.$contents.eq(2).css('display')).to.be.equal('none');

					expect(/closed |closed$/.test($toggler.attr('class'))).to.be.ok();
					expect(/opened |opened$/.test($toggler.attr('class'))).to.not.be.ok();
				});
			});
		});


		/**
		 * updateStateClass()
		 */
		describe('updateStateClass()', function () {
			it('各コンテンツごとにstateがopenedだったらopened-idのclassをつけること', function () {
				var $toggler = $mod.eq(0);
				$toggler.append('<div data-toggler-contents="test"/>');
				var toggler = $toggler.toggler().data('toggler');
				var $test = toggler.$contents.filter('[data-toggler-contents="test"]');
				$test.data('toggler:state', 'opened');
				toggler.updateStateClass();
				expect($toggler.attr('class')).to.contain('opened-test');
			});

			it('各コンテンツごとにstateがclosedだったらclosed-idのclassをつけること', function () {
				var $toggler = $mod.eq(0);
				$toggler.append('<div data-toggler-contents="test"/>');
				var toggler = $toggler.toggler().data('toggler');
				var $test = toggler.$contents.filter('[data-toggler-contents="test"]');
				$test.data('toggler:state', 'closed');
				toggler.updateStateClass();
				expect($toggler.attr('class')).to.contain('closed-test');
			});

			it('開いてる状態のコンテンツがひとつでもあったらopenedにすること', function () {
				var $toggler = $mod.eq(0);
				$toggler.append('<div data-toggler-contents="test"/>');
				var toggler = $toggler.toggler().data('toggler');
				var $test = toggler.$contents.filter('[data-toggler-contents="test"]');
				$test.data('toggler:state', 'opened');
				toggler.updateStateClass();
				expect(/opened | opened$/.test($toggler.attr('class'))).to.be.ok();
			});

			it('開いてる状態のコンテンツがひとつでもあったらclosedはつかないこと', function () {
				var $toggler = $mod.eq(0);
				$toggler.append('<div data-toggler-contents="test"/>');
				var toggler = $toggler.toggler().data('toggler');
				var $test = toggler.$contents.filter('[data-toggler-contents="test"]');
				$test.data('toggler:state', 'opened');
				toggler.updateStateClass();
				expect(/closed | closed$/.test($toggler.attr('class'))).to.not.be.ok();
			});

			it('開いてる状態のコンテンツがひとつもなければclosedがつくこと', function () {
				var $toggler = $mod.eq(0);
				var toggler = $toggler.toggler().data('toggler');
				toggler.$contents.data('toggler:state', 'closed');
				toggler.updateStateClass();
				expect(/closed | closed$/.test($toggler.attr('class'))).to.be.ok();
			});

			it('開いてる状態のコンテンツがひとつもなければopenedはつかないこと', function () {
				var $toggler = $mod.eq(0);
				var toggler = $toggler.toggler().data('toggler');
				toggler.$contents.data('toggler:state', 'closed');
				toggler.updateStateClass();
				expect(/opened | opened$/.test($toggler.attr('class'))).to.not.be.ok();
			});
		});


		/**
		 * filterContents()
		 */
		describe('filterContens()', function () {
			it('引数に渡された値と this.$contents の\
				data-toggler-contents の値が一致するものを返すこと', function () {
				$mod.eq(0).append('<div data-toggler-contents="test">');
				$mod.eq(0).append('<div data-toggler-contents="test">');

				var toggler = $mod.toggler().eq(0).data('toggler');
				var $filterContents = toggler.filterContents('test');

				expect($filterContents).to.have.length(2);
			});

			it('undefined / \'\' が渡されたときは全ての this.$contents を返すこと', function () {
				$mod.eq(0).append('<div data-toggler-contents="test">');
				$mod.eq(0).append('<div data-toggler-contents="test">');

				var toggler = $mod.toggler().eq(0).data('toggler');
				var $filterContents = toggler.filterContents('');

				expect($filterContents).to.have.length(3);

				$filterContents = toggler.filterContents(undefined);
				expect($filterContents).to.have.length(3);
			});
		});


		/**
		 * open()
		 */
		describe('open()', function () {
			it('コンテンツが開くこと', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideDown');

				toggler.open();
				expect(stub.calledOnce).to.be.ok();

				stub.restore();
			});

			it('元々開いてたら再度開かないこと', function () {
				$mod.eq(0).addClass('opened');
				var toggler = $mod.eq(0).toggler().data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideDown');

				toggler.open();
				expect(stub.calledOnce).to.not.be.ok();

				stub.restore();
			});

			it('開いたthis.$contentsのdata(\'toggler:state\')をopenedにすること', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');

				toggler.open();

				expect(toggler.$contents.data('toggler:state')).to.be.equal('opened');
			});

			context('オプションのeffectがslideの場合', function () {
				it('オプションのopenSpeedの値を引数にslideDownが呼ばれること', function () {
					var toggler = $mod.eq(0).toggler({
						effect: 'slide',
						openSpeed: 300
					}).data('toggler');
					var spy = sinon.spy(jQuery.fn, 'slideDown');
					toggler.open();
					expect(spy.calledWith(300)).to.be.ok();
					spy.restore();
				});
			});

			context('オプションのeffectがfadeの場合', function () {
				it('オプションのopenSpeedの値を引数にfadeInが呼ばれること', function () {
					var toggler = $mod.eq(0).toggler({
						effect: 'fade',
						openSpeed: 300
					}).data('toggler');
					var spy = sinon.spy(jQuery.fn, 'fadeIn');
					toggler.open();
					expect(spy.calledWith(300)).to.be.ok();
					spy.restore();
				});
			});


			context('引数targetが渡された場合', function () {
				it('this.$contentsのdata-toggler-contentsの値と一致するものだけ開くこと', function () {
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideDown', function () {
						$(this).data('test', true);
					});

					toggler.open('test');

					expect(toggler.$contents.eq(0).data('test')).to.not.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});
			});

			context('引数がエラーの場合', function () {
				it('undefinedならthis.$contentsが全部開くこと', function () {
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideDown', function () {
						$(this).data('test', true);
					});

					toggler.open(undefined);

					expect(toggler.$contents.eq(0).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});

				it('空のStringならthis.$contentsが全部開くこと', function () {
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideDown', function () {
						$(this).data('test', true);
					});

					toggler.open('');

					expect(toggler.$contents.eq(0).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});
			});

			it('開いたあとに状態を更新すること');

			it('連続でクリックしても大丈夫なこと');
		});


		/**
		 * close()
		 */
		describe('close()', function () {
			it('コンテンツが閉じること', function () {
				$mod.eq(0).addClass('opened');
				var toggler = $mod.eq(0).toggler().data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideUp');

				toggler.close();
				expect(stub.calledOnce).to.be.ok();

				stub.restore();
			});

			it('元々閉じてたら再度閉じないこと', function () {
				var toggler = $mod.eq(0).toggler().data('toggler');
				var stub = sinon.stub(jQuery.fn, 'slideUp');

				toggler.close();
				expect(stub.calledOnce).to.not.be.ok();

				stub.restore();
			});

			it('閉じたthis.$contentsのdata(\'toggler:state\')をclosedにすること', function () {
				var toggler = $mod.toggler().eq(0).data('toggler');

				toggler.close();

				expect(toggler.$contents.data('toggler:state')).to.be.equal('closed');
			});

			context('オプションのeffectがslideの場合', function () {
				it('オプションのcloseSpeedの値を引数にslideUpが呼ばれること', function () {
					$mod.eq(0).addClass('opened');
					var toggler = $mod.eq(0).toggler({
						effect: 'slide',
						closeSpeed: 300
					}).data('toggler');
					var spy = sinon.spy(jQuery.fn, 'slideUp');
					toggler.close();
					expect(spy.calledWith(300)).to.be.ok();
					spy.restore();
				});
			});

			context('オプションのeffectがfadeの場合', function () {
				it('オプションのcloseSpeedの値を引数にfadeOutが呼ばれること', function () {
					$mod.eq(0).addClass('opened');
					var toggler = $mod.eq(0).toggler({
						effect: 'fade',
						closeSpeed: 300
					}).data('toggler');
					var spy = sinon.spy(jQuery.fn, 'fadeOut');
					toggler.close();
					expect(spy.calledWith(300)).to.be.ok();
					spy.restore();
				});
			});


			context('引数targetが渡された場合', function () {
				it('this.$contentsのdata-toggler-contentsの値と一致するものだけ開くこと', function () {
					$mod.eq(0).addClass('opened');
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideUp', function () {
						$(this).data('test', true);
					});

					toggler.close('test');

					expect(toggler.$contents.eq(0).data('test')).to.not.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});
			});

			context('引数がエラーの場合', function () {
				it('undefinedならthis.$contentsが全部閉じること', function () {
					$mod.eq(0).addClass('opened');
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideUp', function () {
						$(this).data('test', true);
					});

					toggler.close(undefined);

					expect(toggler.$contents.eq(0).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});

				it('空のStringならthis.$contentsが全部閉じること', function () {
					$mod.eq(0).addClass('opened');
					$mod.eq(0).append('<div data-toggler-contents="test">');
					$mod.eq(0).append('<div data-toggler-contents="test">');

					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(jQuery.fn, 'slideUp', function () {
						$(this).data('test', true);
					});

					toggler.close('');

					expect(toggler.$contents.eq(0).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(1).data('test')).to.be.equal(true);
					expect(toggler.$contents.eq(2).data('test')).to.be.equal(true);

					stub.restore();
				});
			});

			it('開いたあとに状態を更新すること');

			it('連続でクリックしても大丈夫なこと');
		});


		/**
		 * toggle()
		 */
		describe('toggle()', function () {
			context('開いてたとき', function () {
				it('close()が呼ばれること', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'close');
					toggler.$contents.data('toggler:state', 'opened');
					toggler.toggle();
					expect(stub.calledOnce).to.be.ok();
				});

				it('close()の引数にtoggle()の引数を渡すこと', function () {
					$mod.eq(0).append('<div data-toggler-contents="test"/>');
					var toggler = $mod.eq(0).toggler().data('toggler');
					var stub = sinon.stub(toggler, 'close');
					toggler.$contents.data('toggler:state', 'opened');
					toggler.toggle('test');
					expect(stub.calledWith('test')).to.be.ok();
				});

				it('open()は呼ばれないこと', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'open');
					toggler.$contents.data('toggler:state', 'opened');
					toggler.toggle();
					expect(stub.calledOnce).to.not.be.ok();
				})
			});
			context('閉じてたとき', function () {
				it('open()が呼ばれること', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'open');
					toggler.$contents.data('toggler:state', 'closed');
					toggler.toggle();
					expect(stub.calledOnce).to.be.ok();
				});

				it('open()の引数にtoggle()の引数を渡すこと', function () {
					$mod.eq(0).append('<div data-toggler-contents="test"/>');
					var toggler = $mod.eq(0).toggler().data('toggler');
					var stub = sinon.stub(toggler, 'open');
					toggler.$contents.data('toggler:state', 'closed');
					toggler.toggle('test');
					expect(stub.calledWith('test')).to.be.ok();
				});

				it('close()は呼ばれないこと', function () {
					var toggler = $mod.toggler().eq(0).data('toggler');
					var stub = sinon.stub(toggler, 'close');
					toggler.$contents.data('toggler:state', 'closed');
					toggler.toggle();
					expect(stub.calledOnce).to.not.be.ok();
				})
			});

			it('連続でクリックしても大丈夫なこと');

			it('contentsが復数あるときのstateの扱い的なの');
		});


		describe('state()', function () {
			it('未実装');

			//it('opened|closed|animatingを返すこと', function () {
			//	var toggler = $mod.toggler().eq(0).data('toggler');
			//	var state = toggler.state();
			//	var test = /opened|closed|animating/.test(state);
			//	expect(test).to.be.ok();
			//});

			//it('this._stateの値を返すこと', function () {
			//	var toggler = $mod.toggler().eq(0).data('toggler');
			//	var state = toggler.state();
			//	expect(state).to.be.equal(toggler._state)
			//});

			//it('アニメーション中ならanimatingを返すこと', function () {
			//	var toggler = $mod.toggler().eq(0).data('toggler');
			//	toggler.$contents.show();
			//	toggler.$contents.slideDown(100);
			//	expect(toggler.state()).to.be.equal('animating')
			//});

			//it('アニメーションが終わった後はanimatingを返さないこと', function (done) {
			//	var toggler = $mod.toggler().eq(0).data('toggler');
			//	toggler.$contents.show();
			//	toggler.$contents.slideDown(100, function () {
			//		expect(toggler.state()).to.not.be.equal('animating');
			//		done();
			//	});
			//});
		});
	});
});
