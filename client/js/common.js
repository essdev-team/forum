"use strict";

function logout() {
    $.ajax({
        url: '/logout',
        type: 'POST',
        contentType: 'application/json', 
        data: JSON.stringify({logout: true})
    }).done(function(data) {
        if (data)
            location.href = '/login';
        else {
            // TODO: display some error message
            console.log(data);
        }
    }).fail(function(err) {
        console.error(err);
    });
}

function subscribe(userid, itemid, isSubscribed, type) {
    $.ajax({
        url: '/action',
        type: 'POST',
        contentType: 'application/json', 
        data: JSON.stringify({userId: userid, itemId: itemid, subscribed: isSubscribed, action:"subscribe", contentType: type})
    }).done(function(data) {
        if (data) {
            // TODO: indicate the success 
            console.log("Successful subscription");
        }
        else {
            // TODO: display some error message
            console.log(data);
        }
    }).fail(function(err) {
        console.error(err);
    });
}

function save(userid, itemid, isSaved, type) {
    $.ajax({
        url: '/action',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({userId: userid, itemId: itemid, saved: isSaved, action:"save", contentType: type})
    }).done(function(data) {
        if (data) {
            // TODO: indicate the success
            console.log("Successful save");
        }
        else {
            // TODO: display some error message
            console.log(data);
        }
    }).fail(function(err) {
        console.error(err);
    });
}

function vote(itemid, voteValue, hasVoted) {
    $.ajax({
        url: '/action',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({itemId: itemid, value: voteValue, voted: hasVoted, action:"vote"})
    }).done(function(data) {
        if (data) {
            // TODO: indicate the success
            console.log("Successful vote");
        }
        else {
            // TODO: display some error message
            console.log(data);
        }
    }).fail(function(err) {
        console.error(err);
    });
}

function reply(parent, text, userid) {
    var content = {requested:"add", type:"comment", parentId: parent, content: text, userId: userid};
    $.ajax({
        url: href,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
    }).done(function(data) {
        if (data) {
            console.log("success");
        }
        else {
            // at some point show "something went wrong" modal
            console.log('empty response');
        }
    }).fail(function(err) {
        // at some point show "something went wrong" modal
        console.log("Something went wrong");
    });
}

/* fillTemplate(template [, strings, used, to, fill, template])
**
**
** This is a basic templating function that can be used to 
** fill a specified template using the template and arguments provided.
** Note that this function should be wrapped around for page-specific
** uses. 
*/
function fillTemplate(template) {
    var completedTemplate = template;
    var replaceThis;
    for (var i=1; i<arguments.length; i++){
        replaceThis = "{" + (i - 1) + "}";
        completedTemplate = completedTemplate.replace(replaceThis, arguments[i]);
    }

    return completedTemplate;
}