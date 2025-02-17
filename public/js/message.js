let page = 1;
const perPage = 10;
let isLoading = false;
let hasMoreContacts = true;
let hasMoreGroups = true;
let searchTerm = "";
let debounceTimeout;

const loadingTextElement = document.querySelector("#loadingText");

const contactListElement = document.querySelector("#contactList");
const contactContainerElement = document.querySelector("#contactContainer");
const contactModal = document.querySelector("#contactModal");

const groupListElement = document.querySelector("#groupList");
const groupContainerElement = document.querySelector("#groupContainer");
const groupModal = document.querySelector("#groupModal");

const waEditor = createWhatsAppWysiwyg("editor-container", {
  placeholder: "Type your WhatsApp message here...",
});

function openContactModal() {
  // Reset state for a fresh load
  page = 1;
  hasMoreContacts = true;
  contactListElement.innerHTML = "";
  loadContacts();
  contactModal.classList.add("flex");
  contactModal.classList.remove("hidden");
}

function closeContactModal() {
  contactModal.classList.add("hidden");
  contactModal.classList.remove("flex");
}

function selectContact(number) {
  document.querySelector("#number").value = number;
  closeContactModal();
}

async function sendMessage() {
  const number = document.querySelector("#number").value;
  const message = waEditor.getContent();
  if (number && message) {
    try {
      const response = await fetch(`${SAFE_API_URL}/api/message/send-message`, {
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
        document.querySelector("#number").value = "";
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
  loadingTextElement.classList.remove("hidden");

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
      contactListElement.append(li);
    } else {
      for (const contact of contactsData.contacts) {
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
        li.addEventListener('click', () => selectContact(contact.number));
        contactListElement.append(li);
      }
    }

    if (contactsData.contacts.length < perPage) {
      hasMoreContacts = false;
    }

    page++;
  } catch (error) {
    console.error("Error loading contacts:", error);
  }

  isLoading = false;
  loadingTextElement.classList.add("hidden");
}

// Debounced search: clear previous results and load contacts based on new search term
function searchContacts() {
  searchTerm = document.querySelector("#searchContact").value.trim();
  page = 1;
  hasMoreContacts = true;
  contactListElement.innerHTML = "";
  loadContacts();
}

function openGroupModal() {
  // Reset state for a fresh load
  page = 1;
  groupListElement.innerHTML = "";
  loadGroups();
  groupModal.classList.add("flex");
  groupModal.classList.remove("hidden");
}

function closeGroupModal() {
  groupModal.classList.add("hidden");
  groupModal.classList.remove("flex");
}

function selectGroup(number) {
  document.querySelector("#number").value = number;
  closeGroupModal();
}

async function sendGroupMessage() {
  const groupId = document.querySelector("#number").value;
  const message = waEditor.getContent();
  if (groupId && message) {
    try {
      const response = await fetch(
        `${SAFE_API_URL}/api/message/send-group-message`,
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
        document.querySelector("#number").value = "";
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
  loadingTextElement.classList.remove("hidden");

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

    for (const group of groupsData) {
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
      li.addEventListener('click', () => selectGroup(group.groupId));
      groupListElement.append(li);
    }

    page++;
  } catch (error) {
    console.error("Error loading groups:", error);
  }

  isLoading = false;
  loadingTextElement.classList.add("hidden");
}

// Debounced search: clear previous results and load groups based on new search term
function searchGroups() {
  searchTerm = document.querySelector("#searchGroup").value.trim();
  page = 1;
  hasMoreGroups = true;
  groupListElement.innerHTML = "";
  loadGroups();
}

// Listen for scroll events to implement infinite scroll
if (contactContainerElement) {
  contactContainerElement.addEventListener("scroll", () => {
    if (
      contactContainerElement.scrollTop + contactContainerElement.clientHeight >=
      contactContainerElement.scrollHeight - 10
    ) {
      loadContacts();
    }
  });

  document.querySelector("#searchContact").addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchContacts, 500);
  });
}

if (groupContainerElement) {
  groupContainerElement.addEventListener("scroll", () => {
    if (
      groupContainerElement.scrollTop + groupContainerElement.clientHeight >=
      groupContainerElement.scrollHeight - 10
    ) {
      loadContacts();
    }
  });

  document.querySelector("#searchGroup").addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchGroups, 500);
  });
}
