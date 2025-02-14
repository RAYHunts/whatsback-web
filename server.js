const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const qrcode = require("qrcode");
require("dotenv").config();

const { client, setSocketManager } = require("./src/whatsapp-client");
const { serverLog, sleep, parseOrigins } = require("./src/helper");
const state = require("./src/whatsapp-client/state");
const userInfo = require("./src/whatsapp-client/getProfile");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const initSchemas = require("./src/schemas");

// API Routes
const commandRoutes = require("./src/routes/api/commandRoutes");
const contactRoutes = require("./src/routes/api/contactRoutes");
const groupRoutes = require("./src/routes/api/groupRoutes");
const messageRoutes = require("./src/routes/api/messageRoutes");

// Frontend Routes
const commandFrontRoutes = require("./src/routes/commandFrontRoutes");
const messageFrontRoutes = require("./src/routes/messageFrontRoutes");
const contactFrontRoutes = require("./src/routes/contactFrontRoutes");

initSchemas();

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "'unsafe-inline'", // consider replacing with a nonce or hash in production
      ],
      // Include cdnjs.cloudflare.com to allow Font Awesome CSS
      styleSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com",
        "'unsafe-inline'", // consider using a hash/nonce for inline styles
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://robohash.org",
        "https://pps.whatsapp.net",
      ],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  })
);

app.disable("x-powered-by");

app.use(hpp());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use("/api", apiLimiter);

const apiCors = {
  origin: parseOrigins(process.env.API_CORS_ORIGIN),
  allowedHeaders: ["Content-Type"],
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
};
app.use(cors(apiCors));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/default");
app.set("view engine", "ejs");

app.use(express.json());

// Expose global variable for use in EJS templates
app.use((req, res, next) => {
  res.locals.APP_PORT = process.env.APP_PORT || 5001;
  next();
});

// Frontend routes
app.get("/", (req, res) => res.render("index"));
app.use("/commands", commandFrontRoutes);
app.use("/contacts", contactFrontRoutes);
app.use("/message", messageFrontRoutes);

// API routes
app.use("/api/command", commandRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/message", messageRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

// Create HTTP server and configure Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: parseOrigins(process.env.SOCKET_IO_CORS_ORIGIN), // restrict origins for socket connections
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handling
const connectedSockets = [];

io.on("connection", async (socket) => {
  connectedSockets.push(socket);
  socket.emit("connected", "WhatsApp Client is Connected!");
  socket.emit("logs", "WhatsApp Client is Connected!");
  serverLog("WhatsApp Client is Connected!");

  // Emit current state to the newly connected socket
  if (state.lastQR) {
    qrcode.toDataURL(state.lastQR, (err, url) => {
      if (!err) {
        socket.emit("qr", url);
        socket.emit("logs", "QR Code received, scan please!");
        serverLog("QR Code sent to new socket");
      }
    });
  }
  if (state.isAuthenticated) {
    const info = await userInfo(client);
    socket.emit("authenticated", {
      log: "WhatsApp is authenticated!",
      user_info: info,
    });
    serverLog("Authenticated state sent to new socket");
  }
  if (state.isReady) {
    const info = await userInfo(client);
    socket.emit("ready", {
      log: "WhatsApp client is ready!",
      user_info: info,
    });
    socket.emit("logs", "WhatsApp client is ready!");
    serverLog("Ready state sent to new socket");
  }

  // Listen for logout events from this socket
  socket.on("logout", async () => {
    try {
      await client.logout();
      serverLog("Logged out the current client");
      socket.emit("disconnected", "Logged out the current client");
      await client.destroy();
      socket.emit("client_logout", "You're now logged out!");
      serverLog("Client destroyed after logout");

      // Wait a bit before reinitializing
      await sleep(3000);
      await client.initialize();
      serverLog("Reinitialized the client after logout");
      socket.emit("logs", "Reinitialized the client");
    } catch (error) {
      console.error("Logout error:", error);
    }
  });

  socket.on("disconnect", () => {
    const index = connectedSockets.indexOf(socket);
    if (index !== -1) {
      connectedSockets.splice(index, 1);
    }
    serverLog("Socket disconnected");
  });
});

// Let the WhatsApp client module know about our sockets
setSocketManager(connectedSockets);

// Global error handling middleware (optional, but recommended)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the HTTP server
const PORT = process.env.APP_PORT || 5001;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
