let page = 1;
const perPage = 10;
let isLoading = false;
let hasMoreContacts = true;
let searchTerm = "";
let debounceTimeout;

const loadingTextElement = document.querySelector("#loadingText");
const contactListElement = document.querySelector("#contactList");
const contactContainerElement = document.querySelector("#contactContainer");

async function loadContacts() {
  if (isLoading || !hasMoreContacts) return;
  isLoading = true;
  loadingTextElement.classList.remove("hidden");

  try {
    // Use encodeURIComponent for the search term
    const response = await fetch(
      `${SAFE_API_URL}/api/contacts?page=${page}&perPage=${perPage}&search=${encodeURIComponent(
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
        li.classList.add(
          "cursor-pointer",
          "hover:bg-gray-200",
          "p-2",
          "rounded"
        );
        li.innerHTML = `
            <div class="flex items-center justify-start gap-2">
              <div class="h-10 w-10 rounded-full bg-black bg-cover bg-center" style="background-image: url('${contact.profilePicture}');"></div>
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

function searchContacts() {
  searchTerm = document.querySelector("#searchContact").value.trim();
  page = 1;
  hasMoreContacts = true;
  contactListElement.innerHTML = "";
  loadContacts();
}

await loadContacts();

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
