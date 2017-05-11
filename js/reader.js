//For a given number:
//STAT+01: 100%
//STAT+02: 100%
//STAT+03: 97.22%
//STAT+04: 91.66%
//STAT+05: 83.33%
//STAT+06: 72.22%
//STAT+07: 58.33%
//STAT+08: 41.66%
//STAT+09: 27.77%
//STAT+10: 16.66%
//STAT+11: 8.33%
//STAT+12: 2.78%

//Basic training: up to 6
//Advanced training: up to 12
//Average stat: 3
//Average easy: Up to difficulty 7
//Average medium: Up to difficulty 10
//Average hard: Up to difficulty 12

$(document).ready(function() {
    $.getJSON("../data/data.json", function(obj) {
        console.log(obj);
        fillText(data.start.text);
    });
    
    function fillText(text) {
        $("#textlayout").empty();
        $("#textlayout").append(text + "<br/>");
        $("#textlayout").scrollTop($("#textlayout")[0].scrollHeight);
    };
});