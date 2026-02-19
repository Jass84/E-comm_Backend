# ClassMora — Mock Pantaloons-like Frontend

This is a complete static frontend project (no backend) that mimics the UI/UX of an e-commerce site similar to Pantaloons.

Folder structure and files are provided. The site uses HTML, CSS and vanilla JavaScript. Dummy data and SVG placeholders are included in `assets/images/`.

How to run locally

1. Open the project folder in your file manager or VS Code.
2. Serve the folder with any static server. Examples:

   - Using Python 3:

     ```bash
     python3 -m http.server 8000
     # then open http://localhost:8000 in your browser
     ```

   - Using VS Code Live Server extension: open `index.html` and click "Go Live".

Notes and dependencies

- No build tools required. Only a modern browser is needed.
- Uses Google Fonts (Montserrat) via CDN.
- All interactions (carousel, mega menu, filters, add-to-cart) are implemented in `assets/js/main.js` using localStorage for cart persistence.

Files of interest

- index.html — homepage with hero carousel and featured products
- category.html — category listing with filter sidebar
- product.html — product detail page with gallery, size selector and tabs
- cart.html — cart page that reads from localStorage
- assets/css/style.css — main stylesheet
- assets/js/main.js — all UI interactions

If you want further polish (real images, product JSON, advanced filtering), tell me which area to enhance next.
# Classmora Frontend

This project was created with React.

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the dependencies.

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.
