const N = 10000000;
const I = 100;

let A;
let i, j;

if (process.argv[2] === 'push') {
  console.time('push');
  for (i = 0; i < I; i++) {
    A = [];
    for (j = 0; j < N; j++) A.push(Math.random());
  }
  console.timeEnd('push');
}

if (process.argv[2] === 'counter') {
  console.time('counter');
  for (i = 0; i < I; i++) {
    A = [];
    for (j = 0; j < N; j++) A[j] = Math.random();
  }
  console.timeEnd('counter');
}

if (process.argv[2] === 'presized') {
  console.time('presized counter');
  for (i = 0; i < I; i++) {
    A = new Array(N);
    for (j = 0; j < N; j++) A[j] = Math.random();
  }
  console.timeEnd('presized counter');
}
