let myCanvas = document.querySelector("#my-canvas");

myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

const ctx = myCanvas.getContext("2d");

const A = {x: 100, y: 300};
drawDot(A, "A");

const B = {x: 400, y: 100};
drawDot(B, "B");

const orange = {r: 230, g: 150, b: 0};   //rgb values of orange
const blue = {r: 0, g: 70, b: 160};

const lowFrequency = 200;
const highFrequency = 600;
let osc = null;
let audioCtx = null;
myCanvas.addEventListener("click", () => {
    if(audioCtx == null)
    {
        audioCtx = new(AudioContext || webkitAudioContext || window.webkitAudioContext)();   //defining audios for different browser control supports.
        osc = audioCtx.createOscillator();
        osc.frequency.value = 200;
        osc.start();

        const node = audioCtx.createGain();
        node.gain.value = 0.1;

        osc.connect(node);
        node.connect(audioCtx.destination);
    }
});

function bubbleShootingAnimation()
{
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

    let seconds = new Date().getTime() / 1000;
    // console.log(seconds);
    let t = (Math.sin(seconds * Math.PI) + 1) / 2;   //gives a pendulum clock with a time period of 2 seconds. t = seconds - Math.floor(seconds) gives a bubble shooting animation effect.

    let C = {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t)
    };
    drawDot(C, "");

    drawDot(A, "A");
    drawDot(B, "B");

    let transitionColor = {
        r: lerp(orange.r, blue.r, t),
        g: lerp(orange.g, blue.g, t),
        b: lerp(orange.b, blue.b, t)
    };
    myCanvas.style.backgroundColor = `rgb(${transitionColor.r}, ${transitionColor.g}, ${transitionColor.b})`;   //this is how the TRANSITION property works in CSS.

    if(osc != null)   //i.e. when the canvas is clicked, the OSC variable is no longer a null variable.
    {
        osc.frequency.value = lerp(lowFrequency, highFrequency, t);
    }

    ctx.strokeStyle = "white";   //for the text animations.
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "bold 40px Arial";
    ctx.setLineDash([lerp(3, 130, t), 130]);   //here 3 specifies the length of a line-dash and 100 specifies the length of a space in between two dashes.
    ctx.strokeText("click for sound", myCanvas.width / 2, 10);
    ctx.setLineDash([]);
    ctx.fillText("click for sound", myCanvas.width / 2, 10);

    requestAnimationFrame(bubbleShootingAnimation);
}
bubbleShootingAnimation(A, B);

function lineOfObjectsInBetween(A, B)
{
    for(let i = 1; i <= 9; i++)
    {
        let t = i / 10;
        let C = {
            x: lerp(A.x, B.x, t), 
            y: lerp(A.y, B.y, t), 
        };
        drawDot(C, "C");
    }
}
// lineOfObjectsInBetween(A, B);

function lerp(a, b, t)
{
    return (a + (b - a) * t);
}

function drawDot(coordinate, label)
{
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.arc(coordinate.x, coordinate.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, coordinate.x, coordinate.y);
}
