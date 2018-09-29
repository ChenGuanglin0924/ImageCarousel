(function(win, doc) {
    /**
     * ImageCarousel
     * @param {Array} images 
     * @param {Object} options 
     */
    let ImageCarousel = function(images, options) {
        this.images = images;
        let defaults = {
            target: doc.querySelector("body"),
            showToggleButton: true
        };
        this.options = Object.assign({}, defaults, options);
    }
    ImageCarousel.prototype = {
        /**
         * 初始化函数
         */
        init: function() {
            this.renderDOM();
            
            this.addImages(this.images);

            this.bindEvents();
        },

        /**
         * 绑定事件
         */
        bindEvents: function() {
            this.getElms("menuBar").addEventListener("mouseover", this.selectedImgChanged.bind(this));
        },

        /**
         * 选中图片改变事件
         * @param {*} e 索引、事件源对象、DOM元素
         */
        selectedImgChanged: function(e) {
            let url = "";
            if (this.isNumber(e)) {
                //e为当前图片在images数组中的索引
                url = `url(${this.images[e]})`;
                this.removeClass(this.getElms("selected"), "selected");
                this.addClass(this.getElms("item", true)[e], "selected");
            }
            else {
                //e为鼠标移动时的源对象或传入DOM元素
                let img = e.target || e;
                if (img.className !== "item") {
                    return;
                }
                url = img.style.backgroundImage;
                this.removeClass(this.getElms("selected"), "selected");
                this.addClass(img, "selected");
            }
            this.getElms("content").style.backgroundImage = url;
        },

        /**
         * 添加样式
         * @param {Element} element element
         * @param {String} 样式名
         */
        addClass: function(element, className) {
            if (!element) {
                return;
            }
            let elmClass = element.getAttribute("class");
            if (className && elmClass.indexOf(className) < 0) {
                elmClass += ` ${className}`;
            }
            element.setAttribute("class", elmClass.trim());
        },

        /**
         * 移除样式
         * @param {Element} element element
         * @param {String} 样式名
         */
        removeClass: function(element, className) {
            if (!element) {
                return;
            }
            let elmClass = element.getAttribute("class").trim();
            if (className && elmClass.indexOf(className) > -1) {
                elmClass = elmClass.replace(className, "");
            }
            element.setAttribute("class", elmClass.trim());
        },

        /**
         * 切换样式
         * @param {Element} element element
         * @param {String} 样式名
         */
        toggleClass: function(element, className) {
            if (!element) {
                return;
            }
            let elmClass = element.getAttribute("class").trim();
            if (className && elmClass.indexOf(className) < 0) {
                elmClass += ` ${className}`;
            } else {
                elmClass = elmClass.replace(className, "");
            }
            element.setAttribute("class", elmClass.trim());
        },

        /**
         * 是否为字符串
         * @param {*} value
         * @returns {Boolean}
         */
        isString: function(value) {
            return (typeof value == 'string') && value.constructor == String;
        },

        /**
         * 检测数据是否为number
         * @param {*} value
         * @returns {Boolean}
         */
        isNumber: (value) => {
            if (value === '') return false;
            let mdata = Number(value);
            if (mdata === 0) return true;
            return !isNaN(mdata);
        },

        /**
         * 渲染外层容器
         */
        renderDOM: function() {
            //轮播容器
            let imageCarousel = doc.createElement("div");
            imageCarousel.className = "imageCarousel";
            this.options.target.appendChild(imageCarousel);
            //显示容器
            let content = doc.createElement("div");
            content.className = "content";
            imageCarousel.appendChild(content);
            //切换菜单容器
            let menuBar = doc.createElement("div");
            menuBar.className = "menuBar"
            imageCarousel.appendChild(menuBar);
            //切换按钮
            let leftToggleButton = doc.createElement("a");
            leftToggleButton.className = "leftToggleButton";
            leftToggleButton.innerText = "<";
            content.appendChild(leftToggleButton);
            let rightToggleButton = doc.createElement("a");
            rightToggleButton.className = "rightToggleButton";
            rightToggleButton.innerText = ">";
            content.appendChild(rightToggleButton);
        },

        /**
         * 添加多张图片
         * @param {Array} urls 图片路径数组
         */
        addImages: function(urls) {
            urls.forEach((url) => {
                this.addImage(url);
            });
            //默认选中第一张图片
            this.selectedImgChanged(0);
        },

        /**
         * 添加单张图片
         * @param {String} url 图片路径
         */
        addImage: function(url) {
            let img = doc.createElement("div");
            img.className = "item";
            // img.src = url;
            img.style.backgroundImage = `url(${url})`;
            this.getElms("menuBar").appendChild(img);
        },

        /**
         * 初始化滚动条
         */
        resizeScroll: function() {
            if(this.uiInfs.length === 4) {
                /* 真实dom 渲染结束  */
                //判断浏览器
                let isIE = navigator.userAgent.match(/MSIE (\d)/i);
                isIE = isIE ? isIE[1] : undefined;
                let isFF = /FireFox/i.test(navigator.userAgent);
    
                let container = this.refs.layerTypes;
                let slider = this.refs.slider;
                let sliderBg = this.refs.sliderBg;
    
                if (isIE < 9) //传统浏览器使用MouseWheel事件
                {
                    container.attachEvent("onmousewheel", function (e) {
                        //计算鼠标滚轮滚动的距离
                        let v = e.wheelDelta / 2;
                        container.scrollLeft += v;
                        slider.style.marginLeft = container.scrollLeft +'px';
                        //阻止浏览器默认方法
                        return false;
                    });
                }
                else if (!isFF) //除火狐外的现代浏览器也使用MouseWheel事件
                {
                    container.addEventListener("mousewheel", function (e) {
                        //计算鼠标滚轮滚动的距离
                        let v = -e.wheelDelta / 2;
                        container.scrollLeft += v;
                        slider.style.marginLeft = container.scrollLeft +'px';
                        //阻止浏览器默认方法
                        e.preventDefault();
                    }, false);
                }
                else //火狐使用DOMMouseScroll事件
                {
                    container.addEventListener("DOMMouseScroll", function (e) {
                        //计算鼠标滚轮滚动的距离
                        container.scrollLeft += e.detail * 80;
                        slider.style.marginLeft = container.scrollLeft +'px';
                        //阻止浏览器默认方法
                        e.preventDefault();
                    }, false);
                    
                }
                //点击和拖动事件  IE11、Chrome和Firefox测试OK
                sliderBg.onmousedown = function(e) {
                    //判断鼠标点击元素  slider则为拖动，slider-bg则为点击
                    if(e.target.className === "slider-bg") {
                        let xLeft = e.clientX - 76;  //76为sliderBg相对于屏幕左侧的距离
                        if(xLeft < sliderBg.offsetWidth - slider.offsetWidth) {
                            container.scrollLeft = xLeft;
                        }
                        else if(xLeft < sliderBg.offsetWidth) {
                            container.scrollLeft = xLeft - slider.offsetWidth;
                        }
                        slider.style.marginLeft = container.scrollLeft +'px';
                    }
                    else {
                        //阻止浏览器默认方法
                        e.preventDefault();
                        let left = e.clientX - slider.offsetLeft;
                        document.onmousemove = function(e) {
                            var xLeft = e.clientX - left;
                            if (xLeft <= 0) {
                                xLeft = 0;
                            };
                            if (xLeft >= sliderBg.clientWidth - slider.clientWidth) {
                                xLeft = sliderBg.clientWidth - slider.clientWidth;
                            };
                            slider.style.marginLeft = xLeft + 'px';
                            container.scrollLeft = xLeft;
                        }
                        document.onmouseup = function (){
                            document.onmousemove = null;
                        }
                    }
                }
            }
        },

        /**
         * 根据类名获取元素
         * @param {String} filter Class
         * @param {Boolean} isAll 是否取整个集合
         */
        getElms: function(filter, isAll) {
            if (!this.isString(filter)) {
                return null;
            }
            return isAll ? 
                this.options.target.getElementsByClassName(filter) : 
                this.options.target.getElementsByClassName(filter)[0];
        }

    }
    //将ImageCarousel挂载在window全局
    window.ImageCarousel = ImageCarousel;
}(window, document))