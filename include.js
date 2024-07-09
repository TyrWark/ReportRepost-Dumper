// ORDER OF OPERATIONS

/*
1. Listeners are attached. Ignition checks to see if the iFrame has loaded. If it has, fire Starter

2. Starter creates the input boxes. Then removes the iFrame
  2a. The iFrame passes up the Full Expanded Url of itself up to main. Listeners then passes those into an Array
  2b. GetKeys pushes message array gotten from the listeners into a Map, then fetches specific Keys

3. The Inputs include a new button, once selected, that fires Engine V2

4. EngineV2 grabs all the values found in the inputs, then modifies the Full Expanded URL based on the selections. It then pops a tab of the Full Expanded URL
  4a. The popped window then passes back the Query URL back to main into the Map and suicides

5. EngineV2 then fires the fetch request using the Query URL, the provided Name/Desc

 */



// Global Variables Part 1:
const timer = ms => new Promise(res => setTimeout(res, ms))
var url = "https://app.lightspeedanalytics.net"
var ID = new String
var dataarray = new Array
var datamap = new Map
var cleaned = new String
var prefix = "https://lightspeedanalytics.net/"
var loaded = true






// Global Variables Part 2:
var url2 = new String
var Dynamic = new String
var warningmessage = "Super Long Visualization. Most likely killed report."
var removedVis = new String
var removedFilters = new String
var BlockArray = new Array
var table
var tempmap = new Map()
var vislength = new String
var maparray = new Array
var reducedmap = new Map()
var reducedarray = new Array
var finalarray = [["", ""], ["", ""], ["Custom Calculations", ""], ["Label", "Based On (Custom Measure)", "Type (Custom Measure)", "Category", "Expression", "Value Format"]]




// Console Variables:
var consoledebuglink = false;
var consoledebugdynamic1 = false;
var consoledebugdynamicmap = false;
var consoledebugdynamicfinal = false;

//Tested on the following

//https://lightspeedanalytics.net/category/1/reports/70994 - Works - No Custom
//https://lightspeedanalytics.net/category/1/reports/63856 - Works - No Custom
//https://lightspeedanalytics.net/category/1/reports/63547 - Works - Lots of Custom



//___________________________________________Support Functions_________________________________________________________________


function Right(text, length) {
    return text.split("").reverse().join("").substring(0, text.length - length + 1).split("").reverse().join("");
}

//Gets the left most X characters from string.
function Left(text, length) {
    return text.substring(0, length);
}


//Generate Input Boxes appended to Body
function add(name,id,type) {


    let br = document.createElement("br")
    //Create an input type dynamically.
    let element = document.createElement("input");

    //Create Labels
    let label = document.createElement("Label");
    label.innerHTML = name+"   ";

    //Assign different attributes to the element.
    element.setAttribute("type", type);
    element.setAttribute("value", "");
    element.setAttribute("id", id);
    element.setAttribute("style", "width:200px");
    element.setAttribute("style", "padding-left:15px")

    label.setAttribute("style", "font-weight:normal");
    label.setAttribute("style", "padding-left:15px")


    //Append the element in page (in span).
    document.body.appendChild(label);
    document.body.appendChild(element);
    document.body.appendChild(br)
}



//Create the Inputs
function createInputs(){
    add("Report Name","BoxID", "text")
    add("Report Description","BoxID2","text")
    add("Filter Remove?","BoxID3","checkbox")
    add("Vis Remove?","BoxID4","checkbox")
    createButton2()
}




//Create Button #1
function createButton2() {
    var zNode = document.createElement('div');
    zNode.innerHTML = '<button id="myButton" type="button">'+ 'Regen Report</button>';
    zNode.setAttribute('id', 'myContainer');
    document.body.appendChild(zNode);
    //--- Activate the newly added button.
    document.getElementById("myButton").addEventListener("click", EngineV3, false);

    var zNode2 = document.createElement('div');
    zNode2.innerHTML = '<button id="myButton2" type="button">'+ 'Report Dump</button>';
    zNode2.setAttribute('id', 'myContainer2');
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(zNode2);
    //--- Activate the newly added button.
    document.getElementById("myButton2").addEventListener("click", EngineV2, false);




}



async function TestforLoad() {
    timer(1000)


    if (document.querySelector("#top-bar-buttons-react-root > div > div > div.css-11fsnzt-Box-Flex.e1rqh3k81 > a").style.cssText == "cursor: not-allowed;") {
        loaded = false
    }
    console.log("Is Loaded? "+loaded)
}



//_____________________________________________________________________________________________________________________________










//___________________________________________Getting Data Functions_________________________________________________________________


//Create Event Listeners for postMessage
function Listeners(){
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


    eventer(messageEvent,function(e) {
        console.log('Message = ',e.data);
        dataarray.push(e.data.split("|"))
        console.log(dataarray)
    },false);

}






//Turn array from the Listeners into a Map with specific values grabbed
function GetKeys(){

    for (let i = 0; i < dataarray.length; i++) {
        datamap.set(dataarray[i][0],dataarray[i][1])
    }
    //console.log("DataMap Below")
    //console.log(datamap)
    url = datamap.get('URLFLAG')
    ID = datamap.get('IDFLAG')
    //     console.log(url)
    //     console.log(ID)
}

//__________________________________________________________________________________________________________________________________










//______________________________________________Cleaner Function____________________________________________________________________


//Cut out Vis Related chunks of URL
function CutVis2() {
    let FindVis = url.indexOf("&vis") + 1
    let FindDynorDomain = new Number
    if (FindDynorDomain = url.indexOf("dynamic_field") !== -1) {
        FindDynorDomain = url.indexOf("dynamic_field") + 1
    }
    else {
        FindDynorDomain = url.indexOf("embed_domain=") + 1
    }
    let PreVis = Left(url, FindVis)
    let PostVis = Right(url, FindDynorDomain)

    url = (PreVis + PostVis)
}

//Cut out Filter Related chunks of URL
function CutFilters2() {
    console.log(url)
    let FindFilters = url.indexOf("&f") + 1
    let FindSorts = url.indexOf("&sorts") + 1
    var Prefilter = Left(url, FindFilters)
    var PostSorts = Right(url, FindSorts)
    url = Prefilter + PostSorts
}


//__________________________________________________________________________________________________________________________________










//______________________________________Fetch Requests__________________________________________________________________________


async function Repost(name,desc,link,id,savedover){

    console.log("Name= "+name)
    console.log("Desc= "+desc)
    console.log("Link= "+link)
    //     console.log("ID= "+id)
    //     console.log("Override?= "+savedover)





    let mainbody = "{\"title\":\"TITLEREPLACE\",\"description\":\"DESCREPLACE\",\"url\":\"LINKREPLACE\",\"category_id\":\"1\",\"report_id\":\"99999\",\"share\":true}"
    mainbody = mainbody.replaceAll("TITLEREPLACE", name)
    mainbody = mainbody.replaceAll("DESCREPLACE", desc)
    mainbody = mainbody.replaceAll("LINKREPLACE", link)





    fetch("https://lightspeedanalytics.net/reports", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": `${document.URL}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `${mainbody}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response=>response.json())
        .then(data=>{
        console.log(data);
        cleaned = prefix + data.report_url;
        window.open(cleaned);

    });
    ;



}


//__________________________________________________________________________________________________________________________________








//_______________________________________Engine_____________________________________________________________________________________


//Creates the TextBoxes, Starts Listener, Then deletes the iFrame and Side Banner
function Starter(){

    createInputs()

    setTimeout(function(){
        GetKeys()
        document.querySelector("#react-root > div.dash-container.dash-loading.looker-wrapper").remove()
        document.querySelector("#o-wrapper").remove()
    },4000)

}






function EngineV3(){


    //Gets the info out of the input boxes
    let boxname = document.querySelector("#BoxID").value
    let boxdesc = document.querySelector("#BoxID2").value
    let boxfilter = document.querySelector("#BoxID3").checked
    let boxvis = document.querySelector("#BoxID4").checked


    //If inputs on, mod the URL
    if(boxvis == true){CutVis2()}
    if(boxfilter == true){CutFilters2()}


    //Open the URL for Secondary Pop Tab to postMessage its redir'd URL back to main
    window.open(url)
    setTimeout(function(){
        console.log(dataarray)
        Repost(boxname,boxdesc,dataarray[2],"99999")
    },2000)




}



function Ignition() {
    setTimeout(async function () {
        await TestforLoad()
        await timer(1000)
        if (loaded == false) {

            Starter()
        }
        else { console.log("Report Loaded Fine") }
    }, 6000)
}


//__________________________________________________________________________________________________________________________________





// ________________________________________________MAIN WINDOW EVENTS________________________________________________________________________
if (window.top === window.self) {
    //Doesnt work, always passes to Starter()
    Listeners()
    Ignition()


    //________________________________________________iFRAME EVENTS___________________________________________________________________________
}else{
    url2 = document.URL

    //Gets the Full URL of the iFrame and passes it up
    let tempurl = document.URL
    let tempID = tempurl.split("&").filter((word) => word.includes("id="))[1].split("=")[1];
    console.log(tempurl)
    setTimeout(function() {
        // Send the message "Hello" to the parent window
        parent.postMessage("URLFLAG|"+tempurl,"*");
        parent.postMessage("IDFLAG|"+tempID,"*");
    }, 2000);

}


//________________________SECONDARY POP TAB EVENTS________________________________________________________________________________________________

//Find Main Window, and postMessage the redirected Query URL back to main, then suicide
if (document.URL.includes("https://app.lightspeedanalytics.net/embed/explore/")){
    var winRef = window.opener
    winRef.postMessage(document.URL, "*")
    window.close()



}



//__________________________________________________________________________________________________________________________________















// PART 2




function EngineV2(zEvent) {
    url2 = dataarray[0][1]
    console.log(url2)
    document.body.innerHTML = ""
    DynamicCutOut()
    //var ReadableDynamic = DeFuckifyEncoding(interim)
    //console.log(ReadableDynamic)
    SegmentBlocks(DeFuckifyEncoding(Dynamic))
    ArraytoMap(BlockArray)
    ReduceMaps()
    MaptoFinalArray(reducedarray)
    VisFix()
    ExtraDeets()
    BuildTable(finalarray)
    INITHeaders()
}






//Find Dynamic identifier and fetch data
function DynamicCutOut() {
    Dynamic = url2.substring(url2.indexOf("dynamic_fields")).replaceAll("+", "")
    if (consoledebugdynamic1 == true) {
        console.log(url2.substring(url2.indexOf("dynamic_fields")).replaceAll("+", ""))
    }
}



function SegmentBlocks(string) {
    console.log(string)
    let RegexMatch = /([,"]{2})/
    var Blocks = string.split(",{")
    let tempfirstentryfix = Blocks.shift()
    Blocks.unshift(Right(tempfirstentryfix, 18))
    if (consoledebugdynamic1 == true) {
        console.log(Blocks)
    }
    for (let i = 0; i < Blocks.length; i++) {
        var temparray = new Array
        temparray.push(Blocks[i].split(RegexMatch))
        var fixedarray = temparray[0]
        var cleaned = fixedarray.filter((word) => word.length > 6)
        if (consoledebugdynamic1 == true) {
            console.log(cleaned)
        }
        BlockArray.push(cleaned)
    }
    if (consoledebugdynamic1 == true) {
        console.log(BlockArray)
    }
}


function DeFuckifyEncoding(string) {
    var HTMLParings = [['%5B', '['], ['%20', ' '], ['%21', '!'], ['%22', '"'], ['%23', '#'], ['%24', '$'], ['%25', '%'], ['%26', '&'], ['%27', '‘'], ['%28', '('], ['%29', ')'], ['%2A', '*'], ['%2B', '+'], ['%2C', ','], ['%2D', '–'], ['%2E', '.'], ['%2F', '/'], ['%3A', ':'], ['%3B', ';'], ['%3C', '<'], ['%3D', '='], ['%3E', '>'], ['%3F', '?'], ['%40', '@'], ['%5C', `\\`], ['%5D', ']'], ['%5E', '^'], ['%5F', '_'], ['%60', "'`'"], ['%7B', '{'], ['%7C', '|'], ['%7D', '}'], ['%7E', '~'], ['%7F', ''], ['%80', '€'], ['%81', ''], ['%82', '‚'], ['%83', 'ƒ'], ['%84', '„'], ['%85', '…'], ['%86', '†'], ['%87', '‡'], ['%88', 'ˆ'], ['%89', '‰'], ['%8A', 'Š'], ['%8B', '‹'], ['%8C', 'Œ'], ['%8D', ''], ['%8E', 'Ž'], ['%8F', ''], ['%90', ''], ['%91', '‘'], ['%92', '’'], ['%93', '"'], ['%94', '"'], ['%95', '•'], ['%96', '–'], ['%97', '—'], ['%98', '"'], ['%99', '™'], ['%9A', 'š'], ['%9B', '›'], ['%9C', 'œ'], ['%9D', ''], ['%9E', 'ž'], ['%9F', 'Ÿ'], ['%A0', ''], ['%A1', '¡'], ['%A2', '¢'], ['%A3', '£'], ['%A4', '¤'], ['%A5', '¥'], ['%A6', '|'], ['%A7', '§'], ['%A8', '¨'], ['%A9', '©'], ['%AA', 'ª'], ['%AB', '«'], ['%AC', '¬'], ['%AD', '¯'], ['%AE', '®'], ['%AF', '¯'], ['%B0', '°'], ['%B1', '±'], ['%B2', '²'], ['%B3', '³'], ['%B4', '´'], ['%B5', 'µ'], ['%B6', '¶'], ['%B7', '·'], ['%B8', '¸'], ['%B9', '¹'], ['%BA', 'º'], ['%BB', '»'], ['%BC', '¼'], ['%BD', '½'], ['%BE', '¾'], ['%BF', '¿'], ['%C0', 'À'], ['%C1', 'Á'], ['%C2', ' '], ['%C3', 'Ã'], ['%C4', 'Ä'], ['%C5', 'Å'], ['%C6', 'Æ'], ['%C7', 'Ç'], ['%C8', 'È'], ['%C9', 'É'], ['%CA', 'Ê'], ['%CB', 'Ë'], ['%CC', 'Ì'], ['%CD', 'Í'], ['%CE', 'Î'], ['%CF', 'Ï'], ['%D0', 'Ð'], ['%D1', 'Ñ'], ['%D2', 'Ò'], ['%D3', 'Ó'], ['%D4', 'Ô'], ['%D5', 'Õ'], ['%D6', 'Ö'], ['%D7', '×'], ['%D8', 'Ø'], ['%D9', 'Ù'], ['%DA', 'Ú'], ['%DB', 'Û'], ['%DC', 'Ü'], ['%DD', 'Ý'], ['%DE', 'Þ'], ['%DF', 'ß'], ['%E0', 'à'], ['%E1', 'á'], ['%E2', 'â'], ['%E3', 'ã'], ['%E4', 'ä'], ['%E5', 'å'], ['%E6', 'æ'], ['%E7', 'ç'], ['%E8', 'è'], ['%E9', 'é'], ['%EA', 'ê'], ['%EB', 'ë'], ['%EC', 'ì'], ['%ED', 'í'], ['%EE', 'î'], ['%EF', 'ï'], ['%F0', 'ð'], ['%F1', 'ñ'], ['%F2', 'ò'], ['%F3', 'ó'], ['%F4', 'ô'], ['%F5', 'õ'], ['%F6', 'ö'], ['%F7', '÷'], ['%F8', 'ø'], ['%F9', 'ù'], ['%FA', 'ú'], ['%FB', 'û'], ['%FC', 'ü'], ['%FD', 'ý'], ['%FE', 'þ'], ['%FF', 'ÿ']]
    for (let i = 0; i < HTMLParings.length; i++) {
        //console.log(HTMLParings[i][0])
        //console.log(HTMLParings[i][1])
        string = string.replaceAll(HTMLParings[i][0], HTMLParings[i][1])
    }
    return string
}



// Turns Array into KeyPairs
function ArraytoMap(array) {
    for (let i = 0; i < array.length; i++) {
        tempmap = new Map()
        let temparray = array[i]
        if (consoledebugdynamicmap == true) {
            console.log(temparray)
        }
        for (let t = 0; t < temparray.length; t++) {
            let temp2 = temparray[t].split(":")
            //console.log(temp2)
            tempmap.set(temp2[0].replaceAll('"', ""), temp2[1])
        }
        maparray.push(tempmap)
    }
    if (consoledebugdynamicmap == true) {
        console.log(maparray)
    }
}


//Uses Maps to filter for specific fields in a specific order
function ReduceMaps() {
    reducedmap = new Map()
    for (let i = 0; i < maparray.length; i++) {
        if (maparray[i].has("label")) {reducedmap.set("Label", maparray[i].get("label"))}
        else { reducedmap.set("Name", "N/A") }


        if (maparray[i].has("based_on")) {reducedmap.set("Based_on", maparray[i].get("based_on"))}
        else { reducedmap.set("Based_on", "N/A") }


        if (maparray[i].has("type")) {reducedmap.set("Type", maparray[i].get("type"))}
        else { reducedmap.set("Type", "N/A") }


        if (maparray[i].has("category")) {reducedmap.set("Category", maparray[i].get("category"))}
        else { reducedmap.set("Category", "N/A") }


        if (reducedmap.get("Category") == "N/A") {
            if (reducedmap.get("Type") == "N/A") {
                //If there is no Type Nor Category, its an old style of Table Calc. Reset Key and set it again
                if (consoledebugdynamicmap == true) {
                    console.log("Has None")
                }
                reducedmap.delete("Category")
                reducedmap.set("Category", "Measure Based Table Calculation")
            } else {
                //If there is a Type but no Category, thats a Prebuilt Custom Measure
                if (consoledebugdynamicmap == true) {
                    console.log("Has Type")
                }
                reducedmap.delete("Category")
                reducedmap.set("Category", "Prebuilt Custom Measure")
            }
        } else {
            // If it has both, do nothing.
            if (consoledebugdynamicmap == true) {
                console.log("Has Category")
            }
        }

        if (maparray[i].has("expression")) {reducedmap.set("Expression", maparray[i].get("expression"))}
        else {reducedmap.set("Expression", maparray[i].get("filter_expression"))}


        if (maparray[i].has("value_format")) {reducedmap.set("Value_Format", maparray[i].get("value_format"))
                                             } else { reducedmap.set("Value_Format", "null") }


        reducedarray.push(reducedmap)
        reducedmap = new Map()
    }
    if (consoledebugdynamicmap == true) {
        console.log(reducedarray)
    }
}



function MaptoFinalArray(array) {
    for (let i = 0; i < array.length; i++) {
        finalarray.push([
            array[i].get("Label").replaceAll('"', "").replaceAll('+', " "),
            array[i].get("Based_on").replaceAll('"', ""),
            (array[i].get("Type").replaceAll('"', "")),
            (array[i].get("Category").replaceAll('"', "")),
            (Right(array[i].get("Expression"), 2).replaceAll("\\n", "")),
            (array[i].get("Value_Format").replaceAll('"', ""))
        ]);
    }
    //console.log(finalarray);
}




function VisFix(){


    let FindVis = url2.indexOf("&vis") + 1
    let FindDynorDomain = new Number
    if (FindDynorDomain = url2.indexOf("dynamic_field") !== -1) {
        FindDynorDomain = url2.indexOf("dynamic_field") + 1
    }
    else {
        FindDynorDomain = url2.indexOf("embed_domain=") + 1
    }

    //Getting Vis Length
    vislength = FindVis - FindDynorDomain
    vislength = Math.abs(vislength)




}



//Get Other Report Details
function ExtraDeets() {
    var splitfields = url2.split("&")
    var getfilters = splitfields.filter((word) => word.includes("f["))
    var getsorts = splitfields.filter((word) => word.includes("sorts="))
    var gettitle = splitfields.filter((word) => word.includes("title="))
    var getfields = splitfields.filter((word) => word.includes("fields="))
    var getfields2 = DeFuckifyEncoding(getfields[0]).split("=")[1].split(",")
    var getfieldnames = DeFuckifyEncoding(getfields[0]).split("=")[0].split("?")[1]
    getfields2.unshift(getfieldnames)
    finalarray.unshift(getfields2)
    for (let i = 0; i < getfilters.length; i++) {
        let tempfilter = DeFuckifyEncoding(getfilters[i]).replaceAll("+", " ").split("=")
        try{tempfilter[1] = DeFuckifyEncoding(tempfilter[1])}catch{null}
        finalarray.unshift(tempfilter)
    }
    finalarray.unshift(DeFuckifyEncoding(getsorts[0]).replaceAll("+", " ").split("="))
    //insert vis length. If long, insert warning too.
    if(vislength > 10000){
        finalarray.unshift(["Visualization Length", vislength,warningmessage])

    }else{finalarray.unshift(["Visualization Length", vislength])}

    finalarray.unshift(DeFuckifyEncoding(gettitle[0]).replaceAll("+", " ").split("="))
}



//Build and Display Table
function BuildTable(array) {
    //setup our table array
    var tableArr = array
    //create a Table Object
    table = document.createElement('table');
    //iterate over every array(row) within tableArr
    for (let row of tableArr) {
        //Insert a new row element into the table element
        table.insertRow();
        //Iterate over every index(cell) in each array(row)
        for (let cell of row) {
            //While iterating over the index(cell)
            //insert a cell into the table element
            let newCell = table.rows[table.rows.length - 1].insertCell();
            //add text to the created cell element
            newCell.textContent = cell;
        }
    }
    table.style.border = "1px solid red"
    table.setAttribute("id", "maintable")
    document.querySelector("body").appendChild(table);
}






function INITHeaders() {
    for (let i = 1; i < 7; i++) {
        $(`#maintable > tbody > tr:nth-child(9) > td:nth-child(${i})`).css("font-weight", "bold").css("font-size","2rem");
    }
    for (let i = 1; i < 9; i++) {
        $(`#maintable > tbody > tr:nth-child(${i}) > td:nth-child(1)`).css("font-weight", "bold").css("font-size","2rem");
    }
}



$("head").append(`
    <style>
        #maintable {
        font-family: "Lato",Helvetica,Arial,Verdana,sans-serif;
        border-spacing: 10px;
        background-color: #747F92
        border-collapse: collapse;
        box-sizing: border-box;
        padding: 5px 6px;
        font-size: 1.5rem;
        color: #000;
        text-align: left;
        border: 1px solid;
        td{
        border: 2px solid #000;
        background-color: #afdbd5;
        height: 25px;
        width: 200px;
        padding-left: 7px;
        padding-right: 7px;
        }
    </style>
`);
