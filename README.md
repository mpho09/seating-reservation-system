# seating-reservation-system

# Seat Check

A simple seat reservation system. Users pick an available seat, hold it with their email (getting a hold code) and later confirm it. Built with Node.js + Express and a vanilla JavaScript frontend.

## Features

- View a live map of 20 seats with their status (`available`, `held`, `confirmed`)
- Hold an available seat by email and receive a unique 6-character hold code
- Confirm a held seat using the email + hold code
- Waitlist button that appears when no seats are available
- Seat map auto-refreshes every few seconds

## Requirements

- [Node.js](https://nodejs.org/) (v16 or newer)

## Setup

```bash
# install dependencies
npm install express

# start the server
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Project structure

```
.
├── server.js        # Express backend (routes + seat logic)
└── public/          # frontend served as static files
    ├── index.html
    └── script.js
```

## Notes

- Seat data is stored **in memory**, so restarting the server clears all holds and confirmations.
- Holds do not expire — a held seat stays held until it's confirmed (or the server restarts).

To make data persist or add hold expiry, swap the in-memory maps for a file or database and add a timeout when holding a seat.
