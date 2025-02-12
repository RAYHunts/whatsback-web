$(document).ready(function () {
  const socket = io();
  const SESSION_NAME = "whatsapp_session";
  const log = $(".logs");

  // Initial setup
  if (localStorage.getItem(SESSION_NAME)) {
    const userInfo = JSON.parse(localStorage.getItem(SESSION_NAME));
    displayUserInfo(userInfo);
  }

  // Enhanced logging with types
  function addLog(message, type = "info") {
    const types = {
      info: { class: "blue", icon: "info-circle" },
      success: { class: "green", icon: "check-circle" },
      error: { class: "red", icon: "times-circle" },
      warning: { class: "yellow", icon: "exclamation-circle" },
    };

    const timestamp = new Date().toLocaleTimeString();
    log.append(`
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
      `);

    if (log.parent().length > 0) {
      log.parent().scrollTop(log.parent()[0].scrollHeight);
    }
  }

  // Dark/Light Mode Toggle
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

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

  // Set initial icon based on theme
  if (localStorage.theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  // Add event listener to toggle button
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Update connection status
  function updateStatus(text, type = "gray") {
    $("#connection-status").html(`
        <span class="bg-${type}-500 text-white px-2 py-1 rounded-md text-sm">${text}</span>
      `);
  }

  // Display user info
  function displayUserInfo(userInfo) {
    if (userInfo) {
      $("#user_info").text(userInfo.name);
      $("#profile_picture").attr("src", userInfo.picture);
      $("#active_session").removeClass("hidden");
      updateStatus("Connected", "green");
    } else {
      $("#active_session").addClass("hidden");
      updateStatus("Disconnected", "gray");
    }
  }

  // Logout handler
  $("#logout-btn").click(function () {
    localStorage.removeItem(SESSION_NAME);
    socket.emit("logout");
    displayUserInfo(null);
    addLog("Successfully logged out", "success");
  });

  // Event listeners
  socket.on("connected", () => updateStatus("Connecting...", "yellow"));
  socket.on("disconnected", () => updateStatus("Disconnected", "gray"));

  socket.on("logs", (msg) => addLog(msg));

  socket.on("ready", (data) => {
    console.log("Ready event triggered", data);
    if (data.user_info) {
      localStorage.setItem(SESSION_NAME, JSON.stringify(data.user_info));
      displayUserInfo(data.user_info);
      $(".qrcode-container").addClass("hidden");
    }
  });

  socket.on("authenticated", (data) => {
    console.log("Authenticated event triggered", data);
    addLog(data.log, "success");
    if (data.user_info) {
      displayUserInfo(data.user_info);
      $(".qrcode-container").addClass("hidden");
    }
  });

  socket.on("qr", (src) => {
    $(".qrcode-container").removeClass("hidden");
    $("#qrcode").attr("src", src);
    addLog("QR code generated - please scan", "info");
  });

  socket.on("disconnected", (msg) => {
    addLog(msg, "error");
    localStorage.removeItem(SESSION_NAME);
    displayUserInfo(null);
  });

  socket.on("client_logout", (msg) => {
    addLog(msg, "info");
    localStorage.removeItem(SESSION_NAME);
    displayUserInfo(null);
  });
});

function formatInternationalPhoneNumber(number) {
  number = number.toString();
  // Ensure the number starts with "62" (Indonesia's country code)
  if (!number.startsWith("62")) {
    return "Invalid Indonesian number";
  }

  // Remove the country code and add the plus sign
  let localNumber = number.slice(2);
  if (localNumber.length === 10) {
    return `+62 ${localNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 11) {
    return `+62 ${localNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 12) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 13) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{4})(\d{5})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 14) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{5})/, "$1-$2-$3")}`;
  } else if (localNumber.length === 15) {
    return `+62 ${localNumber.replace(/(\d{4})(\d{5})(\d{6})/, "$1-$2-$3")}`;
  } else {
    return "Invalid length for an Indonesian number";
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
  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  // Auto-remove after 3 seconds
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

  // Start progress bar animation
  setTimeout(() => (progress.style.width = "0%"), 50);
}

function sleep(ms) {
  new Promise((resolve) => setTimeout(resolve, ms));
}

// CSS animation for fade-in
const style = document.createElement("style");
style.textContent = `
  @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
      animation: fade-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);
