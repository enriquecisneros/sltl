/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  var autocomplete = void 0;

  function autocompleteSplitValues(value) {
    var result = [];
    var quote = false;
    var current = '';
    var valueLength = value.length;
    var character = void 0;

    for (var i = 0; i < valueLength; i++) {
      character = value.charAt(i);
      if (character === '"') {
        current += character;
        quote = !quote;
      } else if (character === ',' && !quote) {
        result.push(current.trim());
        current = '';
      } else {
        current += character;
      }
    }
    if (value.length > 0) {
      result.push($.trim(current));
    }

    return result;
  }

  function extractLastTerm(terms) {
    return autocomplete.splitValues(terms).pop();
  }

  function searchHandler(event) {
    var options = autocomplete.options;

    if (options.isComposing) {
      return false;
    }

    var term = autocomplete.extractLastTerm(event.target.value);

    if (term.length > 0 && options.firstCharacterBlacklist.indexOf(term[0]) !== -1) {
      return false;
    }

    return term.length >= options.minLength;
  }

  function sourceData(request, response) {
    var elementId = this.element.attr('id');

    if (!(elementId in autocomplete.cache)) {
      autocomplete.cache[elementId] = {};
    }

    function showSuggestions(suggestions) {
      var tagged = autocomplete.splitValues(request.term);
      var il = tagged.length;
      for (var i = 0; i < il; i++) {
        var index = suggestions.indexOf(tagged[i]);
        if (index >= 0) {
          suggestions.splice(index, 1);
        }
      }
      response(suggestions);
    }

    var term = autocomplete.extractLastTerm(request.term);

    function sourceCallbackHandler(data) {
      autocomplete.cache[elementId][term] = data;

      showSuggestions(data);
    }

    if (autocomplete.cache[elementId].hasOwnProperty(term)) {
      showSuggestions(autocomplete.cache[elementId][term]);
    } else {
      var options = $.extend({ success: sourceCallbackHandler, data: { q: term } }, autocomplete.ajax);
      $.ajax(this.element.attr('data-autocomplete-path'), options);
    }
  }

  function focusHandler() {
    return false;
  }

  function selectHandler(event, ui) {
    var terms = autocomplete.splitValues(event.target.value);

    terms.pop();

    terms.push(ui.item.value);

    event.target.value = terms.join(', ');

    return false;
  }

  function renderItem(ul, item) {
    return $('<li>').append($('<a>').html(item.label)).appendTo(ul);
  }

  Drupal.behaviors.autocomplete = {
    attach: function attach(context) {
      var $autocomplete = $(context).find('input.form-autocomplete').once('autocomplete');
      if ($autocomplete.length) {
        var blacklist = $autocomplete.attr('data-autocomplete-first-character-blacklist');
        $.extend(autocomplete.options, {
          firstCharacterBlacklist: blacklist || ''
        });

        $autocomplete.autocomplete(autocomplete.options).each(function () {
          $(this).data('ui-autocomplete')._renderItem = autocomplete.options.renderItem;
        });

        $autocomplete.on('compositionstart.autocomplete', function () {
          autocomplete.options.isComposing = true;
        });
        $autocomplete.on('compositionend.autocomplete', function () {
          autocomplete.options.isComposing = false;
        });
      }
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        $(context).find('input.form-autocomplete').removeOnce('autocomplete').autocomplete('destroy');
      }
    }
  };

  autocomplete = {
    cache: {},

    splitValues: autocompleteSplitValues,
    extractLastTerm: extractLastTerm,

    options: {
      source: sourceData,
      focus: focusHandler,
      search: searchHandler,
      select: selectHandler,
      renderItem: renderItem,
      minLength: 1,

      firstCharacterBlacklist: '',

      isComposing: false
    },
    ajax: {
      dataType: 'json'
    }
  };

  Drupal.autocomplete = autocomplete;
})(jQuery, Drupal);;
/**
 * @file
 * JavaScript behaviors for element (read) more.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Element (read) more.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformElementMore = {
    attach: function (context) {
      $(context).find('.js-webform-element-more').once('webform-element-more').each(function (event) {
        var $more = $(this);
        var $a = $more.find('a').first();
        var $content = $more.find('.webform-element-more--content');

        // Add aria-* attributes.
        $a.attr({
          'aria-expanded': false,
          'aria-controls': $content.attr('id')
        });

        // Add event handlers.
        $a.on('click', toggle)
          .on('keydown', function (event) {
            // Space or Return.
            if (event.which === 32 || event.which === 13) {
              toggle(event);
            }
          });

        function toggle(event) {
          var expanded = ($a.attr('aria-expanded') === 'true');

          // Toggle `aria-expanded` attributes on link.
          $a.attr('aria-expanded', !expanded);

          // Toggle content and more .is-open state.
          if (expanded) {
            $more.removeClass('is-open');
            $content.slideUp();
          }
          else {
            $more.addClass('is-open');
            $content.slideDown();
          }

          event.preventDefault();
        }
      });
    }
  };

})(jQuery, Drupal);
;