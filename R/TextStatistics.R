library(tidyverse)
library(tokenizers)
library(rjson)
library(ggplot2)

start_time <- Sys.time()

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")
  
numberOfWords <- 0

listOfWords <- list(0)

for (year in years) {

  for (week in weeks) {

    #Name of the file for the matching week
    weekFile <- paste(c("..\\Data\\Walterfootball\\", year, "\\week_", week, ".json"), collapse = "")

    if (file.exists(weekFile)) {
      
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

            allComments <- paste(comment)
            
            words <- tokenize_words(allComments) #splitting the comments to array of words
            
            listOfWordsC <-c(listOfWords, words) #collect words for data
            
            numberOfWords <- numberOfWords + count_words(allComments) #total words
          
          }

        }
        i <- i + 1
      }
    }
    else {
      error <- paste("file not found:", week, "/", year)
      print(error)
    }
  }

}

print(numberOfWords)

end_time <- Sys.time()

print(end_time - start_time) #time needed for each article read

#CORPUS.TXT full of mistakes, but interesting to read anyway
#lets read corpus
start_time <- Sys.time()

corpus <- paste("..\\Data\\Corpus\\corpus.txt")

text <- readLines(corpus, encoding = "UTF-8")

wordsCorpus <- tokenize_words(text) #list of words

totalWords <- count_words(text) #count total words

print(totalWords)

#sort words by frequency
tab <- table(wordsCorpus[[1]])
tab <- tibble(word = names(tab), count = as.numeric(tab))
arrange(tab, desc(count))

end_time <- Sys.time()
print(end_time - start_time) #time needed for corpus read
