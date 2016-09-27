$(document).ready(function() {

    // streamObj holds the stream names, set to defaults
    var streamObj = ["freecodecamp", "OgamingSC2", "trumpsc", "ESL_SC2", "cretetion", "storbeck", "RobotCaleb", "habathcx", "noobs2ninjas", "streamerhouse", "StonedYooda", "reynad27", "desertodtv", "plusan", "a_seagull"];


    // This variable has three possible states, 0, 1, or 2
    // It is used to show All, Offline Only, or Online Only
    // 0 corresponds to All, 1 to Offline, 2 to Online
    var show = 0;
    var wait;

    // =============================================================
    // - Primary function to display streams based on user options -
    // =============================================================
    function loadChannels(value, index, ar) {

        // DOM elemetss are created for each stream card based on contents of streamObj
        // Elements are created with classes and IDs for future use
        // If All, load all DOM elements
        if (show === 0) {
            $('#the-end').before("<a id=\'link" + index + "\'- href=# target=\'_blank\'>" +
                "<div class=\'stream col-lg-1 col-md-3 col-xs-6\' id=\'stream" + index + "\'>" +
                "<img class=\'logo\' id=\'logo" + index + "\'><div class=\'overlay\' id=\'overlay" + index + "'\>" +
                "<i class=\'fa fa-close\' id=\'" + index + "\'></i><p></p></div></img>" +
                "<p class=\'title\' id=\'title" + index + "\'></p></div></a>");
        }
        
        // Retrieve the status of each stream first and color bottom of stream card
        // Function runs when promise is fulfilled
        // 'https://api.twitch.tv/kraken/streams/' + value + '?client_id=ppjulqz1cnlk0oo7w3f3tqfkndc1gkh&callback=?'

        $.getJSON('https://api.twitch.tv/kraken/streams/' + value + '?client_id=ppjulqz1cnlk0oo7w3f3tqfkndc1gkh').then( 
            function(status) {
            if (status.stream === null) {
                // if Offline only, create DOM element
                if (show === 1) {
                    $('#the-end').before("<a id=\'link" + index + "\'- href=# target=\'_blank\'>" +
                        "<div class=\'stream col-lg-1 col-md-3 col-xs-6\' id=\'stream" + index + "\'>" +
                        "<img class=\'logo\' id=\'logo" + index + "\'><div class=\'overlay\' id=\'overlay" + index + "'\>" +
                        "<i class=\'fa fa-close\' id=\'" + index + "\'></i></div></img>" +
                        "<p class=\'title\' id=\'title" + index + "\'></p></div></a>");
                }
                $('#stream' + index).css('border-color', '#FF1744');

            } else {
                // if Online only, create DOM element
                if (show === 2) {
                    $('#the-end').before("<a id=\'link" + index + "\'- href=# target=\'_blank\'>" +
                        "<div class=\'stream col-lg-1 col-md-3 col-xs-6\' id=\'stream" + index + "\'>" +
                        "<img class=\'logo\' id=\'logo" + index + "\'><div class=\'overlay\' id=\'overlay" + index + "'\>" +
                        "<i class=\'fa fa-close\' id=\'" + index + "\'></i></div></img>" +
                        "<p class=\'title\' id=\'title" + index + "\'></p></div></a>");
                }
                $('#stream' + index).css('border-color', '#00E676');
            }

            // When the status promise is fulfilled, 
            // retrieve the remaining details for visible cards
            return $.getJSON('https://api.twitch.tv/kraken/channels/' + value + '?client_id=ppjulqz1cnlk0oo7w3f3tqfkndc1gkh');
        }).then(function(channel) {
            $('#title' + index).text(channel.display_name);
            $('#overlay' + index + ' p').html(channel.status);
            if (channel.logo === null) {
                //Placeholder image if no logo is set
                $('#logo' + index).attr('src', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/231853/TwitchHolder.png');
            } else {
                $('#logo' + index).attr('src', channel.logo);
            }
            $('#link' + index).attr('href', channel.url);
        }).then(function() {
          $('.stream').css('opacity', '1');
        }, function() {
          console.log('error');
        });
    }
    // ========================
    // - End primary function -
    // ========================

    streamObj.forEach(loadChannels);
    $('#all').css('background', '#6441A5');

    // #add-button appended after #the-end to ensure correct placement async
    $('#the-end').after("<div class=\'stream col-lg-1 col-md-3 col-xs-6\'" +
        "id=\'add-button\'>+</div>");

    // Toggle show all streams
    $('#all').click(function() {
        if (show !== 0) {
            $('#main').empty();
            $('#main').append("<div id=\'the-end\'</div>");
            show = 0;
            $('#all').css('background', '#6441A5');
            $('#offline').css('background', '');
            $('#online').css('background', '');
            streamObj.forEach(loadChannels);
            $('#the-end').after("<div class=\'stream col-lg-1 col-md-3 col-xs-6\'" +
                "id=\'add-button\'>+</div>");
        }
    });

    // Toggle only offline streams
    $('#offline').click(function() {
        if (show !== 1) {
            $('#main').empty();
            $('#main').append("<div id=\'the-end\'</div>");
            show = 1;
            $('#offline').css('background', 'rgb(255, 23, 68)');
            $('#all').css('background', '');
            $('#online').css('background', '');
            streamObj.forEach(loadChannels);
            $('#the-end').after("<div class=\'stream col-lg-1 col-md-3 col-xs-6\'" +
                "id=\'add-button\'>+</div>");
        }
    });

    // Toggle show only online streams
    $('#online').click(function() {
        if (show !== 2) {
            $('#main').empty(); //Remove all elements
            $('#main').append("<div id=\'the-end\'</div>"); //Add '#the-end' placeholder
            show = 2;
            $('#online').css('background', 'rgb(0, 230, 118)');
            $('#all').css('background', '');
            $('#offline').css('background', '');
            streamObj.forEach(loadChannels);
            //Add button goes after '#the-end'
            $('#the-end').after("<div class=\'stream col-lg-1 col-md-3 col-xs-6\'" +
                "id=\'add-button\'>+</div>");
        }
    });

    // Show the add stream dialog
    $('body').on('click', '#add-button', function() {
        $('.submit-popup').css('opacity', '1');
        $('.submit-popup').css('visibility', 'visible');
        $('#main').css('opacity', '0.3');
        $('#add-stream-text').focus();
        $('#main').css('pointer-events', 'none');
    });

    // Hide the add stream dialog
    $('.submit-popup .fa-close').click(function() {
        $('#add-stream-text').val('');
        $('.submit-popup').css('opacity', '0');
        $('.submit-popup').css('visibility', 'hidden');
        $('#main').css('opacity', '1');
        $('#add-status').text('');
        $('#main').css('pointer-events', 'auto');
    });

    // Allow 'Enter' to click submit
    $("#add-stream-text").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#submit-button").click();
        }
    });

    // Add a stream to the list
    $('#submit-button').click(function() {
        // Check to see if the stream is already in the list
        if (streamObj.indexOf($('#add-stream-text').val().toLowerCase()) !== -1) {
            $('#add-status').text($('#add-stream-text').val() + ' is already in the list.');
            $('#add-stream-text').val('');
        } else {
            // if not, check to see if it is a valid channel name
            $.get('https://api.twitch.tv/kraken/channels/' + $('#add-stream-text').val()).then(function(channel) {
                // If successful, add stream name to streamObj and reload
                streamObj.push($('#add-stream-text').val().toLowerCase());
                $('#main').empty();
                $('#main').append("<div id=\'the-end\'</div>");
                streamObj.forEach(loadChannels);
                $('#the-end').after("<div class=\'stream col-lg-1 col-md-3 col-xs-6\'" +
                    "id=\'add-button\'>+</div>");
                // Reset submission dialog
                $('#add-status').text($('#add-stream-text').val() + ' added successfully!');
                $('#add-stream-text').val('');
                // Display error message if stream doesn't exist
            }, function() {
                $('#add-status').text('Could not find stream ' + $('#add-stream-text').val());
            });
        }
    });

    // Remove a stream from the list
    $('body').on('click', '.overlay .fa-close', function() {
        $('a').attr('href', '#');
        $('a').attr('target', '');
        $('#stream' + $(this).attr('id')).remove();
        streamObj.splice($(this).attr('id'), 1);
    });
});