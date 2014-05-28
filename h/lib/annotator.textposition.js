// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-2542d55
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2014-05-28 21:22:33Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var TextPositionAnchor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TextPositionAnchor = (function(_super) {
    __extends(TextPositionAnchor, _super);

    TextPositionAnchor.Annotator = Annotator;

    function TextPositionAnchor(annotator, annotation, target, start, end, startPage, endPage, quote, diffHTML, diffCaseOnly) {
      this.start = start;
      this.end = end;
      TextPositionAnchor.__super__.constructor.call(this, annotator, annotation, target, startPage, endPage, quote, diffHTML, diffCaseOnly);
      if (this.start == null) {
        throw new Error("start is required!");
      }
      if (this.end == null) {
        throw new Error("end is required!");
      }
      this.Annotator = TextPositionAnchor.Annotator;
    }

    TextPositionAnchor.prototype._createHighlight = function(page) {
      var browserRange, mappings, normedRange, realRange;
      mappings = this.annotator.domMapper.getMappingsForCharRange(this.start, this.end, [page]);
      realRange = mappings.sections[page].realRange;
      browserRange = new this.Annotator.Range.BrowserRange(realRange);
      normedRange = browserRange.normalize(this.annotator.wrapper[0]);
      return new this.Annotator.TextHighlight(this, page, normedRange);
    };

    return TextPositionAnchor;

  })(Annotator.Anchor);

  Annotator.Plugin.TextPosition = (function(_super) {
    __extends(TextPosition, _super);

    function TextPosition() {
      this.createFromPositionSelector = __bind(this.createFromPositionSelector, this);
      this._getTextPositionSelector = __bind(this._getTextPositionSelector, this);
      _ref = TextPosition.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextPosition.prototype.pluginInit = function() {
      this.Annotator = Annotator;
      this.annotator.selectorCreators.push({
        name: "TextPositionSelector",
        describe: this._getTextPositionSelector
      });
      this.annotator.anchoringStrategies.push({
        name: "position",
        code: this.createFromPositionSelector
      });
      return this.Annotator.TextPositionAnchor = TextPositionAnchor;
    };

    TextPosition.prototype._getTextPositionSelector = function(selection) {
      var endOffset, startOffset;
      if (selection.type !== "text range") {
        return [];
      }
      if (this.annotator.domMapper.getStartPosForNode == null) {
        return [];
      }
      startOffset = this.annotator.domMapper.getStartPosForNode(selection.range.start);
      endOffset = this.annotator.domMapper.getEndPosForNode(selection.range.end);
      if ((startOffset != null) && (endOffset != null)) {
        return [
          {
            type: "TextPositionSelector",
            start: startOffset,
            end: endOffset
          }
        ];
      } else {
        if (startOffset == null) {
          console.log("Warning: can't generate TextPosition selector, because", selection.range.start, "does not have a valid start position.");
        }
        if (endOffset == null) {
          console.log("Warning: can't generate TextPosition selector, because", selection.range.end, "does not have a valid end position.");
        }
        return [];
      }
    };

    TextPosition.prototype.createFromPositionSelector = function(annotation, target) {
      var content, currentQuote, savedQuote, selector, _base;
      selector = this.annotator.findSelector(target.selector, "TextPositionSelector");
      if (selector == null) {
        return;
      }
      if (selector.start == null) {
        console.log("Warning: 'start' field is missing from TextPositionSelector. Skipping.");
        return null;
      }
      if (selector.end == null) {
        console.log("Warning: 'end' field is missing from TextPositionSelector. Skipping.");
        return null;
      }
      content = this.annotator.domMapper.getCorpus().slice(selector.start, +(selector.end - 1) + 1 || 9e9).trim();
      currentQuote = this.annotator.normalizeString(content);
      savedQuote = typeof (_base = this.annotator).getQuoteForTarget === "function" ? _base.getQuoteForTarget(target) : void 0;
      if ((savedQuote != null) && currentQuote !== savedQuote) {
        return null;
      }
      return new TextPositionAnchor(this.annotator, annotation, target, selector.start, selector.end, this.annotator.domMapper.getPageIndexForPos(selector.start), this.annotator.domMapper.getPageIndexForPos(selector.end), currentQuote);
    };

    return TextPosition;

  })(Annotator.Plugin);

}).call(this);

//
//# sourceMappingURL=annotator.textposition.map