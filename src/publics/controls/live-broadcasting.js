'use strict'

//Shoplive JS Files
window.onload = function (s,h,o,p,l,i,v,e) {
    s["ShoplivePlayer"]=l;
    (s[l]=s[l]||function(){(s[l].q=s[l].q||[]).push(arguments);}),
    (i=h.createElement(o)),
    (v=h.getElementsByTagName(o)[0]);
    i.async=1;
    i.src=p;
    v.parentNode.insertBefore(i,v);
}(window,document,'script','https://static.shoplive.cloud/live.js', 'mplayer');

var target = null;
var idClass = document.getElementsByClassName('xans-member-var-id');
if (idClass && idClass.length > 0) {
    target = document.getElementsByClassName('xans-member-var-id')[0];
}
if (target) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var id = mutation.target.textContent;
            var name = document.getElementsByClassName('xans-member-var-name')[0].innerHTML;
            // 1회 campaign key : c7869f3ad6e2
            mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', '2f94ea8714c9', {userId: id, userName: name}, {
                messageCallback: {
                    CLICK_PRODUCT: function(payload) {
                        window.open(payload.url, '_blank');
                    }
                },
                ui: {
                    optionButton: true
                }
            });
            mplayer("run", "shoplive_mmz");
        });
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
} else {
    // 1회 campaign key : c7869f3ad6e2
    mplayer('init', 'XNuOemxWb5GD5mTBA2Hl', '2f94ea8714c9', '', {
        messageCallback: {
            CLICK_PRODUCT: function(payload) {
                window.open(payload.url, '_blank');
            }
        },
        ui: {
            optionButton: true
        }
    });
    mplayer("run", "shoplive_mmz");
}