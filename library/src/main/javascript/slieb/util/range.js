goog.provide('slieb.util.Range');



/**
 * @constructor
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
slieb.util.Range = function(from, to) {

  if (from > to) {
    throw new Error('slieb.util.Range: from is larger than to');
  }

  /** @type {number} */
  this.from = from;
  /** @type {number} */
  this.to = to;
  /** @type {number} */
  this.length = 1 + to - from;
};


/**
 * @param {number} index the position of required value.
 * @return {number|undefined} returns the number at index.
 */
slieb.util.Range.prototype.valueAt = function(index) {
  if (index < 0 || index >= this.length) {
    return undefined;
  }
  return this.from + index;
};


/**
 * @param {number} value a value that might be within range.
 * @return {number} returns the index of value.
 */
slieb.util.Range.prototype.indexOf = function(value) {
  var index = -1;

  if (value >= this.from && value <= this.to) {
    index = value - this.from;
  }

  return index;
};


/**
 * @param {?number} from the start point.
 * @param {?number} to the end point.
 * @return {!Array.<number>} returns an array of all values.
 */
slieb.util.Range.prototype.getValues = function(from, to) {
  if (typeof from !== 'number') {
    from = /** @type {number} */ (this.from);
  }

  if (typeof to !== 'number') {
    to = /** @type {number} */ (this.to);
  }
  return this.getValuesInternal(from, to);
};


/**
 * @param {number} from the start point.
 * @param {number} to the end point.
 * @return {!Array.<number>} returns an array of all values.
 */
slieb.util.Range.prototype.getValuesInternal = function(from, to) {
  var length, result;

  if (from > to || from < this.from || to > this.to) {
    var str = 'slieb.util.Range: ';
    str += 'values are out of range';
    throw new Error(str);
  }

  length = /** @type {number} */ (1 + to - from);
  result = new Array(length);
  if (length > 0) while (length--) {
    result[length] = from + length;
  }
  return result;
};


/**
 * @return {string} returns the string representation of this range;.
 */
slieb.util.Range.prototype.toString = function() {
  return 'Range[' + this.from + '..' + this.to + ']';
};
