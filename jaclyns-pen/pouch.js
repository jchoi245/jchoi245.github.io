// This file runs on the pouch page only.

// ===== THE POUCH =====
// Hovering a thing in the pouch writes its name in the tooltip.
const tooltip = document.querySelector('#tooltip');
const tooltipStart = tooltip.innerHTML;

function addPouchName(selector, name) {
  const thing = document.querySelector(selector);

  thing.addEventListener('mouseenter', function () {
    tooltip.innerHTML = name + '<br>(not a pen)';
  });

  thing.addEventListener('mouseleave', function () {
    tooltip.innerHTML = tooltipStart;
  });
}

addPouchName('#pouch-clip', 'hair clip');
addPouchName('#pouch-cream', 'hand cream');
addPouchName('#pouch-mirror', 'pocket mirror');
addPouchName('#pouch-balm', 'lip balm');
addPouchName('#pouch-tissues', 'tissues');
