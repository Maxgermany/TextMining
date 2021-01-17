library(stringr)
library(rjson)

numExtract <- function(string) {
  allNumbers <- regmatches(string, gregexpr("[[:digit:]]+", string))
  allNumbers <- as.numeric(unlist(allNumbers))
  allNumbers <- as.list(strsplit(toString(allNumbers), ", ")[[1]])
  return(allNumbers)
}

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
  
  for (week in weeks) {
    
    weekFile <- paste(c("..\\Data\\RMoreInformation\\", year, "\\week_", week, ".json"), collapse = "") # File with the information of the week and the comments
    
    if (file.exists(weekFile)) {
      
      resultWeek <- rjson::fromJSON(file = weekFile)
      
      i <- 1
      
      for (game in resultWeek$games) {
        
        numbers <- numExtract(game$comments)
        
        j <- 1
        
        if (length(game$players) > 1){
          
          for (player in game$players) {
            
            playerInformation <- player$`game information`
            
            properties <- paste(names(playerInformation), playerInformation)
            
            for (number in numbers) {
              
              for (property in properties) {
                
                propertyName <- strsplit(property, "[[:space:]]")[[1]][1]
                propertyValue <- strsplit(property, "[[:space:]]")[[1]][2]
                
                if (number == propertyValue) {
                  
                  if (number != 0) {
                    
                    playerInformation[[propertyName]] <- list(propertyValue, 13)
                    names(playerInformation[[propertyName]]) <- c("propertyValue", "annotationID")
                  
                  }
                
                }
                
              }
              
            }
            
            resultWeek$games[[i]]$players[[j]]$`game information` <- playerInformation
            
            j <- j + 1
            
          }
        
        }
          
        i <- i + 1
          
      }
      
      exportJSON <- rjson::toJSON(resultWeek, 1) #Generate JSON
      
      fileName <- paste(c("..\\Data\\Output\\", year, "\\week_", week, ".json"), collapse = "")
      
      write(exportJSON, fileName) #Save JSON to file
      
    }
    
  }
  
}
