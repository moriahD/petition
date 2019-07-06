//#signature is id of canvas
// var dataURL = signature.toDataURL();
var signature = $("#signature");
var mousedown = false;
var pos = {};
function setPosition(e) {
    pos.x = e.clientX - c.canvas.offsetLeft;
    pos.y = e.clientY - c.canvas.offsetTop;
}
var signatureElement = document.getElementById("signature");
var c = signatureElement.getContext("2d");

c.width = 500;
c.height = 300;

console.log("mouse writing");
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
        c.beginPath();
        c.moveTo(pos.x, pos.y); // from
        setPosition(e);
        c.lineTo(pos.x, pos.y);
        console.log("position inside mousemove, mousedown: ", pos.x, pos.y);
        c.stroke();
    }
});
