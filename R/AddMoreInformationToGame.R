library(stringr)

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

for(year in years) {
  
  for (week in weeks) {
    
    weekFile <- paste(c("..\\Data\\Output\\", year, "\\week_", week, ".json"), collapse = "") # File with the information of the week and the comments
    
    gameFile <- paste(c("..\\Data\\Kaggle\\", year, "\\week_", week, ".json"), collapse = "") # File with the detailed information of the player stats in a week
    
    if (file.exists(weekFile)) {
      
      if(file.exists(gameFile)) {
        
        resultWeek <- rjson::fromJSON(file = weekFile)
        
        resultGame <- rjson::fromJSON(file = gameFile)
        
        i <- 1 # For iteration purpose
        
        for (game in resultWeek$games) {
          
          j <- 1 # For iteration purpose
          
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
          
          i <- i + 1
          
        }
        
        exportJSON <- jsonlite::toJSON(resultWeek, pretty = TRUE) #Generate JSON
        
        fileName <- paste(c("..\\Data\\Output\\", year, "\\week_", week, ".json"), collapse = "")
        
        write(exportJSON, fileName) #Save JSON to file
        
        #jsonlite saves single values as list, below it is reversed: ["value"] -> "value"
        fileLines <- readLines(fileName)
        
        replaceLines <- gsub(pattern = '\\["', replace = '"', x = fileLines)
        
        replaceLines <- gsub(pattern = '"\\]', replace = '"', x = replaceLines)
        
        replaceLines <- str_replace_all(replaceLines, "\\[([:digit:]*)\\]", "\\1")
        
        replaceLines <- gsub(pattern = '\\[false\\]', replace = 'false', x = replaceLines)
        
        replaceLines <- gsub(pattern = '\\[true\\]', replace = 'true', x = replaceLines)
        
        writeLines(replaceLines, con=fileName)
      }
    }
  }
}
