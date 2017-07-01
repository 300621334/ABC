//Shafiq-Ur-Rehman #300621334
var filePath = "abc.txt";
var urlArray = {};//an object. Never used!!
var i = 0;
var urlArray = [];//an array.
var timeArray = [];
var timeOut;

/*if txt file has blank lines,creates "" ele in arrays.
fullArray[x] !== "" inside if() wasn't filtering & "" were still being inserted!!! 
Probably \r was being pushed as array ele & converted to ""!!!?
Regex \r\n|,  (instead of [\n,] or [\r?\n,] or [\r\n,]) solved issue. If non-windows txt file then put a '?'=> \r?\n|,
\r\n left ONLY true empty strings so fullArray[x] !== "" does work. With other attempts even though console.log showed "" in arrays but those "" were NOT being stopped by fullArray[x] !== "" and were being passed-on into urlArray etc!!! Probably "" had \r inside of them and were NOT considered EMPTY in true sense!!!
http://www.w3schools.com/jsref/jsref_regexp_whitespace.asp
http://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
http://stackoverflow.com/questions/29558519/how-to-split-string-based-on-r-n

/\S/.test(fullArray[x])   to eliminate any array ele that contain white spaces ONLY & no text
http://www.w3schools.com/jsref/jsref_obj_regexp.asp
*/





function readTextFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {//wiring done bforehand to respond to status change AFTER xhr.open/send
        if (xhr.readyState === 4 && xhr.status === 200) {
            var fullArray = xhr.responseText.split(/\r?\n|,/);//response rcvd AFTER xhr.open/send

            console.log(fullArray);


            urlArray = [];//clear any previous ele. So aft UPDATE arrays r rebuilt//don't do this inside for() else only one img remains
            timeArray = [];

            for (var x = 0; x < fullArray.length; x++) {

                if (x % 2 === 0 && fullArray[x] !== "" && /\S/.test(fullArray[x])) //odd item. index# 0,2,4,6,8...
                    urlArray.push(fullArray[x]);

                else if (fullArray[x] !== "" && /\S/.test(fullArray[x]))
                    timeArray.push(fullArray[x]);
            }//for() ends

            console.log(urlArray);
            console.log(timeArray);

            document.getElementById("slideshow").style.marginTop = (screen.height * 0.15) + "px";
            document.getElementsByTagName("footer")[0].style.marginTop = ((screen.height) * 0.40) + "px";

            populate();
        }//outer-if ends
    }//fn ends

    xhr.open("GET", file, true);//true=async
    xhr.send();
}


function fadeEffect() {
    $("#img").fadeTo("fast", 0.01, populate);//(speed,opacity,callBack to this method to go to next img)
}


function populate() {

    while (i < urlArray.length) {
        var image = document.getElementById("img");
        image.src = urlArray[i].trim();//trim coz in txt file comma/or end of line may have space(s) beside em  
        $("#img").fadeTo("fast", 1);//(speed,opacity)//img shows up slowly
        timeOut = setTimeout(fadeEffect, timeArray[i]);//fadeEffect callback populate//img fades away aft this much time=timeArray[i]
        i++;//to go to next img
        if (i === urlArray.length)//if reached beyond LAST img then reset to 1st img(index# 0)
        { i = 0 }
        break;
    }
}


function backBtn() {
    clearTimeout(timeOut);
    $("#img").stop(true, true);//stop fadeTo animation. Remove sth in queue. Complete ongoing animation.
    if (i === 1)//i.e. 1st img is on display while i++ has inc index to 0+1=1
        i = urlArray.length - 1;//display LAST img
    else if (i === 0)//i.e. LAST img is on display
        i = urlArray.length - 2;//show 2nd-to-LAST img
    else
        i = i - 2;//i-1 img is on display while so i-2 is to be shown if back-btn clicked

    fadeEffect();//will callBack populate() in turn
}

//addEventListener("load", function () { readTextFile(filePath); }, false);
$(window).load(function () { readTextFile(filePath); });//access object window eout quotes

//document.getElementById("next").addEventListener("click", function () { clearTimeout(timeOut); fadeEffect(); }, false);
$("#next").click(function () {//access "CSS selector"
    clearTimeout(timeOut);
    $("#img").stop(true, true);//stop animation(fade effect), remove img in queue=true, complete current animation=true//https://api.jquery.com/stop/
    fadeEffect();
});

//document.getElementById("back").addEventListener("click", backBtn, false);
$("#back").click(backBtn);

//document.getElementById("update").addEventListener("click", function () { clearTimeout(timeOut); i = 0; readTextFile(filePath); }, false);
$("#update").click(function () { clearTimeout(timeOut); $("#img").stop(true, true); i = 0; readTextFile(filePath); });
