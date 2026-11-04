
const CONTACT_STORAGE_KEY = "yagyasenna_contacts";

function initTrustedCircle() {

    const contactsList = document.getElementById("contactsList");
    const form = document.getElementById("contactForm");
    const formCard = document.getElementById("contactFormCard");
    const addBtn = document.getElementById("addContactBtn");
    const cancelBtn = document.getElementById("cancelContactBtn");
    const section = document.getElementById("trustedSection");

    let contacts = JSON.parse(
        localStorage.getItem(CONTACT_STORAGE_KEY) || "[]"
    );

    let editingId = null;

    function saveContacts() {
        localStorage.setItem(
            CONTACT_STORAGE_KEY,
            JSON.stringify(contacts)
        );
    }

    function renderContacts() {

        contactsList.innerHTML = "";

        if (contacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-contacts">
                    <h3>Your circle starts here ♡</h3>
                    <p>Add someone you trust.</p>
                </div>
            `;
            return;
        }

        contacts.forEach(contact => {

            const card = document.createElement("article");
            card.className = "contact-card";

            const name = document.createElement("h3");
            name.textContent = contact.name;

            const phone = document.createElement("p");
            phone.textContent = contact.phone;

            const actions = document.createElement("div");
            actions.className = "contact-actions";

            const callBtn = document.createElement("button");
            callBtn.textContent = "Call";
            callBtn.addEventListener("click", () => {
                window.location.href = `tel:${contact.phone}`;
            });

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => {
                editContact(contact.id);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", () => {
                deleteContact(contact.id);
            });

            actions.append(callBtn, editBtn, deleteBtn);
            card.append(name, phone, actions);
            contactsList.appendChild(card);
        });
    }

    function resetForm() {
        form.reset();
        editingId = null;
        formCard.hidden = true;
        document.getElementById("formHeading").textContent =
            "Add a trusted contact";
    }

    function editContact(id) {

        const contact = contacts.find(item => item.id === id);

        if (!contact) return;

        editingId = id;

        document.getElementById("contactName").value =
            contact.name;

        document.getElementById("contactPhone").value =
            contact.phone;

        document.getElementById("formHeading").textContent =
            "Edit trusted contact";

        formCard.hidden = false;
        formCard.scrollIntoView({ behavior: "smooth" });
    }

    function deleteContact(id) {

        if (!confirm("Remove this contact from your circle?")) {
            return;
        }

        contacts = contacts.filter(item => item.id !== id);

        saveContacts();
        renderContacts();
    }

    addBtn.addEventListener("click", () => {
        resetForm();
        formCard.hidden = false;
        document.getElementById("contactName").focus();
    });

    cancelBtn.addEventListener("click", resetForm);

    form.addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("contactName")
            .value.trim();

        const phone = document.getElementById("contactPhone")
            .value.trim();

        if (!name || !/^[0-9]{10}$/.test(phone)) {
            alert("Enter a valid name and 10-digit phone number.");
            return;
        }

        if (editingId) {

            const contact = contacts.find(
                item => item.id === editingId
            );

            if (contact) {
                contact.name = name;
                contact.phone = phone;
            }

        } else {

            contacts.push({
                id: crypto.randomUUID(),
                name,
                phone
            });
        }

        saveContacts();
        renderContacts();
        resetForm();
    });

    document.getElementById("backToHome")
        .addEventListener("click", () => {

            section.hidden = true;

            document.querySelector(".welcome").hidden = false;
            document.querySelector(".sos-section").hidden = false;
            document.querySelector(".section:not(.trusted-section)").hidden = false;
            document.querySelector(".reminder").hidden = false;
        });

    renderContacts();
}

window.initTrustedCircle = initTrustedCircle;
