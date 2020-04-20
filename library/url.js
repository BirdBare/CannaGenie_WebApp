  

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