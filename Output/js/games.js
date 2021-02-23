function generateMenu() {
    //TODO: Add highlighting of current year and week

    let years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
    let weeks = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
    let navbar = document.getElementById("navbar");

    for (let year in years) {

        let menuYear = document.createElement("div");

        menuYear.setAttribute("class", "subnav");

        let menuYearButton = document.createElement("button");

        menuYearButton.setAttribute("class", "subnavbtn");
        menuYearButton.innerText = "Year " + years[year];

        menuYear.appendChild(menuYearButton);

        let subContent = document.createElement("div");
        subContent.setAttribute("class", "subnav-content");

        for (let week in weeks) {

            let menuWeek = document.createElement("a");

            menuWeek.setAttribute("href", "?year=" + years[year] + "&week=" + weeks[week]);
            menuWeek.innerText = "Week " + weeks[week];

            subContent.appendChild(menuWeek);

        }

        menuYearButton.appendChild(subContent);

        navbar.appendChild(menuYear);

    }
}

function isParameter() {

    let urlString = window.location.href;
    let url = new URL(urlString);
    return url.searchParams.has("year") && url.searchParams.has("week");

}

async function getData() {

    let urlString = window.location.href;
    let url = new URL(urlString);

    let week = url.searchParams.get("week");
    let year = url.searchParams.get("year");

    let response = await fetch("..\\Data\\Output\\" + year + "\\week_" + week + ".json")

    let data = await response.json();

    return data;

}

function showPlayerData(element, gameNumber) {

    let table = document.createElement('table');

    let outputElement = document.getElementById("outputData");

    let output = MyLib.text;

    for(let player in MyLib.Data.games[gameNumber].players) {

        if(Object.keys(MyLib.Data.games[gameNumber].players[player]).length == 2) {

            let playerName = MyLib.Data.games[gameNumber].players[player]["player information"].name.toString();

            if (playerName == element.innerText) {

                Object.keys(MyLib.Data.games[gameNumber].players[player]).forEach(function (key) {

                    let thead = document.createElement('tr');

                    let td = document.createElement('th');

                    td.innerText = translate(key);
                    td.setAttribute("colspan", "2");

                    thead.appendChild(td);

                    table.appendChild(thead);


                    Object.keys(MyLib.Data.games[gameNumber].players[player][key]).forEach(function (key1) {

                        if (MyLib.Data.games[gameNumber].players[player][key][key1] != "None" && MyLib.Data.games[gameNumber].players[player][key][key1] != 0) {

                            let tbody = document.createElement('tr');

                            td = document.createElement('td');
                            td.innerText = translate(key1);

                            tbody.appendChild(td);

                            if (typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "string" || typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "number" || typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "boolean") {

                                td = document.createElement('td');

                                td.innerText = translate(MyLib.Data.games[gameNumber].players[player][key][key1]);

                                tbody.appendChild(td);

                            } else {

                                td = document.createElement('td');

                                td.innerHTML = '<strong style="color:red">' + MyLib.Data.games[gameNumber].players[player][key][key1][1]["propertyValue"] + "</strong>";

                                tbody.appendChild(td);

                                Object.keys(MyLib.Data.games[gameNumber].players[player]["game information"]).forEach(function (key2) {

                                    if (typeof(MyLib.Data.games[gameNumber].players[player]["game information"][key2]) == "object"){

                                        number = MyLib.Data.games[gameNumber].players[player]["game information"][key2][1]["propertyValue"].toString();

                                        output = output.replaceAll(" " + number + " ", '<strong style="color:red"> ' + number + " </strong>");
                                        output = output.replaceAll(" " + number + "-", '<strong style="color:red"> ' + number + "</strong>-");
                                        output = output.replaceAll("-" + number + " ", '-<strong style="color:red">' + number + " </strong>");
                                        output = output.replaceAll("(" + number + " ", '(<strong style="color:red">' + number + " </strong>");

                                        //output = output.replaceAll(" " + number + ")", '<strong style="color:red"> ' + number + "</strong>)"); //This line somehow produces an error sometimes; for example on week 1 of 2008 when changing from Julius Jones to Maurice Morris

                                        output = output.replaceAll("(" + number + "-", '(<strong style="color:red">' + number + "</strong>-");
                                        output = output.replaceAll("(" + number + ")", '(<strong style="color:red">' + number + "</strong>)")
                                        output = output.replaceAll("-" + number + ")", '-<strong style="color:red">' + number + "</strong>)");
                                        output = output.replaceAll("-" + number + ",", '-<strong style="color:red">' + number + "</strong>,");
                                        output = output.replaceAll("," + number + ")", ',<strong style="color:red">' + number + "</strong>)");
                                        output = output.replaceAll("," + number + " ", ',<strong style="color:red">' + number + " </strong>");
                                        output = output.replaceAll("-" + number + ".", '-<strong style="color:red">' + number + "</strong>.");
                                        output = output.replaceAll(" " + number + "!", ' <strong style="color:red">' + number + "</strong>!");
                                        output = output.replaceAll("-" + number + "!", '-<strong style="color:red">' + number + "</strong>!");

                                    }

                                });

                            }

                            table.appendChild(tbody);

                            outputElement.innerHTML = output;
                        }
                    });
                });
            }
        } else {

            if (playerName == element.innerText) {

                Object.keys(MyLib.Data.games[gameNumber].players[player]).forEach(function (key) {

                    if (MyLib.Data.games[gameNumber].players[player][key] != "None") {

                        let tbody = document.createElement('tr');

                        let td = document.createElement('td');
                        td.innerText = translate(key);

                        tbody.appendChild(td);

                        td = document.createElement('td');
                        td.innerText = MyLib.Data.games[gameNumber].players[player][key];

                        tbody.appendChild(td);

                        table.appendChild(tbody);
                    }
                });
            }
        }
    }

    let outputDetail = document.getElementById('outputDetail');
    outputDetail.innerHTML = '';
    outputDetail.appendChild(table);

}

generateMenu();

if (isParameter()) {

    let outputElement = document.getElementById("outputData");

    getData()
        .then(
            data => {

                window.MyLib = {};
                MyLib.Data = data;

                let output = "";

                for (let game in data.games) {

                    output += "<h2>";
                    output += data.games[game]["Team 1"].Name + " ";
                    output += data.games[game]["Team 1"].Points + " - ";
                    output += data.games[game]["Team 2"].Name + " ";
                    output += data.games[game]["Team 2"].Points;
                    output += "</h2>"

                    let temp = data.games[game].comments.toString();

                    if (data.games[game].players != "NoPlayersFound") {

                        for (let playerIndex in data.games[game].players) {

                            if (Object.keys(data.games[game].players[playerIndex]).length == 2) {

                                let playerName = data.games[game].players[playerIndex]["player information"].name.toString()

                                temp = temp.replaceAll(playerName, "<strong onclick='showPlayerData(this, " + game + ")'><strong>" + playerName + "</strong></strong></strong>");

                            } else {

                                let playerName = data.games[game].players[playerIndex].name.toString()

                                temp = temp.replaceAll(playerName, "<strong onclick='showPlayerData(this, " + game + ")'><strong>" + playerName + "</strong></strong></strong>");

                            }
                        }

                    }

                    output += "<div>";
                    output += temp;
                    output += "</div>";

                    output += "<br>";

                    output += '<hr style="height:2px;border-width:0;color:gray;background-color:gray">';

                }

                MyLib.text = output;

                outputElement.innerHTML = output;

            }
        ).catch((error) => {

            console.log(error);

            outputElement.innerText = "Week wasn't scrapped yet."

        });
}