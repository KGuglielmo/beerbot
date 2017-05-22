"use strict";

module.exports = function (context, name) {
    context.res = {
        attachments: [
            {
                fallback: "Cheers to you, " + name + "!",
                text: "Cheers to you, " + name + "!",
                image_url: "https://thechive.files.wordpress.com/2017/02/cheers_lead.jpg?quality=85&strip=info"
            }
        ]
    };
    context.done();
};