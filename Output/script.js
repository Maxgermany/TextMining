function generateMenu() {

    let years = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
    let weeks = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
    let navbar = document.getElementById("navbar");

    for (let year in years) {

        let menuYear = document.createElement("div");

        menuYear.setAttribute("class", "subnav")

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

function translate(term) {

    wordMap = {
        "game information" : "Game informations",
        "player information" : "Player informations",

        "player_id" : "PlayerID",
        "name" : "Name",
        "position" : "Position",
        "height" : "Height",
        "weight" : "Weight",
        "current_team" : "Current team",
        "birth_place" : "Birth place",
        "birth_date" : "Birth date",
        "college" : "College",
        "high_school" : "High school",
        "draft_team" : "Draft team",
        "draft_round" : "Draft round",
        "draft_position" : "Draft position",
        "draft_year" : "Draft year",
        "current_salary" : "Current salary",

        "year" : "Year",
        "date" : "Game date",
        "game_number": "Game number",
        "age" : "Age",
        "team" : "Team",
        "game_location" : "Game location",
        "opponent" : "Opponent",
        "player_team_score" : "Team score",
        "opponent_score" : "Opponent score",
        "game_won" : "Game won",

        "rushing_attempts": "Rushing attempts",
        "rushing_yards" : "Rushing yards",
        "rushing_touchdowns" : "Rushing touchdowns",

        "receiving_targets" : "Receiving targets",
        "receiving_receptions" : "Receiving receptions",
        "receiving_yards" : "Receiving yards",
        "receiving_touchdowns" : "Receiving toruchdowns",

        "punt_return_attempts" : "Punt return attempts",
        "punt_return_yards" : "Punt return yards",

        "passing_attempts" : "Passing attempts",
        "passing_completions" : "Passing completions",
        "passing_yards" : "Passing yards",
        "passing_rating" : "Passing rating",
        "passing_touchdowns" : "Passing touchdowns",
        "passing_sacks" : "Passing sacks",
        "passing_sacks_yards_lost" : "Passing sacks - yards lost",
        "passing_interceptions" : "Passing interceptions",

        "defense_tackles" : "Defense tackles",
        "defense_tackle_assists" : "Defense tackle assists",
        "defense_interceptions" : "Defense interceptions",


        "C" : "Center",
        "RB" : "Running Back",
        "FB" : "Fullback",
        "HB" : "Halfback",
        "OG" : "Offensive Guards",
        "OT" : "Offensive Tackle",
        "LG" : "Left Guard",
        "LT" : "Left Tackle",
        "RG" : "Right Guard",
        "RT" : "Right Tackle",
        "TE" : "Tight End",
        "QB" : "Quarterback",
        "WR" : "Wide Receiver",

        "CB" : "Cornerback",
        "DE" : "Defensive End",
        "DT" : "Defensive Tackle",
        "LB" : "Linebacker",
        "ILB" : "Inside Linebacker",
        "MLB" : "Middle Linebacker",
        "NT" : "Nose Tackle",
        "OLB": "Outside Linebacker",
        "S" : "Safety",
        "FS" : "Free Safety",
        "SS" : "Strong Safety",

        "K" : "Kicker",
        "KR" : "Kick Returner",
        "LS" : "Long Snapper",
        "P" : "Punter",
        "PR" : "Punt Runner",


        /**"ARZ" : "Arizona Cardnials",
         "ARI" : "Arizona Cardnials",
         "ATL" : "Atlanta Falcons",
         "BLT" : "Balimore Ravens",
         "BAL" : "Balimore Ravens",
         "BUF" : "Buffalo Bills",
         "CAR" : "Carolina Panthers",
         "CHI" : "Chicago Bears",
         "CIN" : "Cincinnati Bengals",
         "CLV" : "Cleveland Browns",
         "CLE" : "Cleveland Browns",
         "DAL" : "Dallas Cowboys",
         "DEN" : "Denver Broncos",
         "DET" : "Detroit Lions",
         "GB"  : "Green Bay Packers",
         "HST" : "Houston Texas",
         "HOU" : "Houston Texas",
         "IND" : "Indianapolis Colts",
         "JAX" : "Jacksonville Jaguars",
         "KC"  : "Kansas City Chiefs",
         "LV"  : "Las Vegas Raiders",
         "LAC" : "Los Angeles Chargers",
         "LAR" : "Los Angeles Rams",
         "MIA" : "Miami Dolphins",
         "MIN" : "Minnesota Vikings",
         "NE"  : "New England Patriots",
         "NWE"  : "New England Patriots",
         "NO"  : "New Orleans Saints",
         "NYG" : "New York Giants",
         "NYJ" : "New York Jets",
         "PHI" : "Philadelphia Eagles",
         "PIT" : "Pittsburgh Steelers",
         "SF"  : "San Francisco 49ers",
         "SFO"  : "San Francisco 49ers",
         "SEA" : "Seattle Seahawks",
         "TB"  : "Tampa Bay Buccaneers",
         "TAM"  : "Tampa Bay Buccaneers",
         "TEN" : "Tennessee Titans",
         "WAS" : "Washington Football Team"**/
    }

    let returnValue = term;

    Object.keys(wordMap).forEach(function(key) {
        if (key === term) {
            returnValue = wordMap[key];
        }
    });

    return returnValue;
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

    for(player in MyLib.Data.games[gameNumber].players) {

        if(Object.keys(MyLib.Data.games[gameNumber].players[player]).length == 2) {

            playerName = MyLib.Data.games[gameNumber].players[player]["player information"].name.toString();

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

                            let td = document.createElement('td');
                            td.innerText = translate(key1);
                            tbody.appendChild(td);

                            if (typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "string" || typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "number" || typeof(MyLib.Data.games[gameNumber].players[player][key][key1]) == "boolean") {
                                td = document.createElement('td');
                                td.innerText = translate(MyLib.Data.games[gameNumber].players[player][key][key1]);
                                tbody.appendChild(td);
                            } else {
                                td = document.createElement('td');
                                td.innerHTML = '<strong style="color:red">' + MyLib.Data.games[gameNumber].players[player][key][key1]["propertyValue"] + "</strong>";
                                tbody.appendChild(td);
                                Object.keys(MyLib.Data.games[gameNumber].players[player]["game information"]).forEach(function (key) {
                                    if (typeof(MyLib.Data.games[gameNumber].players[player]["game information"][key]) == "object"){
                                        number = MyLib.Data.games[gameNumber].players[player]["game information"][key]["propertyValue"];
                                        output = output.replaceAll(" " + number + " ", '<strong style="color:red"> ' + number + " </strong>");
                                        output = output.replaceAll(" " + number + "-", '<strong style="color:red"> ' + number + "</strong>-");
                                        output = output.replaceAll("-" + number + " ", '-<strong style="color:red">' + number + " </strong>");
                                        output = output.replaceAll("(" + number + " ", '(<strong style="color:red">' + number + " </strong>");
                                        output = output.replaceAll(" " + number + ")", '<strong style="color:red">' + number + "</strong>)");

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
    outputElement = document.getElementById("outputData");
    getData()
        .then(
            data => {
                window.MyLib = {};
                MyLib.Data = data;
                console.log(data);

                let output = "";
                for (game in data.games) {

                    output += "<h2>";
                    output += data.games[game]["Team 1"].Name + " " + data.games[game]["Team 1"].Points + " - " + data.games[game]["Team 2"].Name + " " + data.games[game]["Team 2"].Points;
                    output += "</h2>"

                    let temp = data.games[game].comments.toString();

                    for (player in data.games[game].players) {
                        if(Object.keys(data.games[game].players[player]).length == 2) {
                            playerName = data.games[game].players[player]["player information"].name.toString()
                            temp = temp.replaceAll(playerName, "<strong onclick='showPlayerData(this, " + game + ")'><strong>" + playerName + "</strong></strong></strong>");
                        } else {
                            playerName = data.games[game].players[player].name.toString()
                            temp = temp.replaceAll(playerName, "<strong onclick='showPlayerData(this, " + game + ")'><strong>" + playerName + "</strong></strong></strong>");
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
        outputElement.innerText = "Week wasn't scrapped yet."
    });
}