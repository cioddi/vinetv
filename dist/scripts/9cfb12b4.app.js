'use strict';

var vinetvApp = angular.module('vinetvApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

  function fetchRecentVines(){
      $.ajax({url:'https://search.twitter.com/search.json?q=vine.co%2Fv%2F&result_type=recent&include_entities=1&rpp=20'});
  }

  function fetchRecent(url){
      if(typeof url === 'undefined')url = '?q=vine.co%2Fv%2F&include_entities=1&rpp=8&geocode=50.9375310,6.9602786,40mi';

      var url = 'https://search.twitter.com/search.json'+url+'&callback=parse';
      console.log('fetching '+url);
      var b = document.createElement("script");
      b.id = "fetcher";
      b.src = url;
      document.body.appendChild(b)
  }
  var already_played = '';
  function parse(content){
      // $('#content_container').html('');
      document.body.removeChild(document.getElementById("fetcher"));
      var res = content.results;
      for(var key in res){
          if(already_played.indexOf(res[key].entities.urls[0].display_url) === -1){
              if($('#content_container > div').length >= 8)$('#content_container > div:first-child').remove();

              already_played += ','+res[key].entities.urls[0].display_url+',';

              var created_at = new Date(res[key].created_at);
              var vine_card = $('<div class="span4"><h4 class="date">'+created_at.getDate()+'.'+(created_at.getMonth()+1)+'.'+created_at.getFullYear()+' '+created_at.getHours()+':'+created_at.getMinutes()+' in '+res[key].location+'</h4><iframe class="vine_card" src="https://'+res[key].entities.urls[0].display_url+'/card" frameborder="0"></iframe></div>');
              $('#content_container').append(vine_card);
          }
      }
      if(typeof content.next_page !== 'undefined')$('.fetch_next').html('<a onclick="fetchRecent(\''+content.next_page+'\');return false;">next Page</a>');
      else $('.fetch_next').html('');
  }
