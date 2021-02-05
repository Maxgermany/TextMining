function createArrayAToZ() {
    return String.fromCharCode(...Array(91).keys()).slice(65);
}

function generateMenu() {

    abcArray = createArrayAToZ();

    let menu = document.getElementById('navbar');

    for (let element in abcArray) {

        let menuElement = document.createElement("a");

        menuElement.setAttribute("href", "players.html?letter=" + abcArray[element]);

        menuElement.setAttribute("class", "letter")

        menuElement.innerText = " " + abcArray[element] + " ";

        menu.appendChild(menuElement);

    }

    highlightCurrent();
}

function highlightCurrent() {

    let urlString = window.location.href;
    let url = new URL(urlString);
    let letter = url.searchParams.get("letter");

    currentLink = document.querySelectorAll('a[href="players.html?letter=' + letter + '"]');
    currentLink.forEach(function(link) {
        link.className += ' activeLetter';
    });

}

generateMenu();
