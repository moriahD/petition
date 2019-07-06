var signature = $("#signature");
var wrap_signature = $("#wrap_signature");
// var dataURL = signature.toDataURL();
var c = signature.getContext("2d");

var mousedown = false;
signature
    .on("mousedown", function(e) {
        e.preventDefault();
        mousedown = true;
        console.log("mouse down");
    })
    .on("touchstart", function() {
        mousedown = true;
    });
signature
    .on("mouseup", function(e) {
        e.preventDefault();
        mousedown = false;
        console.log("mouse down");
    })
    .on("touchend", function() {
        mousedown = false;
    });

signature.on("mousemove", function() {
    if (mousedown) {
        console.log("mouse writing");
        c.strokeStyle = "black";
        c.lineWidth = "2";
        c.beginPath();
    } else {
    }
});
