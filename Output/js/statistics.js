var statistics = {
    "Task": "The task was to scrape NFL game reports and map them to a game database.",
    "Amount of words" : "1000",
    "Amount of different words" : "700",
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