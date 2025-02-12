let page = 1;
const perPage = 10;
let isLoading = false;
let hasMoreContacts = true;
let searchTerm = "";
let debounceTimeout;

const loadingTextEl = document.getElementById("loadingText");

const contactListEl = document.getElementById("contactList");
const contactContainerEl = document.getElementById("contactContainer");
const contactModal = document.getElementById("contactModal");

const groupListEl = document.getElementById("groupList");
const groupContainerEl = document.getElementById("groupContainer");
const groupModal = document.getElementById("groupModal");

const waEditor = createWhatsAppWysiwyg("editor-container", {
  placeholder: "Type your WhatsApp message here...",
});

function openContactModal() {
  // Reset state for a fresh load
  page = 1;
  hasMoreContacts = true;
  contactListEl.innerHTML = "";
  loadContacts();
  contactModal.classList.add("flex");
  contactModal.classList.remove("hidden");
}

function closeContactModal() {
  contactModal.classList.add("hidden");
  contactModal.classList.remove("flex");
}

function selectContact(number) {
  document.getElementById("number").value = number;
  closeContactModal();
}

async function sendMessage() {
  const number = document.getElementById("number").value;
  const message = waEditor.getContent();
  if (number && message) {
    try {
      const response = await fetch("/api/message/send-message", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number,
          message,
        }),
      });
      const result = await response.json();
      if (result.status) {
        document.getElementById("number").value = "";
        waEditor.editorElement.innerHTML = "";
        waEditor.previewElement.innerHTML = "";
        waEditor.editorElement.dispatchEvent(new Event("input"));
        createToast("info", "Message sent!", `Message successfully sent`);
      } else {
        createToast("warning", "Sending Failed!", `Message failed to sent`);
      }
    } catch (error) {
      createToast("debug", "Ooops!", "Something happend!");
      console.error(error);
    }
  } else {
    createToast("error", "Alert!", "Please enter both number and message");
  }
}

async function loadContacts() {
  if (isLoading || !hasMoreContacts) return;
  isLoading = true;
  loadingTextEl.classList.remove("hidden");

  try {
    // Use encodeURIComponent for the search term
    const response = await fetch(
      `/api/contacts?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
        searchTerm
      )}`
    );
    const result = await response.json();

    // Support API responses that either wrap contacts in a 'data' property or return an array directly
    const contactsData = result.data || result;

    if (contactsData.contacts.length === 0) {
      const li = document.createElement("li");
      li.classList.add("cursor-pointer", "hover:bg-gray-200", "p-2", "rounded");
      li.innerHTML = `
          <div class="flex items-center justify-start gap-2">
            <div class="bg-black h-10 w-10 rounded-full"></div>
            <div>
              <strong class="font-bold">No contacts found</strong>
            </div>
          </div>
        `;
      contactListEl.appendChild(li);
    } else {
      contactsData.contacts.forEach((contact) => {
        const li = document.createElement("li");
        li.classList.add("cursor-pointer", "hover:bg-gray-200", "p-2", "rounded");
        li.innerHTML = `
          <div class="flex items-center justify-start gap-2">
            <div class="bg-black h-10 w-10 rounded-full"></div>
            <div>
              <strong class="font-bold">${contact.name}</strong>
              <p class="font-mono text-gray-500">
                ${formatInternationalPhoneNumber(contact.number)}
              </p>
            </div>
          </div>
        `;
        li.onclick = () => selectContact(contact.number);
        contactListEl.appendChild(li);
      });
    }

    if (contactsData.contacts.length < perPage) {
      hasMoreContacts = false;
    }

    page++;
  } catch (error) {
    console.error("Error loading contacts:", error);
  }

  isLoading = false;
  loadingTextEl.classList.add("hidden");
}

// Debounced search: clear previous results and load contacts based on new search term
function searchContacts() {
  searchTerm = document.getElementById("searchContact").value.trim();
  page = 1;
  hasMoreContacts = true;
  contactListEl.innerHTML = "";
  loadContacts();
}

function openGroupModal() {
  // Reset state for a fresh load
  page = 1;
  hasMoreGroups = true;
  groupListEl.innerHTML = "";
  loadGroups();
  groupModal.classList.add("flex");
  groupModal.classList.remove("hidden");
}

function closeGroupModal() {
  groupModal.classList.add("hidden");
  groupModal.classList.remove("flex");
}

function selectGroup(number) {
  document.getElementById("number").value = number;
  closeGroupModal();
}

async function sendGroupMessage() {
  const groupId = document.getElementById("number").value;
  const message = waEditor.getContent();
  if (groupId && message) {
    try {
      const response = await fetch(
        "/api/message/send-group-message",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupId,
            message,
          }),
        }
      );
      const result = await response.json();
      if (result.status) {
        document.getElementById("number").value = "";
        waEditor.editorElement.innerHTML = "";
        waEditor.previewElement.innerHTML = "";
        waEditor.editorElement.dispatchEvent(new Event("input"));
        createToast(
          "info",
          "Message sent to group!",
          `Message successfully sent`
        );
      } else {
        createToast(
          "warning",
          "Sending Failed!",
          `Message failed to sent in the group`
        );
      }
    } catch (error) {
      createToast("debug", "Ooops!", "Something happend!");
      console.error(error);
    }
  } else {
    createToast("error", "Alert!", "Please enter both number and message");
  }
}

async function loadGroups() {
  if (isLoading || !hasMoreGroups) return;
  isLoading = true;
  loadingTextEl.classList.remove("hidden");

  try {
    // Use encodeURIComponent for the search term
    const response = await fetch(
      `/api/groups?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
        searchTerm
      )}`
    );
    const result = await response.json();

    // Support API responses that either wrap groups in a 'data' property or return an array directly
    const groupsData = result.data || result;

    if (groupsData.length < perPage) {
      hasMoreGroups = false;
    }

    groupsData.forEach((group) => {
      const li = document.createElement("li");
      li.classList.add("cursor-pointer", "hover:bg-gray-200", "p-2", "rounded");
      li.innerHTML = `
            <div class="flex items-center justify-start gap-2">
              <div class="bg-black h-10 w-10 rounded-full"></div>
              <div>
                <strong class="font-bold">${group.groupName}</strong>
                <p class="font-mono text-gray-500">
                  ${group.totalParticipants}
                </p>
              </div>
            </div>
          `;
      li.onclick = () => selectGroup(group.groupId);
      groupListEl.appendChild(li);
    });

    page++;
  } catch (error) {
    console.error("Error loading groups:", error);
  }

  isLoading = false;
  loadingTextEl.classList.add("hidden");
}

// Debounced search: clear previous results and load groups based on new search term
function searchGroups() {
  searchTerm = document.getElementById("searchGroup").value.trim();
  page = 1;
  hasMoreGroups = true;
  groupListEl.innerHTML = "";
  loadGroups();
}

// Listen for scroll events to implement infinite scroll
if (contactContainerEl) {
  contactContainerEl.addEventListener("scroll", () => {
    if (
      contactContainerEl.scrollTop + contactContainerEl.clientHeight >=
      contactContainerEl.scrollHeight - 10
    ) {
      loadContacts();
    }
  });

  document.getElementById("searchContact").addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchContacts, 500);
  });
}

if (groupContainerEl) {
  groupContainerEl.addEventListener("scroll", () => {
    if (
      groupContainerEl.scrollTop + groupContainerEl.clientHeight >=
      groupContainerEl.scrollHeight - 10
    ) {
      loadContacts();
    }
  });

  document.getElementById("searchGroup").addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchGroups, 500);
  });
}
