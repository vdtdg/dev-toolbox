# Yet another dev toolbox

Except this one is free, without ads, no cookies, fully client side and lightweight !

## Introduction

Welcome to _Dev Toolbox_, a simple, efficient, and respectful of your privacy toolbox for developers.

It's fully client-side, meaning all processing is done in your browser without the need for server-side interaction.

Bookmark it, keep a tab open while you work and have access to its tool. No need to install countless plugins on your
IDEs.

You're working on a colleague's computer and need a tool a base64 conversion tool? No need to install plugins and mess
with other people's environments, just [open the toolbox on their browser](https://valerian.dtdg.fr/dev-toolbox) and use
the toolbox directly.

## Features

- **Free**: Totally free, forever.
- **Lightweight**: Optimized for speed and efficiency.
- **No Ads or cookies**: Enjoy an uninterrupted experience without tracking.
- **Mobile friendly**: The responsive interface accommodate both mobile and desktop users.
- **Fully client-side**: Your data stay on your machine, and is processed locally, ensuring privacy and security.
- **Versatile tools**: Includes a variety of tools useful for developers regardless of different languages and
  frameworks.

## Usage

Visit [valerian.dtdg.fr/dev-toolbox](https://valerian.dtdg.fr/dev-toolbox) to use the toolbox.

## Contributing

To get started with _Dev Toolbox_, simply clone the repository:

```bash
git clone https://github.com/vdtdg/dev-toolbox.git
cd dev-toolbox
```

You need Node.js and npm. At least version 20.

Then, at the root level of the project, execute `npm install` to install dependencies.

Finally, to run locally the toolbox, execute `npm start`.

Go to http://localhost:3000/ to access your local version of the toolbox.

Run with docker:
```bash
docker-compose build
docker-compose up -d
```
Go to http://localhost/dev-toolbox/ to access your docker version of the toolbox.

### How to contribute

Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a pull request

### Next features to be developed ordered by priority

- Develop new tools:
  - (in progress) File diff
  - (in progress) image resizer and extension changer. 
  - (in progress) jwt helper (https://jwt.io/)
  - (in progress) Simple color picker (click on a spectrum, get the color values in different formats)
  - (in progress) Color shades generator
  - (in progress) Emoji picker
  - (in progress) Lorem Ipsum generator
  - SQL auto-Formatter: drop unindented SQL query, get it formatted properly
  - JSON prettier / reducer (Something like https://plantuml.com/json ?)
  - [JSON to Pydantic](https://jsontopydantic.com/)
  - Postman-like helper for basic http queries
  - Regexp display / explainer
  - SQL Polyglot tool.
  - SQL explainer ?
  - huffman encoder ?
  - a basic whiteboard tool ?
  - Various guide list
    - [API security Checklist](https://github.com/shieldfy/API-Security-Checklist/blob/master/README.md?source=post_page-----78fd25dac4df--------------------------------)
    - [CSS selector reference](https://www.w3schools.com/cssref/css_selectors.php)
- SEO optimization: how to make sure this toolbox ranks in various Search engines?
- OpenGraph (og) tags to do.

## License

Distributed under the GPU GPLv3 License. See LICENSE for more information.

## Contact

Valérian de Thézan de Gaussan - [valerian@dtdg.fr](mailto:valerian@dtdg.fr)
