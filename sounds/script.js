let x = 0;
let y = 0;


document.querySelector("body").addEventListener("keydown",function(event){
    console.log(event.key);
    if(event.key === "s")
    {
        console.log(document.querySelector(".left-pad").style.marginTop = `${x += 10}px`);
    }
    if(event.key === "w")
    {
        if(x > 0)
        {
            console.log(document.querySelector(".left-pad").style.marginTop = `${x -= 10}px`);
        }
    }
    if(event.key === "ArrowDown")
    {
        console.log(document.querySelector(".right-pad").style.marginTop = `${y += 10}px`);
    }
    if(event.key === "ArrowUp")
    {
        if(y > 0)
        {
            console.log(document.querySelector(".right-pad").style.marginTop = `${y -= 10}px`);
        }
    }
});