import ijson  # Module for reading big json-files
import os
import json
import re


def splitKaggleData(splitYear):
    sourceFile = open("..\\..\\Data\\Kaggle\\games.json", 'r') # Remember to unzip the file and remove it after processing, because it is to big for Github

    objects = ijson.items(sourceFile, 'item')

    # Filter games that are earlier then 2007
    games = (game for game in objects if int(game['year']) == splitYear)

    # The result variables (dictioniary)
    gamesAfterYears = {}
    playerIDsAfterYears = {}

    # Create neccesary dictionary entry for all years
    for year in range(splitYear, splitYear + 1):
        stringYear = str(year)
        gamesAfterYears[stringYear] = '['  # For json notation
        playerIDsAfterYears[stringYear] = [] # Player ids are saved in a list

    # Iterate over all games and add them in right section of the dictionary
    for game in games:
        gamesAfterYears[game['year']] += str(game) + ","
        playerIDsAfterYears[game['year']].append(game['player_id'])

    for year in range(splitYear, splitYear + 1):
        stringYear = str(year)
        
        playerIDsAfterYears[stringYear] = list(dict.fromkeys(playerIDsAfterYears[stringYear])) # Remove duplicates

        data = gamesAfterYears[stringYear]
        data = data[:-1]  # Remove last ","
        data += "]"  # For json notation

        gamesAfterYears[stringYear] = data

    for year in gamesAfterYears:

        path = "..\\..\\Data\\Kaggle\\"

        if not os.path.exists(path):
            os.makedirs(path)

        data = gamesAfterYears[year]

        if len(data) < 15: # If there are incorrect value, they are filtered here
            continue

        # Adjustments for the json
        data = re.sub("'", '"', data)
        data = re.sub("True", "true", data)
        data = re.sub("False", "false", data)
        data = re.sub('[D][e][c][i][m][a][l][(]["]([0-9]*[.][0-9]*)["][)]', '\\1', data) # Replace 'Decimal("0.0")' with '0.0'

        data = json.loads(data)

        jsonOutputFile = open(path + year + "Games.json", "w")
        jsonOutputFile.write(json.dumps(data, indent=4))
        jsonOutputFile.close()

    sourceFile.close()

    #Find the players to the ids
    findPlayernameToId(playerIDsAfterYears)

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
                    data += '"' + str(key) + '": "' + str(value).replace('"', "'") + '",'
                data = data[:-1]
                data += '},'
        data = data[:-1]
        data += "]"

        data = json.loads(data)

        jsonOutputFile = open(path + year + "Players.json", "w")
        jsonOutputFile.write(json.dumps(data, indent=4))
        jsonOutputFile.close()

for year in range(2008, 2018):
    splitKaggleData(year)
    print("Splitted year " + year + ".")