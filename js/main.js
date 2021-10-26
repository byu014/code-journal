/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $imagePreview = document.querySelector('.preview-image');
const $form = document.querySelector('form');
const newEntry = {};
$photoUrl.addEventListener('input', event => {
  $imagePreview.src = event.target.value;
});

$form.addEventListener('submit', event => {
  const $inputs = $form.elements;
  event.preventDefault();
  newEntry[$inputs.title.name] = $inputs.title.value;
  newEntry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  newEntry[$inputs.notes.name] = $inputs.notes.value;
  newEntry.id = data.nextEntryId++;
  data.entries = [newEntry, ...data.entries];
  $imagePreview.src = 'images/placeholder-image-square.jpg';
  event.target.reset();
});
