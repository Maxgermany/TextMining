library(tidyverse)
library(tokenizers)
library(rjson)

start_time <- Sys.time()

weeks <- list("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20")

years <- list("2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017")
  
wordsPerGame <- 0

listOfWords <- list()

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

            allComments <- paste(allComments, comment, setp=" ")

            words <- tokenize_words(allComments) #splitting the comments to array of words

            c(listOfWords, words) #collects words

            wordsPerComment <- count_words(allComments) #count words

            wordsPerGame <- wordsPerGame + wordsPerComment
          }

        }
        i <- i + 1
      }
    }
  }

}

totalWords <- length(listOfWords)
totalUniqueWords <- length(unique(listOfWords))

print(totalWords)
print(totalUniqueWords)

end_time <- Sys.time()

print(end_time - start_time) #time needed for each article read

#lets read corpus
start_time <- Sys.time()

corpus <- paste("..\\Data\\Corpus\\corpus.txt")

text <- readLines(corpus)

words <- tokenize_words(text) #list of words

totalWords <- count_words(text) #count total words
totalUniqueWords <- length(unique(words)) #total unique words

print(totalWords)
print(totalUniqueWords)

end_time <- Sys.time()
print(end_time - start_time) #time needed for corpus read

#lets read corpus chunked
start_time <- Sys.time()

chunks <- chunk_text(corpus, chunk_size = "100")
totalChunks <- length(chunks)
print(totalChunks) #num of chunks created

words <- list()
totalWords <- 0

i <- 1 #for iteration

while(i <= totalChunks) {

  words <- c(words, tokenize_words(chunks[i]))

  totalWords <- totalWords + length(words[[1]])

  i <- i + 1

}

print(totalWords)

end_time <- Sys.time()
print(end_time - start_time) #time needed for corpus read

#sort words by frequency
tab <- table(totalWords)
tab <- data_frame(word = names(tab), count = as.numeric(tab))
arrange(tab, desc(count))