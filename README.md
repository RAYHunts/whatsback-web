> [!CAUTION]
> WhatsApp Web and whatsapp-web.js are not officially supported by WhatsApp. Use this project at your own risk.

<p align="center">
  <img src="/public/images/logo-whatsback-banner.png" width="50%" />
</p>
<p align="center">
  <img src="https://github.com/darkterminal/whatsback-web/actions/workflows/release.yml/badge.svg" alt="Whatsback Web GitHub Action" />
  <img src="https://img.shields.io/github/tag/darkterminal/whatsback-web" alt="Whatsback Web Tag" />
  <img src="https://img.shields.io/github/v/release/darkterminal/whatsback-web" alt="Whatsback Web Release" />
  <img src="https://img.shields.io/github/v/tag/darkterminal/whatsback-web?label=package" alt="Whatsback Web Package Registry" />
  <img src="https://img.shields.io/github/downloads/darkterminal/whatsback-web/total" alt="Whatsback Web Downloads" />
</p>

Whatsback Provider is a simple WhatsApp provider that offers basic functionality such as predefined static commands, sending messages to contacts or groups, and listing all contacts. This project leverages the unofficial [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) package to interface with WhatsApp Web.

> [!NOTE]
> This is my old project and it's already updated and publicly available for everyone.

## Features

- **Predefined Static Commands:**  
  Quickly execute common commands without the need for manual input.

- **Send Message to Contact:**  
  Programmatically send message directly to individual contacts.

- **Send Message to Group:**  
  Programmatically send message to the groups.

- **List All Contacts:**  
  Retrieve and display a list of all contacts available on the WhatsApp account.

## Technologies

This project is built with:

- [**CORS**](https://github.com/expressjs/cors) – To enable cross‑origin resource sharing.
- [**EJS**](https://github.com/mde/ejs) – Templating engine.
- [**Express**](https://github.com/expressjs/express) – Web framework for Node.js.
- [**Express Rate Limit**](https://github.com/nfriedly/express-rate-limit) – Middleware to prevent request flooding.
- [**Helmet**](https://github.com/helmetjs/helmet) – Security middleware for setting HTTP headers.
- [**Node.js**](https://github.com/nodejs/node) – JavaScript runtime environment.
- [**Socket.io**](https://github.com/socketio/socket.io) – Real‑time communication between server and client.
- **SQLite** (via [better‑sqlite3](https://github.com/JoshuaWise/better-sqlite3)) – For local database operations.
- [**whatsapp‑web.js**](https://github.com/pedroslopez/whatsapp-web.js) – Unofficial WhatsApp Web API library.

---

### Other Dependencies

- [**dotenv**](https://github.com/motdotla/dotenv) – Loads environment variables from a `.env` file.
- [**express‑ejs‑layouts**](https://github.com/soarez/express-ejs-layouts) – Layout support for Express with EJS.
- [**hpp**](https://github.com/analog-nico/hpp) – HTTP Parameter Pollution protection middleware.
- [**nodemon**](https://github.com/remy/nodemon) – Monitors for changes in your Node.js application and restarts the server.
- [**patch‑package**](https://github.com/ds300/patch-package) – Keep a record of modifications to npm packages.
- [**qrcode**](https://github.com/soldair/node-qrcode) – Generate QR codes for your application.

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm (comes with Node.js)
- A valid WhatsApp account for testing

### Docker Installation

### Docker CLI

1. **Pull the image:**

   ```bash
   docker pull ghcr.io/darkterminal/whatsback-web:<version-tag>
   ```

2. **Run a container:**

   ```bash
   docker run -d \
     -p 8169:5001 \ # Web GUI
     --env NODE_ENV=production \
     --env APP_PORT=5001 \ # APP AND API
     ghcr.io/darkterminal/whatsback-web:<version-tag>
   ```

### docker-compose.yml

```yaml
services:
  app:
    image: ghcr.io/darkterminal/whatsback-web:<version-tag>
    ports:
      - "${UI_PORT:-8169}:5001"
    environment:
      NODE_ENV: production
      APP_PORT: ${APP_PORT:-5001}
    networks:
      - app_net

networks:
  app_net:
    driver: bridge
```

Replace the `<version-tag>` placeholder with the latest release version from [Package Registry](https://github.com/darkterminal/whatsback-web/pkgs/container/whatsback-web)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/whatsback-provider.git
   cd whatsback-provider
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Configure Environment Variables:**

   Create a `.env` file in the project root with necessary configuration variables. For example:

   ```env
    APP_PORT=5001 # default app port
    UI_PORT=8169 # default ui port

    API_CORS_ORIGIN="https://example.com,http://another-example.com"
   ```
   
### Running the Project

For development, start the server with:

```bash
npm run dev
```

For production, start the server with:

```bash
NODE_ENV=production node server.js
```

Your server should start on the port defined in the `.env` file (default is 5001).

## Available REST API

1. **Sending Message to Contact**

  ```
  POST http://<YOUR_URL>:<APP_PORT>/api/send-message
  Content-Type: application/json

  {
      "number": "08123456789",
      "message": "Hi, I am using Whatsback Web!"
  }
  ```

2. **Sending Message to Group**

  ```
  POST http://<YOUR_URL>:<APP_PORT>/api/send-group-message
  Content-Type: application/json

  {
      "groupId": "123456789@g.us",
      "message": "Hi, I am using Whatsback Web!"
  }
  ```

## Security Considerations

- This project uses middleware like Helmet, express-rate-limit, and hpp to help protect against common web vulnerabilities.
- Be aware that using an unofficial API (whatsapp-web.js) can carry risks with regard to WhatsApp's terms of service.

## Contributing

Contributions are welcome! Please open issues or pull requests to improve the project.

## Donate or Sponsoring

<a href="https://github.com/sponsors/darkterminal">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://i.imgur.com/IcHNW1L.png">
    <source media="(prefers-color-scheme: light)" srcset="https://i.imgur.com/Yzbwovb.png">
    <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://i.imgur.com/IcHNW1L.png">
  </picture>
</a>

## License

[MIT License](LICENSE)
