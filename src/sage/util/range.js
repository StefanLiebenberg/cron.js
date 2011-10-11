goog.provide('sage.util.Range');



/**
 * @constructor
 * @param {number} from the start point.
 * @param {number} to the end point.
 */
sage.util.Range = function(from, to) {
  this.from = from;
  this.to = to;
  this.length = to - from;
};


/**
 * @param {number} index the position of required value.
 * @return {number} returns the number at index.
 */
sage.util.Range.prototype.valueAt = function(index) {
  if (index < 0 || index >= this.length) {
    return undefined;
  }
  return this.from + index;
};


/**
 * @return {Array} returns an array of all values.
 */
sage.util.Range.prototype.getValues = function() {
  var length, result, from;
  length = this.length;
  from = this.from;
  result = new Array(length);
  while (length--) {
    result[length] = from + length;
  }
  return result;
};
