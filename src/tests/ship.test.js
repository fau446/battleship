import ship from "../modules/ship";

const lengthTwoShip = ship(2);
const shipHitOnce = ship(2);
shipHitOnce.hit();
const sunkShip = ship(1);
sunkShip.hit();

test("Length Test", () => {
  expect(lengthTwoShip.length).toEqual(2);
});

test("0 Hit test", () => {
  expect(lengthTwoShip.timesHit).toEqual(0);
});

test("0 Hit to 1 Hit test", () => {
  expect(shipHitOnce.timesHit).toEqual(1);
});

test("Ship hit once not sunk", () => {
  expect(shipHitOnce.sunk).toEqual(false);
});

test("Ship is sunk", () => {
  expect(sunkShip.sunk).toEqual(true);
});
