$(function() {

  var category = [];
  
  $('[name="movie[category]"]').each(function(){
    var me = $(this);
    category.push(me.data('text'))
  })


  $('#douban').blur(function() {
    var douban = $(this)
    var id = douban.val()

    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data) {

          $('#inputTitle').val(data.title)
          $('#inputDoctor').val(data.directors[0].name)
          $('#inputCountry').val(data.countries[0])
          $('#inputPoster').val(data.images.large)
          $('#inputYear').val(data.year)
          $('#inputSummary').val(data.summary)
          
          var genres = data.genres[0];
          var index = category.indexOf(genres);
          if(index > -1){
            $('[data-text="'+ category[index] +'"]').attr('checked', 'checked');
          }else{
            $('input[checked=checked]').removeAttr('checked');
          }

          $('#inputCategory').val(data.genres[0]);


        }
      })
    }
  })
})