library(stringr)
library(rjson)

# Function extracts all numbers from given text
numExtract <- function(string) {
  allNumbers <- regmatches(string, gregexpr("[[:digit:]]+", string))
  allNumbers <- as.numeric(unlist(allNumbers))
  allNumbers <- as.list(strsplit(toString(allNumbers), ", ")[[1]])
  return(allNumbers)
}

# Replace all numbers (from one to ten) that occur as string as integer
numReplace <- function(text) {
  
  numbersList <- list(
    list(" one ", " 1 "),
    list(" two ", " 2 "),
    list(" three ", " 3 "),
    list(" four ", " 4 "),
    list(" five ", " 5 "),
    list(" six ", " 6 "),
    list(" seven ", " 7 "),
    list(" eight ", " 8 "),
    list(" nine ", " 9 "),
    list(" ten ", " 10 "),
    
    list("[(]one ", "(1 "),
    list("[(]two ", "(2 "),
    list("[(]three ", "(3 "),
    list("[(]four ", "(4 "),
    list("[(]five ", "(5 "),
    list("[(]six ", "(6 "),
    list("[(]seven ", "(7 "),
    list("[(]eight ", "(8 "),
    list("[(]nine ", "(9 "),
    list("[(]ten ", "(10 "),
    
    list(" one[)]", " 1)"),
    list(" two[)]", " 2)"),
    list(" three[)]", " 3)"),
    list(" four[)]", " 4)"),
    list(" five[)]", " 5)"),
    list(" six[)]", " 6)"),
    list(" seven[)]", " 7)"),
    list(" eight[)]", " 8)"),
    list(" nine[)]", " 9)"),
    list(" ten[)]", " 10)"),
    
    list(" one.", " 1."),
    list(" two.", " 2."),
    list(" three.", " 3."),
    list(" four.", " 4."),
    list(" five.", " 5."),
    list(" six.", " 6."),
    list(" seven.", " 7."),
    list(" eight.", " 8."),
    list(" nine.", " 9."),
    list(" ten.", " 10."))
  
  for (numberName in numbersList) {
    text <- gsub(numberName[[1]], numberName[[2]], text)
  }
  
  return(text)
}

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

# Finds the sentence to a given position by the dots
findSentenceAfterPosition <- function(comment, index) {
  
  sentenceBeginning <- 0 # Lower Bound
  
  sentenceEnd <- str_length(comment) + 1 # Upper bound
  
  for (dotOccurence in str_locate_all(comment, "[.]")[[1]]) {
    
    if (sentenceBeginning <= dotOccurence[[1]] && dotOccurence[[1]] < index) {
      sentenceBeginning <- dotOccurence[[1]] + 1
    } 
    
    if (sentenceEnd >= dotOccurence[[1]] && dotOccurence[[1]] > index) {
      sentenceEnd <- dotOccurence[[1]]
    }
    
  }
  
  for (dotOccurence in str_locate_all(comment, "[!]")[[1]]) {  # Some sentences start or end with a exclamation mark
    
    if (sentenceBeginning <= dotOccurence[[1]] && dotOccurence[[1]] < index) {
      sentenceBeginning <- dotOccurence[[1]] + 1
    } 
    
    if (sentenceEnd >= dotOccurence[[1]] && dotOccurence[[1]] > index) {
      sentenceEnd <- dotOccurence[[1]]
    }
    
  }
  
  sentence <- str_sub(comment, sentenceBeginning, sentenceEnd)
  
  while (str_sub(sentence, 1, 1) == " ") { # Removes space as first character
    sentence <- str_sub(sentence, 2, str_length(sentence))
  }
  
  return(sentence)
  
}

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")

# Creating the Folders if not exists
path <- "..\\Data\\Output"
if (!(dir.exists(path))){
  dir.create(path)
} else {
  unlink(paste(c(path, "/*"), collapse = "")) # Delete all previous player files
  dir.create(path)
}

for (year in years) {
  for (week in weeks) {
    path <- paste(c("..\\Data\\Output\\", year, "\\"), collapse = "")
    if (!(dir.exists(path))){
      dir.create(path)
    }
  }
}

id <- 1

for (year in years) {
  
  for (week in weeks) {
    
    weekFile <- paste(c("..\\Data\\RMoreInformation\\", year, "\\week_", week, ".json"), collapse = "") # File with the information of the game
    
    if (file.exists(weekFile)) {
      
      resultWeek <- rjson::fromJSON(file = weekFile)
      
      i <- 1 # For iteration purpose
      
      for (game in resultWeek$games) {
        
        game$comments <- numReplace(game$comments)
        
        resultWeek$games[[i]]$comments <- game$comments
        
        j <- 1 # For iteration purpose
        
        if (length(game$players) > 1) { # Games which doesn't have any players are filtered here
          
          for (player in game$players) {
            
            playerInformation <- player$`game information` # Get the detailed information of the player for this game
            
            properties <- paste(names(playerInformation), playerInformation)
            
            playerComment <- "" # All parts in the comment belonging to the player
      
            lastName <- word(player$`player information`$name, -1) # Check if last name occurs later in the text
            
            for (tempCurrentPlayerOccurence in str_locate_all(game$comments, lastName)) { # Iterate over all occurences of the last name of the player in the game comment

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

            
            numbers <- numExtract(playerComment) # Get numbers from text
            
            # Check for each number if it occurs in the statistics of the player
            for (number in numbers) {
              
              for (property in properties) {
                
                propertyName <- strsplit(property, "[[:space:]]")[[1]][1]
                propertyValue <- strsplit(property, "[[:space:]]")[[1]][2]
                
                if (number == propertyValue && propertyName != "game_number") {
                  
                  if (number != 0) {
                    
                    playerInformation[[propertyName]] <- list(propertyValue, id, findSentenceAfterPosition(playerComment, str_locate(playerComment, number)[[1]])) # Add marker and unique ID for annotation, if match is found
                    names(playerInformation[[propertyName]]) <- c("propertyValue", "annotationID", "sentence") 
                  
                    id <- id + 1
                  }
                
                }
                
              }
              
            }
            
            resultWeek$games[[i]]$players[[j]]$`game information` <- playerInformation
            
            resultWeek$games[[i]]$players[[j]]$`game information`[["comment"]] <- playerComment 
            
            j <- j + 1
            
          }
        
        }
          
        i <- i + 1
          
      }
      
      exportJSON <- rjson::toJSON(resultWeek, 1) # Generate JSON
      
      fileName <- paste(c("..\\Data\\Output\\", year, "\\week_", week, ".json"), collapse = "")
      
      write(exportJSON, fileName) # Save JSON to file
      
    }
    
  }
  
}
