/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $imagePreview = document.querySelector('.preview-image');
const $form = document.querySelector('form');
let newEntry = {};
const previousDataJSON = localStorage.getItem('data');
let allData = { ...data };
if (previousDataJSON) {
  allData = JSON.parse(previousDataJSON);
}
$photoUrl.addEventListener('input', event => {
  $imagePreview.src = event.target.value;
});

$form.addEventListener('submit', event => {
  const $inputs = $form.elements;
  event.preventDefault();
  newEntry[$inputs.title.name] = $inputs.title.value;
  newEntry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  newEntry[$inputs.notes.name] = $inputs.notes.value;
  newEntry.entryId = allData.nextEntryId++;
  allData.entries = [newEntry, ...allData.entries];
  newEntry = {};
  $imagePreview.src = 'images/placeholder-image-square.jpg';
  event.target.reset();
});

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(allData);
  localStorage.setItem('data', dataJSON);
});
