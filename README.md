# Portfolio

_The official portfolio website of Gaston Chenet, a UI/UX/Software developer._

## Description

Made with [HTML](https://en.wikipedia.org/wiki/HTML), [Sass](https://sass-lang.com/), [JavaScript](https://en.wikipedia.org/wiki/JavaScript).

Using the modules [Three.js](https://threejs.org/) and [gsap](https://greensock.com/gsap/) to make the webite look cooler and smoother.

## Util commands

_A list of util commands to make the website run properly._

### Install corrsponding modules

```bash
npm install --g sass uglify-js
```

### Compile sass

```bash
sass style/main.scss:style/main.min.css --style compressed --watch
```

### Minify js

```bash
uglifyjs script/main.js --compress --mangle --output script/main.min.js
```
