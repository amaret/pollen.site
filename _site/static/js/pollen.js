// $('body').scrollspy({
//     target: '.doc-sidenav',
//     offset: 40
// });

// $('.doc-sidenav').affix({
//   offset: {
//     top: function () { return $window.width() <= 980 ? 290 : 210 }, 
//     bottom: 270
//   }
// })
// This is listen for click events originating from elements with href starting with #
// From
// http://stackoverflow.com/questions/11513853/how-can-i-use-html-id-links-with-the-bootstrap-navbar-header
// Does not work.
//$('body').on('click.scroll-adjust', '[href^="#"]', function (e) {
//  var $nav
//  var $lnk = e.target.href
//  var $flag = $lnk.indexOf('#')
  // make sure navigation hasn't already been prevented
//  if ( e && e.isDefaultPrevented() ) return
  // get a reference to the offending navbar
//  $nav = $('div.navbar')
  // check if the navbar is fixed
//  if ( $nav.css('position') !== "fixed" ) return
  // listen for when the browser performs the scroll
  //$(window).on('scroll', function () {
    // scroll the window up by the height of the navbar
    //window.scrollBy(0, -$nav.height())
  //});
//});
