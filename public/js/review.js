// $(document).ready(function() {
//     $('#rateMe4').mdbRate();
// });
jQuery(document).ready(function($){

    $(".btnrating").on('click',(function(e) {

    var previous_value = $("#selected_rating").val();

    var selected_value = $(this).attr("data-attr");
    $("#selected_rating").val(selected_value);

    $(".selected-rating").empty();
    $(".selected-rating").html(selected_value);

    for (i = 1; i <= selected_value; ++i) {
    $("#rating-star-"+i).toggleClass('btn-warning');
    $("#rating-star-"+i).toggleClass('btn-default');
    }

    for (ix = 1; ix <= previous_value; ++ix) {
    $("#rating-star-"+ix).toggleClass('btn-warning');
    $("#rating-star-"+ix).toggleClass('btn-default');
    }

    
}));
});

const reviewFormHandler = async (event) => {
    event.preventDefault();
    const rating= $("#selected_rating").val()
    const body = document.querySelector('#review_body').value.trim();
    const item_id=$('.item-title').attr('data-attr');

    if (
      body &&
      rating &&
      item_id
    ) {
      const response = await fetch('/item/:id/review', {
        method: 'POST',
        body: JSON.stringify({
          body,
          rating,
          item_id
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document
    .querySelector('.review-form')
    .addEventListener('submit', reviewFormHandler);