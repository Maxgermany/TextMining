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
    let lastName = nameParts.slice(-1) [0];

    return lastName + ", " + nameParts.slice(0, -1);

}

function retransformName(fullName) {

    let nameParts = fullName.split(", ");

    return nameParts[1] + " " + nameParts[0];
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

    playerName = getPlayerName();

    playerName = retransformName(playerName);

    getPlayer(playerName)
        .then(
            data => {

                window.MyLib = {};
                MyLib.Data = data;

                str = JSON.stringify(data, null, 4);

                let playerDiv = document.createElement("p");

                playerDiv.innerText = str;

                let mainLetterDiv = document.getElementById("allLetters");

                mainLetterDiv.appendChild(playerDiv);

            }
        )
        .catch(error => {
            console.log(error);
        });

}