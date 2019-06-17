(function($) {
    $.fn.ndSlider = function(options) {
        var settings = $.extend({
            'ratio': '16:9',
            'waitInterval': 5000,
            'animationInterval': 500,
            'backgroundColor': '#000000',
            'showNavigation': true,
            'navigationItemColor': '#ffffff',
            'navigationItemActiveColor': '#cb0000',
            'navigationBackgroundColor': 'rgba(0,0,0,0.5)',
            'randomStart': true
        }, options);

        var changeSliderItem = function (slider, fromValue, toValue) {
            if (fromValue == toValue)
                return;
            slider.children('.ndSlider-Item:eq('+fromValue+')').css('z-index', 2);
            slider.children('.ndSlider-Item:not(:eq('+fromValue+'))').css('z-index', 0);
            slider.children('.ndSlider-Item:eq('+toValue+')').css('z-index', 1);
            slider.children('.ndSlider-Item:eq('+fromValue+')').fadeTo(
                settings.animationInterval,
                0,
                function() {
                    $(this).css('z-index', 0);
                    $(this).css('opacity', 100);
                }
            );
        }

        var changeSliderNavigation = function (sliderNavigation, toValue) {
            sliderNavigation.children('span').css('background-color', settings.navigationItemColor);
            sliderNavigation.children('span:eq('+toValue+')').css('background-color', settings.navigationItemActiveColor);
        }

        return this.each(function(i) {
            var slider = $(this);
            var slides = slider.children('div');

            slider.hide();

            slider.addClass('ndSlider');
            slides.addClass('ndSlider-Item');

            slider.css('background-color', settings.backgroundColor);
            slides.css('background-color', settings.backgroundColor);

            if (settings.ratio != null) {
                var ratio = settings.ratio.split(':');
                slider.css({
                    'width': '100%',
                    'padding-top': ((100*ratio[1])/ratio[0])+'%'
                });
            } else {
                slider.css({
                    'width': '100%',
                    'height': '100%',
                    'padding-top': 0
                })
            }

            if (slides.length>1) {
                // create navigations
                if (settings.showNavigation) {
                    var navigation = '<div class="ndSlider-Navigation">';
                    for(i=0; i<slides.length; i++)
                        navigation += '<span></span>';
                    navigation += '</div>'
                    slider.append(navigation);
                }
                navigation = slider.children('.ndSlider-Navigation');
                navigation.css('background-color', settings.navigationBackgroundColor);
                navigation.children('span').css('background-color', settings.navigationItemColor);

                var start = settings.randomStart ? Math.floor(Math.random()*slides.length) : 0;

                //ini!
                slider.children('.ndSlider-Item:eq('+start+')').css('z-index', 2);
                slider.children('.ndSlider-Item:not(:eq('+start+'))').css('z-index', 0);
                changeSliderNavigation(navigation, start);

                var cycler = new ndCycler(
                    slides.length,
                    start,
                    settings.waitInterval,
                    function(fromValue, toValue) {
                        changeSliderNavigation(navigation, toValue);
                        changeSliderItem(slider, fromValue, toValue);
                    });

                slider.on('click', '.ndSlider-Navigation > span', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    cycler.change($(this).index());
                });

                cycler.start();
            }

            slider.show();
            return $(this);
        });
    };
})(jQuery);