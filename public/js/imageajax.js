(function() {
    // setup
    'use strict';

    $(document).ready(function() {

        $('p[name=more-options]').on('click', function() {
            $('.page-overlay').toggleClass('.hidden');
        });


        $.ajaxSetup({dataType: "json"});
        var $sortItem = $('.sortItem');

        // NAV class toggle
        $('.sortItem').on('click', function () {
            // remove all selected
            $sortItem.removeClass('selected');
            // dont click through!
            event.preventDefault();
            // TOOOOOOOOGGGGGGGGGGGGGLE!
            $(this).toggleClass('selected');
            });


    // REFACTORED for cleaner code.
    /*
        I'm not chaining promises, or anything complex so jQuery's normal promise will work.
        For more complex stuff, like multiple callbacks, Q.js would be a better choice.
    */
        var pCache = {
            // the point of this object is to 'cache' the jQuery internal reference for quick lookup
            // may not matter much, but its extra performance at very little time cost.
            // Plus, it gives me a quick inventory of important page elements.

            $results: $('.results'),
            $sub: $('input[name=subreddit]'),
            //$sub: document.querySelector('[name=subreddit]'),
            $search: $('input[name=search]'),
            $sortItems: $('.sortItem'),
            $overlay: $('.page-overlay'),
            $restrictYN: $('restrictYN'), //TODO: Radiobutton cache
            $resultsNum: $('#resultsNum')

        };

        var redditSearch = {

            getUrl : function() {
                var u = (
                "http://www.reddit.com/r/" + pCache.$sub.val()
                + "/search.json?q=" + pCache.$search.val()
                + "&restrict_sr=" + "true"  //TODO: Pull value from Restrict subreddit radio
                + "&sort=" + $('.sortItem.selected').text().toLowerCase() //TODO: Refactor this? set name attributes and use that?
                + "&show=all&limit=" + pCache.$resultsNum.val()
                );
                console.log(u);
                return u;
            },

            getImages : function() {
               return $.ajax(this.getUrl());
            },


            renderImages : function(rData) {

                pCache.$results.text('');
                var d = rData.data.children;
                var goodResults = [];
                for (var i = 0, il = d.length; i < il; i++) {
                    // image?
                    if (d[i].data.url.match(/(jpg|gif|png)$/)) {
                        goodResults.push(
                            //TODO: Add data tag with real image URL for hover
                            "<a data-image='" + d[i].data.url + "' href='http://reddit.com" + d[i].data.permalink + "' target='_blank'><img class='result_img' src='" + d[i].data.thumbnail + "' /></a>"
                        );
                    }
                }

                if (goodResults.length > 0) {
                    pCache.$results.append(goodResults.join(''));
                    pCache.$results.fadeIn(2000);
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

        $('#searchBtn').on('click', function () {
            redditSearch.getImages()
                .done(redditSearch.renderImages)
                .fail(redditSearch.renderFailed);



        });
    }); // document.ready
})(); //IIFE


