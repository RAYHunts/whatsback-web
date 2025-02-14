# Whatsback Provider

Whatsback Provider is a simple WhatsApp provider that offers basic functionality such as predefined static commands, sending messages to contacts or groups, and listing all contacts. This project leverages the unofficial [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) package to interface with WhatsApp Web.

> [!CAUTION]
> WhatsApp Web and whatsapp-web.js are not officially supported by WhatsApp. Use this project at your own risk.

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

Below is an alphabetically sorted list with links to each technology’s GitHub repository:

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

Your server should start on the port defined in the `.env` file (default is 5001).

## Security Considerations

- This project uses middleware like Helmet, express-rate-limit, and hpp to help protect against common web vulnerabilities.
- Be aware that using an unofficial API (whatsapp-web.js) can carry risks with regard to WhatsApp's terms of service.

## Contributing

Contributions are welcome! Please open issues or pull requests to improve the project.

## License

[MIT License](LICENSE)
