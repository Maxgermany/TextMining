start_time <- Sys.time()

testingDifferentData = TRUE # Should be true when the program should take the data in the folder Data/Testdata for testing 

library(stringr)
library(rjson)

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")

#Creating the Folders if not exists
path <- "..\\Data\\RMoreInformation"

if (testingDifferentData) { path <- "..\\Data\\Testdata\\RMoreInformation" }

if (!(dir.exists(path))){
  dir.create(path)
} else {
  unlink(paste(c(path, "/*"), collapse = "")) # Delete all previous player files
  dir.create(path)
}
for (year in years) {
  for (week in weeks) {
    path <- paste(c("..\\Data\\RMoreInformation\\", year), collapse = "")
    
    if (testingDifferentData) { path <- paste(c("..\\Data\\Testdata\\RMoreInformation\\", year), collapse = "") }
    
    if (!(dir.exists(path))){
      dir.create(path)
    }
  }
}

for(year in years) {
  
  for (week in weeks) {
    
    weekFile <- paste(c("..\\Data\\RPlayerNames\\", year, "\\week_", week, ".json"), collapse = "") # File with the information of the week and the comments
    
    if (testingDifferentData) { weekFile <- paste(c("..\\Data\\Testdata\\RPlayerNames\\", year, "\\week_", week, ".json"), collapse = "") }
    gameFile <- paste(c("..\\Data\\Kaggle\\", year, "\\week_", week, ".json"), collapse = "") # File with the detailed information of the player stats in a week
    
    if (file.exists(weekFile)) {
      
      if(file.exists(gameFile)) {
        
        resultWeek <- rjson::fromJSON(file = weekFile)
        
        resultGame <- rjson::fromJSON(file = gameFile)
        
        i <- 1 # For iteration purpose
        
        for (game in resultWeek$games) {
          
          j <- 1 # For iteration purpose
          
          if (length(game$players) < 1) {
            
            resultWeek$games[[i]]$players <- "NoPlayersFound"
            
          } else {
          
            for(playerInGame in game$players) {
              
              for(playerInWeek in resultGame) {
                
                if (playerInGame$player_id == playerInWeek$player_id) {
                  
                  game$players[[j]] <- list(playerInGame, playerInWeek)
                  names(game$players[[j]]) <- c("player information", "game information")
                  j <- j + 1
                  
                }
                
              }
              
            }
            
            resultPlayers <- list()
            
            j <- 1 # for iteration purpose
            
            for (player in game$players) { # Remove duplicates (duplicates don't have two sublists)
              if (length(player) == 2) {
                resultPlayers[[j]] <- player
                j <- j + 1
              }
            }
            
            resultWeek$games[[i]]$players <- resultPlayers
            
          }
          
          i <- i + 1
          
        }
        
        exportJSON <- rjson::toJSON(resultWeek, 1) #Generate JSON
        
        fileName <- paste(c("..\\Data\\RMoreInformation\\", year, "\\week_", week, ".json"), collapse = "")
        
        if (testingDifferentData) { fileName <- paste(c("..\\Data\\Testdata\\RMoreInformation\\", year, "\\week_", week, ".json"), collapse = "") }
        
        write(exportJSON, fileName) #Save JSON to file
       
      }
    }
  }
}

end_time <- Sys.time()

print(end_time - start_time)