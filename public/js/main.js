const socket = io();
const SESSION_NAME = "whatsapp_session";
const log = document.querySelector(".logs");

// Dark/Light Mode Toggle
const themeToggleButton = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");

// Initial setup
const storedSession = localStorage.getItem(SESSION_NAME);

// Logout handler
const logoutButton = document.querySelector("#logout-btn");

// Enhanced logging with types
function addLog(message, type = "info") {
  const types = {
    info: { class: "blue", icon: "info-circle" },
    success: { class: "green", icon: "check-circle" },
    error: { class: "red", icon: "times-circle" },
    warning: { class: "yellow", icon: "exclamation-circle" },
  };

  const timestamp = new Date().toLocaleTimeString();
  log.insertAdjacentHTML(
    "beforeend",
    `
      <li class="log-item text-sm pb-2">
        <span class="bg-${
          types[type].class
        }-500 text-white px-2 py-1 rounded-md text-sm mr-2 hidden sm:inline-block md:inline-block lg:inline-block">
          <i class="fas fa-${
            types[type].icon
          } text-sm"></i> ${type.toUpperCase()}
        </span>
        [${timestamp}] ${message}
      </li>
    `
  );

  if (log.parentElement) {
    log.parentElement.scrollTop = log.parentElement.scrollHeight;
  }
}

// Function to toggle theme
function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  }
}

// Display user info
function displayUserInfo(userInfo) {
  const userInfoElement = document.querySelector("#user_info");
  const profilePicture = document.querySelector("#profile_picture");
  const activeSession = document.querySelector("#active_session");
  if (userInfo) {
    if (userInfoElement) userInfoElement.textContent = userInfo.name;
    if (profilePicture) profilePicture.setAttribute("src", userInfo.picture);
    if (activeSession) activeSession.classList.remove("hidden");
    updateStatus("Connected", "green");
  } else {
    if (activeSession) activeSession.classList.add("hidden");
    updateStatus("Disconnected", "gray");
  }
}

// Update connection status
function updateStatus(text, type = "gray") {
  const connectionStatus = document.querySelector("#connection-status");
  if (connectionStatus) {
    connectionStatus.innerHTML = `
      <span class="bg-${type}-500 text-white px-2 py-1 rounded-md text-sm">${text}</span>
    `;
  }
}

function formatInternationalPhoneNumber(number) {
  number = number.toString();
  // Ensure the number starts with "62" (Indonesia's country code)
  if (!number.startsWith("62")) {
    return "Invalid Indonesian number";
  }

  // Remove the country code and add the plus sign
  let localNumber = number.slice(2);
  switch (localNumber.length) {
    case 10: {
      return `+62 ${localNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
    }
    case 11: {
      return `+62 ${localNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}`;
    }
    case 12: {
      return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")}`;
    }
    case 13: {
      return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{5})/, "$1-$2-$3")}`;
    }
    case 14: {
      return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{5})/, "$1-$2-$3")}`;
    }
    case 15: {
      return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{6})/, "$1-$2-$3")}`;
    }
    default: {
      return "Invalid length for an Indonesian number";
    }
  }
}

function createToast(type, title, message, duration = 3000) {
  // Define styles for each type
  const styles = {
    info: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>`,
      progressColor: "bg-blue-500",
    },
    warning: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>`,
      progressColor: "bg-yellow-500",
    },
    error: {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>`,
      progressColor: "bg-red-500",
    },
    debug: {
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>`,
      progressColor: "bg-purple-500",
    },
  };

  // Get the style for the current type
  const style = styles[type] || styles.info;

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `animate-fade-in ${style.bgColor} p-4 rounded-lg shadow-lg w-80 relative overflow-hidden`;

  // Add progress bar
  const progress = document.createElement("div");
  progress.className = `absolute top-0 left-0 h-1 ${style.progressColor} w-full transition-all duration-[3000ms]`;
  progress.style.width = "100%";

  // Toast content
  toast.innerHTML = `
      <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 ${style.textColor}">
              ${style.icon}
          </div>
          <div class="flex-1">
              <h3 class="font-semibold ${style.textColor}">${title}</h3>
              <p class="text-sm ${style.textColor} mt-1">${message}</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" 
                  class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
          </button>
      </div>
  `;

  // Add progress bar to toast
  toast.prepend(progress);

  // Add toast to container
  const container = document.querySelector("#toast-container");
  if (container) container.append(toast);

  // Auto-remove after duration
  let timeout = setTimeout(() => toast.remove(), duration);

  // Pause on hover
  toast.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
    progress.style.transition = "none";
    progress.style.width = "100%";
  });

  toast.addEventListener("mouseleave", () => {
    progress.style.transition = "width 3s linear";
    progress.style.width = "0%";
    timeout = setTimeout(() => toast.remove(), duration);
  });

  // Start progress bar animation shortly after
  setTimeout(() => (progress.style.width = "0%"), 50);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// CSS animation for fade-in
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
      animation: fade-in 0.3s ease-out;
  }
`;
document.head.append(styleElement);

document.addEventListener("DOMContentLoaded", function () {
  if (storedSession) {
    const userInfo = JSON.parse(storedSession);
    displayUserInfo(userInfo);
  }

  // Set initial icon based on theme
  if (localStorage.getItem("theme") === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  // Add event listener to toggle button
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", toggleTheme);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem(SESSION_NAME);
      socket.emit("logout");
      displayUserInfo();
      addLog("Successfully logged out", "success");
    });
  }

  // Socket event listeners
  socket.on("connected", () => updateStatus("Connecting...", "yellow"));
  socket.on("disconnected", () => updateStatus("Disconnected", "gray"));

  socket.on("logs", (message) => addLog(message));

  socket.on("ready", (data) => {
    console.log("Ready event triggered", data);
    if (data.user_info) {
      localStorage.setItem(SESSION_NAME, JSON.stringify(data.user_info));
      displayUserInfo(data.user_info);
      for (const element of document.querySelectorAll(".qrcode-container"))
        element.classList.add("hidden");
    }
  });

  socket.on("authenticated", (data) => {
    console.log("Authenticated event triggered", data);
    addLog(data.log, "success");
    if (data.user_info) {
      displayUserInfo(data.user_info);
      for (const element of document.querySelectorAll(".qrcode-container"))
        element.classList.add("hidden");
    }
  });

  socket.on("qr", (source) => {
    for (const element of document.querySelectorAll(".qrcode-container"))
      element.classList.remove("hidden");
    const qrcode = document.querySelector("#qrcode");
    if (qrcode) {
      qrcode.setAttribute("src", source);
    }
    addLog("QR code generated - please scan", "info");
  });

  socket.on("disconnected", (message) => {
    addLog(message, "error");
    localStorage.removeItem(SESSION_NAME);
    displayUserInfo();
  });

  socket.on("client_logout", (message) => {
    addLog(message, "info");
    localStorage.removeItem(SESSION_NAME);
    displayUserInfo();
  });
});
