var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var request = require("request");

//var baseURL = "http://localhost:8080/";
var baseURL = "http://api.cannagenie.ngrok.io/";

http.listen(8079);

//create website
app.get ('/', function(request, response) 
{
  response.sendFile(__dirname + "/index.html");
});

//access local folder
app.use('/', express.static(__dirname));

var allStrains;
var allEffects;

const url = baseURL + "api/search";
var request_parameters = 
{   
  "category": "strain",
  "results_per_page" : "200000",
};
request({url:url, qs:request_parameters}, function(err,reponse,body)
{
  if(reponse.statusCode == "404")
  {
  }
  else
  {
    allStrains = JSON.parse(body).result.result.toString().toLowerCase().split(",");
  }
});
var request_parameters = 
{   
  "category": "effect",
  "results_per_page" : "200000",
};
request({url:url, qs:request_parameters}, function(err,reponse,body)
{
  if(reponse.statusCode == "404")
  {
  }
  else
  {
    allEffects = JSON.parse(body).result.result.toString().toLowerCase().split(",");
  }
});


//connect to socket from webpage
io.on("connection", function(socket)
{
  socket.emit("connect","");
  //emit on connection to send socket.id

  socket.on("GenerateSearch", function(data,fn)
  {
      const url = baseURL + "api/multidisambiguate";
      const request_parameters = 
      {  
        "input": data,
      };

      request({url:url, qs:request_parameters}, function(err,reponse,body)
      {
	      if(reponse.statusCode == "404")
	      {
	      }
	      else
	      {
          var searchData = JSON.parse(body).result;

          fn(searchData);
        }
      });
       
  });

  socket.on("GenerateRecommendation", function(req,fn)
  {

    var latitude = req.latitude;
    var longitude = req.longitude;
    var data = req.values;
    //extract data from data ID object

    if(data.length > 0)
    {
      var strainTags = [];
      var effectTags = [];
      var garbageTags = [];

      data.split(",").forEach(element =>
      {
        if(allStrains.indexOf(element) != -1)
        {
          strainTags.push(element);
        }
        else if(allEffects.indexOf(element) != -1)
        {
          effectTags.push(element);
        }
        else
        {
          garbageTags.push(element);
        }
      });
    
      strainTags = strainTags.toString();
      effectTags = effectTags.toString();
      garbageTags = garbageTags.toString();

      if(strainTags.length > 0 || effectTags.length > 0)
      {
            
        const url = baseURL + "api/recommend";
        const request_parameters = 
        {  
          "liked_strains": strainTags,
          "desired_effects": effectTags,
          "results_per_page": 7,
          "return_details": true,
          "latitude" : latitude,
          "longitude": longitude,
          "distance_threshold":100000,
        };

        request({url:url, qs:request_parameters}, function(err,reponse,body)
        {
	        if(reponse.statusCode == "404")
	        {
	        }
	        else
	        {
            var result = JSON.parse(body).recommendations.results;
            fn(result)
	         }
        });
      }
	  }
  });
  //end socket.on recommend
 
  //api search if I can figure out source in autocomplete.
  socket.on("search", function(data, fn)
  {

    const url = baseURL + "api/search";
    const request_parameters = 
    { 
    "input": data,
    "category": "",
    "page" : "",
    "results_per_page" : "100",
    };

    request({url:url, qs:request_parameters}, function(err,reponse,body)
    {
	    if(reponse.statusCode == "404")
	    {
	    }
	    else
	    {
        var result = JSON.parse(body).result.result;
        fn(result);
        //send result to client side in non JSON format.
	    }
    });
  });
});



