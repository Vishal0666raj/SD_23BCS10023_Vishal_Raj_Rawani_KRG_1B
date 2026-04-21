let sequence = 0;
let lastTimestamp = 0;

const workerId = 1;

function currentTime() {
  return Date.now();
}

function generateId() {
  let timestamp = currentTime();

  if (timestamp === lastTimestamp) {
    sequence++;
  } else {
    sequence = 0;
    lastTimestamp = timestamp;
  }

  const id =
    BigInt(timestamp) << 22n |
    BigInt(workerId) << 12n |
    BigInt(sequence);

  return id.toString();
}

module.exports = generateId;