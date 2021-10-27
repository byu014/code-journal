/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $imagePreview = document.querySelector('.preview-image');
const $form = document.querySelector('form');
const $ul = document.querySelector('.entries');
const $body = document.querySelector('body');
const $views = document.querySelectorAll('.view');
const $noEntries = document.querySelector('.no-entries');
let newEntry = {};
const previousDataJSON = localStorage.getItem('data');
let allData = { ...data };

if (previousDataJSON) {
  allData = JSON.parse(previousDataJSON);
}

$photoUrl.addEventListener('input', event => {
  $imagePreview.setAttribute('src', event.target.value);
});

$form.addEventListener('submit', event => {
  const $inputs = $form.elements;
  event.preventDefault();
  newEntry[$inputs.title.name] = $inputs.title.value;
  newEntry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  newEntry[$inputs.notes.name] = $inputs.notes.value;
  newEntry.entryId = allData.nextEntryId++;
  allData.entries = [newEntry, ...allData.entries];
  $imagePreview.src = 'images/placeholder-image-square.jpg';
  $ul.prepend(renderEntry(newEntry));
  newEntry = {};
  for (let view of $views) {
    if (view.getAttribute('data-view') === 'entries') {
      view.classList.remove('hidden');
      allData.view = 'entries';
    } else {
      view.classList.add('hidden');
    }
  }

  event.target.reset();
});

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(allData);
  localStorage.setItem('data', dataJSON);
});

window.addEventListener('DOMContentLoaded', () => {
  for (let entry of allData.entries) {
    $ul.appendChild(renderEntry(entry));
  }
  for (let view of $views) {
    if (view.getAttribute('data-view') === allData.view) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }
  if (allData.entries.length) {
    $noEntries.classList.add('hidden');
  }
});

$body.addEventListener('click', event => {
  if (!event.target.matches('.view-change')) {
    return;
  }

  const dataView = event.target.getAttribute('data-view');
  for (let view of $views) {
    if (view.getAttribute('data-view') === dataView) {
      view.classList.remove('hidden');
      allData.view = view.getAttribute('data-view');
    } else {
      view.classList.add('hidden');
    }
  }

  event.preventDefault();
});

function renderEntry(journalEntry) {
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
  /*
  <div class="col-half">
    <div class="input">
      <img class="preview-image" src="image.png" alt="placeholder-image-square">
    </div>
  </div>
  <div class="col-half">
    <div class="input">
      <h2>Ada Lovelace</h2>
      <p>
        textContent
      </p>
    </div>
  </div>
  */
}
