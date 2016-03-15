$(function(){

	$('.del').on('click', function(){
		var $a = $(this)

		var id = $a.attr('data-id');

		var parent = $a.closest('tr');

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id=' + id
		}).done(function(ret){
			if(ret.code == 0){
				parent.remove();
			}

		})

	});


})