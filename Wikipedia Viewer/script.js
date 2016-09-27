/*
$.ajax({
    url: apiUrl,
    dataType: "jsonp",
    method: 'GET',
}).done(function(data) {
    console.log(data);
}).fail(function(err) {
    throw err;
    console.log("Current Weather cannot be loaded");
});    
*/

$(document).ready(function() {
    
    // particlesJS.load(@dom-id, @path-json, @callback (optional));

    particlesJS.load('particles-js', 'config.json', function() {
        console.log('callback - particles.js config loaded');
    });

    // JQuery ui function. generates list from wikipedia GET request 
    
    $("#search-wiki").autocomplete({
        
        source: function(request, response) {
            $.ajax({
                url: "http://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                }
            }).done(function(data) {
                console.log(data);
                response(data[1]);
            });        
        }, 
    });
    
    // Refresh list of wikipedia entries

    function displayWikiList(data) {
        $(".results").html("");
        for (var item in data) {
            $(".results").append(
                "<a href='" + data[item].fullurl  + "'>"+
                    "<div class='def panel panel-default'>" +
                        "<div class='panel-heading entry-title'><h3>" + data[item].displaytitle + "</h3></div>" +
                        "<div class='snippet panel-body'>" + data[item].extract + "</div>" +
                    "</div>" +
                "</a>"
            )
        }
    }

    // Allow 'Enter' to click submit
    
    $("#search-wiki").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#search-wiki").autocomplete("close");
            $(".btn-search").click();
        }
    });
    
    // User hit button "Search"

    $(".btn-search").click(function() {
        var searchTerm = $("#search-wiki").val();
        console.log(searchTerm);
        var wikiResponse = $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info|pageimages&format=json&exlimit=8&exintro=" +
            "&explaintext=&exsectionformat=plain&inprop=url%7Cdisplaytitle&generator=search&exsentences=2&gsrsearch=" + searchTerm,
            dataType: 'jsonp',
            type: 'GET',
        });

        // When JSON comes back from wikipedia, refresh the list of wikipedia entries on the page
        wikiResponse.done(function(data) {
            console.log(data);
            displayWikiList(data.query.pages)
        });
    });
});




