# Event Talks Website

This project is a simple one-day event website with a schedule of technical talks.

## Running the development server

To run the development server, you need to have Node.js installed.

1.  Clone the repository.
2.  Open a terminal in the project's root directory.
3.  Run `npm install` to install the dependencies (though there are no external dependencies for this simple server).
4.  Run `node server.js`.
5.  Open your browser and navigate to `http://localhost:3000`.

## Building the single-page HTML

To build the single-page HTML file, run the following command in the project's root directory:

```bash
node build.js
```

This will generate a `dist/index.html` file that you can open directly in your browser.

## Serving the single-page HTML

To serve the generated `dist/index.html` file, you can use a simple Python server.

1.  Make sure you are in the project's root directory.
2.  Run the following command:

```bash
python3 -m http.server -d dist 8000
```

3.  Open your browser and navigate to `http://localhost:8000`.
