library(stringr)
library(rjson)
library(rlist)


# Finds the first "." after the occurence of the player (the end of the sentence)
findFirstDotAfterPlayer <- function(comment, playerIndex) {
  
  dotIndex <- str_length(comment) + 1 # Upper bound
  
  for (dotOccurence in str_locate_all(comment, "[.]")[[1]]) {
    if (dotOccurence[[1]] <= dotIndex && dotOccurence[[1]] >= playerIndex) {
      dotIndex <- dotOccurence[[1]]
    }
  }
  
  return(dotIndex)
}

addPlayerData <- function(playerData, comment) {
  
  playerFile <- paste(c("..\\Data\\Output\\Player\\", playerData$`player information`$name, ".json"), collapse = "")
  
  if (file.exists(playerFile)) {
    
    exportPlayerData <- rjson::fromJSON(file = playerFile)
    
    numberGames <- exportPlayerData[["numberGames"]] + 1
    
    exportPlayerData$numberGames <- numberGames
    
    exportPlayerData[["games"]][[numberGames]] <- playerData$`game information`
    exportPlayerData[["games"]][["comment"]] <- comment
    
  } else {
    
    exportPlayerData <- playerData$`player information`
    exportPlayerData[["games"]][[1]] <- playerData$`game information`
    exportPlayerData[["games"]][[1]][["comment"]] <- comment
    exportPlayerData[["numberGames"]] <- 1
    
  }
  
  exportPlayerData <- rjson::toJSON(exportPlayerData, 1) # Generate JSON
  
  write(exportPlayerData, playerFile) # Save JSON to file
}

# Creating the Folders if not exists
path <- "..\\Data\\Output\\"
if (!(dir.exists(path))){
  dir.create(path)
}
path <- "..\\Data\\Output\\Player\\"
if(!(dir.exists(path))) {
  dir.create(path)
}

unlink(paste(c(path, "/*"), collapse = "")) # Delete all previous player files

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")

allPlayersFile <- "..\\Data\\Output\\Player\\AllPlayers.json"

i <- 1

allPlayers <- list("")

for (year in years) {
  
  for (week in weeks) {
    
    weekFile <- paste(c("..\\Data\\Output\\", year, "\\week_", week, ".json"), collapse = "") # File with the information of the game
    
    if (file.exists(weekFile)) {
      
      resultWeek <- rjson::fromJSON(file = weekFile)
      
      for (game in resultWeek$games) {
        
        if (length(game$players) > 1) {
          
          for (player in game$players) {
            
            playerInformation <- player$`game information`
            
            properties <- paste(names(playerInformation), playerInformation)

            playerComment <- ""
            
            for (tempCurrentPlayerOccurence in str_locate_all(game$comments, player$`player information`$name)) { # If a player occurs more than once in a comment, we have to find all belonging parts
              
              firstOccurenceOfOtherPlayerInText <- str_length(game$comments) # Upper bound
              
              for (playerTemp in game$players) { # For all players in the comment
                
                playerOccurenceInText <- str_locate_all(game$comments, playerTemp$`player information`$name) # All occurences of the current player in the comment
                
                for (occurenceIndex in playerOccurenceInText) {
                  
                  if (firstOccurenceOfOtherPlayerInText > occurenceIndex[[1]] && occurenceIndex[[1]] > tempCurrentPlayerOccurence[[2]]) { # If the position of the temp player is between the current player and the current upper bound we change the upper bound
                    firstOccurenceOfOtherPlayerInText <- occurenceIndex[[1]] - 1 # Char position before the temp player
                  }
                  
                }
                
              }
              
              endOfPlayerSentence <- findFirstDotAfterPlayer(game$comments, tempCurrentPlayerOccurence[[2]])
              
              if (endOfPlayerSentence > firstOccurenceOfOtherPlayerInText) {
                firstOccurenceOfOtherPlayerInText <- endOfPlayerSentence
              }
              
              playerComment <- paste(c(playerComment, substr(game$comments, tempCurrentPlayerOccurence[[1]], firstOccurenceOfOtherPlayerInText)), collapse="") # The belonging comment part
              
            }
            
            addPlayerData(player, playerComment)
            
            if (!is.element(player$`player information`$name, allPlayers)) {
              allPlayers[[i]] <- player$`player information`$name
              i <- i + 1
            }
            
          }
          
        }
        
      }
      
    }
    
  }
  
}

allPlayers <- allPlayers[order(unlist(allPlayers))]

allPlayers <- rjson::toJSON(allPlayers, 1)

write(allPlayers, allPlayersFile)
