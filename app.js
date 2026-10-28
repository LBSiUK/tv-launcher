// Remote: Space is Home (show or hide the bar), Left and Right move along it,
// Enter picks the focused tile up so Left and Right carry it to a new place,
// and Enter again puts it down. T flips light and dark mode for the demo.

const root = document.documentElement;
const tv = document.getElementById("tv");
const bar = document.getElementById("homebar");
const announcer = document.getElementById("announce");
const row = bar.querySelector(".tiles");

// Bar geometry in screen pixels on the 1920-wide grid (mirrors styles.css).
const SCREEN = 1920;
const EDGE = 96;          // row's left inset, and the margin kept after the last tile
const TILE = 240;         // tile width
const GROW = 30;          // how far a focused tile spreads past its slot on each side
const GAP = 11;           // gap between the focused tile and its neighbours
const GAP_MOVING = 63;    // wider gap while a tile is being moved
const PEEK = 120;         // how much of the next tile stays in view

// The bar's order lives here; each tile is drawn at its index (its --slot).
const order = [...bar.querySelectorAll(".tile")];

let index = 0;
let open = true;
let moving = false;
let scroll = 0;

function name(tile) {
  return tile.getAttribute("aria-label");
}

function announce(text) {
  announcer.textContent = text;
}

function render() {
  order.forEach((tile, i) => {
    tile.style.setProperty("--slot", i);
    tile.classList.toggle("is-focused", i === index);
    tile.classList.toggle("is-before", i < index);
    tile.classList.toggle("is-after", i > index);
    tile.classList.toggle("is-moving", moving && i === index);
    tile.classList.toggle("at-start", i === 0);
    tile.classList.toggle("at-end", i === order.length - 1);
    tile.tabIndex = i === index ? 0 : -1;
  });
  bar.toggleAttribute("data-moving", moving);
  followFocus();
}

// Slide the row only as far as needed to keep the focused tile on screen,
// with half of the next tile showing so it's clear the row carries on.
function followFocus() {
  const gap = moving ? GAP_MOVING : GAP;
  const left = EDGE + index * TILE - GROW;
  const right = EDGE + (index + 1) * TILE + GROW;
  const needRight = index < order.length - 1 ? right + gap + PEEK : right + EDGE;
  const needLeft = index > 0 ? left - gap - PEEK : 0;
  if (needRight - scroll > SCREEN) scroll = needRight - SCREEN;
  if (needLeft < scroll) scroll = needLeft;
  scroll = Math.max(0, scroll);
  row.style.setProperty("--scroll", scroll);
}

function focusTile() {
  order[index].focus({ preventScroll: true });
}

function setOpen(next) {
  if (!next && moving) putDown();
  open = next;
  bar.dataset.state = open ? "open" : "closed";
  bar.inert = !open;
  if (open) {
    focusTile();
  } else {
    tv.focus({ preventScroll: true });
  }
}

function step(dir) {
  const next = index + dir;
  if (next < 0 || next >= order.length) return;
  if (moving) {
    [order[index], order[next]] = [order[next], order[index]];
  }
  index = next;
  render();
  focusTile();
}

function pickUp() {
  moving = true;
  render();
  announce(`Moving ${name(order[index])}. Left and right to move it, Enter to put it down.`);
}

function putDown() {
  moving = false;
  render();
  announce(`${name(order[index])} put down at position ${index + 1} of ${order.length}.`);
}

// Theme: follow the system until T is pressed, then stick with the choice.
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
let themeChosen = false;

function applyTheme(theme) {
  root.dataset.theme = theme;
}

applyTheme(darkQuery.matches ? "dark" : "light");
darkQuery.addEventListener("change", (e) => {
  if (!themeChosen) applyTheme(e.matches ? "dark" : "light");
});

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.code === "Space") {
    e.preventDefault();
    if (!e.repeat) setOpen(!open);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    if (open) step(e.key === "ArrowLeft" ? -1 : 1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (open && !e.repeat) (moving ? putDown : pickUp)();
  } else if (e.key === "t" || e.key === "T") {
    themeChosen = true;
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  }
});

// Keep the bar's focus in step when a tile is clicked instead of reached by
// keys. While a tile is being moved, focus stays on it.
order.forEach((tile) => {
  tile.addEventListener("focus", () => {
    const i = order.indexOf(tile);
    if (i === index) return;
    if (moving) {
      focusTile();
      return;
    }
    index = i;
    render();
  });
});

render();
setOpen(true);
