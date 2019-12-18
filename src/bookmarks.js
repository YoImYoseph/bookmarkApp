'use strict';

const bookmarkList = function(){
  
  const render = function(){
    let entries = [...store.bookmarks];
    let listString = '';

    if(store.filter) {
      entries = entries.filter(entry => entry.rating >= store.filter);
    }

    entries.forEach(bookmark => {
      listString += bookmarkItem.createBookmarkHTML(bookmark);
    });
    $('.js-bookmark-list').html(listString);
  };

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.bookmark-collapse, .bookmark-expand, .bookmark')
      .data('bookmark-id');
  }

  const handleBookmarkDelete = function(){
    $('.js-bookmark-list').on('click', '#delete', e => {
      let entryID = getItemIdFromElement(e.target);
      api.deleteBookmark(entryID)
        .then(res => res.json())
        .then(resJSON => {
          store.deleteBookmarkByID(entryID);
          render();
        })
        .catch(error => console.log(error));
    });
  };

  const handleBookmarkClick = function(){
    $('.js-bookmark-list').on('click', '.bookmark-expand, .bookmark-collapse', e => {
      let entryID = getItemIdFromElement(e.target);
      store.toggleExpandBookmark(entryID);
      render();
    });
  };

  const handleRatingFilterChange = function(){
    $('#rating-filter').on('change', e => {
      let newRating = e.target.value;
      store.filter = newRating;
      render();
    });
  };

  const bindBookmarkListEventHandlers = function(){
    handleBookmarkClick();
    handleBookmarkDelete();
    handleRatingFilterChange();
  };

  return {
    bindBookmarkListEventHandlers,
    render
  };
}();

const bookmarkForm = function(){
  
  const render = function(){
    const form = `
      <form id="bookmark-form" class="bookmark-form">
        <label for="title">Title</label>
        <input type="text" name="title" id="title" placeholder="My Awesome Site" required />
        <label for="url">Bookmark URL</label>
        <input type="url" name="url" id="url" placeholder="http://site.com" required />
        <label for="desc">Description</label>
        <input type="text" name="desc" id="desc" maxlength="255" placeholder="Enter a summary"/>
        <label for="rating">My Rating</label>
        <select name="rating" id="rating" min="1" max="5">
          <option value="5">&#x2605&#x2605&#x2605&#x2605&#x2605</option>
          <option value="4">&#x2605&#x2605&#x2605&#x2605;</option>
          <option value="3">&#x2605&#x2605&#x2605;</option>
          <option value="2">&#x2605&#x2605;</option>
          <option value="1">&#x2605;</option>
        </select>
        <button type="submit">Add</button>
      </form>
    `;
    if(store.adding) {
      $('.js-bookmark-list').after(form);
      $('#display-form').toggleClass('hide-button');
    } else {
      $('#bookmark-form').remove();
      $('#display-form').toggleClass('hide-button');
    }
  };

  const handleAddBookmarkClick = function(){
    $('#display-form').on('click', () => {
      store.adding = !store.adding;
      render();
    });
  };

  const handleSubmitNewBookmark = function(){
    $('body').on('submit', '#bookmark-form', e => {
      e.preventDefault();
      let formData = new FormData(document.getElementById('bookmark-form'));
      let formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      api.createBookmark(formObject)
        .then(res => res.json())
        .then(resJSON => {
          api.getBookmarks()
            .then(res => res.json())
            .then(bookmarks => {
              store.bookmarks = [];
              bookmarks.forEach( bookmark => {
                store.addBookmark(bookmark);
                bookmarkList.render();
                return resJSON;
              }
              );})
            .catch(error => console.log(error));
        })
        .then(resJSON => {
          console.log(resJSON);
          store.adding = false;
          render();
        })
        .catch(error => console.log(error));
    });
  };

  const bindFormEventListeners = function(){
    handleAddBookmarkClick();
    handleSubmitNewBookmark();
  };

  return {
    render,
    bindFormEventListeners
  };
}();

const bookmarkItem = function(){

  const createBookmarkHTML = function(obj){
    let stars = '';
    switch (obj.rating) {
    case 1:
      stars = '&#x2605;';
      break;
    case 2:
      stars = '&#x2605;&#x2605;';
      break;
    case 3:
      stars = '&#x2605;&#x2605;&#x2605;';
      break;
    case 4:
      stars = '&#x2605;&#x2605;&#x2605;&#x2605;';
      break;
    case 5:
      stars = '&#x2605;&#x2605;&#x2605;&#x2605;&#x2605';
      break;
    default:
      stars = 'N/A';
    }

    if(obj.expanded) {
      return `
      <li data-bookmark-id="${obj.id}" class="bookmark">
        <button id="delete" class="delete">Delete</button>
        <div data-bookmark-id="${obj.id}" class="bookmark-expand">
          <h3>${obj.title}</h3>
          <p class="rating">${stars}</p>
          <p class="desc" placeholder="No description provided" disabled>${obj.desc = obj.desc ? obj.desc : 'No description provided'}</p>
          <a href="${obj.url}">Visit Site</a>
        </div>
      </li>
    `;
    }

    return `
    <li data-bookmark-id="${obj.id}" class="bookmark">
      <button id="delete" class="delete">Delete</button>
      <div data-bookmark-id="${obj.id}" class="bookmark-collapse">
        <h3>${obj.title}</h3>
        <p>${stars}</p>
      </div>
    </li>
  `;
  };
  
  return {
    createBookmarkHTML
  };
}();