from bs4 import BeautifulSoup
import requests
import json
import re
import os


def scrapWalterfootball(year, week):
    # Einlesen der Webseite
    url = 'https://walterfootball.com/nflreview' + year + '_' + week + '.php'
    page = requests.get(url)

    soup = BeautifulSoup(page.content, 'html.parser')

    removeScripts(soup)

    removeNoScripts(soup)

    removeFonts(soup)

    removeLinks(soup)

    removeTable(soup)

    mainList = soup.find('div', id='MainContentBlock')

    mainList = str(mainList)

    mainList = mainList[mainList.find("<br/> <br/>"):]

    # Extrahieren der Spiele
    games = str(mainList).split("<img ")

    for x in games: # Remove pictures from the website that are not a logo
        if ".jpg" in x and "src=" in x and "logo" not in x:
            games.remove(x)

    data = '{'

    data += '"year": "' + year + '",'

    data += '"week": "' + str(week) + '",'

    numberGames = 1

    for i in range(int((len(games) - 1) / 2)):
        temp = ""
        try:
            game = games[2 + (i * 2)]

            # Extrahieren der Listenpunkte
            points = game.split("<li>")

            # Extrahieren der Teamnamen und Spielstände
            teams = points[0].split("<br/> <b>")

            if len(teams) == 1:
                teams = teams[0].split("</b>")
            else:
                teams = teams[1].split("</b>")

            teams = teams[0]

            teams = teams.split(" ")

            teams = list(filter(None, teams))

            if len(teams) == 5:
                teams = teams[1:]

            #Check for false entries and do not include them
            if not isinstance(teams, list) or len(teams) < 4:
                continue

            #Do not include entries with not numeric points
            if not (teams[1].replace(",", "").isnumeric() and teams[3].replace('"', "").isnumeric()):
                continue


            temp += ' "Game ' + str(numberGames) + '": {'

            temp += '"Team 1": {"Name" : "' + teams[0].replace('"', "") + '", "Points": "' + teams[1].replace(",", "") + '"},'

            temp += '"Team 2": {"Name" : "' + teams[2].replace('"', "") + '", "Points": "' + teams[3].replace('"', "").replace(",", "") + '"},'

            temp += '"comments" : {'

            temp += '"amount": "' + str(len(points) - 1) + '"'

            if len(points) - 1 != 0:
                temp += ','

            # Aufschreiben der Listenpunkte
            for j in range(int(len(points) - 1)):

                temp += '"' + str(j + 1) + '": "' + str(points[j + 1]).replace('"', "").replace('\n', ' ').replace('\r',
                                                                                                                   '').replace(
                    '"', "").replace("</li>", "").replace("</div>", "").replace("<center>", "").replace("</center>", "") + '"'

                if j != int(len(points) - 2):
                    temp += ','

            temp += '}}'

            if i != int((len(games) - 1) / 2) - 1:
                temp += ','

            #temp is used to not write to the json until there is no error
            data += temp
            numberGames += 1
        except:
            print("Problem")

    data += ',"numberOfGames": "' + str(numberGames-1) + '"'
    data += '}'

    data = data.replace("<br/>", "")

    #Reduce several whitespaces to one
    data = re.sub(' +', ' ', data)

    #Remove whitespace after "
    data = re.sub('" ', '"', data)

    #Remove control char
    data = re.sub("	", '', data)

    if data[-2] == ",":
        data = data[:-2]
        data += "}"

    try:
        data = json.loads(data)

        path = "..\\..\\Data\\Walterfootball\\" + year

        # Speichern in einer JSON-Datei
        if not os.path.exists(path):
            os.makedirs(path)

        f = open(path + "\\week_" + week + ".json", "w")
        f.write(json.dumps(data, indent=4))
        f.close()

        print("Week " + week + " of year " + year + " scraped")
    except:
        print("Could not scrap week " + week + " of " + year)


def scrapWalterfootballCorpus(year, week):

    print("Now Scrapping week " + week + " of " + year + " for corpus")

    url = 'https://walterfootball.com/nflreview' + year + '_' + week + '.php'
    page = requests.get(url)

    soup = BeautifulSoup(page.content, 'html.parser')

    removeScripts(soup)

    removeNoScripts(soup)

    removeFonts(soup)

    removeLinks(soup)

    removeTable(soup)

    removeBold(soup)

    if "We do not have an article for URL" in str(soup):
        print("Couldn't scrap week " + week + " of " + year + " for corpus")
    else:

        file = open("..\\..\\Data\\Corpus\\corpus.txt", "a+")

        soup = soup.find('div', id='MainContentBlock')

        for listElement in soup.find_all("li"):
            file.write(' '.join(listElement.text.replace('\n', ' ').replace('\r', ' ').split()))

        file.close()


def removeScripts(soup):
    [s.extract() for s in soup('script')]


def removeNoScripts(soup):
    [s.extract() for s in soup('noscript')]


def removeFonts(soup):
    [s.extract() for s in soup('font')]


def removeLinks(soup):
    [s.extract() for s in soup('a')]


def removeTable(soup):
    [s.extract() for s in soup('table')]


def removeBold(soup):
    [s.extract() for s in soup('b')]#

def removeNonLogoImages(tag):
    return bool(tag.get("img") and tag.contains(".jpg"))


weeks = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18",
         "19", "20"]

year = 2008

while (year <= 2017):
    for i in weeks:
        scrapWalterfootball(str(year), i)
        #scrapWalterfootballCorpus(str(year), i)
    year += 1
