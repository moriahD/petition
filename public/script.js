//#signature is id of canvas
// var dataURL = signature.toDataURL();
var signature = $("#signature");
var mousedown = false;
var pos = { x: 0, y: 0 };
function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}
var signatureElement = document.getElementById("signature");
var c = signatureElement.getContext("2d");

console.log(c);
c.strokeStyle = "black";
c.lineWidth = "2";

signature
    .on("mousedown", function(e) {
        e.preventDefault();
        mousedown = true;
        setPosition(e);
        console.log("mouse down");
    })
    .on("touchstart", function() {
        mousedown = true;
    });
signature
    .on("mouseup", function(e) {
        e.preventDefault();
        mousedown = false;
        console.log("mouse up");
    })
    .on("touchend", function() {
        mousedown = false;
    });

signature.on("mousemove", function(e) {
    if (mousedown) {
        console.log("mouse writing");

        c.beginPath();
        c.moveTo(pos.x, pos.y); // from
        setPosition(e);
        c.lineTo(pos.x, pos.y);

        c.stroke();
    } else {
    }
});
