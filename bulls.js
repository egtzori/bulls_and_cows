
function generate_combos() {
  var combos = [];
  for (i=0; i<10000; i++) {
    if (i<=1000) continue; // discard <1000
    var s = ('000'+i).slice(-4);

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
const match_cows_on_different_pos = (combo1, combo2) => {
  const result = combo2
    .split('')
    .map( (c, i, a) =>  (i !== combo1.indexOf(c) && combo1.includes(c)) ? c : null)
  return result.reduce( (a, c) => a += +!!c, 0);
}

// check if combo is possible (will satisfy given result)
const possible = (secret, result, combo, newcombo) => {
  const result2 = get_result(secret, newcombo)

  // one or more Cows - combo must match Cows number of digits but on different position
  if (0 < result[1]) {
    const test =  match_cows_on_different_pos(newcombo, combo);
    // console.log("!!!", result, combo, newcombo, test);
    return match_cows_on_different_pos(newcombo, combo) === result[1];
  }

  return result2[0] + result2[1] >= result[0] + result[1];
}

const solved = (result) => result[0] === 4;


console.time("generate_combos");
var combos = generate_combos()
console.timeEnd("generate_combos");
console.log("%s combos", combos.length);

const secret = array_random(combos);

for (var i=1; i<1000; i++) {
  var combo = array_random(combos);
  var result = get_result(secret, combo);
  const done = solved(result);
  console.log("[%s combos] %s <-> %s, %s", combos.length, secret, combo, result);
  if (done) {
    return console.log("solved in %s steps: ", i, secret, combo);
  }
  combos = combos.filter(c => possible(secret, result, combo, c));
}

console.log("could not solve in %s steps", i);

// check [0, 4] responses -- can filter out more
