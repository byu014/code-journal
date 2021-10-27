/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $imagePreview = document.querySelector('.preview-image');
const $form = document.querySelector('form');
const $inputs = $form.elements;
const $ul = document.querySelector('.entries');
const $body = document.querySelector('body');
const $views = document.querySelectorAll('.view');
const $noEntries = document.querySelector('.no-entries');
let newEntry = {};

$photoUrl.addEventListener('input', event => {
  $imagePreview.setAttribute('src', event.target.value);
  if (!event.target.value.length) {
    $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
  }
});

$form.addEventListener('submit', event => {
  if (data.editing) {
    configureEntry(data.editing, true);
  } else {
    configureEntry(newEntry, false);
  }
  setView('entries');
  event.preventDefault();
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

$ul.addEventListener('click', event => {
  if (event.target.matches('.fa-pen')) {
    setView('entry-form');
    const currentId = event.target.getAttribute('data-entry-id');
    for (let entry of data.entries) {
      if (entry.entryId.toString() === currentId) {
        data.editing = entry;
        break;
      }
    }
    populateForm(data.editing);
  }
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
  $h2.classList.add('title');

  const $editIcon = document.createElement('i');
  $editIcon.classList.add('fas');
  $editIcon.classList.add('fa-pen');
  $editIcon.setAttribute('data-entry-id', journalEntry.entryId);

  const $p = document.createElement('p');
  $p.textContent = journalEntry.notes;
  $p.classList.add('notes');

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
          <h2 class="title">Ada Lovelace</h2>
          <i class="fas fa-pen" data-entry-id=id></i>
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
  if (dataView !== 'entry-form') {
    resetForm();
  }
}

function populateForm(entry) {
  $inputs.title.setAttribute('value', entry.title);
  $inputs.photoUrl.setAttribute('value', entry.photoUrl);
  $inputs.notes.value = entry.notes;
  $imagePreview.setAttribute('src', entry.photoUrl);
}

function configureEntry(entry, isUpdate) {
  entry[$inputs.title.name] = $inputs.title.value;
  entry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  entry[$inputs.notes.name] = $inputs.notes.value;
  if (!isUpdate) {
    entry.entryId = data.nextEntryId++;
    data.entries = [newEntry, ...data.entries];
    $ul.prepend(renderEntry(entry));
  } else {
    let $liImg = document.querySelector(`li[data-entry-id="${data.editing.entryId}"] .preview-image`);
    let $liTitle = document.querySelector(`li[data-entry-id="${data.editing.entryId}"] .title`);
    let $liNotes = document.querySelector(`li[data-entry-id="${data.editing.entryId}"] .notes`);

    $liImg.src = data.editing.photoUrl;
    $liTitle.textContent = data.editing.title;
    $liNotes.textContent = data.editing.notes;
    data.editing = null;
  }
}

function resetForm() {
  $form.reset();
  $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
}
