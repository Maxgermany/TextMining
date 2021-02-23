async function getAllPlayers() {

    let response = await fetch("..\\Data\\Output\\Player\\AllPlayers.json");

    let data = await response.json();

    return data;

}

async function getPlayer(playerName) {

    let response = await fetch("..\\Data\\Output\\Player\\" + playerName + ".json");

    let data = await response.json();

    return data;

}

function isPlayerParameter() {

    let urlString = window.location.href;
    let url = new URL(urlString);
    return url.searchParams.has("player");

}

function getPlayerName() {

    let urlString = window.location.href;
    let url = new URL(urlString);
    return url.searchParams.get("player");
}

function transformName(fullName) {

    let nameParts = fullName.split(" ");
    let lastName = nameParts.slice(-1);

    return lastName + ", " + nameParts.slice(0, -1).toString().replace(",", " ");

}

function retransformName(fullName) {

    let nameParts = fullName.split(", ");

    return nameParts[1] + " " + nameParts[0];
}

function displayPlayerStats() {
    playerName = getPlayerName();

    playerName = retransformName(playerName);

    getPlayer(playerName)
        .then(
            data => {

                window.MyLib = {};
                MyLib.Data = data;

                let mainLetterDiv = document.getElementById("allLetters");

                let playerTitle = document.createElement("h2");

                playerTitle.innerText = playerName;

                mainLetterDiv.appendChild(playerTitle);

                let table = document.createElement("table");

                let thead = document.createElement("tr");

                let th = document.createElement("th");

                th.innerText = "Property";

                thead.appendChild(th);

                th = document.createElement("th");

                th.innerText = "Value";

                thead.appendChild(th);

                table.appendChild(thead);

                for (const [key, value] of Object.entries(data)) {

                    if (key == "games") continue;

                    if(value == "None") continue;

                    let tbody = document.createElement("tr");

                    let td = document.createElement("td");

                    td.innerText = translate(key);

                    tbody.appendChild(td);

                    td = document.createElement("td");

                    td.innerText = value;

                    tbody.appendChild(td);

                    table.appendChild(tbody);

                }

                mainLetterDiv.appendChild(table);

                let gameTitle = document.createElement("h3");

                gameTitle.innerText = "Games";

                mainLetterDiv.appendChild(gameTitle);

                for (const [key, value] of Object.entries(data.games)) {

                    let expandibleGameButton = document.createElement("button");

                    expandibleGameButton.setAttribute("type", "button");

                    expandibleGameButton.setAttribute("class", "collapsible");

                    expandibleGameButton.innerText = "Game " + key;

                    mainLetterDiv.appendChild(expandibleGameButton);

                    let table = document.createElement("table");

                    table.setAttribute("class", "content");

                    let tr = document.createElement("tr");

                    let th = document.createElement("th");

                    th.innerText = "Property";

                    tr.appendChild(th);

                    th = document.createElement("th");

                    th.innerText = "Value";

                    tr.appendChild(th);

                    table.appendChild(tr);

                    th = document.createElement("th");

                    th.innerText = "Sentences";

                    tr.appendChild(th);

                    th = document.createElement("th");

                    th.innerText = "Confidence";

                    tr.appendChild(th);

                    table.appendChild(tr);

                    for (const [gameKey, gameValue] of Object.entries(value)) {

                        if (typeof(gameValue) == "object") {

                            let tr = document.createElement("tr");

                            let td = document.createElement("td");

                            td.innerText = translate(gameKey);

                            tr.appendChild(td);

                            td = document.createElement("td");

                            td.innerText = gameValue[1].propertyValue

                            tr.appendChild(td);

                            td = document.createElement("td");

                            td.innerText = gameValue[1].sentence;

                            tr.appendChild(td);

                            td = document.createElement("td");

                            td.innerText = gameValue[1].confidence;

                            tr.appendChild(td);

                            table.appendChild(tr);

                            tr = document.createElement("tr");

                            if (Object.keys(gameValue).length > 1) {

                                for (const [commentKey, commentValue] of Object.entries(gameValue)) {

                                    tr = document.createElement("tr");

                                    td = document.createElement("td");

                                    td.innerText = "";

                                    tr.appendChild(td);

                                    td = document.createElement("td");

                                    td.innerText = "";

                                    tr.appendChild(td);

                                    td = document.createElement("td");

                                    td.innerText = commentValue.sentence;

                                    tr.appendChild(td);

                                    td = document.createElement("td");

                                    td.innerText = commentValue.confidence;

                                    tr.appendChild(td);

                                    table.appendChild(tr);

                                }
                            }

                        } else if (gameKey == "comment") {

                            let tr = document.createElement("tr");

                            tr.setAttribute("class", "commentRow");

                            let td = document.createElement("td");

                            td.innerText = translate(gameKey);

                            tr.appendChild(td);

                            td = document.createElement("td");

                            td.innerText = gameValue;

                            td.setAttribute("colspan", "3");

                            tr.appendChild(td);

                            table.appendChild(tr);

                        } else if (gameValue != 0) {

                            let tr = document.createElement("tr");

                            let td = document.createElement("td");

                            td.innerText = translate(gameKey);

                            tr.appendChild(td);

                            td = document.createElement("td");

                            td.innerText = gameValue;

                            tr.appendChild(td);

                            td = document.createElement("td");

                            tr.appendChild(td);

                            td = document.createElement("td");

                            tr.appendChild(td);

                            table.appendChild(tr);

                        }
                    }

                    mainLetterDiv.appendChild(table);

                }

                var coll = document.getElementsByClassName("collapsible");

                for (let i = 0; i < coll.length; i++) {
                    coll[i].addEventListener("click", function() {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.display === "block") {
                            content.style.display = "none";
                        } else {
                            content.style.display = "block";
                        }
                    });
                }

            }
        )
        .catch(error => {
            console.log(error);
            let allLetters = document.getElementById("allLetters");

            let errorTitle = document.createElement("h2");

            errorTitle.innerText = "Player not found";

            allLetters.appendChild(errorTitle);
        });
}

if(!isPlayerParameter()) {
    getAllPlayers()
        .then(
            data => {

                window.MyLib = {};
                MyLib.Data = data;

                let playersGroupedByLetter = data.reduce(function (letterArrays, currentPlayer) { // Reduces all players in an object grouped by letter

                    let transformedName = transformName(currentPlayer) // Transforms name from "firstname lastname" to "lastname, firstname"

                    if (letterArrays.hasOwnProperty(transformedName.charAt(0))) { // Checks if object has an entry with the current first letter

                        letterArrays[transformedName.charAt(0)].push(transformedName);

                    } else { // If not it is getting created

                        letterArrays[transformedName.charAt(0)] = [transformedName];

                    }

                    return letterArrays;

                }, {});

                playersGroupedByLetter = Object.keys(playersGroupedByLetter)
                    .sort()
                    .reduce((obj, key) => {  // Orders the object letters

                        obj[key] = playersGroupedByLetter[key];
                        return obj;

                    }, {});

                let letters = Object.entries(playersGroupedByLetter);

                let mainLetterDiv = document.getElementById("allLetters");

                for (const letter in letters) {

                    currentLetter = letters[letter][0];

                    playerNames = letters[letter][1];

                    playerNames = playerNames.sort();

                    let letterDiv = document.createElement("div");

                    letterDiv.setAttribute("class", "letterDiv");

                    letterDiv.setAttribute("id", currentLetter);

                    letterDiv.innerText = currentLetter;

                    mainLetterDiv.appendChild(letterDiv);

                    let playerList = document.createElement("ul");

                    playerList.setAttribute("class", "playerList");

                    for (let i = 0; i < playerNames.length; i++) {

                        let playerElement = document.createElement("li");

                        playerElement.innerHTML = "<a href='?player=" + playerNames[i] + "'>" + playerNames[i] + "</a>";

                        playerList.appendChild(playerElement);
                    }

                    mainLetterDiv.appendChild(playerList);

                }
            })
        .catch(error => {
            console.log(error)
        })

} else {

    displayPlayerStats();

}