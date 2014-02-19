
/**
 * Module dependencies.
 */

var Emitter = require('emitter')
  , html = require('./template')
  , o = require('jquery')
  , bind = require('bind');

/**
 * Expose `Pager`.
 */

module.exports = Pager;

/**
 * Initialize a new `Pager`.
 *
 * @api public
 */

function Pager() {
  Emitter.call(this);
  this.el = o(html);
  this.el.on('click', 'li > a', bind(this, this.onclick));
  this.page = this.el.find('.pager');
  this.displayedPages = 5;
  this.edges = 2;
  this.ellipseText = '&hellip;';
  this.perpage(10);
  this.total(0);
  this.show(0);
}

/**
 * Mixin emitter.
 */

Emitter(Pager.prototype);

/**
 * Handle delegated clicks.
 *
 * @api private
 */

Pager.prototype.onclick = function(e){
  e.preventDefault();
  var el = o(e.target).parent();
  if (el.hasClass('prev')) return this.prev();
  if (el.hasClass('next')) return this.next();
  this.show(el.text() - 1);
};

/**
 * Return the total number of pages.
 *
 * @return {Number}
 * @api public
 */

Pager.prototype.pages = function(){
  return Math.ceil(this._total / this._perpage);
};

/**
 * Select the previous page.
 *
 * @api public
 */

Pager.prototype.prev = function(){
  this.show(Math.max(0, this.current - 1));
};

/**
 * Select the next page.
 *
 * @api public
 */

Pager.prototype.next = function(){
  this.show(Math.min(this.pages() - 1, this.current + 1));
};

/**
 * Select the page `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.show = function(n){
  this.select(n);
  this.emit('show', n);
  return this;
};

/**
 * Select page `n` without emitting "show".
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.select = function(n){
  this.current = n;
  this.render();
  return this;
};

/**
 * Set the number of items perpage to `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.perpage = function(n){
  this._perpage = n;
  return this;
};

/**
 * Set the total number of items to `n`.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.total = function(n){
  this._total = n;
  return this;
};

/**
 * Append the index to the page.
 *
 * @param {Number} n
 * @return {Pager}
 * @api public
 */

Pager.prototype.append = function (n, control) {
  if (control ) {
    if(control === "prev") {
      this.page.append('<li class="prev"><a href="#"><< 上一页</a></li>');
    } else if (control === "next") {
      this.page.append('<li class="next"><a href="#">下一页 >></a></li>');
    } else {
      this.page.append('<li class="page"><a href="#">' + this.ellipseText + '</a></li>');
    }
  } else {
    if (n === this.current) {
      this.page.append('<li class="page active"><a href="#">' + (n+1) + '</a></li>');
    } else {
      this.page.append('<li class="page"><a href="#">' + (n+1) + '</a></li>');
    }
    
  }
}

/**
 * Render the pager.
 *
 * @api public
 */

Pager.prototype.render = function(){
  var el = this.el;
  var curr = this.current;

  var pages = this.pages();
  var edges = this.edges;
  var displayedPages = this.displayedPages;
  var halfDisplayed = displayedPages / 2;


  var start = Math.ceil(
    curr > halfDisplayed ? 
    Math.max(Math.min(curr - halfDisplayed, (pages - displayedPages)), 0) 
    : 0);

  var end = Math.ceil(
    curr > halfDisplayed ? 
    Math.min(curr + halfDisplayed, pages) : 
    Math.min(displayedPages, pages));

  var page = this.page;
    
  var links = '';
  var i = 0;

  // remove old
  el.find('.pager').empty();

  // Generate Prev link
  this.append(0, 'prev');

  // Generate start edges
  if (start > 0) {
    var _end = Math.min(edges, start);
    for (i = 0; i < _end; i++) {
      this.append(i);
    }
    if (edges < start && (start - edges !== 1)) {
      this.append(0, 'ellipse');
    } else if (start - edges === 1){
      this.append(edges);
    }
  }

  // Generate interval links
  for (i = start; i < end; i++) {
    this.append(i);;
  }

  // Generate end edges
  if (end < pages) {
    if (pages - edges > end && (pages - edges - end !== 1)) {
      this.append(0, 'ellipse');
    } else if (pages - edges - end === 1){
      this.append(end);
    }
    var begin = Math.max(pages - edges, end);
    for (i = begin; i < pages; i++) {
      this.append(i);
    }
  }

  // Generate Next link
  this.append(0, 'next');

  var prev = el.find('.prev');
  var next = el.find('.next');

  // prev
  if (curr) {
    prev.removeClass('pager-hide');
  }
  else {
    prev.addClass('pager-hide');
    prev.unbind('click', 'a');
  }

  // next
  if (curr < pages - 1) {
    next.removeClass('pager-hide');
  }
  else {
    next.addClass('pager-hide');
    next.unbind('click', 'a');
  }
};

