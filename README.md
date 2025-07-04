# 3D Solar System Simulation

This is a single-page web application that displays a 3D simulation of our solar system, built with Three.js.

## Objective

The project demonstrates skills in 3D rendering, scene creation, object animation, and user interaction using pure JavaScript, HTML, and CSS.

## Features

-   **3D Scene**: A full 3D scene containing the Sun and all 8 planets.
-   **Realistic Orbits**: Planets orbit the sun at default speeds. Orbital paths are visualized.
-   **Dynamic Speed Control**: A UI panel allows real-time adjustment of each planet's orbital speed via sliders.
-   **Mobile Responsive**: The layout and canvas adapt to different screen sizes.

### Bonus Features Implemented

-   **Pause/Resume**: A button to pause and resume the entire animation.
-   **Background Stars**: A procedurally generated starfield for a more immersive background.
-   **Planet Tooltips**: Hovering over a planet displays its name.
-   **Dark/Light Mode**: A UI toggle to switch between a light and dark theme.
-   **Camera Controls**: The scene can be panned, zoomed, and rotated using the mouse (powered by `OrbitControls`).

## Tech Stack

-   **HTML5**
-   **CSS3**
-   **JavaScript (ES6 Modules)**
-   **Three.js** (imported via CDN)

## How to Run

This project uses modern JavaScript modules and can be run easily with a local web server.

### Prerequisites

You need a local web server to handle ES6 module imports correctly. The `Live Server` extension for Visual Studio Code is a great and simple option.

### Steps

1.  **Clone or Download the Repository**
    -   Download the `.zip` file and extract it.

2.  **Open the Project Folder**
    -   Open the extracted folder (`Your Name`) in a code editor like VS Code.

3.  **Start a Local Server**
    -   **Using VS Code's `Live Server` extension:**
        -   Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) from the marketplace.
        -   Right-click on `index.html` in the file explorer.
        -   Select "Open with Live Server".
    -   **Using Python's built-in server (alternative):**
        -   Open a terminal or command prompt in the project folder.
        -   Run the command: `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
        -   Open your browser and navigate to `http://localhost:8000`.

4.  **View the Application**
    -   The solar system simulation should now be running in your browser.