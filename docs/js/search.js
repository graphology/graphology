require([
  'gitbook',
  'jquery'
], function(gitbook, $) {
  var INPUT = '';
  var SELECTOR = '.chapter > a';
  var HIDDEN = {};

  // Adding the search input
  function addSearchInput() {
    $('.book-summary').prepend([
      '<div id="book-search-input" role="search">',
        '<input class="custom-input" type="text" placeholder="Search..." value="' + INPUT + '" />',
      '</div>'
    ].join('\n'));

    $(SELECTOR).each(function() {
      if (HIDDEN[$(this).parent().attr('data-level')])
        $(this).hide();
    });

    $('#book-search-input > input').on('input', function() {
      INPUT = ($(this).val() || '')
        .trim()
        .toLowerCase();

      HIDDEN = {};

      $(SELECTOR).show();

      if (INPUT.length < 2)
        return;

      $(SELECTOR).each(function() {
        var text = ($(this).text() || '')
          .trim()
          .toLowerCase();

        if (!~text.indexOf(INPUT)) {
          $(this).hide();
          HIDDEN[$(this).parent().attr('data-level')] = true;
        }
        else {
          var $ancestors = $(this).parents('.chapter').find('> a');

          $ancestors.each(function() {
            delete HIDDEN[$(this).parent().attr('data-level')];
          });

          $ancestors.show();
        }
      });
    });
  }

  gitbook.events.on('page.change', addSearchInput);
});
