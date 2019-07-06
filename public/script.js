var signature = $("#signature");
var wrap_signature = $("#wrap_signature");
var mousedown = false;

signature.on("mousedown", function(e) {
    e.preventDefault();
    mousedown = true;
    console.log("mouse down");
});

signature.on("mouseup", function(e) {
    e.preventDefault();
    mousedown = false;
    console.log("mouse down");
});

signature.on("mousemove", function() {
    if (mousedown) {
        console.log("mouse writing");
    } else {
        console.log("mouse moving without mousedown");
    }
});
