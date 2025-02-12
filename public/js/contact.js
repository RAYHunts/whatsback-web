let page = 1;
const perPage = 10;
let isLoading = false;
let hasMoreContacts = true;
let searchTerm = "";
let debounceTimeout;

const loadingTextEl = document.getElementById("loadingText");
const contactListEl = document.getElementById("contactList");
const contactContainerEl = document.getElementById("contactContainer");

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
        li.classList.add(
          "cursor-pointer",
          "hover:bg-gray-200",
          "p-2",
          "rounded"
        );
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

function searchContacts() {
  searchTerm = document.getElementById("searchContact").value.trim();
  page = 1;
  hasMoreContacts = true;
  contactListEl.innerHTML = "";
  loadContacts();
}

loadContacts();

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
