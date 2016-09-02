$(function() {
    var $title = 'CSRF DEMO';

    document.title = $title;

    $('h1[name="loginTitle"]').text($title);

    var actionUrl = window.location.pathname;

    $('form[name="loginForm"]').attr('action', actionUrl);

    var loginStatus = window.location.search;

    if (loginStatus === '?error') {
        $('div[name="loginStatus"]').text('Username or Password error!');
        $('div[name="loginStatus"]').css('color', '#FFEBEE');
    } else if (loginStatus === '?logout') {
        $('div[name="loginStatus"]').text('Logout succeed!');
    }

    fetchXSRF(function (token) {
        $('input[name=_csrf]').val(token);
    });
    
    $('input[type!=password]').blur(function () {
        $(this).val(safe_tags_replace($(this).val()) );
    });
    $('form[name=loginForm]').submit( function(event) {
        var token = $('input[name=_csrf]').val();
        var $csrf = $('input[name=_csrf]');
        var $username=$('input[name=username]');
        var $password=$('input[name=password]');
        $username.val(safe_tags_replace($username.val()) );
        $password.val(safe_tags_replace($password.val()) );
        $csrf.val( safe_tags_replace(token) );
    });
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"':'&quot',
        '\'': '&#x27',
        '/':'&#x2F'
    };

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }
    function safe_tags_replace(str) {
        return str.replace(/[&<>"'/]/g, replaceTag);
    }
    // function getCookie(cname) {
    //     var name = cname + "=";
    //     var ca = document.cookie.split(';');
    //     for (var i = 0; i < ca.length; i++) {
    //         var c = ca[i];
    //         while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //         }
    //         if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //         }
    //     }
    //     return "";
    // }
    function fetchXSRF (callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (callback && typeof callback === 'function') {
                    callback(request.getResponseHeader('X-XSRF-TOKEN'));
                    //callback(request.getAllResponseHeaders());
                }
            }
        };
        request.open('HEAD', document.location, true);
        request.send(null);
    }

    //  For CSRF  Non-Redirect Action Testing
    // $('form[name=loginForm]').submit( function(event) {
    //     /* stop form from submitting normally */
    //     event.preventDefault();
    //     var header = $("meta[name='_csrf_header']").attr("content");
    //     var token = $("meta[name='_csrf']").attr("content");
    //     console.log(header + token );
    //     var $form = $( this ), urls = $form.attr( 'action' );

    //     $.ajax({
    //         url: urls,
    //         type: 'POST',
    //         beforeSend: function(xhr){
    //             xhr.setRequestHeader(header, token);
    //         },
    //         headers: {
    //             "X-XSRF-TOKEN": token
    //         },
    //         data: {username: $('#username').val() , password: $('#password').val() },//$('form[name="loginForm"]').serialize() ,
    //         success: function(data) {
    //             console.log(data);
    //         },
    //         error: function (xhr, ajaxOptions) {
    //             console.log(xhr.status + ": " );
    //         }
    //     });
    // });

});
   //analytics users
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-47166353-3', 'auto');
  ga('send', 'pageview');