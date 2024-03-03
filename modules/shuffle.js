/**
* Shuffles all elements in an array.
* @param {Array} array an array of items
*/
function ShuffleArray(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

module.exports = {
    ShuffleArray
};
