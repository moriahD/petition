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
        c.strokeStyle = "red";
        c.lineWidth = "2";
        c.beginPath();
        c.moveTo(pos.x, pos.y); // from
        setPosition(e);
        c.lineTo(pos.x, pos.y);
        console.log("position inside mousemove, mousedown: ", pos.x, pos.y);
        c.stroke();
        //saving signature as dataURL
        var dataURL = signatureElement.toDataURL();
        $("#sig").val(dataURL);
    }
}); //drawing signature on canvas

//what to do next ?
