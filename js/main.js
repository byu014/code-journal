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

function renderEntry(journalEntry) {
  /*
  <div class="col-half">
    <div class="input">
      <img class="preview-image" src="https://www.bbvaopenmind.com/wp-content/uploads/2015/12/Ada_Lovelace_Chalon_portrait-1-1024x1024-1.jpg" alt="placeholder-image-square">
    </div>
  </div>
  <div class="col-half">
    <div class="input">
      <h2>Ada Lovelace</h2>
      <p>
        Augusta Ada King, Countness of Lovelace was an English mathematician and writer,
        chiefly known for her work on Charles Baggages proposed mechanical general-purpose computer.
      </p>
      <p>
        She was the first to recognize that the machine had application beyond pure calculation,
        and to have published the first algorithm intended to be carried out by such a machine.
      </p>
    </div>
  </div>
  */
  const $li = document.createElement('li');
  $li.classList.add('row');

  const $colHalf1 = document.createElement('div');
  $colHalf1.classList.add('col-half');

  const $input1 = document.createElement('div');
  $input1.classList.add('input');

  const $image = document.createElement('img');
  $image.classList.add('preview-image');
  $image.setAttribute('src', journalEntry.photoUrl);
  $image.setAttribute('alt', 'place-holder-image-square');

  const $colHalf2 = document.createElement('div');
  $colHalf2.classList.add('col-half');
  const $input2 = document.createElement('div');
  $input2.classList.add('input');

  const $h2 = document.createElement('h2');
  $h2.textContent = journalEntry.title;

  const $p = document.createElement('p');
  $p.textContent = journalEntry.notes;

  $input2.appendChild($h2);
  $input2.appendChild($p);
  $colHalf2.appendChild($input2);
  $input1.appendChild($image);
  $colHalf1.appendChild($input1);
  $li.appendChild($colHalf1);
  $li.appendChild($colHalf2);

  return $li;
}
