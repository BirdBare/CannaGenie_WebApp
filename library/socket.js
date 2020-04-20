  

  var searchParams = new URLSearchParams(window.location.search);
  const urlParameters = {};
  // Display the key/value pairs
  for(var pair of searchParams.entries()) {
    urlParameters[pair[0]] = pair[1];
  }

  function GetSearch(key)
  {
    return urlParameters[key];
  }




  var socket = io();

  function GetId()
  {
    return socket.id;
  }

  function SendSocket(id,data)
  {
    var obj = { id:socket.id, payload:data };
    socket.emit(id, obj)
  }

  function GenerateSearch(list)
  { 
    var obj = {values:list};
    SendSocket("GenerateSearch",obj);
  }

  function GenerateRecommendation(list)
  {
    if(navigator.geolocation)
    {
    console.log("enabled");
    navigator.geolocation.getCurrentPosition(function (position)
    {
            console.log("hello")

      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      var obj = {values:list, latitude:lat, longitude:lon};
      SendSocket("GenerateRecommendation",obj);
      console.log(lat);
    },
    function(error)
    { 
      var obj = {values:list, latitude:undefined, longitude:undefined};
      SendSocket("GenerateRecommendation",obj);

    },
    {
      timeout:100,
    });
    }
  }