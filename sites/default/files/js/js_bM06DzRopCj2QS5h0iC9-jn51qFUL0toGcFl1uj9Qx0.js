/**
 * @file
 * JavaScript behaviors for CodeMirror integration.
 */

(function ($, Drupal) {

  'use strict';

  // @see http://codemirror.net/doc/manual.html#config
  Drupal.webform = Drupal.webform || {};
  Drupal.webform.codeMirror = Drupal.webform.codeMirror || {};
  Drupal.webform.codeMirror.options = Drupal.webform.codeMirror.options || {};

  /**
   * Initialize CodeMirror editor.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformCodeMirror = {
    attach: function (context) {
      if (!window.CodeMirror) {
        return;
      }

      // Webform CodeMirror editor.
      $(context).find('textarea.js-webform-codemirror').once('webform-codemirror').each(function () {
        var $input = $(this);

        // Open all closed details, so that editor height is correctly calculated.
        var $details = $(this).parents('details:not([open])');
        $details.attr('open', 'open');

        // #59 HTML5 required attribute breaks hack for webform submission.
        // https://github.com/marijnh/CodeMirror-old/issues/59
        $(this).removeAttr('required');

        var options = $.extend({
          mode: $(this).attr('data-webform-codemirror-mode'),
          lineNumbers: true,
          lineWrapping: ($(this).attr('wrap') === 'off') ? false : true,
          viewportMargin: Infinity,
          readOnly: ($(this).prop('readonly') || $(this).prop('disabled')) ? true : false,
          extraKeys: {
            // Setting for using spaces instead of tabs - https://github.com/codemirror/CodeMirror/issues/988
            Tab: function (cm) {
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces, 'end', '+element');
            },
            // On 'Escape' move to the next tabbable input.
            // @see http://bgrins.github.io/codemirror-accessible/
            Esc: function (cm) {
              // Must show and then textarea so that we can determine
              // its tabindex.
              var textarea = $(cm.getTextArea());
              $(textarea).show().addClass('visually-hidden');
              var $tabbable = $(':tabbable');
              var tabindex = $tabbable.index(textarea);
              $(textarea).hide().removeClass('visually-hidden');

              // Tabindex + 2 accounts for the CodeMirror's iframe.
              $tabbable.eq(tabindex + 2).focus();
            }

          }
        }, Drupal.webform.codeMirror.options);

        var editor = CodeMirror.fromTextArea(this, options);

        // Now, close details.
        $details.removeAttr('open');

        // Apply the textarea's min/max-height to the CodeMirror editor.
        if ($input.css('min-height')) {
          var minHeight = $input.css('min-height');
          $(editor.getWrapperElement())
            .css('min-height', minHeight)
            .find('.CodeMirror-scroll')
            .css('min-height', minHeight);
        }
        if ($input.css('max-height')) {
          var maxHeight = $input.css('max-height');
          $(editor.getWrapperElement())
            .css('max-height', maxHeight)
            .find('.CodeMirror-scroll')
            .css('max-height', maxHeight);
        }

        // Issue #2764443: CodeMirror is not setting submitted value when
        // rendered within a webform UI dialog or within an Ajaxified element.
        var changeTimer = null;
        editor.on('change', function () {
          if (changeTimer) {
            window.clearTimeout(changeTimer);
            changeTimer = null;
          }
          changeTimer = setTimeout(function () {editor.save();}, 500);
        });

        // Update CodeMirror when the textarea's value has changed.
        // @see webform.states.js
        $input.on('change', function () {
          editor.getDoc().setValue($input.val());
        });

        // Set CodeMirror to be readonly when the textarea is disabled.
        // @see webform.states.js
        $input.on('webform:disabled', function () {
          editor.setOption('readOnly', $input.is(':disabled'));
        });

        // Delay refreshing CodeMirror for 10 millisecond while the dialog is
        // still being rendered.
        // @see http://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
        setTimeout(function () {
          // Show tab panel and open details.
          var $tabPanel = $input.parents('.ui-tabs-panel:hidden');
          var $details = $input.parents('details:not([open])');

          if (!$tabPanel.length && $details.length) {
            return;
          }

          $tabPanel.show();
          $details.attr('open', 'open');

          editor.refresh();

          // Hide tab panel and close details.
          $tabPanel.hide();
          $details.removeAttr('open');
        }, 10);
      });

      // Webform CodeMirror syntax coloring.
      if (window.CodeMirror.runMode) {
        $(context).find('.js-webform-codemirror-runmode').once('webform-codemirror-runmode').each(function () {
          // Mode Runner - http://codemirror.net/demo/runmode.html
          CodeMirror.runMode($(this).addClass('cm-s-default').text(), $(this).attr('data-webform-codemirror-mode'), this);
        });
      }

    }
  };

})(jQuery, Drupal);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($, Drupal, drupalSettings) {
  var showWeight = JSON.parse(localStorage.getItem('Drupal.tableDrag.showWeight'));

  Drupal.behaviors.tableDrag = {
    attach: function attach(context, settings) {
      function initTableDrag(table, base) {
        if (table.length) {
          Drupal.tableDrag[base] = new Drupal.tableDrag(table[0], settings.tableDrag[base]);
        }
      }

      Object.keys(settings.tableDrag || {}).forEach(function (base) {
        initTableDrag($(context).find('#' + base).once('tabledrag'), base);
      });
    }
  };

  Drupal.tableDrag = function (table, tableSettings) {
    var _this = this;

    var self = this;
    var $table = $(table);

    this.$table = $(table);

    this.table = table;

    this.tableSettings = tableSettings;

    this.dragObject = null;

    this.rowObject = null;

    this.oldRowElement = null;

    this.oldY = 0;

    this.changed = false;

    this.maxDepth = 0;

    this.rtl = $(this.table).css('direction') === 'rtl' ? -1 : 1;

    this.striping = $(this.table).data('striping') === 1;

    this.scrollSettings = { amount: 4, interval: 50, trigger: 70 };

    this.scrollInterval = null;

    this.scrollY = 0;

    this.windowHeight = 0;

    this.indentEnabled = false;
    Object.keys(tableSettings || {}).forEach(function (group) {
      Object.keys(tableSettings[group] || {}).forEach(function (n) {
        if (tableSettings[group][n].relationship === 'parent') {
          _this.indentEnabled = true;
        }
        if (tableSettings[group][n].limit > 0) {
          _this.maxDepth = tableSettings[group][n].limit;
        }
      });
    });
    if (this.indentEnabled) {
      this.indentCount = 1;

      var indent = Drupal.theme('tableDragIndentation');
      var testRow = $('<tr/>').addClass('draggable').appendTo(table);
      var testCell = $('<td/>').appendTo(testRow).prepend(indent).prepend(indent);
      var $indentation = testCell.find('.js-indentation');

      this.indentAmount = $indentation.get(1).offsetLeft - $indentation.get(0).offsetLeft;
      testRow.remove();
    }

    $table.find('> tr.draggable, > tbody > tr.draggable').each(function () {
      self.makeDraggable(this);
    });

    $table.before($('<button type="button" class="link tabledrag-toggle-weight"></button>').on('click', $.proxy(function (e) {
      e.preventDefault();
      this.toggleColumns();
    }, this)).wrap('<div class="tabledrag-toggle-weight-wrapper"></div>').parent());

    self.initColumns();

    $(document).on('touchmove', function (event) {
      return self.dragRow(event.originalEvent.touches[0], self);
    });
    $(document).on('touchend', function (event) {
      return self.dropRow(event.originalEvent.touches[0], self);
    });
    $(document).on('mousemove pointermove', function (event) {
      return self.dragRow(event, self);
    });
    $(document).on('mouseup pointerup', function (event) {
      return self.dropRow(event, self);
    });

    $(window).on('storage', $.proxy(function (e) {
      if (e.originalEvent.key === 'Drupal.tableDrag.showWeight') {
        showWeight = JSON.parse(e.originalEvent.newValue);
        this.displayColumns(showWeight);
      }
    }, this));
  };

  Drupal.tableDrag.prototype.initColumns = function () {
    var _this2 = this;

    var $table = this.$table;
    var hidden = void 0;
    var cell = void 0;
    var columnIndex = void 0;
    Object.keys(this.tableSettings || {}).forEach(function (group) {
      Object.keys(_this2.tableSettings[group]).some(function (tableSetting) {
        var field = $table.find('.' + _this2.tableSettings[group][tableSetting].target).eq(0);
        if (field.length && _this2.tableSettings[group][tableSetting].hidden) {
          hidden = _this2.tableSettings[group][tableSetting].hidden;
          cell = field.closest('td');
          return true;
        }
        return false;
      });

      if (hidden && cell[0]) {
        columnIndex = cell.parent().find('> td').index(cell.get(0)) + 1;
        $table.find('> thead > tr, > tbody > tr, > tr').each(_this2.addColspanClass(columnIndex));
      }
    });
    this.displayColumns(showWeight);
  };

  Drupal.tableDrag.prototype.addColspanClass = function (columnIndex) {
    return function () {
      var $row = $(this);
      var index = columnIndex;
      var cells = $row.children();
      var cell = void 0;
      cells.each(function (n) {
        if (n < index && this.colSpan && this.colSpan > 1) {
          index -= this.colSpan - 1;
        }
      });
      if (index > 0) {
        cell = cells.filter(':nth-child(' + index + ')');
        if (cell[0].colSpan && cell[0].colSpan > 1) {
          cell.addClass('tabledrag-has-colspan');
        } else {
          cell.addClass('tabledrag-hide');
        }
      }
    };
  };

  Drupal.tableDrag.prototype.displayColumns = function (displayWeight) {
    if (displayWeight) {
      this.showColumns();
    } else {
        this.hideColumns();
      }

    $('table').findOnce('tabledrag').trigger('columnschange', !!displayWeight);
  };

  Drupal.tableDrag.prototype.toggleColumns = function () {
    showWeight = !showWeight;
    this.displayColumns(showWeight);
    if (showWeight) {
      localStorage.setItem('Drupal.tableDrag.showWeight', showWeight);
    } else {
      localStorage.removeItem('Drupal.tableDrag.showWeight');
    }
  };

  Drupal.tableDrag.prototype.hideColumns = function () {
    var $tables = $('table').findOnce('tabledrag');

    $tables.find('.tabledrag-hide').css('display', 'none');

    $tables.find('.tabledrag-handle').css('display', '');

    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan = this.colSpan - 1;
    });

    $('.tabledrag-toggle-weight').text(Drupal.t('Show row weights'));
  };

  Drupal.tableDrag.prototype.showColumns = function () {
    var $tables = $('table').findOnce('tabledrag');

    $tables.find('.tabledrag-hide').css('display', '');

    $tables.find('.tabledrag-handle').css('display', 'none');

    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan = this.colSpan + 1;
    });

    $('.tabledrag-toggle-weight').text(Drupal.t('Hide row weights'));
  };

  Drupal.tableDrag.prototype.rowSettings = function (group, row) {
    var field = $(row).find('.' + group);
    var tableSettingsGroup = this.tableSettings[group];
    return Object.keys(tableSettingsGroup).map(function (delta) {
      var targetClass = tableSettingsGroup[delta].target;
      var rowSettings = void 0;
      if (field.is('.' + targetClass)) {
        rowSettings = {};
        Object.keys(tableSettingsGroup[delta]).forEach(function (n) {
          rowSettings[n] = tableSettingsGroup[delta][n];
        });
      }
      return rowSettings;
    }).filter(function (rowSetting) {
      return rowSetting;
    })[0];
  };

  Drupal.tableDrag.prototype.makeDraggable = function (item) {
    var self = this;
    var $item = $(item);

    $item.find('td:first-of-type').find('a').addClass('menu-item__link');

    var handle = $('<a href="#" class="tabledrag-handle"><div class="handle">&nbsp;</div></a>').attr('title', Drupal.t('Drag to re-order'));

    var $indentationLast = $item.find('td:first-of-type').find('.js-indentation').eq(-1);
    if ($indentationLast.length) {
      $indentationLast.after(handle);

      self.indentCount = Math.max($item.find('.js-indentation').length, self.indentCount);
    } else {
      $item.find('td').eq(0).prepend(handle);
    }

    handle.on('mousedown touchstart pointerdown', function (event) {
      event.preventDefault();
      if (event.originalEvent.type === 'touchstart') {
        event = event.originalEvent.touches[0];
      }
      self.dragStart(event, self, item);
    });

    handle.on('click', function (e) {
      e.preventDefault();
    });

    handle.on('focus', function () {
      self.safeBlur = true;
    });

    handle.on('blur', function (event) {
      if (self.rowObject && self.safeBlur) {
        self.dropRow(event, self);
      }
    });

    handle.on('keydown', function (event) {
      if (event.keyCode !== 9 && !self.rowObject) {
        self.rowObject = new self.row(item, 'keyboard', self.indentEnabled, self.maxDepth, true);
      }

      var keyChange = false;
      var groupHeight = void 0;

      switch (event.keyCode) {
        case 37:
        case 63234:
          keyChange = true;
          self.rowObject.indent(-1 * self.rtl);
          break;

        case 38:
        case 63232:
          {
            var $previousRow = $(self.rowObject.element).prev('tr').eq(0);
            var previousRow = $previousRow.get(0);
            while (previousRow && $previousRow.is(':hidden')) {
              $previousRow = $(previousRow).prev('tr').eq(0);
              previousRow = $previousRow.get(0);
            }
            if (previousRow) {
              self.safeBlur = false;
              self.rowObject.direction = 'up';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                groupHeight = 0;
                while (previousRow && $previousRow.find('.js-indentation').length) {
                  $previousRow = $(previousRow).prev('tr').eq(0);
                  previousRow = $previousRow.get(0);
                  groupHeight += $previousRow.is(':hidden') ? 0 : previousRow.offsetHeight;
                }
                if (previousRow) {
                  self.rowObject.swap('before', previousRow);

                  window.scrollBy(0, -groupHeight);
                }
              } else if (self.table.tBodies[0].rows[0] !== previousRow || $previousRow.is('.draggable')) {
                self.rowObject.swap('before', previousRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, -parseInt(item.offsetHeight, 10));
              }

              handle.trigger('focus');
            }
            break;
          }

        case 39:
        case 63235:
          keyChange = true;
          self.rowObject.indent(self.rtl);
          break;

        case 40:
        case 63233:
          {
            var $nextRow = $(self.rowObject.group).eq(-1).next('tr').eq(0);
            var nextRow = $nextRow.get(0);
            while (nextRow && $nextRow.is(':hidden')) {
              $nextRow = $(nextRow).next('tr').eq(0);
              nextRow = $nextRow.get(0);
            }
            if (nextRow) {
              self.safeBlur = false;
              self.rowObject.direction = 'down';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                groupHeight = 0;
                var nextGroup = new self.row(nextRow, 'keyboard', self.indentEnabled, self.maxDepth, false);
                if (nextGroup) {
                  $(nextGroup.group).each(function () {
                    groupHeight += $(this).is(':hidden') ? 0 : this.offsetHeight;
                  });
                  var nextGroupRow = $(nextGroup.group).eq(-1).get(0);
                  self.rowObject.swap('after', nextGroupRow);

                  window.scrollBy(0, parseInt(groupHeight, 10));
                }
              } else {
                self.rowObject.swap('after', nextRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, parseInt(item.offsetHeight, 10));
              }

              handle.trigger('focus');
            }
            break;
          }
      }

      if (self.rowObject && self.rowObject.changed === true) {
        $(item).addClass('drag');
        if (self.oldRowElement) {
          $(self.oldRowElement).removeClass('drag-previous');
        }
        self.oldRowElement = item;
        if (self.striping === true) {
          self.restripeTable();
        }
        self.onDrag();
      }

      if (keyChange) {
        return false;
      }
    });

    handle.on('keypress', function (event) {

      switch (event.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
          return false;
      }
    });
  };

  Drupal.tableDrag.prototype.dragStart = function (event, self, item) {
    self.dragObject = {};
    self.dragObject.initOffset = self.getPointerOffset(item, event);
    self.dragObject.initPointerCoords = self.pointerCoords(event);
    if (self.indentEnabled) {
      self.dragObject.indentPointerPos = self.dragObject.initPointerCoords;
    }

    if (self.rowObject) {
      $(self.rowObject.element).find('a.tabledrag-handle').trigger('blur');
    }

    self.rowObject = new self.row(item, 'pointer', self.indentEnabled, self.maxDepth, true);

    self.table.topY = $(self.table).offset().top;
    self.table.bottomY = self.table.topY + self.table.offsetHeight;

    $(item).addClass('drag');

    $('body').addClass('drag');
    if (self.oldRowElement) {
      $(self.oldRowElement).removeClass('drag-previous');
    }
  };

  Drupal.tableDrag.prototype.dragRow = function (event, self) {
    if (self.dragObject) {
      self.currentPointerCoords = self.pointerCoords(event);
      var y = self.currentPointerCoords.y - self.dragObject.initOffset.y;
      var x = self.currentPointerCoords.x - self.dragObject.initOffset.x;

      if (y !== self.oldY) {
        self.rowObject.direction = y > self.oldY ? 'down' : 'up';

        self.oldY = y;

        var scrollAmount = self.checkScroll(self.currentPointerCoords.y);

        clearInterval(self.scrollInterval);

        if (scrollAmount > 0 && self.rowObject.direction === 'down' || scrollAmount < 0 && self.rowObject.direction === 'up') {
          self.setScroll(scrollAmount);
        }

        var currentRow = self.findDropTargetRow(x, y);
        if (currentRow) {
          if (self.rowObject.direction === 'down') {
            self.rowObject.swap('after', currentRow, self);
          } else {
            self.rowObject.swap('before', currentRow, self);
          }
          if (self.striping === true) {
            self.restripeTable();
          }
        }
      }

      if (self.indentEnabled) {
        var xDiff = self.currentPointerCoords.x - self.dragObject.indentPointerPos.x;

        var indentDiff = Math.round(xDiff / self.indentAmount);

        var indentChange = self.rowObject.indent(indentDiff);

        self.dragObject.indentPointerPos.x += self.indentAmount * indentChange * self.rtl;
        self.indentCount = Math.max(self.indentCount, self.rowObject.indents);
      }

      return false;
    }
  };

  Drupal.tableDrag.prototype.dropRow = function (event, self) {
    var droppedRow = void 0;
    var $droppedRow = void 0;

    if (self.rowObject !== null) {
      droppedRow = self.rowObject.element;
      $droppedRow = $(droppedRow);

      if (self.rowObject.changed === true) {
        self.updateFields(droppedRow);

        Object.keys(self.tableSettings || {}).forEach(function (group) {
          var rowSettings = self.rowSettings(group, droppedRow);
          if (rowSettings.relationship === 'group') {
            Object.keys(self.rowObject.children || {}).forEach(function (n) {
              self.updateField(self.rowObject.children[n], group);
            });
          }
        });

        self.rowObject.markChanged();
        if (self.changed === false) {
          $(Drupal.theme('tableDragChangedWarning')).insertBefore(self.table).hide().fadeIn('slow');
          self.changed = true;
        }
      }

      if (self.indentEnabled) {
        self.rowObject.removeIndentClasses();
      }
      if (self.oldRowElement) {
        $(self.oldRowElement).removeClass('drag-previous');
      }
      $droppedRow.removeClass('drag').addClass('drag-previous');
      self.oldRowElement = droppedRow;
      self.onDrop();
      self.rowObject = null;
    }

    if (self.dragObject !== null) {
      self.dragObject = null;
      $('body').removeClass('drag');
      clearInterval(self.scrollInterval);
    }
  };

  Drupal.tableDrag.prototype.pointerCoords = function (event) {
    if (event.pageX || event.pageY) {
      return { x: event.pageX, y: event.pageY };
    }
    return {
      x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: event.clientY + document.body.scrollTop - document.body.clientTop
    };
  };

  Drupal.tableDrag.prototype.getPointerOffset = function (target, event) {
    var docPos = $(target).offset();
    var pointerPos = this.pointerCoords(event);
    return { x: pointerPos.x - docPos.left, y: pointerPos.y - docPos.top };
  };

  Drupal.tableDrag.prototype.findDropTargetRow = function (x, y) {
    var _this3 = this;

    var rows = $(this.table.tBodies[0].rows).not(':hidden');

    var _loop = function _loop(n) {
      var row = rows[n];
      var $row = $(row);
      var rowY = $row.offset().top;
      var rowHeight = void 0;

      if (row.offsetHeight === 0) {
        rowHeight = parseInt(row.firstChild.offsetHeight, 10) / 2;
      } else {
          rowHeight = parseInt(row.offsetHeight, 10) / 2;
        }

      if (y > rowY - rowHeight && y < rowY + rowHeight) {
        if (_this3.indentEnabled) {
          if (Object.keys(_this3.rowObject.group).some(function (o) {
            return _this3.rowObject.group[o] === row;
          })) {
            return {
              v: null
            };
          }
        } else if (row === _this3.rowObject.element) {
            return {
              v: null
            };
          }

        if (!_this3.rowObject.isValidSwap(row)) {
          return {
            v: null
          };
        }

        while ($row.is(':hidden') && $row.prev('tr').is(':hidden')) {
          $row = $row.prev('tr:first-of-type');
          row = $row.get(0);
        }
        return {
          v: row
        };
      }
    };

    for (var n = 0; n < rows.length; n++) {
      var _ret = _loop(n);

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    return null;
  };

  Drupal.tableDrag.prototype.updateFields = function (changedRow) {
    var _this4 = this;

    Object.keys(this.tableSettings || {}).forEach(function (group) {
      _this4.updateField(changedRow, group);
    });
  };

  Drupal.tableDrag.prototype.updateField = function (changedRow, group) {
    var rowSettings = this.rowSettings(group, changedRow);
    var $changedRow = $(changedRow);
    var sourceRow = void 0;
    var $previousRow = void 0;
    var previousRow = void 0;
    var useSibling = void 0;

    if (rowSettings.relationship === 'self' || rowSettings.relationship === 'group') {
      sourceRow = changedRow;
    } else if (rowSettings.relationship === 'sibling') {
        $previousRow = $changedRow.prev('tr:first-of-type');
        previousRow = $previousRow.get(0);
        var $nextRow = $changedRow.next('tr:first-of-type');
        var nextRow = $nextRow.get(0);
        sourceRow = changedRow;
        if ($previousRow.is('.draggable') && $previousRow.find('.' + group).length) {
          if (this.indentEnabled) {
            if ($previousRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
              sourceRow = previousRow;
            }
          } else {
            sourceRow = previousRow;
          }
        } else if ($nextRow.is('.draggable') && $nextRow.find('.' + group).length) {
          if (this.indentEnabled) {
            if ($nextRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
              sourceRow = nextRow;
            }
          } else {
            sourceRow = nextRow;
          }
        }
      } else if (rowSettings.relationship === 'parent') {
          $previousRow = $changedRow.prev('tr');
          previousRow = $previousRow;
          while ($previousRow.length && $previousRow.find('.js-indentation').length >= this.rowObject.indents) {
            $previousRow = $previousRow.prev('tr');
            previousRow = $previousRow;
          }

          if ($previousRow.length) {
            sourceRow = $previousRow.get(0);
          } else {
              sourceRow = $(this.table).find('tr.draggable:first-of-type').get(0);
              if (sourceRow === this.rowObject.element) {
                sourceRow = $(this.rowObject.group[this.rowObject.group.length - 1]).next('tr.draggable').get(0);
              }
              useSibling = true;
            }
        }

    this.copyDragClasses(sourceRow, changedRow, group);
    rowSettings = this.rowSettings(group, changedRow);

    if (useSibling) {
      rowSettings.relationship = 'sibling';
      rowSettings.source = rowSettings.target;
    }

    var targetClass = '.' + rowSettings.target;
    var targetElement = $changedRow.find(targetClass).get(0);

    if (targetElement) {
      var sourceClass = '.' + rowSettings.source;
      var sourceElement = $(sourceClass, sourceRow).get(0);
      switch (rowSettings.action) {
        case 'depth':
          targetElement.value = $(sourceElement).closest('tr').find('.js-indentation').length;
          break;

        case 'match':
          targetElement.value = sourceElement.value;
          break;

        case 'order':
          {
            var siblings = this.rowObject.findSiblings(rowSettings);
            if ($(targetElement).is('select')) {
              var values = [];
              $(targetElement).find('option').each(function () {
                values.push(this.value);
              });
              var maxVal = values[values.length - 1];

              $(siblings).find(targetClass).each(function () {
                if (values.length > 0) {
                  this.value = values.shift();
                } else {
                  this.value = maxVal;
                }
              });
            } else {
              var weight = parseInt($(siblings[0]).find(targetClass).val(), 10) || 0;
              $(siblings).find(targetClass).each(function () {
                this.value = weight;
                weight++;
              });
            }
            break;
          }
      }
    }
  };

  Drupal.tableDrag.prototype.copyDragClasses = function (sourceRow, targetRow, group) {
    var sourceElement = $(sourceRow).find('.' + group);
    var targetElement = $(targetRow).find('.' + group);
    if (sourceElement.length && targetElement.length) {
      targetElement[0].className = sourceElement[0].className;
    }
  };

  Drupal.tableDrag.prototype.checkScroll = function (cursorY) {
    var de = document.documentElement;
    var b = document.body;

    var windowHeight = window.innerHeight || (de.clientHeight && de.clientWidth !== 0 ? de.clientHeight : b.offsetHeight);
    this.windowHeight = windowHeight;
    var scrollY = void 0;
    if (document.all) {
      scrollY = !de.scrollTop ? b.scrollTop : de.scrollTop;
    } else {
      scrollY = window.pageYOffset ? window.pageYOffset : window.scrollY;
    }
    this.scrollY = scrollY;
    var trigger = this.scrollSettings.trigger;
    var delta = 0;

    if (cursorY - scrollY > windowHeight - trigger) {
      delta = trigger / (windowHeight + scrollY - cursorY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return delta * this.scrollSettings.amount;
    }
    if (cursorY - scrollY < trigger) {
      delta = trigger / (cursorY - scrollY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return -delta * this.scrollSettings.amount;
    }
  };

  Drupal.tableDrag.prototype.setScroll = function (scrollAmount) {
    var self = this;

    this.scrollInterval = setInterval(function () {
      self.checkScroll(self.currentPointerCoords.y);
      var aboveTable = self.scrollY > self.table.topY;
      var belowTable = self.scrollY + self.windowHeight < self.table.bottomY;
      if (scrollAmount > 0 && belowTable || scrollAmount < 0 && aboveTable) {
        window.scrollBy(0, scrollAmount);
      }
    }, this.scrollSettings.interval);
  };

  Drupal.tableDrag.prototype.restripeTable = function () {
    $(this.table).find('> tbody > tr.draggable, > tr.draggable').filter(':visible').filter(':odd').removeClass('odd').addClass('even').end().filter(':even').removeClass('even').addClass('odd');
  };

  Drupal.tableDrag.prototype.onDrag = function () {
    return null;
  };

  Drupal.tableDrag.prototype.onDrop = function () {
    return null;
  };

  Drupal.tableDrag.prototype.row = function (tableRow, method, indentEnabled, maxDepth, addClasses) {
    var $tableRow = $(tableRow);

    this.element = tableRow;
    this.method = method;
    this.group = [tableRow];
    this.groupDepth = $tableRow.find('.js-indentation').length;
    this.changed = false;
    this.table = $tableRow.closest('table')[0];
    this.indentEnabled = indentEnabled;
    this.maxDepth = maxDepth;

    this.direction = '';
    if (this.indentEnabled) {
      this.indents = $tableRow.find('.js-indentation').length;
      this.children = this.findChildren(addClasses);
      this.group = $.merge(this.group, this.children);

      for (var n = 0; n < this.group.length; n++) {
        this.groupDepth = Math.max($(this.group[n]).find('.js-indentation').length, this.groupDepth);
      }
    }
  };

  Drupal.tableDrag.prototype.row.prototype.findChildren = function (addClasses) {
    var parentIndentation = this.indents;
    var currentRow = $(this.element, this.table).next('tr.draggable');
    var rows = [];
    var child = 0;

    function rowIndentation(indentNum, el) {
      var self = $(el);
      if (child === 1 && indentNum === parentIndentation) {
        self.addClass('tree-child-first');
      }
      if (indentNum === parentIndentation) {
        self.addClass('tree-child');
      } else if (indentNum > parentIndentation) {
        self.addClass('tree-child-horizontal');
      }
    }

    while (currentRow.length) {
      if (currentRow.find('.js-indentation').length > parentIndentation) {
        child++;
        rows.push(currentRow[0]);
        if (addClasses) {
          currentRow.find('.js-indentation').each(rowIndentation);
        }
      } else {
        break;
      }
      currentRow = currentRow.next('tr.draggable');
    }
    if (addClasses && rows.length) {
      $(rows[rows.length - 1]).find('.js-indentation:nth-child(' + (parentIndentation + 1) + ')').addClass('tree-child-last');
    }
    return rows;
  };

  Drupal.tableDrag.prototype.row.prototype.isValidSwap = function (row) {
    var $row = $(row);
    if (this.indentEnabled) {
      var prevRow = void 0;
      var nextRow = void 0;
      if (this.direction === 'down') {
        prevRow = row;
        nextRow = $row.next('tr').get(0);
      } else {
        prevRow = $row.prev('tr').get(0);
        nextRow = row;
      }
      this.interval = this.validIndentInterval(prevRow, nextRow);

      if (this.interval.min > this.interval.max) {
        return false;
      }
    }

    if (this.table.tBodies[0].rows[0] === row && $row.is(':not(.draggable)')) {
      return false;
    }

    return true;
  };

  Drupal.tableDrag.prototype.row.prototype.swap = function (position, row) {
    this.group.forEach(function (row) {
      Drupal.detachBehaviors(row, drupalSettings, 'move');
    });
    $(row)[position](this.group);

    this.group.forEach(function (row) {
      Drupal.attachBehaviors(row, drupalSettings);
    });
    this.changed = true;
    this.onSwap(row);
  };

  Drupal.tableDrag.prototype.row.prototype.validIndentInterval = function (prevRow, nextRow) {
    var $prevRow = $(prevRow);
    var maxIndent = void 0;

    var minIndent = nextRow ? $(nextRow).find('.js-indentation').length : 0;

    if (!prevRow || $prevRow.is(':not(.draggable)') || $(this.element).is('.tabledrag-root')) {
      maxIndent = 0;
    } else {
      maxIndent = $prevRow.find('.js-indentation').length + ($prevRow.is('.tabledrag-leaf') ? 0 : 1);

      if (this.maxDepth) {
        maxIndent = Math.min(maxIndent, this.maxDepth - (this.groupDepth - this.indents));
      }
    }

    return { min: minIndent, max: maxIndent };
  };

  Drupal.tableDrag.prototype.row.prototype.indent = function (indentDiff) {
    var $group = $(this.group);

    if (!this.interval) {
      var prevRow = $(this.element).prev('tr').get(0);
      var nextRow = $group.eq(-1).next('tr').get(0);
      this.interval = this.validIndentInterval(prevRow, nextRow);
    }

    var indent = this.indents + indentDiff;
    indent = Math.max(indent, this.interval.min);
    indent = Math.min(indent, this.interval.max);
    indentDiff = indent - this.indents;

    for (var n = 1; n <= Math.abs(indentDiff); n++) {
      if (indentDiff < 0) {
        $group.find('.js-indentation:first-of-type').remove();
        this.indents--;
      } else {
        $group.find('td:first-of-type').prepend(Drupal.theme('tableDragIndentation'));
        this.indents++;
      }
    }
    if (indentDiff) {
      this.changed = true;
      this.groupDepth += indentDiff;
      this.onIndent();
    }

    return indentDiff;
  };

  Drupal.tableDrag.prototype.row.prototype.findSiblings = function (rowSettings) {
    var siblings = [];
    var directions = ['prev', 'next'];
    var rowIndentation = this.indents;
    var checkRowIndentation = void 0;
    for (var d = 0; d < directions.length; d++) {
      var checkRow = $(this.element)[directions[d]]();
      while (checkRow.length) {
        if (checkRow.find('.' + rowSettings.target)) {
          if (this.indentEnabled) {
            checkRowIndentation = checkRow.find('.js-indentation').length;
          }

          if (!this.indentEnabled || checkRowIndentation === rowIndentation) {
            siblings.push(checkRow[0]);
          } else if (checkRowIndentation < rowIndentation) {
            break;
          }
        } else {
          break;
        }
        checkRow = checkRow[directions[d]]();
      }

      if (directions[d] === 'prev') {
        siblings.reverse();
        siblings.push(this.element);
      }
    }
    return siblings;
  };

  Drupal.tableDrag.prototype.row.prototype.removeIndentClasses = function () {
    var _this5 = this;

    Object.keys(this.children || {}).forEach(function (n) {
      $(_this5.children[n]).find('.js-indentation').removeClass('tree-child').removeClass('tree-child-first').removeClass('tree-child-last').removeClass('tree-child-horizontal');
    });
  };

  Drupal.tableDrag.prototype.row.prototype.markChanged = function () {
    var marker = Drupal.theme('tableDragChangedMarker');
    var cell = $(this.element).find('td:first-of-type');
    if (cell.find('abbr.tabledrag-changed').length === 0) {
      cell.append(marker);
    }
  };

  Drupal.tableDrag.prototype.row.prototype.onIndent = function () {
    return null;
  };

  Drupal.tableDrag.prototype.row.prototype.onSwap = function (swappedRow) {
    return null;
  };

  $.extend(Drupal.theme, {
    tableDragChangedMarker: function tableDragChangedMarker() {
      return '<abbr class="warning tabledrag-changed" title="' + Drupal.t('Changed') + '">*</abbr>';
    },
    tableDragIndentation: function tableDragIndentation() {
      return '<div class="js-indentation indentation">&nbsp;</div>';
    },
    tableDragChangedWarning: function tableDragChangedWarning() {
      return '<div class="tabledrag-changed-warning messages messages--warning" role="alert">' + Drupal.theme('tableDragChangedMarker') + ' ' + Drupal.t('You have unsaved changes.') + '</div>';
    }
  });
})(jQuery, Drupal, drupalSettings);;
/*! jQuery UI - v1.12.1 - 2017-03-31
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(a){"function"==typeof define&&define.amd?define(["jquery","./version"],a):a(jQuery)}(function(a){return function(){function b(a,b,c){return[parseFloat(a[0])*(l.test(a[0])?b/100:1),parseFloat(a[1])*(l.test(a[1])?c/100:1)]}function c(b,c){return parseInt(a.css(b,c),10)||0}function d(b){var c=b[0];return 9===c.nodeType?{width:b.width(),height:b.height(),offset:{top:0,left:0}}:a.isWindow(c)?{width:b.width(),height:b.height(),offset:{top:b.scrollTop(),left:b.scrollLeft()}}:c.preventDefault?{width:0,height:0,offset:{top:c.pageY,left:c.pageX}}:{width:b.outerWidth(),height:b.outerHeight(),offset:b.offset()}}var e,f=Math.max,g=Math.abs,h=/left|center|right/,i=/top|center|bottom/,j=/[\+\-]\d+(\.[\d]+)?%?/,k=/^\w+/,l=/%$/,m=a.fn.position;a.position={scrollbarWidth:function(){if(void 0!==e)return e;var b,c,d=a("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),f=d.children()[0];return a("body").append(d),b=f.offsetWidth,d.css("overflow","scroll"),c=f.offsetWidth,b===c&&(c=d[0].clientWidth),d.remove(),e=b-c},getScrollInfo:function(b){var c=b.isWindow||b.isDocument?"":b.element.css("overflow-x"),d=b.isWindow||b.isDocument?"":b.element.css("overflow-y"),e="scroll"===c||"auto"===c&&b.width<b.element[0].scrollWidth,f="scroll"===d||"auto"===d&&b.height<b.element[0].scrollHeight;return{width:f?a.position.scrollbarWidth():0,height:e?a.position.scrollbarWidth():0}},getWithinInfo:function(b){var c=a(b||window),d=a.isWindow(c[0]),e=!!c[0]&&9===c[0].nodeType,f=!d&&!e;return{element:c,isWindow:d,isDocument:e,offset:f?a(b).offset():{left:0,top:0},scrollLeft:c.scrollLeft(),scrollTop:c.scrollTop(),width:c.outerWidth(),height:c.outerHeight()}}},a.fn.position=function(e){if(!e||!e.of)return m.apply(this,arguments);e=a.extend({},e);var l,n,o,p,q,r,s=a(e.of),t=a.position.getWithinInfo(e.within),u=a.position.getScrollInfo(t),v=(e.collision||"flip").split(" "),w={};return r=d(s),s[0].preventDefault&&(e.at="left top"),n=r.width,o=r.height,p=r.offset,q=a.extend({},p),a.each(["my","at"],function(){var a,b,c=(e[this]||"").split(" ");1===c.length&&(c=h.test(c[0])?c.concat(["center"]):i.test(c[0])?["center"].concat(c):["center","center"]),c[0]=h.test(c[0])?c[0]:"center",c[1]=i.test(c[1])?c[1]:"center",a=j.exec(c[0]),b=j.exec(c[1]),w[this]=[a?a[0]:0,b?b[0]:0],e[this]=[k.exec(c[0])[0],k.exec(c[1])[0]]}),1===v.length&&(v[1]=v[0]),"right"===e.at[0]?q.left+=n:"center"===e.at[0]&&(q.left+=n/2),"bottom"===e.at[1]?q.top+=o:"center"===e.at[1]&&(q.top+=o/2),l=b(w.at,n,o),q.left+=l[0],q.top+=l[1],this.each(function(){var d,h,i=a(this),j=i.outerWidth(),k=i.outerHeight(),m=c(this,"marginLeft"),r=c(this,"marginTop"),x=j+m+c(this,"marginRight")+u.width,y=k+r+c(this,"marginBottom")+u.height,z=a.extend({},q),A=b(w.my,i.outerWidth(),i.outerHeight());"right"===e.my[0]?z.left-=j:"center"===e.my[0]&&(z.left-=j/2),"bottom"===e.my[1]?z.top-=k:"center"===e.my[1]&&(z.top-=k/2),z.left+=A[0],z.top+=A[1],d={marginLeft:m,marginTop:r},a.each(["left","top"],function(b,c){a.ui.position[v[b]]&&a.ui.position[v[b]][c](z,{targetWidth:n,targetHeight:o,elemWidth:j,elemHeight:k,collisionPosition:d,collisionWidth:x,collisionHeight:y,offset:[l[0]+A[0],l[1]+A[1]],my:e.my,at:e.at,within:t,elem:i})}),e.using&&(h=function(a){var b=p.left-z.left,c=b+n-j,d=p.top-z.top,h=d+o-k,l={target:{element:s,left:p.left,top:p.top,width:n,height:o},element:{element:i,left:z.left,top:z.top,width:j,height:k},horizontal:c<0?"left":b>0?"right":"center",vertical:h<0?"top":d>0?"bottom":"middle"};n<j&&g(b+c)<n&&(l.horizontal="center"),o<k&&g(d+h)<o&&(l.vertical="middle"),f(g(b),g(c))>f(g(d),g(h))?l.important="horizontal":l.important="vertical",e.using.call(this,a,l)}),i.offset(a.extend(z,{using:h}))})},a.ui.position={fit:{left:function(a,b){var c,d=b.within,e=d.isWindow?d.scrollLeft:d.offset.left,g=d.width,h=a.left-b.collisionPosition.marginLeft,i=e-h,j=h+b.collisionWidth-g-e;b.collisionWidth>g?i>0&&j<=0?(c=a.left+i+b.collisionWidth-g-e,a.left+=i-c):j>0&&i<=0?a.left=e:i>j?a.left=e+g-b.collisionWidth:a.left=e:i>0?a.left+=i:j>0?a.left-=j:a.left=f(a.left-h,a.left)},top:function(a,b){var c,d=b.within,e=d.isWindow?d.scrollTop:d.offset.top,g=b.within.height,h=a.top-b.collisionPosition.marginTop,i=e-h,j=h+b.collisionHeight-g-e;b.collisionHeight>g?i>0&&j<=0?(c=a.top+i+b.collisionHeight-g-e,a.top+=i-c):j>0&&i<=0?a.top=e:i>j?a.top=e+g-b.collisionHeight:a.top=e:i>0?a.top+=i:j>0?a.top-=j:a.top=f(a.top-h,a.top)}},flip:{left:function(a,b){var c,d,e=b.within,f=e.offset.left+e.scrollLeft,h=e.width,i=e.isWindow?e.scrollLeft:e.offset.left,j=a.left-b.collisionPosition.marginLeft,k=j-i,l=j+b.collisionWidth-h-i,m="left"===b.my[0]?-b.elemWidth:"right"===b.my[0]?b.elemWidth:0,n="left"===b.at[0]?b.targetWidth:"right"===b.at[0]?-b.targetWidth:0,o=-2*b.offset[0];k<0?(c=a.left+m+n+o+b.collisionWidth-h-f,(c<0||c<g(k))&&(a.left+=m+n+o)):l>0&&(d=a.left-b.collisionPosition.marginLeft+m+n+o-i,(d>0||g(d)<l)&&(a.left+=m+n+o))},top:function(a,b){var c,d,e=b.within,f=e.offset.top+e.scrollTop,h=e.height,i=e.isWindow?e.scrollTop:e.offset.top,j=a.top-b.collisionPosition.marginTop,k=j-i,l=j+b.collisionHeight-h-i,m="top"===b.my[1],n=m?-b.elemHeight:"bottom"===b.my[1]?b.elemHeight:0,o="top"===b.at[1]?b.targetHeight:"bottom"===b.at[1]?-b.targetHeight:0,p=-2*b.offset[1];k<0?(d=a.top+n+o+p+b.collisionHeight-h-f,(d<0||d<g(k))&&(a.top+=n+o+p)):l>0&&(c=a.top-b.collisionPosition.marginTop+n+o+p-i,(c>0||g(c)<l)&&(a.top+=n+o+p))}},flipfit:{left:function(){a.ui.position.flip.left.apply(this,arguments),a.ui.position.fit.left.apply(this,arguments)},top:function(){a.ui.position.flip.top.apply(this,arguments),a.ui.position.fit.top.apply(this,arguments)}}}}(),a.ui.position});;
/*! jQuery UI - v1.12.1 - 2017-03-31
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(a){"function"==typeof define&&define.amd?define(["jquery","../keycode","../position","../safe-active-element","../unique-id","../version","../widget"],a):a(jQuery)}(function(a){return a.widget("ui.menu",{version:"1.12.1",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-caret-1-e"},items:"> *",menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().attr({role:this.options.role,tabIndex:0}),this._addClass("ui-menu","ui-widget ui-widget-content"),this._on({"mousedown .ui-menu-item":function(a){a.preventDefault()},"click .ui-menu-item":function(b){var c=a(b.target),d=a(a.ui.safeActiveElement(this.document[0]));!this.mouseHandled&&c.not(".ui-state-disabled").length&&(this.select(b),b.isPropagationStopped()||(this.mouseHandled=!0),c.has(".ui-menu").length?this.expand(b):!this.element.is(":focus")&&d.closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(b){if(!this.previousFilter){var c=a(b.target).closest(".ui-menu-item"),d=a(b.currentTarget);c[0]===d[0]&&(this._removeClass(d.siblings().children(".ui-state-active"),null,"ui-state-active"),this.focus(b,d))}},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(a,b){var c=this.active||this.element.find(this.options.items).eq(0);b||this.focus(a,c)},blur:function(b){this._delay(function(){var c=!a.contains(this.element[0],a.ui.safeActiveElement(this.document[0]));c&&this.collapseAll(b)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(a){this._closeOnDocumentClick(a)&&this.collapseAll(a),this.mouseHandled=!1}})},_destroy:function(){var b=this.element.find(".ui-menu-item").removeAttr("role aria-disabled"),c=b.children(".ui-menu-item-wrapper").removeUniqueId().removeAttr("tabIndex role aria-haspopup");this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeAttr("role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex").removeUniqueId().show(),c.children().each(function(){var b=a(this);b.data("ui-menu-submenu-caret")&&b.remove()})},_keydown:function(b){var c,d,e,f,g=!0;switch(b.keyCode){case a.ui.keyCode.PAGE_UP:this.previousPage(b);break;case a.ui.keyCode.PAGE_DOWN:this.nextPage(b);break;case a.ui.keyCode.HOME:this._move("first","first",b);break;case a.ui.keyCode.END:this._move("last","last",b);break;case a.ui.keyCode.UP:this.previous(b);break;case a.ui.keyCode.DOWN:this.next(b);break;case a.ui.keyCode.LEFT:this.collapse(b);break;case a.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(b);break;case a.ui.keyCode.ENTER:case a.ui.keyCode.SPACE:this._activate(b);break;case a.ui.keyCode.ESCAPE:this.collapse(b);break;default:g=!1,d=this.previousFilter||"",f=!1,e=b.keyCode>=96&&b.keyCode<=105?(b.keyCode-96).toString():String.fromCharCode(b.keyCode),clearTimeout(this.filterTimer),e===d?f=!0:e=d+e,c=this._filterMenuItems(e),c=f&&c.index(this.active.next())!==-1?this.active.nextAll(".ui-menu-item"):c,c.length||(e=String.fromCharCode(b.keyCode),c=this._filterMenuItems(e)),c.length?(this.focus(b,c),this.previousFilter=e,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter}g&&b.preventDefault()},_activate:function(a){this.active&&!this.active.is(".ui-state-disabled")&&(this.active.children("[aria-haspopup='true']").length?this.expand(a):this.select(a))},refresh:function(){var b,c,d,e,f,g=this,h=this.options.icons.submenu,i=this.element.find(this.options.menus);this._toggleClass("ui-menu-icons",null,!!this.element.find(".ui-icon").length),d=i.filter(":not(.ui-menu)").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var b=a(this),c=b.prev(),d=a("<span>").data("ui-menu-submenu-caret",!0);g._addClass(d,"ui-menu-icon","ui-icon "+h),c.attr("aria-haspopup","true").prepend(d),b.attr("aria-labelledby",c.attr("id"))}),this._addClass(d,"ui-menu","ui-widget ui-widget-content ui-front"),b=i.add(this.element),c=b.find(this.options.items),c.not(".ui-menu-item").each(function(){var b=a(this);g._isDivider(b)&&g._addClass(b,"ui-menu-divider","ui-widget-content")}),e=c.not(".ui-menu-item, .ui-menu-divider"),f=e.children().not(".ui-menu").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),this._addClass(e,"ui-menu-item")._addClass(f,"ui-menu-item-wrapper"),c.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!a.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(a,b){if("icons"===a){var c=this.element.find(".ui-menu-icon");this._removeClass(c,null,this.options.icons.submenu)._addClass(c,null,b.submenu)}this._super(a,b)},_setOptionDisabled:function(a){this._super(a),this.element.attr("aria-disabled",String(a)),this._toggleClass(null,"ui-state-disabled",!!a)},focus:function(a,b){var c,d,e;this.blur(a,a&&"focus"===a.type),this._scrollIntoView(b),this.active=b.first(),d=this.active.children(".ui-menu-item-wrapper"),this._addClass(d,null,"ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",d.attr("id")),e=this.active.parent().closest(".ui-menu-item").children(".ui-menu-item-wrapper"),this._addClass(e,null,"ui-state-active"),a&&"keydown"===a.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),c=b.children(".ui-menu"),c.length&&a&&/^mouse/.test(a.type)&&this._startOpening(c),this.activeMenu=b.parent(),this._trigger("focus",a,{item:b})},_scrollIntoView:function(b){var c,d,e,f,g,h;this._hasScroll()&&(c=parseFloat(a.css(this.activeMenu[0],"borderTopWidth"))||0,d=parseFloat(a.css(this.activeMenu[0],"paddingTop"))||0,e=b.offset().top-this.activeMenu.offset().top-c-d,f=this.activeMenu.scrollTop(),g=this.activeMenu.height(),h=b.outerHeight(),e<0?this.activeMenu.scrollTop(f+e):e+h>g&&this.activeMenu.scrollTop(f+e-g+h))},blur:function(a,b){b||clearTimeout(this.timer),this.active&&(this._removeClass(this.active.children(".ui-menu-item-wrapper"),null,"ui-state-active"),this._trigger("blur",a,{item:this.active}),this.active=null)},_startOpening:function(a){clearTimeout(this.timer),"true"===a.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(a)},this.delay))},_open:function(b){var c=a.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(b.parents(".ui-menu")).hide().attr("aria-hidden","true"),b.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(c)},collapseAll:function(b,c){clearTimeout(this.timer),this.timer=this._delay(function(){var d=c?this.element:a(b&&b.target).closest(this.element.find(".ui-menu"));d.length||(d=this.element),this._close(d),this.blur(b),this._removeClass(d.find(".ui-state-active"),null,"ui-state-active"),this.activeMenu=d},this.delay)},_close:function(a){a||(a=this.active?this.active.parent():this.element),a.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false")},_closeOnDocumentClick:function(b){return!a(b.target).closest(".ui-menu").length},_isDivider:function(a){return!/[^\-\u2014\u2013\s]/.test(a.text())},collapse:function(a){var b=this.active&&this.active.parent().closest(".ui-menu-item",this.element);b&&b.length&&(this._close(),this.focus(a,b))},expand:function(a){var b=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();b&&b.length&&(this._open(b.parent()),this._delay(function(){this.focus(a,b)}))},next:function(a){this._move("next","first",a)},previous:function(a){this._move("prev","last",a)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(a,b,c){var d;this.active&&(d="first"===a||"last"===a?this.active["first"===a?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[a+"All"](".ui-menu-item").eq(0)),d&&d.length&&this.active||(d=this.activeMenu.find(this.options.items)[b]()),this.focus(c,d)},nextPage:function(b){var c,d,e;return this.active?void(this.isLastItem()||(this._hasScroll()?(d=this.active.offset().top,e=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return c=a(this),c.offset().top-d-e<0}),this.focus(b,c)):this.focus(b,this.activeMenu.find(this.options.items)[this.active?"last":"first"]()))):void this.next(b)},previousPage:function(b){var c,d,e;return this.active?void(this.isFirstItem()||(this._hasScroll()?(d=this.active.offset().top,e=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return c=a(this),c.offset().top-d+e>0}),this.focus(b,c)):this.focus(b,this.activeMenu.find(this.options.items).first()))):void this.next(b)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(b){this.active=this.active||a(b.target).closest(".ui-menu-item");var c={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(b,!0),this._trigger("select",b,c)},_filterMenuItems:function(b){var c=b.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),d=new RegExp("^"+c,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function(){return d.test(a.trim(a(this).children(".ui-menu-item-wrapper").text()))})}})});;
/*! jQuery UI - v1.12.1 - 2017-03-31
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed  */
!function(a){"function"==typeof define&&define.amd?define(["jquery","./menu","../keycode","../position","../safe-active-element","../version","../widget"],a):a(jQuery)}(function(a){return a.widget("ui.autocomplete",{version:"1.12.1",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var b,c,d,e=this.element[0].nodeName.toLowerCase(),f="textarea"===e,g="input"===e;this.isMultiLine=f||!g&&this._isContentEditable(this.element),this.valueMethod=this.element[f||g?"val":"text"],this.isNewMenu=!0,this._addClass("ui-autocomplete-input"),this.element.attr("autocomplete","off"),this._on(this.element,{keydown:function(e){if(this.element.prop("readOnly"))return b=!0,d=!0,void(c=!0);b=!1,d=!1,c=!1;var f=a.ui.keyCode;switch(e.keyCode){case f.PAGE_UP:b=!0,this._move("previousPage",e);break;case f.PAGE_DOWN:b=!0,this._move("nextPage",e);break;case f.UP:b=!0,this._keyEvent("previous",e);break;case f.DOWN:b=!0,this._keyEvent("next",e);break;case f.ENTER:this.menu.active&&(b=!0,e.preventDefault(),this.menu.select(e));break;case f.TAB:this.menu.active&&this.menu.select(e);break;case f.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(e),e.preventDefault());break;default:c=!0,this._searchTimeout(e)}},keypress:function(d){if(b)return b=!1,void(this.isMultiLine&&!this.menu.element.is(":visible")||d.preventDefault());if(!c){var e=a.ui.keyCode;switch(d.keyCode){case e.PAGE_UP:this._move("previousPage",d);break;case e.PAGE_DOWN:this._move("nextPage",d);break;case e.UP:this._keyEvent("previous",d);break;case e.DOWN:this._keyEvent("next",d)}}},input:function(a){return d?(d=!1,void a.preventDefault()):void this._searchTimeout(a)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(a){return this.cancelBlur?void delete this.cancelBlur:(clearTimeout(this.searching),this.close(a),void this._change(a))}}),this._initSource(),this.menu=a("<ul>").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._addClass(this.menu.element,"ui-autocomplete","ui-front"),this._on(this.menu.element,{mousedown:function(b){b.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,this.element[0]!==a.ui.safeActiveElement(this.document[0])&&this.element.trigger("focus")})},menufocus:function(b,c){var d,e;return this.isNewMenu&&(this.isNewMenu=!1,b.originalEvent&&/^mouse/.test(b.originalEvent.type))?(this.menu.blur(),void this.document.one("mousemove",function(){a(b.target).trigger(b.originalEvent)})):(e=c.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",b,{item:e})&&b.originalEvent&&/^key/.test(b.originalEvent.type)&&this._value(e.value),d=c.item.attr("aria-label")||e.value,void(d&&a.trim(d).length&&(this.liveRegion.children().hide(),a("<div>").text(d).appendTo(this.liveRegion))))},menuselect:function(b,c){var d=c.item.data("ui-autocomplete-item"),e=this.previous;this.element[0]!==a.ui.safeActiveElement(this.document[0])&&(this.element.trigger("focus"),this.previous=e,this._delay(function(){this.previous=e,this.selectedItem=d})),!1!==this._trigger("select",b,{item:d})&&this._value(d.value),this.term=this._value(),this.close(b),this.selectedItem=d}}),this.liveRegion=a("<div>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).appendTo(this.document[0].body),this._addClass(this.liveRegion,null,"ui-helper-hidden-accessible"),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(a,b){this._super(a,b),"source"===a&&this._initSource(),"appendTo"===a&&this.menu.element.appendTo(this._appendTo()),"disabled"===a&&b&&this.xhr&&this.xhr.abort()},_isEventTargetInWidget:function(b){var c=this.menu.element[0];return b.target===this.element[0]||b.target===c||a.contains(c,b.target)},_closeOnClickOutside:function(a){this._isEventTargetInWidget(a)||this.close()},_appendTo:function(){var b=this.options.appendTo;return b&&(b=b.jquery||b.nodeType?a(b):this.document.find(b).eq(0)),b&&b[0]||(b=this.element.closest(".ui-front, dialog")),b.length||(b=this.document[0].body),b},_initSource:function(){var b,c,d=this;a.isArray(this.options.source)?(b=this.options.source,this.source=function(c,d){d(a.ui.autocomplete.filter(b,c.term))}):"string"==typeof this.options.source?(c=this.options.source,this.source=function(b,e){d.xhr&&d.xhr.abort(),d.xhr=a.ajax({url:c,data:b,dataType:"json",success:function(a){e(a)},error:function(){e([])}})}):this.source=this.options.source},_searchTimeout:function(a){clearTimeout(this.searching),this.searching=this._delay(function(){var b=this.term===this._value(),c=this.menu.element.is(":visible"),d=a.altKey||a.ctrlKey||a.metaKey||a.shiftKey;b&&(!b||c||d)||(this.selectedItem=null,this.search(null,a))},this.options.delay)},search:function(a,b){return a=null!=a?a:this._value(),this.term=this._value(),a.length<this.options.minLength?this.close(b):this._trigger("search",b)!==!1?this._search(a):void 0},_search:function(a){this.pending++,this._addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:a},this._response())},_response:function(){var b=++this.requestIndex;return a.proxy(function(a){b===this.requestIndex&&this.__response(a),this.pending--,this.pending||this._removeClass("ui-autocomplete-loading")},this)},__response:function(a){a&&(a=this._normalize(a)),this._trigger("response",null,{content:a}),!this.options.disabled&&a&&a.length&&!this.cancelSearch?(this._suggest(a),this._trigger("open")):this._close()},close:function(a){this.cancelSearch=!0,this._close(a)},_close:function(a){this._off(this.document,"mousedown"),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",a))},_change:function(a){this.previous!==this._value()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(b){return b.length&&b[0].label&&b[0].value?b:a.map(b,function(b){return"string"==typeof b?{label:b,value:b}:a.extend({},b,{label:b.label||b.value,value:b.value||b.label})})},_suggest:function(b){var c=this.menu.element.empty();this._renderMenu(c,b),this.isNewMenu=!0,this.menu.refresh(),c.show(),this._resizeMenu(),c.position(a.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(),this._on(this.document,{mousedown:"_closeOnClickOutside"})},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(b,c){var d=this;a.each(c,function(a,c){d._renderItemData(b,c)})},_renderItemData:function(a,b){return this._renderItem(a,b).data("ui-autocomplete-item",b)},_renderItem:function(b,c){return a("<li>").append(a("<div>").text(c.label)).appendTo(b)},_move:function(a,b){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(a)||this.menu.isLastItem()&&/^next/.test(a)?(this.isMultiLine||this._value(this.term),void this.menu.blur()):void this.menu[a](b):void this.search(null,b)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(a,b){this.isMultiLine&&!this.menu.element.is(":visible")||(this._move(a,b),b.preventDefault())},_isContentEditable:function(a){if(!a.length)return!1;var b=a.prop("contentEditable");return"inherit"===b?this._isContentEditable(a.parent()):"true"===b}}),a.extend(a.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(b,c){var d=new RegExp(a.ui.autocomplete.escapeRegex(c),"i");return a.grep(b,function(a){return d.test(a.label||a.value||a)})}}),a.widget("ui.autocomplete",a.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(a){return a+(a>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(b){var c;this._superApply(arguments),this.options.disabled||this.cancelSearch||(c=b&&b.length?this.options.messages.results(b.length):this.options.messages.noResults,this.liveRegion.children().hide(),a("<div>").text(c).appendTo(this.liveRegion))}}),a.ui.autocomplete});;
/**
 * @file
 * JavaScript file for the Coffee module.
 */

(function ($, Drupal, drupalSettings, DrupalCoffee) {

  'use strict';

  // Remap the filter functions for autocomplete to recognise the
  // extra value "command".
  var proto = $.ui.autocomplete.prototype;
  var initSource = proto._initSource;

  function filter(array, term) {
    var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');
    return $.grep(array, function (value) {
      return matcher.test(value.command) || matcher.test(value.label) || matcher.test(value.value);
    });
  }

  $.extend(proto, {
    _initSource: function () {
      if ($.isArray(this.options.source)) {
        this.source = function (request, response) {
          response(filter(this.options.source, request.term));
        };
      }
      else {
        initSource.call(this);
      }
    }
  });

  /**
   * Coffee module namespace.
   *
   * @namespace
   *
   * @todo put this in Drupal.coffee to expose it.
   */
  DrupalCoffee = DrupalCoffee || {};

  /**
   * Attaches coffee module behaviors.
   *
   * Initializes DOM elements coffee module needs to display the search.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach coffee functionality to the page.
   *
   * @todo get most of it out of the behavior in dedicated functions.
   */
  Drupal.behaviors.coffee = {
    attach: function () {
      $('body').once('coffee').each(function () {
        var body = $(this);
        DrupalCoffee.bg.appendTo(body).hide();
        DrupalCoffee.wrapper.appendTo('body').addClass('hide-form');
        DrupalCoffee.form
          .append(DrupalCoffee.label)
          .append(DrupalCoffee.field)
          .append(DrupalCoffee.results)
          .wrapInner('<div id="coffee-form-inner" />')
          .appendTo(DrupalCoffee.wrapper);

        // Load autocomplete data set, consider implementing
        // caching with local storage.
        DrupalCoffee.dataset = [];
        DrupalCoffee.isItemSelected = false;

        var autocomplete_data_element = 'ui-autocomplete';

        var urlPath = drupalSettings.coffee.dataPath || 'admin/coffee/get-data';
        $.ajax({
          url: Drupal.url(urlPath),
          dataType: 'json',
          success: function (data) {
            DrupalCoffee.dataset = data;

            // Apply autocomplete plugin on show.
            var $autocomplete = $(DrupalCoffee.field).autocomplete({
              source: DrupalCoffee.dataset,
              focus: function (event, ui) {
                // Prevents replacing the value of the input field.
                DrupalCoffee.isItemSelected = true;
                event.preventDefault();
              },
              change: function (event, ui) {
                DrupalCoffee.isItemSelected = false;
              },
              select: function (event, ui) {
                DrupalCoffee.redirect(ui.item.value, event.metaKey || event.ctrlKey);
                event.preventDefault();
                return false;
              },
              delay: 0,
              appendTo: DrupalCoffee.results
            });

            $autocomplete.data(autocomplete_data_element)._renderItem = function (ul, item) {
              // Strip the basePath when displaying the link description.
              var description = item.value;
              if (item.value.indexOf(drupalSettings.path.basePath) === 0) {
                description = item.value.substring(drupalSettings.path.basePath.length);
              }
              return $('<li></li>')
                .data('item.autocomplete', item)
                .append('<a>' + item.label + '<small class="description">' + description + '</small></a>')
                .appendTo(ul);
            };

            // We want to limit the number of results.
            $(DrupalCoffee.field).data(autocomplete_data_element)._renderMenu = function (ul, items) {
              var self = this;
              items = items.slice(0, drupalSettings.coffee.maxResults);
              $.each(items, function (index, item) {
                self._renderItemData(ul, item);
              });
            };

            DrupalCoffee.form.keydown(function (event) {
              if (event.keyCode === 13) {
                var openInNewWindow = false;

                if (event.metaKey || event.ctrlKey) {
                  openInNewWindow = true;
                }

                if (!DrupalCoffee.isItemSelected) {
                  var $firstItem = $(DrupalCoffee.results).find('li:first').data('item.autocomplete');
                  if (typeof $firstItem === 'object') {
                    DrupalCoffee.redirect($firstItem.value, openInNewWindow);
                    event.preventDefault();
                  }
                }
              }
            });
          },
          error: function () {
            DrupalCoffee.field.val('Could not load data, please refresh the page');
          }
        });

        $('.toolbar-icon-coffee').click(function (event) {
          event.preventDefault();
          DrupalCoffee.coffee_show();
        });
        // Key events.
        $(document).keydown(function (event) {

          // Show the form with alt + D. Use 2 keycodes as 'D' can be uppercase or lowercase.
          if (DrupalCoffee.wrapper.hasClass('hide-form') &&
            event.altKey === true &&
              // 68/206 = d/D, 75 = k.
            (event.keyCode === 68 || event.keyCode === 206 || event.keyCode === 75)) {
            DrupalCoffee.coffee_show();
            event.preventDefault();
          }
          // Close the form with esc or alt + D.
          else {
            if (!DrupalCoffee.wrapper.hasClass('hide-form') && (event.keyCode === 27 || (event.altKey === true && (event.keyCode === 68 || event.keyCode === 206)))) {
              DrupalCoffee.coffee_close();
              event.preventDefault();
            }
          }
        });
      });
    }
  };

  // Prefix the open and close functions to avoid
  // conflicts with autocomplete plugin.
  /**
   * Open the form and focus on the search field.
   */
  DrupalCoffee.coffee_show = function () {
    DrupalCoffee.wrapper.removeClass('hide-form');
    DrupalCoffee.bg.show();
    DrupalCoffee.field.focus();
    $(DrupalCoffee.field).autocomplete({enable: true});
  };

  /**
   * Close the form and destroy all data.
   */
  DrupalCoffee.coffee_close = function () {
    DrupalCoffee.field.val('');
    DrupalCoffee.wrapper.addClass('hide-form');
    DrupalCoffee.bg.hide();
    $(DrupalCoffee.field).autocomplete({enable: false});
  };

  /**
   * Close the Coffee form and redirect.
   *
   * @param {string} path
   *   URL to redirect to.
   * @param {bool} openInNewWindow
   *   Indicates if the URL should be open in a new window.
   */
  DrupalCoffee.redirect = function (path, openInNewWindow) {
    DrupalCoffee.coffee_close();

    if (openInNewWindow) {
      window.open(path);
    }
    else {
      document.location = path;
    }
  };

  /**
   * The HTML elements.
   *
   * @todo use Drupal.theme.
   */
  DrupalCoffee.label = $('<label for="coffee-q" class="hidden" />').text(Drupal.t('Query', '', ''));
  DrupalCoffee.results = $('<div id="coffee-results" />');
  DrupalCoffee.wrapper = $('<div class="coffee-form-wrapper" />');
  DrupalCoffee.form = $('<form id="coffee-form" action="#" />');
  DrupalCoffee.bg = $('<div id="coffee-bg" />').click(function () {
    DrupalCoffee.coffee_close();
  });

  DrupalCoffee.field = $('<input id="coffee-q" type="text" autocomplete="off" />');

})(jQuery, Drupal, drupalSettings);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.theme.progressBar = function (id) {
    return '<div id="' + id + '" class="progress" aria-live="polite">' + '<div class="progress__label">&nbsp;</div>' + '<div class="progress__track"><div class="progress__bar"></div></div>' + '<div class="progress__percentage"></div>' + '<div class="progress__description">&nbsp;</div>' + '</div>';
  };

  Drupal.ProgressBar = function (id, updateCallback, method, errorCallback) {
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;

    this.element = $(Drupal.theme('progressBar', id));
  };

  $.extend(Drupal.ProgressBar.prototype, {
    setProgress: function setProgress(percentage, message, label) {
      if (percentage >= 0 && percentage <= 100) {
        $(this.element).find('div.progress__bar').css('width', percentage + '%');
        $(this.element).find('div.progress__percentage').html(percentage + '%');
      }
      $('div.progress__description', this.element).html(message);
      $('div.progress__label', this.element).html(label);
      if (this.updateCallback) {
        this.updateCallback(percentage, message, this);
      }
    },
    startMonitoring: function startMonitoring(uri, delay) {
      this.delay = delay;
      this.uri = uri;
      this.sendPing();
    },
    stopMonitoring: function stopMonitoring() {
      clearTimeout(this.timer);

      this.uri = null;
    },
    sendPing: function sendPing() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.uri) {
        var pb = this;

        var uri = this.uri;
        if (uri.indexOf('?') === -1) {
          uri += '?';
        } else {
          uri += '&';
        }
        uri += '_format=json';
        $.ajax({
          type: this.method,
          url: uri,
          data: '',
          dataType: 'json',
          success: function success(progress) {
            if (progress.status === 0) {
              pb.displayError(progress.data);
              return;
            }

            pb.setProgress(progress.percentage, progress.message, progress.label);

            pb.timer = setTimeout(function () {
              pb.sendPing();
            }, pb.delay);
          },
          error: function error(xmlhttp) {
            var e = new Drupal.AjaxError(xmlhttp, pb.uri);
            pb.displayError('<pre>' + e.message + '</pre>');
          }
        });
      }
    },
    displayError: function displayError(string) {
      var error = $('<div class="messages messages--error"></div>').html(string);
      $(this.element).before(error).hide();

      if (this.errorCallback) {
        this.errorCallback(this);
      }
    }
  });
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function ($, window, Drupal, drupalSettings) {
  Drupal.behaviors.AJAX = {
    attach: function attach(context, settings) {
      function loadAjaxBehavior(base) {
        var elementSettings = settings.ajax[base];
        if (typeof elementSettings.selector === 'undefined') {
          elementSettings.selector = '#' + base;
        }
        $(elementSettings.selector).once('drupal-ajax').each(function () {
          elementSettings.element = this;
          elementSettings.base = base;
          Drupal.ajax(elementSettings);
        });
      }

      Object.keys(settings.ajax || {}).forEach(function (base) {
        return loadAjaxBehavior(base);
      });

      Drupal.ajax.bindAjaxLinks(document.body);

      $('.use-ajax-submit').once('ajax').each(function () {
        var elementSettings = {};

        elementSettings.url = $(this.form).attr('action');

        elementSettings.setClick = true;

        elementSettings.event = 'click';

        elementSettings.progress = { type: 'throbber' };
        elementSettings.base = $(this).attr('id');
        elementSettings.element = this;

        Drupal.ajax(elementSettings);
      });
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        Drupal.ajax.expired().forEach(function (instance) {
          Drupal.ajax.instances[instance.instanceIndex] = null;
        });
      }
    }
  };

  Drupal.AjaxError = function (xmlhttp, uri, customMessage) {
    var statusCode = void 0;
    var statusText = void 0;
    var responseText = void 0;
    if (xmlhttp.status) {
      statusCode = '\n' + Drupal.t('An AJAX HTTP error occurred.') + '\n' + Drupal.t('HTTP Result Code: !status', { '!status': xmlhttp.status });
    } else {
      statusCode = '\n' + Drupal.t('An AJAX HTTP request terminated abnormally.');
    }
    statusCode += '\n' + Drupal.t('Debugging information follows.');
    var pathText = '\n' + Drupal.t('Path: !uri', { '!uri': uri });
    statusText = '';

    try {
      statusText = '\n' + Drupal.t('StatusText: !statusText', {
        '!statusText': $.trim(xmlhttp.statusText)
      });
    } catch (e) {}

    responseText = '';

    try {
      responseText = '\n' + Drupal.t('ResponseText: !responseText', {
        '!responseText': $.trim(xmlhttp.responseText)
      });
    } catch (e) {}

    responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '');
    responseText = responseText.replace(/[\n]+\s+/g, '\n');

    var readyStateText = xmlhttp.status === 0 ? '\n' + Drupal.t('ReadyState: !readyState', {
      '!readyState': xmlhttp.readyState
    }) : '';

    customMessage = customMessage ? '\n' + Drupal.t('CustomMessage: !customMessage', {
      '!customMessage': customMessage
    }) : '';

    this.message = statusCode + pathText + statusText + customMessage + responseText + readyStateText;

    this.name = 'AjaxError';
  };

  Drupal.AjaxError.prototype = new Error();
  Drupal.AjaxError.prototype.constructor = Drupal.AjaxError;

  Drupal.ajax = function (settings) {
    if (arguments.length !== 1) {
      throw new Error('Drupal.ajax() function must be called with one configuration object only');
    }

    var base = settings.base || false;
    var element = settings.element || false;
    delete settings.base;
    delete settings.element;

    if (!settings.progress && !element) {
      settings.progress = false;
    }

    var ajax = new Drupal.Ajax(base, element, settings);
    ajax.instanceIndex = Drupal.ajax.instances.length;
    Drupal.ajax.instances.push(ajax);

    return ajax;
  };

  Drupal.ajax.instances = [];

  Drupal.ajax.expired = function () {
    return Drupal.ajax.instances.filter(function (instance) {
      return instance && instance.element !== false && !document.body.contains(instance.element);
    });
  };

  Drupal.ajax.bindAjaxLinks = function (element) {
    $(element).find('.use-ajax').once('ajax').each(function (i, ajaxLink) {
      var $linkElement = $(ajaxLink);

      var elementSettings = {
        progress: { type: 'throbber' },
        dialogType: $linkElement.data('dialog-type'),
        dialog: $linkElement.data('dialog-options'),
        dialogRenderer: $linkElement.data('dialog-renderer'),
        base: $linkElement.attr('id'),
        element: ajaxLink
      };
      var href = $linkElement.attr('href');

      if (href) {
        elementSettings.url = href;
        elementSettings.event = 'click';
      }
      Drupal.ajax(elementSettings);
    });
  };

  Drupal.Ajax = function (base, element, elementSettings) {
    var defaults = {
      event: element ? 'mousedown' : null,
      keypress: true,
      selector: base ? '#' + base : null,
      effect: 'none',
      speed: 'none',
      method: 'replaceWith',
      progress: {
        type: 'throbber',
        message: Drupal.t('Please wait...')
      },
      submit: {
        js: true
      }
    };

    $.extend(this, defaults, elementSettings);

    this.commands = new Drupal.AjaxCommands();

    this.instanceIndex = false;

    if (this.wrapper) {
      this.wrapper = '#' + this.wrapper;
    }

    this.element = element;

    this.element_settings = elementSettings;

    this.elementSettings = elementSettings;

    if (this.element && this.element.form) {
      this.$form = $(this.element.form);
    }

    if (!this.url) {
      var $element = $(this.element);
      if ($element.is('a')) {
        this.url = $element.attr('href');
      } else if (this.element && element.form) {
        this.url = this.$form.attr('action');
      }
    }

    var originalUrl = this.url;

    this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, '/ajax$1');

    if (drupalSettings.ajaxTrustedUrl[originalUrl]) {
      drupalSettings.ajaxTrustedUrl[this.url] = true;
    }

    var ajax = this;

    ajax.options = {
      url: ajax.url,
      data: ajax.submit,
      beforeSerialize: function beforeSerialize(elementSettings, options) {
        return ajax.beforeSerialize(elementSettings, options);
      },
      beforeSubmit: function beforeSubmit(formValues, elementSettings, options) {
        ajax.ajaxing = true;
        return ajax.beforeSubmit(formValues, elementSettings, options);
      },
      beforeSend: function beforeSend(xmlhttprequest, options) {
        ajax.ajaxing = true;
        return ajax.beforeSend(xmlhttprequest, options);
      },
      success: function success(response, status, xmlhttprequest) {
        if (typeof response === 'string') {
          response = $.parseJSON(response);
        }

        if (response !== null && !drupalSettings.ajaxTrustedUrl[ajax.url]) {
          if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') {
            var customMessage = Drupal.t('The response failed verification so will not be processed.');
            return ajax.error(xmlhttprequest, ajax.url, customMessage);
          }
        }

        return ajax.success(response, status);
      },
      complete: function complete(xmlhttprequest, status) {
        ajax.ajaxing = false;
        if (status === 'error' || status === 'parsererror') {
          return ajax.error(xmlhttprequest, ajax.url);
        }
      },

      dataType: 'json',
      type: 'POST'
    };

    if (elementSettings.dialog) {
      ajax.options.data.dialogOptions = elementSettings.dialog;
    }

    if (ajax.options.url.indexOf('?') === -1) {
      ajax.options.url += '?';
    } else {
      ajax.options.url += '&';
    }

    var wrapper = 'drupal_' + (elementSettings.dialogType || 'ajax');
    if (elementSettings.dialogRenderer) {
      wrapper += '.' + elementSettings.dialogRenderer;
    }
    ajax.options.url += Drupal.ajax.WRAPPER_FORMAT + '=' + wrapper;

    $(ajax.element).on(elementSettings.event, function (event) {
      if (!drupalSettings.ajaxTrustedUrl[ajax.url] && !Drupal.url.isLocal(ajax.url)) {
        throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', {
          '!url': ajax.url
        }));
      }
      return ajax.eventResponse(this, event);
    });

    if (elementSettings.keypress) {
      $(ajax.element).on('keypress', function (event) {
        return ajax.keypressResponse(this, event);
      });
    }

    if (elementSettings.prevent) {
      $(ajax.element).on(elementSettings.prevent, false);
    }
  };

  Drupal.ajax.WRAPPER_FORMAT = '_wrapper_format';

  Drupal.Ajax.AJAX_REQUEST_PARAMETER = '_drupal_ajax';

  Drupal.Ajax.prototype.execute = function () {
    if (this.ajaxing) {
      return;
    }

    try {
      this.beforeSerialize(this.element, this.options);

      return $.ajax(this.options);
    } catch (e) {
      this.ajaxing = false;
      window.alert('An error occurred while attempting to process ' + this.options.url + ': ' + e.message);

      return $.Deferred().reject();
    }
  };

  Drupal.Ajax.prototype.keypressResponse = function (element, event) {
    var ajax = this;

    if (event.which === 13 || event.which === 32 && element.type !== 'text' && element.type !== 'textarea' && element.type !== 'tel' && element.type !== 'number') {
      event.preventDefault();
      event.stopPropagation();
      $(element).trigger(ajax.elementSettings.event);
    }
  };

  Drupal.Ajax.prototype.eventResponse = function (element, event) {
    event.preventDefault();
    event.stopPropagation();

    var ajax = this;

    if (ajax.ajaxing) {
      return;
    }

    try {
      if (ajax.$form) {
        if (ajax.setClick) {
          element.form.clk = element;
        }

        ajax.$form.ajaxSubmit(ajax.options);
      } else {
        ajax.beforeSerialize(ajax.element, ajax.options);
        $.ajax(ajax.options);
      }
    } catch (e) {
      ajax.ajaxing = false;
      window.alert('An error occurred while attempting to process ' + ajax.options.url + ': ' + e.message);
    }
  };

  Drupal.Ajax.prototype.beforeSerialize = function (element, options) {
    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.detachBehaviors(this.$form.get(0), settings, 'serialize');
    }

    options.data[Drupal.Ajax.AJAX_REQUEST_PARAMETER] = 1;

    var pageState = drupalSettings.ajaxPageState;
    options.data['ajax_page_state[theme]'] = pageState.theme;
    options.data['ajax_page_state[theme_token]'] = pageState.theme_token;
    options.data['ajax_page_state[libraries]'] = pageState.libraries;
  };

  Drupal.Ajax.prototype.beforeSubmit = function (formValues, element, options) {};

  Drupal.Ajax.prototype.beforeSend = function (xmlhttprequest, options) {
    if (this.$form) {
      options.extraData = options.extraData || {};

      options.extraData.ajax_iframe_upload = '1';

      var v = $.fieldValue(this.element);
      if (v !== null) {
        options.extraData[this.element.name] = v;
      }
    }

    $(this.element).prop('disabled', true);

    if (!this.progress || !this.progress.type) {
      return;
    }

    var progressIndicatorMethod = 'setProgressIndicator' + this.progress.type.slice(0, 1).toUpperCase() + this.progress.type.slice(1).toLowerCase();
    if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === 'function') {
      this[progressIndicatorMethod].call(this);
    }
  };

  Drupal.theme.ajaxProgressThrobber = function (message) {
    var messageMarkup = typeof message === 'string' ? Drupal.theme('ajaxProgressMessage', message) : '';
    var throbber = '<div class="throbber">&nbsp;</div>';

    return '<div class="ajax-progress ajax-progress-throbber">' + throbber + messageMarkup + '</div>';
  };

  Drupal.theme.ajaxProgressIndicatorFullscreen = function () {
    return '<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>';
  };

  Drupal.theme.ajaxProgressMessage = function (message) {
    return '<div class="message">' + message + '</div>';
  };

  Drupal.theme.ajaxProgressBar = function ($element) {
    return $('<div class="ajax-progress ajax-progress-bar"></div>').append($element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorBar = function () {
    var progressBar = new Drupal.ProgressBar('ajax-progress-' + this.element.id, $.noop, this.progress.method, $.noop);
    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }
    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }
    this.progress.element = $(Drupal.theme('ajaxProgressBar', progressBar.element));
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorThrobber = function () {
    this.progress.element = $(Drupal.theme('ajaxProgressThrobber', this.progress.message));
    $(this.element).after(this.progress.element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function () {
    this.progress.element = $(Drupal.theme('ajaxProgressIndicatorFullscreen'));
    $('body').append(this.progress.element);
  };

  Drupal.Ajax.prototype.success = function (response, status) {
    var _this = this;

    if (this.progress.element) {
      $(this.progress.element).remove();
    }
    if (this.progress.object) {
      this.progress.object.stopMonitoring();
    }
    $(this.element).prop('disabled', false);

    var elementParents = $(this.element).parents('[data-drupal-selector]').addBack().toArray();

    var focusChanged = false;
    Object.keys(response || {}).forEach(function (i) {
      if (response[i].command && _this.commands[response[i].command]) {
        _this.commands[response[i].command](_this, response[i], status);
        if (response[i].command === 'invoke' && response[i].method === 'focus') {
          focusChanged = true;
        }
      }
    });

    if (!focusChanged && this.element && !$(this.element).data('disable-refocus')) {
      var target = false;

      for (var n = elementParents.length - 1; !target && n >= 0; n--) {
        target = document.querySelector('[data-drupal-selector="' + elementParents[n].getAttribute('data-drupal-selector') + '"]');
      }

      if (target) {
        $(target).trigger('focus');
      }
    }

    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.attachBehaviors(this.$form.get(0), settings);
    }

    this.settings = null;
  };

  Drupal.Ajax.prototype.getEffect = function (response) {
    var type = response.effect || this.effect;
    var speed = response.speed || this.speed;

    var effect = {};
    if (type === 'none') {
      effect.showEffect = 'show';
      effect.hideEffect = 'hide';
      effect.showSpeed = '';
    } else if (type === 'fade') {
      effect.showEffect = 'fadeIn';
      effect.hideEffect = 'fadeOut';
      effect.showSpeed = speed;
    } else {
      effect.showEffect = type + 'Toggle';
      effect.hideEffect = type + 'Toggle';
      effect.showSpeed = speed;
    }

    return effect;
  };

  Drupal.Ajax.prototype.error = function (xmlhttprequest, uri, customMessage) {
    if (this.progress.element) {
      $(this.progress.element).remove();
    }
    if (this.progress.object) {
      this.progress.object.stopMonitoring();
    }

    $(this.wrapper).show();

    $(this.element).prop('disabled', false);

    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.attachBehaviors(this.$form.get(0), settings);
    }
    throw new Drupal.AjaxError(xmlhttprequest, uri, customMessage);
  };

  Drupal.theme.ajaxWrapperNewContent = function ($newContent, ajax, response) {
    return (response.effect || ajax.effect) !== 'none' && $newContent.filter(function (i) {
      return !($newContent[i].nodeName === '#comment' || $newContent[i].nodeName === '#text' && /^(\s|\n|\r)*$/.test($newContent[i].textContent));
    }).length > 1 ? Drupal.theme('ajaxWrapperMultipleRootElements', $newContent) : $newContent;
  };

  Drupal.theme.ajaxWrapperMultipleRootElements = function ($elements) {
    return $('<div></div>').append($elements);
  };

  Drupal.AjaxCommands = function () {};
  Drupal.AjaxCommands.prototype = {
    insert: function insert(ajax, response) {
      var $wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
      var method = response.method || ajax.method;
      var effect = ajax.getEffect(response);

      var settings = response.settings || ajax.settings || drupalSettings;

      var $newContent = $($.parseHTML(response.data, document, true));

      $newContent = Drupal.theme('ajaxWrapperNewContent', $newContent, ajax, response);

      switch (method) {
        case 'html':
        case 'replaceWith':
        case 'replaceAll':
        case 'empty':
        case 'remove':
          Drupal.detachBehaviors($wrapper.get(0), settings);
          break;
        default:
          break;
      }

      $wrapper[method]($newContent);

      if (effect.showEffect !== 'show') {
        $newContent.hide();
      }

      var $ajaxNewContent = $newContent.find('.ajax-new-content');
      if ($ajaxNewContent.length) {
        $ajaxNewContent.hide();
        $newContent.show();
        $ajaxNewContent[effect.showEffect](effect.showSpeed);
      } else if (effect.showEffect !== 'show') {
        $newContent[effect.showEffect](effect.showSpeed);
      }

      if ($newContent.parents('html').length) {
        $newContent.each(function (index, element) {
          if (element.nodeType === Node.ELEMENT_NODE) {
            Drupal.attachBehaviors(element, settings);
          }
        });
      }
    },
    remove: function remove(ajax, response, status) {
      var settings = response.settings || ajax.settings || drupalSettings;
      $(response.selector).each(function () {
        Drupal.detachBehaviors(this, settings);
      }).remove();
    },
    changed: function changed(ajax, response, status) {
      var $element = $(response.selector);
      if (!$element.hasClass('ajax-changed')) {
        $element.addClass('ajax-changed');
        if (response.asterisk) {
          $element.find(response.asterisk).append(' <abbr class="ajax-changed" title="' + Drupal.t('Changed') + '">*</abbr> ');
        }
      }
    },
    alert: function alert(ajax, response, status) {
      window.alert(response.text, response.title);
    },
    announce: function announce(ajax, response) {
      if (response.priority) {
        Drupal.announce(response.text, response.priority);
      } else {
        Drupal.announce(response.text);
      }
    },
    redirect: function redirect(ajax, response, status) {
      window.location = response.url;
    },
    css: function css(ajax, response, status) {
      $(response.selector).css(response.argument);
    },
    settings: function settings(ajax, response, status) {
      var ajaxSettings = drupalSettings.ajax;

      if (ajaxSettings) {
        Drupal.ajax.expired().forEach(function (instance) {

          if (instance.selector) {
            var selector = instance.selector.replace('#', '');
            if (selector in ajaxSettings) {
              delete ajaxSettings[selector];
            }
          }
        });
      }

      if (response.merge) {
        $.extend(true, drupalSettings, response.settings);
      } else {
        ajax.settings = response.settings;
      }
    },
    data: function data(ajax, response, status) {
      $(response.selector).data(response.name, response.value);
    },
    invoke: function invoke(ajax, response, status) {
      var $element = $(response.selector);
      $element[response.method].apply($element, _toConsumableArray(response.args));
    },
    restripe: function restripe(ajax, response, status) {
      $(response.selector).find('> tbody > tr:visible, > tr:visible').removeClass('odd even').filter(':even').addClass('odd').end().filter(':odd').addClass('even');
    },
    update_build_id: function update_build_id(ajax, response, status) {
      $('input[name="form_build_id"][value="' + response.old + '"]').val(response.new);
    },
    add_css: function add_css(ajax, response, status) {
      $('head').prepend(response.data);

      var match = void 0;
      var importMatch = /^@import url\("(.*)"\);$/gim;
      if (document.styleSheets[0].addImport && importMatch.test(response.data)) {
        importMatch.lastIndex = 0;
        do {
          match = importMatch.exec(response.data);
          document.styleSheets[0].addImport(match[1]);
        } while (match);
      }
    },
    message: function message(ajax, response) {
      var messages = new Drupal.Message(document.querySelector(response.messageWrapperQuerySelector));
      if (response.clearPrevious) {
        messages.clear();
      }
      messages.add(response.message, response.messageOptions);
    }
  };
})(jQuery, window, Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function (Drupal) {
  Drupal.theme.ajaxProgressBar = function ($element) {
    return $element.addClass('ajax-progress ajax-progress-bar');
  };
})(Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function (Drupal, drupalSettings) {
  Drupal.behaviors.activeLinks = {
    attach: function attach(context) {
      var path = drupalSettings.path;
      var queryString = JSON.stringify(path.currentQuery);
      var querySelector = path.currentQuery ? '[data-drupal-link-query=\'' + queryString + '\']' : ':not([data-drupal-link-query])';
      var originalSelectors = ['[data-drupal-link-system-path="' + path.currentPath + '"]'];
      var selectors = void 0;

      if (path.isFront) {
        originalSelectors.push('[data-drupal-link-system-path="<front>"]');
      }

      selectors = [].concat(originalSelectors.map(function (selector) {
        return selector + ':not([hreflang])';
      }), originalSelectors.map(function (selector) {
        return selector + '[hreflang="' + path.currentLanguage + '"]';
      }));

      selectors = selectors.map(function (current) {
        return current + querySelector;
      });

      var activeLinks = context.querySelectorAll(selectors.join(','));
      var il = activeLinks.length;
      for (var i = 0; i < il; i++) {
        activeLinks[i].classList.add('is-active');
      }
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        var activeLinks = context.querySelectorAll('[data-drupal-link-system-path].is-active');
        var il = activeLinks.length;
        for (var i = 0; i < il; i++) {
          activeLinks[i].classList.remove('is-active');
        }
      }
    }
  };
})(Drupal, drupalSettings);;
