 
 $('#input').tagEditor({
      initialTags: [],
      delimiter: ',\t', 
      placeholder: 'Enter CannaGenie Tags...',
      forceLowercase: true,
      autocomplete: {
        delay:0 , 
        minLength: 1, 
        source: function(request, response) 
        {
          socket.emit("search",request.term, function (data)
          {
            response(data);
          });
        }
      }
  });
  
  var value = GetSearch("search");
  if(value != undefined)
  {
    value.split(",").forEach(function(item)
    {
      $('#input').tagEditor('addTag', item);
    });
  }

  $(document).keypress(function(event)
  {
    if(event.which == 13)
    {
      Recommend();
    }
  });