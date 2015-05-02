goog.provide('slieb.util.array');


/**
 * @param {Array} array the array to remove duplicates from.
 * @return {Array} returns the modified array;.
 */
slieb.util.array.uniq = function(array) {
  var len = array.length, value, at;
  for (var i = 0; i < len; i += 1) {
    value = array[i];
    at = i + 1;
    while ((at = array.indexOf(value, at)) !== -1) {
      array.splice(at, 1); len--;
    }
  }
  return array;
};
