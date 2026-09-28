# Wanderlog

A simple travel journal with a responsive editorial-style interface and a complete client-side CRUD flow using browser `localStorage`.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- Google Fonts: Fraunces, Work Sans and Space Mono

## Week 2 Features

### Trip data model
Every trip follows the same structure:

```js
{
  id: "unique-id",
  title: "Trip title",
  destination: "Destination",
  date: "YYYY-MM-DD",
  notes: "Trip notes",
  coverImageUrl: ""
}
```

`coverImageUrl` is included in the model for consistency and future image support; the current brief does not require a cover-image field in the form.

### Create (C)
- Add Trip form with title, destination, date and notes.
- Title, destination and date are required.
- New trips are saved to `localStorage`.
- Form is cleared after a successful save.

### Read (R)
- Saved trips are read from `localStorage` on page load.
- The destinations grid is rendered dynamically with JavaScript.
- There are no hardcoded destination cards.

### Update (U)
- Each trip has an **Edit** action.
- Edit pre-fills the form with the selected trip's existing data.
- Saving updates the correct entry while preserving its ID.

### Delete (D)
- Each trip has a **Delete** action.
- A browser confirmation dialog is shown before deletion.
- The selected trip is removed from `localStorage` and the UI.

### Empty state
When no trips exist, Wanderlog shows a friendly empty-state message with a button to add the first trip.

## Storage

Trips are stored under the localStorage key:

```text
wanderlogTrips
```

Data stays in the current browser on the current device. No backend or database is required.

## How to Run

No installation is required.

1. Open `index.html` in a browser.
2. Or use VS Code with the Live Server extension.
3. Add, edit and delete trips from the page.

## Project Structure

```text
wanderlog/
├── index.html
├── style.css
├── script.js
└── README.md
```
