

if(navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(function (position)
  {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var obj = {values:list, latitude:lat, longitude:lon};
    SendSocket("GenerateRecommendation",obj);
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