start_time <- Sys.time()

library(tidyverse)
library(tokenizers)
library(rjson)

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")


#Creating the Folders if not exists
path <- "..\\Data\\RTextstatistics"
if (!(dir.exists(path))){
  dir.create(path)
} else {
  unlink(paste(c(path, "/*"), collapse = "")) # Delete all previous files
  dir.create(path)
}
for (year in years) {
  for (week in weeks) {
    path <- paste(c("..\\Data\\RTextStatistics\\", year), collapse = "")
    if (!(dir.exists(path))){
      dir.create(path)
    }
  }
}

wordsPerGame <- 0

listOfWords <- list()

for (year in years) {
  
  for (week in weeks) {

    #Name of the file for the matching week
    weekFile <- paste(c("..\\Data\\Walterfootball\\", year, "\\week_", week, ".json"), collapse = "")

    if (file.exists(weekFile)) {

      finalJSON <- list() #The output will be stored in this
      
      resultWeek <- rjson::fromJSON(file = weekFile) #Parse json from file
      
      i <- 1 #For iteration
      
      while(i <= as.integer(resultWeek$numberOfGames)){
        
        gameName <- paste(c("Game ", i), collapse = "")
        
        game <- get(gameName, resultWeek) #Get game 1, 2, 3...
        
        allComments <- "" #All comments are saved in one var
        
        firstNum <- TRUE #The first element of the game$comments is the number of comments, we don't want in the text
        
        for (comment in game$comments) {
          if(firstNum){
            firstNum <- FALSE
          } else {
            allComments <- paste(allComments, comment, setp=" ")

            words <- tokenize_words(allComments) #splitting the comments to array of words

            c(listOfWords, words) #collects words

            wordsPerComment <- length(words[[1]]) #length of array -> number of words per comment

            wordsPerGame <- wordsPerGame + wordsPerComment
          }

        }
        
        game$comments <- allComments
        
        finalJSON$games[[i]] <- game

        exportJSON <- rjson::toJSON(wordsPerGame, 1) #Generate JSON
      
        fileName <- paste(c("..\\Data\\RTextStatistics\\" , year, "\\week_",  week, "\\game_", i, ".json"), collapse = "")
      
        write(exportJSON, fileName) #Save JSON to file
        
        i <- i + 1 
      }
    }
  }
}

totalWords <- length(listOfWords)

#sort words by frequency
tab <- table(totalWords)
tab <- data_frame(word = names(tab), count = as.numeric(tab))
arrange(tab, desc(count))

end_time <- Sys.time()

print(end_time - start_time)