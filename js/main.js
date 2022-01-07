
// $() aka means GetElementByID!

//Implemented Features:
//"On Scroll", Load Content in a unit by unit format
//Custom Cursor!
//Loading screen that occurs once per session
//My Minecraft server's player count. (Via mcAPI)
//Random message poping up in loading screen
//Typewriter

//Todo:
// Turn on and off rain (Local storage) 

let cursor;
let link;

let loader;
let content;

//Loading screen functions start
function runPageLoader()
{
    setTimeout(() => {
        content.style.display = 'block'
        content.style.opacity = 1;


        fadeOut(loader);
        sessionStorage.setItem("loaded", "true");
        //console.log("loadedin func " + sessionStorage.getItem('loaded'));
    }, 4000);
}

function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        op -= op * 0.1;
    }, 10);
}
//Loading screen functions end

function main() {

    //Typewriter simulation start
    let defaultTypeWriterText = $(".app-picture-text")[0].getElementsByTagName('p')[0].innerHTML;

    let typewriterAnimation = function() {
        var p = $(".app-picture-text")[0].getElementsByTagName('p')[0];
        var displayStr = "";

        var typeOut = setInterval(function() {

            //Type out function, keep adding 1 char at a time till text length reached
            if(displayStr.length < defaultTypeWriterText.length)
                {
                    displayStr += defaultTypeWriterText[displayStr.length];
                    p.innerHTML = displayStr;
                    if(displayStr.length < defaultTypeWriterText.length)
                        p.innerHTML += "_";
                }
            
            //Text length reached
            else
            {
                let interval = 80;
                let msBeforeDeleteText = 1300; //cooldown before delete text starts
                let msCount = 0;

                //Delete char by char until nothing left
                var deleteText = setInterval(function() {
                    msCount += interval;
                    if(msCount >= msBeforeDeleteText)
                    {
                        if(displayStr.length > 0)
                        {
                            displayStr = displayStr.substring(0, displayStr.length-1);
                            p.innerHTML = displayStr + "_";
                        }
                        else
                        {
                            clearInterval(deleteText);

                            //Recalls function when animation is complete as this is suppose to continue endlessly
                            typewriterAnimation();
                        }
                    }
                }, interval);

                clearInterval(typeOut);
            }
        }, 100);
    }
    typewriterAnimation();
    //Type writer simulation end


    //Minecraft server API retrieval start
    let interval = 10000; //milisecs between each call
    let refresher = function() {

        //Using an online proxy OMFG this took way too long. Tried anyorigin but they're DOWN!, 20+ forums on CORS bypass and none gave me the answer jesus christ.
        $.getJSON("https://api.allorigins.win/raw?url=" + encodeURIComponent('https://www.vortexnetwork.me/queries/server?id=1'), 
            function(json) {
                let playerDiv = document.getElementById("players");
                if(playerDiv == null)
                    return;
                if(playerDiv.getElementsByTagName('p').length == 0)
                {
                    for(let i = 0; i < 2; ++i)
                    {
                        playerDiv.appendChild(document.createElement("p"));
                    }
                    playerDiv.getElementsByTagName('p')[0].innerHTML = "Server is Offline!";
                }
                if(json.status_value !== 1)
                {
                    //Server not found/offline
                    playerDiv.getElementsByTagName('p')[0].innerHTML = "Server is Offline!";
                    playerDiv.getElementsByTagName('p')[1].innerHTML = "";
                    playerDiv.style.borderBottom = "solid 3px red";
                    
                }
                else {
                    //Server is online
           
                    playerDiv.getElementsByTagName('p')[0].innerHTML = "Server is Online";
                    playerDiv.getElementsByTagName('p')[1].innerHTML = json.player_count + "/" + json.player_count_max + " Players on the server";
                  
                    playerDiv.style.borderBottom = "solid 3px greenyellow";
                    
                }
            }
        );
    }

    setTimeout(function() {
        refresher();
    },interval);

    refresher(); //Call once on init
    //Minecraft server API retrieval end



    //Loading screen start
    loader = document.querySelector(".loader");
    content = document.querySelector(".pageloaded");
    
    $.getJSON("https://raw.githubusercontent.com/Coolfire02/Y2S1_WEBDEV_A02/master/html/json/quotes.json", function(json)
    {
        let element = document.getElementById("random-load-text");
        if(element != null)
            element.innerHTML = json["quotes"][Math.floor(Math.random() * json["quotes"].length)];
    });

    if(sessionStorage.getItem("loaded") == null)
    {
        runPageLoader();
    }
    else {
        if(content != null && loader != null) { //Code only executes for page that has loading screen
            content.style.display = 'block'
            content.style.opacity = 1;
            loader.style.opacity = 0;
            loader.style.display = 'none';
        }
    }
    //Loading screen end



    //Custom cursor start
    cursor = document.querySelector(".cursor");
    window.addEventListener("mousemove", mouseMoveEvent);
    window.addEventListener("wheel", mouseMoveEvent);
    window.addEventListener("mouseup", mouseUpEvent);
    window.addEventListener("mousedown", mouseDownEvent);
    window.addEventListener("mouseenter", mouseEnterLinkEvent);
    window.addEventListener("mouseleave", mouseLeaveLinkEvent);
    //Custom cursor end

    //On scroll load start
    $(window).on("load", function () {

        $(window).scroll(function () {
            var bottomOfScreen = $(this).scrollTop() + $(this).innerHeight();

            $(".fast-fade").each(function () {
                /* Check the location of each desired element */
                var objectBottom = $(this).offset().top + $(this).outerHeight() / 2.0;

                /* If the element is completely within bounds of the window, fade it in */
                if (objectBottom < bottomOfScreen) { //object comes into view (scrolling down)
                    if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
                } else { //object goes out of view (scrolling up)
                    if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
                }
            });

            $(".slow-fade").each(function () {
                /* Check the location of each desired element */
                var objectBottom = $(this).offset().top + $(this).outerHeight() / 3.0;

                /* If the element is completely within bounds of the window, fade it in */
                if (objectBottom < bottomOfScreen) { //object comes into view (scrolling down)
                    if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
                } else { //object goes out of view (scrolling up)
                    if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
                }
            });

            $(".smooth-fade").each(function () {
                /* Check the location of each desired element */
                var objectBottom = $(this).offset().top + $(this).outerHeight() / 5.0;

                var delayInMilliseconds = 300;
                var obj = $(this);

                /* If the element is completely within bounds of the window, fade it in */
                if (objectBottom < bottomOfScreen) { //object comes into view (scrolling down)
                    setTimeout(function () {
                        if (obj.css("opacity") == 0) { obj.fadeTo(500, 1); }
                    }, delayInMilliseconds);
                } else { //object goes out of view (scrolling up)
                    if (obj.css("opacity") == 1) { obj.fadeTo(10, 0); }
                }


            });

        }).scroll(); //invoke scroll-handler on page-load
    });
    //On scroll load end

}

//Custom cursor functions start
function mouseMoveEvent(e) 
{
    cursor.style.top =  e.pageY + "px";
    cursor.style.left = e.pageX + "px";
}

function mouseUpEvent(e) 
{
    //Reset size back to defaultt
    cursor.style.transform = "translate(-50%, -50%) scale(1)";

    //Check if a link was just clicked
    if(e.target.querySelector("link") != null)
    {
        //Dont need to do animation here since transition css alr defined
        cursor.style.transform = "translate(-50%, -50%) scale(5)";
        cursor.style.opacity = 0;
    }
}

function mouseDownEvent(e)
{
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
}

function mouseEnterLinkEvent(e)
{
    //Viewing some link
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursor.style.borderColor = '#e71d36';
}

function mouseLeaveLinkEvent(e)
{
    //Unview the linkz
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
}
//Custom cursor functions end

//Call init when dom is loaded
document.addEventListener('DOMContentLoaded', main);