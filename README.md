# Gator - Foz's Dumb Blog Aggregator

A simple command-line blog and RSS feed aggregator built with TypeScript and Node.js.
Users can register, follow feeds, and browse recent articles directly from the terminal. This project was made as part of the boot.dev typescript path.

### Features

- User registration and login system

- RSS feed fetching and parsing

- Follow/unfollow feeds per user

- Browse latest articles

- Persistent database storage

- Simple CLI-style command interface

### Commands Overview

Below are all available commands and their basic usage.

#### Command	Description	Example
| Command | Description | Example |
|----------|--------------|----------|
| **login** | Logs in as an existing user | `npm run start login` |
| **register** | Registers a new user | `npm run start register` |
| **reset** | Clears all data from the database | `npm run start reset` |
| **users** | Displays all registered users | `npm run start users` |
| **agg** | Fetches and aggregates RSS feeds based on a timer. Takes a time as a number followed by a h/m/s/ms | `npm run start agg 2h` |
| **addfeed** | Adds a new RSS feed with a nickname and URL (requires login) | `npm run start addfeed tech https://example.com/rss` |
| **feeds** | Lists all available feeds with nicknames | `npm run start feeds` |
| **follow** | Follows a feed by URL (requires login) | `npm run start follow https://example.com/rss` |
| **following** | Shows all feeds the current user follows (requires login) | `npm run start following` |
| **unfollow** | Unfollows a feed (requires login) | `npm run start unfollow https://example.com/rss` |
| **browse** | Displays the latest X feed entries (defaults to 2) (requires login) | `npm run start browse 5` |

### Tech Stack

- TypeScript
- Node.js
- Drizzle ORM
- PostgreSQL
- fast-xml-parser

