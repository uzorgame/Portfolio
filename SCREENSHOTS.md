# Screenshots — the standard

Every product on the site shows its screenshots the same way. This is that way, written down
so the next project does not invent a second one.

## Where the files live

```
Public/<project>/shots/<name>.webp      the small file
Public/<project>/shots/<name>@2x.webp   the large file
```

One folder per project, always under `Public/<project>/shots/`. Nothing else goes in it.
`<name>` says what the picture shows — `portfolio`, `transactions`, `london` — never a GUID
and never `screenshot-1`. The name is read by whoever comes next; the order is decided in
`shotSets`, not by sorting filenames.

## Two sizes, always

A screenshot is served at two widths so a phone does not download a picture sized for a
desktop. Which two depends on the shape:

| shape  | what it is                | small | large  | rendered at |
|--------|---------------------------|-------|--------|-------------|
| `tall` | a poster, a phone screen  | 640   | 1400   | ~340px      |
| `wide` | a desktop application     | 760   | 1520   | ~560px      |

WebP, quality 82–84, `lanczos3` downscaling. Generated with `sharp`; the Poster project has
it as a dependency, so the conversion is run from there.

`sizes` must state the width the picture is **actually rendered at**, not an approximation.
Declaring `90vw` where the real figure is `calc(92vw - 56px)` pushed the browser just past
the small file's reach and it fetched the large one — half a megabyte per picture, on the
connection least able to afford it.

## Declaring a set

In `js/main.js`:

```js
const shotSets = {
  poster: {
    title: 'Poster',                    // the dialog's heading
    dir: 'Public/poster/shots',
    shape: 'tall',                      // decides the grid and the two widths
    shots: [
      { file: 'london', alt: 'A minimalist map poster of London made with Poster' },
    ]
  }
};
```

And on the project card, in the links row, between the primary link and Privacy:

```html
<button data-shots="poster" data-i18n="common.screenshots">Screenshots</button>
```

## What the dialog does

- **One dialog for everything.** Screenshots reuse the same `#modal` as the privacy policies.
  Escape, the overlay click, the scroll lock and the Lenis pause are already wired to it; a
  second dialog would have to reimplement all four and then keep them in step.
- **Grid.** Three across for `tall`, two across for `wide`, one across below 900px.
- **Click a picture** and it fills the dialog, alone. The movement is a FLIP animation — the
  new layout is applied instantly, the difference from the old position is measured, and the
  element is animated from that difference back to nothing.
- **Getting back:** the Back button in the head, a click anywhere outside the picture, or
  Escape. Escape steps back one level before it closes the dialog. The overlay closes
  outright, because it is outside the dialog and means "leave", not "go back".

## Two rules that were learned the hard way

**No border on a screenshot.** A hairline in `--border` is a light line in the dark theme,
and drawn around a poster whose own paper is already light it reads as a stray white stripe.
Every picture here carries its own frame — a printed margin, or a window's chrome.

**No caption under a screenshot.** A poster has its city typeset across the sheet and an
application window has its own title bar; a label underneath names the same thing twice. The
`alt` text carries it for anyone who cannot see the picture, and it is the only place that
description belongs.

## The page must not move

Opening the dialog sets `body { overflow: hidden }`, which removes the scrollbar — and the
page underneath gets those pixels back and slides sideways. `html { scrollbar-gutter: stable }`
reserves the channel permanently so nothing shifts. If a new dialog is ever added, this is
already handled globally; do not compensate with padding per dialog.
