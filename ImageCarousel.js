(function(win, doc) {
    /**
     * 图片轮播
     * @param {Array} images 
     * @param {Object} options 
     */
    let ImageCarousel = function(images, options) {
        this.images = images;
        let defaults = {
            target: doc.querySelector("body"),  //目标对象DOM
            showBottomToggle: true,  //是否显示底部切换按钮
            showBottomMenu: true,  //是否显示底部切换菜单
            showSlidesToggle: true,  //是否显示两侧切换按钮
            contentWidth: 800,  //轮播容器宽度
            contentHeight: 600,  //轮播容器高度
            menuBarHeight: options.menuBarHeight ? options.menuBarHeight : 100,  //底部切换菜单高度
            menuBarNum: 8,  //底部切换菜单视窗显示数量
            isAutoToggle: true,  //是否自动切换图片
            animationInterval: 3000  //自动切换图片时间间隔
        };
        this.options = Object.assign({}, defaults, options);
        this.selectedImgIdx = 0;
    }
    /**
     * 图片轮播属性
     */
    ImageCarousel.prototype = {
        /**
         * 初始化函数
         */
        init: function() {
            this.renderDOM();
            this.options.isAutoToggle && this.autoToggle(this.options.animationInterval);
        },

        /**
         * 选中图片改变事件
         * @param {Number} idx 索引
         */
        selectedImgChanged: function(idx) {
            if (!this.isNumber(idx) || (this.isNumber(idx) && (idx < 0 || idx > this.images.length - 1))) {
                return;
            }
            this.selectedImgIdx = idx;
            let url = `url(${this.images[idx]})`;
            this.removeClass(this.getElms("selected", true), "selected");
            this.addClass(this.getElms("item", true)[idx], "selected");
            this.addClass(this.getElms("garaschan-icons-dian", true)[idx], "selected");
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
         * @param {Array} elements element
         * @param {String} 样式名
         */
        removeClass: function(elements, className) {
            if (elements.length === 0) {
                return;
            }
            let len = elements.length;
            for (let i = 0; i < len; i++) {
                let elmClass = elements[0].getAttribute("class").trim();
                if (className && elmClass.indexOf(className) > -1) {
                    elmClass = elmClass.replace(className, "");
                }
                elements[0].setAttribute("class", elmClass.trim());
            }
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
            if (value === '' || value === null) return false;
            return !isNaN(value);
        },

        /**
         * 渲染外层容器
         */
        renderDOM: function() {
            let imageCarouselSize = [
                `width: ${this.options.contentWidth}px`,
                `height: ${this.options.contentHeight}px`
            ]
            //轮播容器
            let imageCarousel = doc.createElement("div");
            imageCarousel.className = "imageCarousel";
            imageCarousel.style = imageCarouselSize.join(";");
            this.options.target.appendChild(imageCarousel);
            //内容显示容器
            let contentHeight = this.options.showBottomMenu ? this.options.contentHeight - this.options.menuBarHeight : this.options.contentHeight;
            let content = doc.createElement("div");
            content.className = "content";
            content.style.height = `${contentHeight}px`;
            imageCarousel.appendChild(content);
            //两侧切换按钮
            this.options.showSlidesToggle && this.creaSidesToggleBtn();
            //底部切换按钮
            this.options.showBottomToggle && this.createBottomToggleBtn();
            //底部切换菜单
            this.options.showBottomMenu && this.createBottomMenuBar();
        },

        /**
         * 创建两侧切换按钮
         */
        creaSidesToggleBtn: function() {
            let content = this.getElms("content");
            let leftToggleButton = doc.createElement("a");
            leftToggleButton.className = "leftToggleButton garaschan-icons-prev";
            leftToggleButton.title = "Prev";
            content.appendChild(leftToggleButton);
            let rightToggleButton = doc.createElement("a");
            rightToggleButton.className = "rightToggleButton garaschan-icons-next";
            rightToggleButton.title = "Next";
            content.appendChild(rightToggleButton);
            leftToggleButton.addEventListener("click", this.sidesToggleClickd.bind(this, 0));
            rightToggleButton.addEventListener("click", this.sidesToggleClickd.bind(this, 1));
        },

        /**
         * 两侧切换按钮点击事件
         */
        sidesToggleClickd: function(type) {
            if (type && this.selectedImgIdx < this.images.length - 1) {
                this.selectedImgChanged(this.selectedImgIdx + 1);
            }
            else if (!type && this.selectedImgIdx > 0) {
                this.selectedImgChanged(this.selectedImgIdx - 1);
            }
        },

        /**
         * 创建底部菜单栏
         */
        createBottomMenuBar: function() {
            let menuBar = doc.createElement("div");
            menuBar.className = "menuBar";
            menuBar.style.height = `${this.options.menuBarHeight}px`;
            this.getElms("imageCarousel").appendChild(menuBar);
            this.addImages(this.images);
            menuBar.addEventListener("mouseover", this.menuBarChanged.bind(this));
        },

        /**
         * 底部菜单改变事件
         */
        menuBarChanged: function(e) {
            let url = e.target.style.backgroundImage;
            if (this.isString(url) && url.trim() !== "") {
                let url1 = url.match(/\("(.+)"\)/)[1];
                let idx = this.images.indexOf(url1);
                this.selectedImgChanged(idx);
            }
        },

        /**
         * 创建底部切换按钮
         */
        createBottomToggleBtn: function() {
            let bottomToggleButton = doc.createElement("ul");
            bottomToggleButton.className = "bottomToggleUl";
            let UIs = [];
            this.images.forEach((img, idx) => {
                UIs.push('<li><a class="garaschan-icons-dian" idx="' + idx + '"></a></li>');
            });
            bottomToggleButton.innerHTML = UIs.join("");
            this.getElms("content").appendChild(bottomToggleButton);
            bottomToggleButton.addEventListener("mouseover", this.bottomToggleChanged.bind(this));
        },

        /**
         * 底部切换按钮改变事件
         */
        bottomToggleChanged: function(e) {
            let idx = e.target.getAttribute("idx");
            if (e.target.tagName === "A" && this.isNumber(idx)) {
                this.selectedImgChanged(idx);
            }
        },

        /**
         * 添加多张图片
         * @param {Array} urls 图片路径数组
         */
        addImages: function(urls) {
            if (this.options.showBottomMenu) {
                urls.forEach((url) => {
                    this.addImage(url);
                });
            }
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
            img.style.width = `${this.options.contentWidth / this.options.menuBarNum}px`;
            img.style.backgroundImage = `url(${url})`;
            this.getElms("menuBar").appendChild(img);
        },

        /**
         * 轮播自动切换
         */
        autoToggle: function(interval){
            let me = this;
            this.getElms("content").timer = setInterval(function() {
                me.selectedImgChanged(me.selectedImgIdx);
                if (me.selectedImgIdx > -1 && me.selectedImgIdx < me.images.length - 1) {
                    me.selectedImgIdx ++;
                }
                else {
                    me.selectedImgIdx = 0;
                }
            }, interval);
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