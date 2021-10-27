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

$photoUrl.addEventListener('input', event => {
  $imagePreview.setAttribute('src', event.target.value);
});

$form.addEventListener('submit', event => {
  const $inputs = $form.elements;
  event.preventDefault();
  newEntry[$inputs.title.name] = $inputs.title.value;
  newEntry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  newEntry[$inputs.notes.name] = $inputs.notes.value;
  newEntry.entryId = data.nextEntryId++;
  data.entries = [newEntry, ...data.entries];
  $imagePreview.src = 'images/placeholder-image-square.jpg';
  $ul.prepend(renderEntry(newEntry));
  newEntry = {};
  setView('entries');
  event.target.reset();
});

window.addEventListener('DOMContentLoaded', () => {
  for (let entry of data.entries) {
    $ul.appendChild(renderEntry(entry));
  }
  setView(data.view);
});

$body.addEventListener('click', event => {
  if (!event.target.matches('.view-change')) {
    return;
  }

  const dataView = event.target.getAttribute('data-view');
  setView(dataView);

  event.preventDefault();
});

function renderEntry(journalEntry) {
  const $li = document.createElement('li');
  $li.classList.add('row');
  $li.setAttribute('data-entry-id', journalEntry.entryId);

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

  const $edit = document.createElement('div');
  $edit.classList.add('edit');

  const $h2 = document.createElement('h2');
  $h2.textContent = journalEntry.title;

  const $editIcon = document.createElement('i');
  $editIcon.classList.add('fas');
  $editIcon.classList.add('fa-pen');

  const $p = document.createElement('p');
  $p.textContent = journalEntry.notes;

  $edit.appendChild($h2);
  $edit.appendChild($editIcon);
  $input2.appendChild($edit);
  $input2.appendChild($p);
  $colHalf2.appendChild($input2);
  $input1.appendChild($image);
  $colHalf1.appendChild($input1);
  $li.appendChild($colHalf1);
  $li.appendChild($colHalf2);

  return $li;
  /*
  <li class="row" data-entry-id=id>
    <div class="col-half">
      <div class="input">
        <img class="preview-image" src="image.png" alt="placeholder-image-square">
      </div>
    </div>
    <div class="col-half">
      <div class="input">
        <div class="edit">
          <h2>Ada Lovelace</h2>
          <i class="fas fa-pen"></i>
        </div>
        <p>
          textContent
        </p>
      </div>
    </div>
  </li>
  */
}

function setView(dataView) {
  for (let view of $views) {
    if (view.getAttribute('data-view') === dataView) {
      view.classList.remove('hidden');
      data.view = view.getAttribute('data-view');
    } else {
      view.classList.add('hidden');
    }
  }
  if (data.entries.length) {
    $noEntries.classList.add('hidden');
  }
}
