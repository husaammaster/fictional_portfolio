"use strict";

export const COLORS = [
  "#4F46E5", // indigo
  "#06B6D4", // cyan/teal
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#3B82F6", // blue
  "#14B8A6", // turquoise
  "#84CC16", // lime
  "#EC4899", // pink
];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randColor() {
  return COLORS[getRndInteger(0, COLORS.length)];
}

export function shuffle(arr) {
  let arrCpy = arr.slice(); // copy by value instead of by reference
  let newArr = [];

  while (arrCpy.length != 0) {
    const ind = getRndInteger(0, arrCpy.length - 1);
    newArr.push(arrCpy[ind]);
    arrCpy.splice(ind, 1);
  }
  return newArr;
}

console.log(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]));
