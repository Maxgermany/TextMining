var wordMap = {
    "game information" : "Game informations",
    "player information" : "Player informations",

    "player_id" : "PlayerID",
    "name" : "Name",
    "position" : "Position",
    "height" : "Height",
    "weight" : "Weight",
    "current_team" : "Current team",
    "birth_place" : "Birth place",
    "birth_date" : "Birth date",
    "college" : "College",
    "high_school" : "High school",
    "draft_team" : "Draft team",
    "draft_round" : "Draft round",
    "draft_position" : "Draft position",
    "draft_year" : "Draft year",
    "current_salary" : "Current salary",

    "year" : "Year",
    "date" : "Game date",
    "game_number": "Game number",
    "age" : "Age",
    "team" : "Team",
    "game_location" : "Game location",
    "opponent" : "Opponent",
    "player_team_score" : "Team score",
    "opponent_score" : "Opponent score",
    "game_won" : "Game won",

    "rushing_attempts": "Rushing attempts",
    "rushing_yards" : "Rushing yards",
    "rushing_touchdowns" : "Rushing touchdowns",

    "receiving_targets" : "Receiving targets",
    "receiving_receptions" : "Receiving receptions",
    "receiving_yards" : "Receiving yards",
    "receiving_touchdowns" : "Receiving touchdowns",

    "punt_return_attempts" : "Punt return attempts",
    "punt_return_yards" : "Punt return yards",

    "passing_attempts" : "Passing attempts",
    "passing_completions" : "Passing completions",
    "passing_yards" : "Passing yards",
    "passing_rating" : "Passing rating",
    "passing_touchdowns" : "Passing touchdowns",
    "passing_sacks" : "Passing sacks",
    "passing_sacks_yards_lost" : "Passing sacks - yards lost",
    "passing_interceptions" : "Passing interceptions",

    "defense_tackles" : "Defense tackles",
    "defense_tackle_assists" : "Defense tackle assists",
    "defense_interceptions" : "Defense interceptions",


    "C" : "Center",
    "RB" : "Running Back",
    "FB" : "Fullback",
    "HB" : "Halfback",
    "OG" : "Offensive Guards",
    "OT" : "Offensive Tackle",
    "LG" : "Left Guard",
    "LT" : "Left Tackle",
    "RG" : "Right Guard",
    "RT" : "Right Tackle",
    "TE" : "Tight End",
    "QB" : "Quarterback",
    "WR" : "Wide Receiver",

    "CB" : "Cornerback",
    "DE" : "Defensive End",
    "DT" : "Defensive Tackle",
    "LB" : "Linebacker",
    "ILB" : "Inside Linebacker",
    "MLB" : "Middle Linebacker",
    "NT" : "Nose Tackle",
    "OLB": "Outside Linebacker",
    "S" : "Safety",
    "FS" : "Free Safety",
    "SS" : "Strong Safety",

    "K" : "Kicker",
    "KR" : "Kick Returner",
    "LS" : "Long Snapper",
    "P" : "Punter",
    "PR" : "Punt Runner",


    /**"ARZ" : "Arizona Cardnials",
     "ARI" : "Arizona Cardnials",
     "ATL" : "Atlanta Falcons",
     "BLT" : "Balimore Ravens",
     "BAL" : "Balimore Ravens",
     "BUF" : "Buffalo Bills",
     "CAR" : "Carolina Panthers",
     "CHI" : "Chicago Bears",
     "CIN" : "Cincinnati Bengals",
     "CLV" : "Cleveland Browns",
     "CLE" : "Cleveland Browns",
     "DAL" : "Dallas Cowboys",
     "DEN" : "Denver Broncos",
     "DET" : "Detroit Lions",
     "GB"  : "Green Bay Packers",
     "HST" : "Houston Texas",
     "HOU" : "Houston Texas",
     "IND" : "Indianapolis Colts",
     "JAX" : "Jacksonville Jaguars",
     "KC"  : "Kansas City Chiefs",
     "LV"  : "Las Vegas Raiders",
     "LAC" : "Los Angeles Chargers",
     "LAR" : "Los Angeles Rams",
     "MIA" : "Miami Dolphins",
     "MIN" : "Minnesota Vikings",
     "NE"  : "New England Patriots",
     "NWE"  : "New England Patriots",
     "NO"  : "New Orleans Saints",
     "NYG" : "New York Giants",
     "NYJ" : "New York Jets",
     "PHI" : "Philadelphia Eagles",
     "PIT" : "Pittsburgh Steelers",
     "SF"  : "San Francisco 49ers",
     "SFO"  : "San Francisco 49ers",
     "SEA" : "Seattle Seahawks",
     "TB"  : "Tampa Bay Buccaneers",
     "TAM"  : "Tampa Bay Buccaneers",
     "TEN" : "Tennessee Titans",
     "WAS" : "Washington Football Team"**/
};


function translate(term) {

    let returnValue = term;

    Object.keys(wordMap).forEach(function(key) {
        if (key === term) {
            returnValue = wordMap[key];
        }
    });

    return returnValue; //If no translation is found the original term is returned
}
