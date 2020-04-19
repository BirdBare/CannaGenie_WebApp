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

//connect to socket from webpage
io.on("connection", function(socket)
{
  console.log(socket.id);
  socket.emit("connect","");
  //emit on connection to send socket.id

  socket.on("GenerateSearch", function(data)
  {
    var socketId = data.ID;
    data = data.Data;
    //extract data from data ID object
      
      const url = baseURL + "api/multidisambiguate";
      const request_parameters = 
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
          var apiStrain =
            JSON.parse(body).result.result.toString().toLowerCase().split(",");
        }
      });
       
  });

  socket.on("GenerateRecommendation", function(data)
  {
    var socketId = data.ID;
    data = data.Data;
    //extract data from data ID object

    if(data.length > 0)
    {
      /* GET ALL STRAINS AND EFFECTS FROM API */
      const url = baseURL + "api/search";
      const request_parameters = 
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
          var apiStrain =
            JSON.parse(body).result.result.toString().toLowerCase().split(",");
          
          //after getting strains, lets get effects
          request_parameters["category"] = "effect";  
          request({url:url, qs:request_parameters}, function(err,reponse,body)
          {
	          if(reponse.statusCode == "404")
	          {
	          }
	          else
	          {
              var apiEffect =
                JSON.parse(body).result.result.toString().toLowerCase().split(",");

              //we successfully got both strains and effects, so lets filter
              
              data = data.split(",");
              //data is sent as string, we need array to do index search


              var strainTags = [];
              var effectTags = [];
              var garbageTags = [];

              data.forEach(element =>
              {
                if(apiStrain.indexOf(element) != -1)
                {
                  strainTags.push(element);
                }
                else if(apiEffect.indexOf(element) != -1)
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

              console.log("...List of Tags...");
              console.log("Strains: " + strainTags);
              console.log("Effects: " + effectTags);
              console.log("Garbage: " + garbageTags);

              if(strainTags.length > 0 || effectTags.length > 0)
              {
                const url = baseURL + "api/recommend";
                const request_parameters = 
                {  
                  "liked_strains": strainTags,
                  "desired_effects": effectTags,
                  "results_per_page": 5,
                  "return_details": true,
                  "latitude" : "38.576094",
                  "longitude": "-90.502007499999",
                  "distance_threshold":500,
                };

                request({url:url, qs:request_parameters}, function(err,reponse,body)
                {
	                if(reponse.statusCode == "404")
	                {
	                }
	                else
	                {
                    var result = JSON.parse(body).recommendations.results;
                    var obj = {ID:socketId, Data:result};
                    io.emit("RecommendationResult", obj);
                    //send result to client side in non JSON format.
	                }
                });
                //end recommender request
              }
            }
          });
          //end effect search request
	      }
      });
      //end strain search request
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



