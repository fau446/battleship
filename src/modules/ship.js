const ship = (length) => {
  let timesHit = 0;
  let sunk = false;

  function isSunk() {
    if (length <= timesHit) {
      sunk = true;
    }
  }

  function hit() {
    timesHit += 1;
    isSunk();
  }

  return {
    get length() {
      return length;
    },
    get timesHit() {
      return timesHit;
    },
    get sunk() {
      return sunk;
    },
    hit,
  };
};

export default ship;
