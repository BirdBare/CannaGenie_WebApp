  var filterChoices =
  {
    highestMatch: 0,
    availability: 1,
    highestRating: 2,
  };

  var filterChoice = filterChoices.highestMatch;

$("#submit").click(function()
{
var search = document.getElementById("input").value;



  if(search.length == 0)
  {
    //go to strain of the day
  }
  else
  {
   var cSearchText = document.getElementById("input").value;

    if(cSearchText.length > 0)
    {
      socket.close();
      window.location = "results.html?" + "search=" + cSearchText + 
        "&page=" + 1 +"&filter=" + filterChoice;  
    }
  }
});