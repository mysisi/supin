	/**
	 * 列表滑动事件
	 * [conSwipe description]
	 * 
	 * M端拖动
	 * var obj = {
	 *           'list' : 内部选择列表,
	 *           'parent' : 外部box,
	 *           'isInteger' : 是否需要停留在整数行
	 *  } 
	 */
	var conSwipe = {
		doSwipe: function(obj) {
			var $ul = obj['list'];
			//conSwipe.isInteger = obj['isInteger'] ? obj['isInteger'] : conSwipe.isInteger;
			var y = obj['y'] || 0;
			$ul.on('touchstart', function(e) {
				this.startY = e.targetTouches[0].screenY;
				this.startTop = this.y || y;
				this.startTime = event.timeStamp; //初始化时间
				this.moved = false; //为了判断是否是点击
				this.scrollerHeight = this.offsetHeight;
				this.maxScrollY = obj['parent'][0].offsetHeight - this.scrollerHeight + 1;

				this._height = this._height || $(this).parent().height() - $(this).find('li').height() * $(this).find('li').length + 1;
				if (obj.isInteger) {
					$(this).find(".selected").removeClass("selected");
				}

				if (this.isInTransition) {
					var matrix = window.getComputedStyle(this, null);
					matrix = matrix['webkitTransform'].split(')')[0].split(', ');
					this.y = matrix[13] || matrix[5];
					this.y = Math.round(this.y);
					this.startTop = Math.round(this.y);
					$(this).css({
						"-webkit-transform": "translate3d(0," + this.y + "px, 0)",
						'-webkit-transition-duration': '0'
					});
					this.isInTransition = false;
				}
			});
			$ul.on('touchmove', function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.moved = true;

				this.y = e.targetTouches[0].screenY - this.startY + this.startTop;

				if (this.y > 0 || this.y < this.maxScrollY) {
					var newY = this.y - (e.targetTouches[0].screenY - this.startY) * 2 / 3;
					this.y = this.y > 0 ? 0 : this.maxScrollY;
					if (newY > 0 || newY < this.maxScrollY) {
						this.y = newY;
					}
					//console.log(e.targetTouches[0].screenY - this.startY)
				}

				$(this).css({
					"-webkit-transform": "translate3d(0," + this.y + "px, 0)",
					'-webkit-transition-duration': '0'
				});
				this.isInTransition = false;
				var timeStamp = event.timeStamp;
				if (timeStamp - this.startTime > 300) {
					this.startTime = timeStamp;
					this.startY = e.targetTouches[0].screenY;
					this.startTop = this.y;
					//console.log(this.startY+' , '+this.startTop)
				}
			});
			$ul.on('touchend', function(e) {
				var dist = e.changedTouches[0].screenY - this.startY;
				this.endTime = event.timeStamp;
				var duration = this.endTime - this.startTime;
				if (this.moved) {
					e.preventDefault();
					e.stopPropagation();
					var newY = Math.round(e.changedTouches[0].screenY);
					this.isInTransition = true;
					if (this.y > 0 || this.y < this.maxScrollY) {
						conSwipe.scrollTo(this, this.y, this.maxScrollY, 600, obj.isInteger);
						return;
					}
					if (duration < 300 || obj.isInteger) {
						var move = conSwipe.calculateMoment(this.y, this.startTop, duration, this.maxScrollY, this.wrapH);
						this.y = move.destination;
						var time = move.duration;
						if (obj.isInteger) {
							this.y = Math.round(this.y / 30) * 30; //30为行高
						}
						$(this).css({
							'-webkit-transform': 'translate3d(0, ' + this.y + 'px, 0)',
							'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
							'-webkit-transition-duration': time + 'ms'
						});
					}
					if (obj.isInteger) {
						if (time) {
							$(this).one('webkitTransitionEnd', function() {
								var pY = $(this).position().top;
								var num = -(pY - 43 - 90) / 30;
								$(this).find("li").eq(num).addClass("selected");
							});
						} else {
							var pY = $(this).position().top;
							var num = -(pY - 43 - 90) / 30;
							$(this).find("li").eq(num).addClass("selected");
						}
					}
					return;
				} else {
					if (obj.isInteger) {
						this.y = this.y || e.changedTouches[0].screenY - this.startY + this.startTop;
						if (this.y % 30) {
							this.y = Math.round(this.y / 30) * 30;
							$(this).css({
								'-webkit-transform': 'translate3d(0, ' + this.y + 'px, 0)',
								'transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
								'-webkit-transition-duration': 0 + 'ms'
							});
						}
						var num = -(this.y - 90) / 30;
						$(this).find("li").eq(num).addClass("selected");
						return;
					}
				}
			});
		},
		scrollTo: function(obj, y, maxY, time, isInteger) {
			if (y > 0 || maxY > 0) {
				y = 0;
			} else if (y < maxY) {
				y = maxY;
			}
			if (isInteger) {
				y = Math.round(y / 30) * 30;
			}
			obj.isInTransition = true;

			$(obj).css({
				'-webkit-transform': 'translate3d(0, ' + y + 'px, 0)',
				'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'-webkit-transition-duration': time + 'ms'
			});
			if (isInteger) {
				$(obj).one('webkitTransitionEnd', function() {
					var pY = $(obj).position().top;
					var num = -(pY - 43 - 90) / 30;
					$(obj).find("li").eq(num).addClass("selected");
				});
			}
		},
		calculateMoment: function(current, start, time, lowerMargin, wrapperSize) {
			var distance = current - start,
				speed = Math.abs(distance) / time,
				destination,
				duration;

			deceleration = 0.0006;
			destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
			duration = speed / deceleration;

			if (destination < lowerMargin) {
				destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if (destination > 0) {
				destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			}
		},
		initPos: function(obj) {
			var $ul = obj['list'];
			var moveNum = obj['num'];
			var y = -moveNum * 30;
			$ul.find("li").eq(moveNum + 3).addClass("selected");
			$ul.css({
				'-webkit-transform': 'translate3d(0, ' + y + 'px, 0)',
				'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'-webkit-transition-duration': 0 + 'ms'
			});
		}
	};
