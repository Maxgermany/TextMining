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

if(!isPlayerParameter()) {
    getAllPlayers()
        .then(
            data => {

                window.MyLib = {};
                MyLib.Data = data;

                let playersGroupedByLetter = data.reduce(function (acc, curr) {

                    if (acc.hasOwnProperty(curr.charAt(0))) {
                        acc[curr.charAt(0)].push(curr);
                    } else {
                        acc[curr.charAt(0)] = [curr]
                    }

                    return acc;

                }, {});

                let letters = Object.entries(playersGroupedByLetter);

                let mainLetterDiv = document.getElementById("allLetters");

                for (const letter in letters) {

                    currentLetter = letters[letter][0];

                    playerNames = letters[letter][1];

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