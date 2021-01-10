library(rjson)
library(jsonlite)

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")

#Creating the Folders if not exists
path <- "..\\Data\\Output"
if (!(dir.exists(path))){
  dir.create(path)
}
for (year in years) {
  for (week in weeks) {
    path <- paste(c("..\\Data\\Output\\", year), collapse = "")
    if (!(dir.exists(path))){
      dir.create(path)
    }
  }
}

for (year in years) {
  
  #Read game file
  gameFile <- paste(c("..\\Data\\Kaggle\\", year, "Games.json"), collapse = "")
  resultGames <- rjson::fromJSON(file= gameFile)
  
  #Read players file
  playersFile <- paste(c("..\\Data\\Kaggle\\", year, "Players.json"), collapse = "")
  resultPlayers <- rjson::fromJSON(file = playersFile)
  
  for (week in weeks) {

    #Name of the file for the matching week
    weekFile <- paste(c("..\\Data\\Walterfootball\\", year, "\\week_", week, ".json"), collapse = "")

    if (file.exists(weekFile)) {
      
      resultWeek <- rjson::fromJSON(file = weekFile) #Parse json from file
      
      finalJSON <- list() #The output will be stored in this
      
      finalJSON$week <- resultWeek$week
      
      finalJSON$year <- resultWeek$year
      
      finalJSON$numberOfGames <- resultWeek$numberOfGames
      
      i <- 1 #For iteration
      
      while(i <= as.integer(resultWeek$numberOfGames)){
        
        gameName <- paste(c("Game ", i), collapse = "")
        
        game <- get(gameName, resultWeek) #Get game 1, 2, 3...
        
        allComments <- "" #All comments are saved in one var
        
        for (comment in game$comments) {
          allComments <- paste(allComments, comment, setp=" ")
        }
        
        game$comments <- allComments
        
        playersInGame <- list() #In this list will all players that occur in the comments be saved
        
        j <- 1 #For iteration
        
        for (player in resultPlayers) {
          if(length(grep(player$name, allComments) > 0)) { #Checks if playername is in comments
            playersInGame[[j]] <- player
            j <- j + 1
          }
        }
        
        game$players <- playersInGame
        
        finalJSON$games[[i]] <- game
        
        i <- i + 1
        
      }
      
      exportJSON <- jsonlite::toJSON(finalJSON, pretty = TRUE) #Generate JSON
      
      write(exportJSON, paste(c("..\\Data\\Output\\" , year, "\\week_",  week, ".json"), collapse = "")) #Save JSON to file
    
    }
  }
}

