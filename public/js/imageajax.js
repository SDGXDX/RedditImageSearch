(function() {
    // setup
    'use strict';

    $(document).ready(function() {

        var pCache = {
            // the point of this object is to 'cache' the jQuery internal reference for quick lookup
            // may not matter much, but its extra performance at very little time cost.
            // Plus, it gives me a quick inventory of important page elements.
            $results: $('.results'),
            $searchBtn: $('button'),
            $sortItems: $('.sortItem'),
            $overlay: $('.page-overlay'),

            inputFields: {
                $sub: $('input[name=subreddit]'),
                $search: $('input[name=search]'),
                $restrictYN: $('restrictYN'),
                $resultsNum: $('#resultsNum')
            }

        };


        $('p[name=more-options]').on('click', function() {
            $('.page-overlay').toggleClass('.hidden');
        });


        $.ajaxSetup({dataType: "json", cache: true });


        // NAV class toggle
        pCache.$sortItems.on('click', function () {
            // remove all selected
            pCache.$sortItems.removeClass('selected');
            // dont click through!
            event.preventDefault();
            // TOOOOOOOOGGGGGGGGGGGGGLE!
            $(this).toggleClass('selected');
            });

        var redditSearch = {


            getUrl: function () {
                var u = (
                "http://www.reddit.com/r/" + pCache.inputFields.$sub.val()
                + "/search.json?q=" + pCache.inputFields.$search.val()
                + "&restrict_sr=" + (pCache.inputFields.$restrictYN.val()===true ? 'true' : 'false')
                + "&sort=" + pCache.$sortItems.find(".selected").text().toLowerCase()
                + "&show=all&limit=" + pCache.inputFields.$resultsNum.val()
                );
                console.log(u);
                return u;
            },

            getImages : function() {
               return $.ajax(this.getUrl());
            },


            renderImages : function(rData) {
                /*
                TODO: This is pulling all results and parsing out the images. There should be a way to JUST fetch images.
                 */
                pCache.$results.text('');
                var d = rData.data.children;
                var goodResults = [];
                for (var i = 0, il = d.length; i < il; i++) {
                    // image?
                    if (d[i].data.url.match(/(jpg|gif|png)$/)) {
                        goodResults.push(
                            "<a data-image='" + d[i].data.url + "' href='http://reddit.com" + d[i].data.permalink + "' target='_blank'><img class='result-img' src='" + d[i].data.thumbnail + "' /></a>"
                        );
                    }
                }

                if (goodResults.length > 0) {
                    pCache.$results.hide();
                    pCache.$results.append(goodResults.join(''));
                    pCache.$results.fadeIn(600);
                } else {
                    pCache.$results.append('<h1>No images found.</h1>');

                }


            },
            renderFailed : function(error) {
                pCache.$results.text("Something went wrong. Please try again");
                console.log("Caught error on ajax: %j", error);
            }

        };

        $('#more-options').on('click', function() {
            pCache.$overlay.toggleClass('hidden');
        });

        $('#options-close').on('click', function() {
            pCache.$overlay.toggleClass('hidden');
        });




       // Search! Much cleaner now.

        pCache.$searchBtn.on('click', function () {
            redditSearch.getImages()
                .done(redditSearch.renderImages)
                .fail(redditSearch.renderFailed);
        });

    }); // document.ready
})(); //IIFE


