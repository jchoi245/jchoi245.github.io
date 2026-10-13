const circle = document.querySelector('#circle');
const triangle = document.querySelector('#triangle');
const square = document.querySelector('#square');

let currentColor = 'white';

circle.addEventListener('click', function () {
  currentColor = currentColor === 'red' ? 'white' : 'red';
  document.body.style.backgroundColor = currentColor;
});

triangle.addEventListener('click', function () {
  currentColor = currentColor === 'yellow' ? 'white' : 'yellow';
  document.body.style.backgroundColor = currentColor;
});

square.addEventListener('click', function () {
  currentColor = currentColor === 'green' ? 'white' : 'green';
  document.body.style.backgroundColor = currentColor;
});
