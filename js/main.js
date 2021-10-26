/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $imagePreview = document.querySelector('.preview-image');

$photoUrl.addEventListener('input', event => {
  $imagePreview.src = event.target.value;
});
