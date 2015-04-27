;(function ($) {
    var $window   = $(window);
    var $document = $(document);
    var didScroll = false;
    var scrollPos = 0;

    function noScrollFn() {
        window.scrollTo(scrollPos ? scrollPos.x : 0, scrollPos ? scrollPos.y : 0);
    }

    function noScroll() {
        $window.off('scroll.morphingButton.scrollHandler');
        $window.on('scroll.morphingButton.noScrollFn', noScrollFn);
    }

    function scrollFn() {
        $window.on('scroll.morphingButton.scrollHandler', scrollHandler);
    }

    function canScroll() {
        $window.off('scroll.morphingButton.noScrollFn');
        scrollFn();
    }

    function scrollHandler() {
        if(!didScroll) {
            didScroll = true;
            setTimeout(function() {scrollPage();}, 60);
        }
    }

    function scrollPage() {
        scrollPos = {x : window.pageXOffset || $document[0].scrollLeft, y : window.pageYOffset || $document[0].scrollTop};
        didScroll = false;
    }

    $.fn.extend({
        morphingButton: function (options) {
            return this.each(function () {
                var $this = $(this);
                var $body = $('body');
                var defaults = {
                    noScrollClass: 'noscroll',
                    scrollClass:   'scroll',
                    closeSelector: '.icon-close'
                };

                options = $.extend(defaults, options);

                scrollFn();

                new UIMorphingButton($this[0], {
                    closeEl : options.closeSelector,
                    onBeforeOpen : function() {
                        // don't allow to scroll
                        noScroll();
                    },
                    onAfterOpen : function() {
                        // can scroll again
                        canScroll();
                        // add class "noscroll" to body
                        $body.addClass(options.noScrollClass);
                        // add scroll class to main el
                        $this.addClass(options.scrollClass);
                    },
                    onBeforeClose : function() {
                        // remove class "noscroll" from body
                        $body.removeClass(options.noScrollClass);
                        // remove scroll class from main el
                        $this.removeClass(options.scrollClass);
                        // don't allow to scroll
                        noScroll();
                    },
                    onAfterClose : function() {
                        // can scroll again
                        canScroll();
                    }
                });
            });
        }
    });
})(jQuery);

$('.resultImage').morphingButton();