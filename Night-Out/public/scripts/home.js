/* global $ */

$(document).ready( function() {
let clickEvent = false;
$('#myCarousel').on('click', '.nav a', function() {
clickEvent = true;
$('.nav li').removeClass('active');
$(this).parent().addClass('active');
}).on('slid.bs.carousel', function(e) {
if (!clickEvent) {
const count = $('.nav').children().length -1;
const current = $('.nav li.active');
current.removeClass('active').next().addClass('active');
const id = parseInt(current.data('slide-to'), 10);
if (count === id) {
$('.nav li').first().addClass('active');
}
}
clickEvent = false;
});
});
