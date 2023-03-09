
function generate_combos() {
  var combos = [];
  for (i=1234; i<10000; i++) {
    var s = String(i)
    if (s.includes('0')) continue; // remove zeroes

    // remove dup digits
    var sorted = s.split('').sort();
    if (sorted[0] === sorted[1]
    || sorted[1] === sorted[2]
    || sorted[2] === sorted[3]) {
      continue; // discard duplicate digit
    }
    combos.push(s);
  }
  return combos;
}

function array_random(arr) {
  return arr[Math.floor(Math.random()*(arr.length))]
}

function get_result(secret, combo) {
  var res = [0, 0]; // [B, C]
  for (var i=0; i<4; i++) {
    for (var j=0; j<4; j++) {
      if (secret[i] === combo[j]) {
        res[ +(i===j)^1 ] ++;
      }
    }
  }
  return res;
}

// returns number - matching symbols in combo2 from combo1 which are on diffrerent positions
function match_cows_on_different_pos(combo1, combo2) {
  const result = combo2
    .split('')
    .map( (c, i, a) =>  (i !== combo1.indexOf(c) && combo1.includes(c)) ? c : null)
  return result.reduce( (a, c) => a += +!!c, 0);
}

// return number - matching symbols in combo2 in same position as combo1
function match_bulls(combo1, combo2) {
  const result = combo2
    .split('')
    .map( (c, i, a) =>  (i === combo1.indexOf(c)) ? c : null)
  return result.reduce( (a, c) => a += +!!c, 0);
}

// check if combo is possible (will satisfy given result)
function possible(secret, result, combo, newcombo) {
  const result2 = get_result(secret, newcombo)

  // one or more Bulls
  if (0 < result[0]) {
    const test =  match_bulls(newcombo, combo);
    if (test !== result[0]) return false;
  }

  // one or more Cows - combo must match Cows number of digits but on different position
  if (0 < result[1]) {
    const test =  match_cows_on_different_pos(newcombo, combo);
    return match_cows_on_different_pos(newcombo, combo) === result[1];
  }

  return result2[0] + result2[1] >= result[0] + result[1];
}

const solved = (result) => result[0] === 4;

const start = Date.now();
var combos = generate_combos()
console.log("generated %s combos in %sms", combos.length, Date.now() - start);

const secret = array_random(combos); // value to guess

for (var i=1; i<1000; i++) {
  var combo = array_random(combos);
  var result = get_result(secret, combo);
  const done = solved(result);
  console.log("[%s combos] %s <-> %s, %s", combos.length, secret, combo, result);
  if (done) {
    const elapsed = Date.now() - start;
    return console.log("solved in %s steps (%sms): %s %s ", i, elapsed, secret, combo);
  }
  combos = combos.filter(c => possible(secret, result, combo, c));
}

console.log("could not solve in %s steps", i);
