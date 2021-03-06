/* global data */
/* exported data */
const $photoUrl = document.querySelector('input[name="photoUrl"]');
const $save = document.querySelector('.save');
const $deleteButton = document.querySelector('.delete-entry-button');
const $imagePreview = document.querySelector('.preview-image');
const $form = document.querySelector('form');
const $inputs = $form.elements;
const $ul = document.querySelector('.entries');
const $body = document.querySelector('body');
const $views = document.querySelectorAll('.view');
const $noEntries = document.querySelector('.no-entries');
const $modalBg = document.querySelector('.modal-bg');
const $deleteEntryButton = document.querySelector('.delete-entry-button');
const $searchBar = document.querySelector('.search-bar');

// displays image preview for valid image paths
$photoUrl.addEventListener('input', event => {
  if (!event.target.value.length) {
    $imagePreview.setAttribute('src', 'images/placeholder-image-square.jpg');
    return;
  }
  $imagePreview.src = event.target.value;
});

// search bar
$searchBar.addEventListener('keydown', event => {
  if (!(event.key === 'Enter')) {
    return;
  }
  const $allEntries = document.querySelectorAll('li.row');
  clearEntries($allEntries);
  for (let entry of data.entries) {
    let isMatch = true;
    for (let word of event.target.value.trim().toLowerCase().split(' ')) {
      if (!entry.title.toLowerCase().trim().includes(word)) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      $ul.appendChild(renderEntry(entry));
    }
  }
});

// handles entry submissions/edits
$form.addEventListener('submit', event => {
  if (data.editing) {
    configureEntry(data.editing, true);
  } else {
    configureEntry({}, false);
  }
  setView('entries');
  event.preventDefault();
});

// load entries, only runs when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  renderEntries();
  setView(data.view);
});

// change views
$body.addEventListener('click', event => {
  if (!event.target.matches('.view-change')) {
    return;
  }

  const dataView = event.target.getAttribute('data-view');
  setView(dataView);
  event.preventDefault();
});

// edit entry
$ul.addEventListener('click', event => {
  if (event.target.matches('.fa-pen')) {
    const currentId = event.target.getAttribute('data-entry-id');
    let entryIndex = findEntry(currentId);
    data.editing = data.entries[entryIndex];
    populateForm(data.editing);
  }
});

// entry delete modal
$modalBg.addEventListener('click', event => {
  const $cancelButton = document.querySelector('.modal .gray-button');
  const $confirmButton = document.querySelector('.modal .red-button');
  if (event.target === $cancelButton) {
    $modalBg.classList.add('hidden');
  }
  if (event.target === $confirmButton) {
    const $li = document.querySelector(`li[data-entry-id="${data.editing.entryId}"]`);
    let entryIndex = findEntry(data.editing.entryId);
    data.entries.splice(entryIndex, 1);
    data.editing = null;
    $modalBg.classList.add('hidden');
    $li.remove();
    setView('entries');
  }
});

$deleteEntryButton.addEventListener('click', event => {
  $modalBg.classList.remove('hidden');
  event.preventDefault();
});

// takes entry object and returns entry in DOM tree
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
  $image.setAttribute('src', 'images/placeholder-image-square.jpg');
  $image.src = journalEntry.photoUrl;
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
  $editIcon.setAttribute('data-view', 'entry-form');
  $editIcon.classList.add('view-change');
  $editIcon.setAttribute('id', 'edit-entry');

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

function renderEntries() {
  for (let entry of data.entries) {
    $ul.appendChild(renderEntry(entry));
  }
}

// sets the specified dataView
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
  } else {
    $noEntries.classList.remove('hidden');
  }
  if (data.editing) {
    populateForm(data.editing);
  }
  if (dataView !== 'entry') {
    const $allEntries = document.querySelectorAll('li.row');
    resetEntries($allEntries);
  }
  if (dataView !== 'entry-form') {
    resetForm();
  } else {
    let mode = data.editing ? 'edit-entry-mode' : 'new-entry-mode';
    $save.classList.add(mode);
    if (mode === 'edit-entry-mode') {
      $deleteButton.classList.remove('hidden');
    }
  }
}

// populates form elements for edit page
function populateForm(entry) {
  $inputs.title.value = entry.title;
  $inputs.photoUrl.value = entry.photoUrl;
  $inputs.notes.value = entry.notes;
  $imagePreview.src = entry.photoUrl;
}

// deals with adding/editting entry
function configureEntry(entry, isUpdate) {
  entry[$inputs.title.name] = $inputs.title.value;
  entry[$inputs.photoUrl.name] = $inputs.photoUrl.value;
  entry[$inputs.notes.name] = $inputs.notes.value;
  if (!isUpdate) {
    entry.entryId = data.nextEntryId++;
    data.entries = [entry, ...data.entries];
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

// resets the form during view changes
function resetForm() {
  $form.reset();
  data.editing = null;
  $save.classList.remove('edit-entry-mode');
  $save.classList.remove('new-entry-mode');
  $deleteButton.classList.add('hidden');
  $photoUrl.dispatchEvent(new Event('input'));
}

// takes id of entry and returns index of entry in data.entries array
function findEntry(id) {
  for (let i = 0; i < data.entries.length; i++) {
    if (id === data.entries[i].entryId.toString()) {
      return i;
    }
  }
  return null;
}

// removes all given entries from DOM tree
function clearEntries($allEntries) {
  for (let $entry of $allEntries) {
    $entry.remove();
  }
}

function resetEntries($allEntries) {
  clearEntries($allEntries);
  renderEntries();
  $searchBar.value = '';
}
