'use strict';

const store = function(){
  const addBookmark = function(bookmark = Object){
    this.bookmarks.push(bookmark);
};
  
const toggleExpandBookmark = function(id){
  let bookmark = this.bookmarks.find(bookmark => id === bookmark.id);
  bookmark.expanded = !bookmark.expanded;
};

const updateBookmark = function(id, options){
  let bookmark = this.bookmarks.find(bookmark => id === bookmark.id);
  Object.assign(bookmark, options);
};

const deleteBookmarkByID = function(id){
  this.bookmarks = this.bookmarks.filter(bookmark => id !== bookmark.id);
};

const toggleEditBookmark = function(id){
  this.bookmarks.forEach(bookmark => {
    bookmark.editing = false;
  });
  let bookmark = this.bookmarks.find(bookmark => id === bookmark.id);
  bookmark.editing = !bookmark.editing;
};

const toggleAddBookmarkForm = function(){
  this.adding = !this.adding;
};

const updateRatingFilter = function(num = Number){
  this.filter = num;
};

return {
  bookmarks: [],
  adding: false,
  filter: 0,
  addBookmark,
  updateBookmark,
  deleteBookmarkByID,
  updateRatingFilter,
  toggleAddBookmarkForm,
  toggleEditBookmark,
  toggleExpandBookmark
 };
}();