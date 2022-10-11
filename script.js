const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl= document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Validate form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if(!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  // valid
  return true;
}

// Build bookmarks DOM
function buildBookmarks() {
  // remove all bookmark elements
  bookmarksContainer.textContent = '';
  // build items
  Object.keys(bookmarks).forEach((id) => {
    const {name, url} = bookmarks[id];
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-regular', 'fa-circle-xmark');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onClick', `deleteBookmark('${id}')`);
    // favicon / link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    // favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
    favicon.setAttribute('alt', 'Favicon');
    // link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`)
    link.setAttribute('target','_blank');
    link.textContent = name;
    // append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch Bookmarks from local storage
function fetchBookmarks() {
  // get bookmarks from localStorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // create bookmarks object in localStorage
    const id= `https://troopl.com/eyssantos`;
    bookmarks[id] = [
      {
        name: 'Portfolio',
        url: 'https://troopl.com/eyssantos',
      }
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }
  buildBookmarks();
}

// Delete bookmark 
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  };
  // update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
     urlValue = `https://${urlValue}`; 
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();