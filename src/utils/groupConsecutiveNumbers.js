export function groupConsecutiveNumbers(arr) {
  let ranges = [];
  let start = arr[0];
  let end = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] === 1) {
      // Continue the current range
      end = arr[i];
    } else {
      // Add the completed range to the result
      ranges.push(start !== end ? `${start}-${end}` : `${start}`);

      // Start a new range
      start = arr[i];
      end = arr[i];
    }
  }

  // Add the last range to the result
  ranges.push(start !== end ? `${start}-${end}` : `${start}`);

  return ranges.join(",");
}
