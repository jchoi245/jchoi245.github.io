// This file runs on the planner page only.
const plannerBig = document.querySelector('#planner-big');
const todoPage = document.querySelector('#todo-page');
const leftPage = document.querySelector('#left-page');
const plannerHint = document.querySelector('#planner-hint');

// ===== THE PLANNER =====
let plannerOpen = false;

function openPlanner() {
  plannerBig.classList.add('open');
  todoPage.classList.add('showing');
  leftPage.classList.add('showing');
  plannerHint.classList.add('dark');
  plannerHint.textContent = 'click to close';
  plannerOpen = true;
}

function closePlanner() {
  plannerBig.classList.remove('open');
  todoPage.classList.remove('showing');
  leftPage.classList.remove('showing');
  plannerHint.classList.remove('dark');
  plannerHint.textContent = 'click to open';
  plannerOpen = false;
}

// Click the closed notebook to open it.
plannerBig.addEventListener('click', function () {
  if (plannerOpen === false) {
    openPlanner();
  }
});

// Click the left page to close it again.
leftPage.addEventListener('click', function () {
  closePlanner();
});

// Click the right page to close it too, except on a to-do item (that ticks the box).
todoPage.addEventListener('click', function (event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') {
    return;
  }
  closePlanner();
});

// The "click to open / click to close" words work as a button too.
plannerHint.addEventListener('click', function () {
  if (plannerOpen === false) {
    openPlanner();
  } else {
    closePlanner();
  }
});
