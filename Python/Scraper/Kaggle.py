import ijson  # Module for reading big json-files
import os
import json
import re
import datetime

# TODO: Combine split function of year and week in one

def splitKaggleData(splitYear):
    sourceFile = open("..\\..\\Data\\Kaggle\\games.json",
                      'r')  # Remember to unzip the file and remove it after processing, because it is to big for Github

    objects = ijson.items(sourceFile, 'item')

    # Filter games that are in the given year
    games = (game for game in objects if int(game['year']) == splitYear)

    # The result variables (dictioniary)
    gamesAfterYears = {}
    playerIDsAfterYears = {}

    # Create neccesary dictionary entry for all years
    for year in range(splitYear, splitYear + 1):
        stringYear = str(year)
        gamesAfterYears[stringYear] = '['  # For json notation
        playerIDsAfterYears[stringYear] = []  # Player ids are saved in a list

    # Iterate over all games and add them in right section of the dictionary
    for game in games:
        gamesAfterYears[game['year']] += str(game) + ","
        playerIDsAfterYears[game['year']].append(game['player_id'])

    for year in range(splitYear, splitYear + 1):
        stringYear = str(year)

        playerIDsAfterYears[stringYear] = list(dict.fromkeys(playerIDsAfterYears[stringYear]))  # Remove duplicates

        data = gamesAfterYears[stringYear]
        data = data[:-1]  # Remove last ","
        data += "]"  # For json notation

        gamesAfterYears[stringYear] = data

    for year in gamesAfterYears:

        path = "..\\..\\Data\\Kaggle\\"

        if not os.path.exists(path):
            os.makedirs(path)

        data = gamesAfterYears[year]

        if len(data) < 15:  # If there are incorrect value, they are filtered here
            continue

        # Adjustments for the json
        data = re.sub("'", '"', data)
        data = re.sub("True", "true", data)
        data = re.sub("False", "false", data)
        data = re.sub('[D][e][c][i][m][a][l][(]["]([0-9]*[.][0-9]*)["][)]', '\\1',
                      data)  # Replace 'Decimal("0.0")' with '0.0'

        data = json.loads(data)

        jsonOutputFile = open(path + year + "Games.json", "w")
        jsonOutputFile.write(json.dumps(data, indent=4))
        jsonOutputFile.close()

    sourceFile.close()

    # Find the players to the ids
    findPlayernameToId(playerIDsAfterYears)

    #Split the data further in gameWeeks
    splitYearAfterWeek(splitYear)


def findPlayernameToId(ids):
    # ids has the structure { "year1": [playerid1, playerid2, playerid3...], "year2": [playerid1, playerid2, playerid3, ...], ...}

    path = "..\\..\\Data\\Kaggle\\"

    for year in ids:

        sourceFile = open("..\\..\\Data\\Kaggle\\profiles.json", 'r')
        objects = ijson.items(sourceFile, 'item')
        players = (playerObjects for playerObjects in objects)  # Find the player with the matching id

        data = "["

        # Checks for each player from the big player.json, if he occurs in the id list of the years
        for player in players:
            if player['player_id'] in ids[year]:
                data += '{'
                for key, value in player.items():
                    if str(value)[-1] == ' ': # e.g. "Andrew Johnson " -> "Andrew Johnson"
                        value = value[:-1]
                    data += '"' + str(key) + '": "' + str(value).replace('"', "'") + '",'
                data = data[:-1] # Remove last comma
                data += '},'
        data = data[:-1] # Remove last comma
        data += "]"

        data = json.loads(data)

        jsonOutputFile = open(path + year + "Players.json", "w")
        jsonOutputFile.write(json.dumps(data, indent=4))
        jsonOutputFile.close()

#Splits the year data in to weeks after season
def splitYearAfterWeek(year):

    calendarWeeks = getCalenderWeeksAsArray(year)

    if year != 2017:  # For year 2017 is the dataset only partly available

        nflWeekNumber = 18  # A season goes from year to the other, so year x has the last 4 weeks of year x-1
        pathYear = year

        for week in calendarWeeks:

            if nflWeekNumber == 22:  # At this point the games are of the new season of the given year
                nflWeekNumber = 1

            weekGames = '['

            sourceFile = open("..\\..\\Data\\Kaggle\\" + str(year) + "Games.json", 'r')

            games = ijson.items(sourceFile, 'item')

            # Filter games that are in the given week of the year
            gameFilter = (game for game in games if getCalendarWeek(game['date']) == week)

            for game in gameFilter:
                weekGames += str(game) + ","

            weekGames = weekGames[:-1]
            weekGames += "]"

            sourceFile.close()

            data = weekGames

            # Adjustments for the json
            data = re.sub("'", '"', data)
            data = re.sub("True", "true", data)
            data = re.sub("False", "false", data)
            data = re.sub('[D][e][c][i][m][a][l][(]["]([0-9]*[.][0-9]*)["][)]', '\\1',
                          data)  # Replace 'Decimal("0.0")' with '0.0'

            data = json.loads(data)

            path = "..\\..\\Data\\Kaggle\\" + str(pathYear) + "\\"

            if not os.path.exists(path):
                os.makedirs(path)

            if nflWeekNumber < 10:
                nflWeekNumberStr = str(nflWeekNumber)
                nflWeekNumberStr = "0" + nflWeekNumberStr
            else:
                nflWeekNumberStr = str(nflWeekNumber)

            jsonOutputFile = open(path + "week_" + str(nflWeekNumberStr) + ".json", "w")
            jsonOutputFile.write(json.dumps(data, indent=4))
            jsonOutputFile.close()

            nflWeekNumber += 1

    else:

        nflWeekNumber = 1

        for week in calendarWeeks:

            weekGames = '['

            sourceFile = open("..\\..\\Data\\Kaggle\\" + str(year) + "Games.json", 'r')

            games = ijson.items(sourceFile, 'item')

            # Filter games that are in the given year
            gameFilter = (game for game in games if getCalendarWeek(game['date']) == week)

            for game in gameFilter:
                weekGames += str(game) + ","

            weekGames = weekGames[:-1]
            weekGames += "]"

            sourceFile.close()

            data = weekGames

            # Adjustments for the json
            data = re.sub("'", '"', data)
            data = re.sub("True", "true", data)
            data = re.sub("False", "false", data)
            data = re.sub('[D][e][c][i][m][a][l][(]["]([0-9]*[.][0-9]*)["][)]', '\\1',
                          data)  # Replace 'Decimal("0.0")' with '0.0'

            data = json.loads(data)

            path = "..\\..\\Data\\Kaggle\\" + str(year) + "\\"

            if not os.path.exists(path):
                os.makedirs(path)

            if nflWeekNumber < 10:
                nflWeekNumberStr = str(nflWeekNumber)
                nflWeekNumberStr = "0" + nflWeekNumberStr
            else:
                nflWeekNumberStr = str(nflWeekNumber)

            jsonOutputFile = open(path + "week_" + str(nflWeekNumberStr) + ".json", "w")
            jsonOutputFile.write(json.dumps(data, indent=4))
            jsonOutputFile.close()

            nflWeekNumber += 1


def getCalendarWeek(date):
    dateParts = date.split("-")
    calendarWeek = datetime.date(int(dateParts[0]), int(dateParts[1]), int(dateParts[2])).isocalendar()[1]
    return calendarWeek


def getCalenderWeeksAsArray(year):
    sourceFile = open("..\\..\\Data\\Kaggle\\" + str(year) + "Games.json", 'r')

    games = ijson.items(sourceFile, 'item')

    calendarWeeks = []

    for game in games:
        gameDate = game['date']
        calendarWeek = getCalendarWeek(gameDate)
        calendarWeeks.append(calendarWeek)

    sourceFile.close()

    calendarWeeks = list(set(calendarWeeks))  # Remove duplicates

    return calendarWeeks


for year in range(2008, 2018): # Splits the kaggle-data after year
    splitKaggleData(year)
    print("Scrapped year " + str(year) + ".")


for year in range(2008, 2018): # Splits the year further in weeks
    splitYearAfterWeek(year)
    print("Scrapped weeks of year " + str(year) + ".")
