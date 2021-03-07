var statistics = {
    "Task": "The task is to scrape NFL game reports and map them to a game database.",
    "Amount of scraped sites" : "197",
    "Amount of scraped games" : "2520",
    "Amount of player found" : "2526",
    "Amount of possible matchings" : "83986",
    "Amount of words" : "653427",
    "Amount of different words" : "",
    "Time to proceed (corpus.txt)" : "26.31793 secs",
    "Time to proceed (corpus chunked)" : "3.193176 mins"
}

function populateStatistics() {

    let statisticElement = document.getElementById("statistics");

    let table = document.createElement("table");

    let thead = document.createElement("tr");

    let th = document.createElement("th");

    th.innerText = "Property";

    thead.appendChild(th);

    th = document.createElement("th");

    th.innerText = "Value";

    thead.appendChild(th);

    table.appendChild(thead);

    Object.keys(statistics).forEach(function(key) {

        let tr = document.createElement("tr");

        let td = document.createElement("td");
        td.innerText = key;

        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = statistics[key];

        tr.appendChild(td);

        table.appendChild(tr);

    });

    statisticElement.appendChild(table);
}

populateStatistics();
