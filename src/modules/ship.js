const ship = (length, shipName = null) => {
  let timesHit = 0;
  let sunk = false;
  const name = shipName;

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
    get name() {
      return name;
    },
    hit,
  };
};

export default ship;
