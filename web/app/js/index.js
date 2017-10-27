'use strict';
$(function() {
    var logoutLink = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/auth/login.html?logout';
    console.log(logoutLink);
    $('form[name="logoutForm"]').attr('action', logoutLink);

});