
const JOURNAL_KEY = "yagyasenna_journal_entries";

function initJournal() {

    const form = document.getElementById("journalForm");
    const entriesContainer = document.getElementById("journalEntries");

    function getEntries() {
        try {
            return JSON.parse(localStorage.getItem(JOURNAL_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveEntries(entries) {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    }

    function renderEntries() {

        const entries = getEntries();
        entriesContainer.replaceChildren();

        if (entries.length === 0) {
            const message = document.createElement("p");
            message.textContent = "No journal entries yet. Start writing whenever you are ready.";
            entriesContainer.appendChild(message);
            return;
        }

        entries.slice().reverse().forEach(entry => {

            const card = document.createElement("article");
            card.className = "journal-entry";

            const title = document.createElement("h4");
            title.textContent = entry.title;

            const date = document.createElement("small");
            date.textContent = new Date(entry.date).toLocaleString();

            const details = document.createElement("p");
            details.textContent =
                `${entry.category} · ${entry.mood}`;

            const content = document.createElement("p");
            content.className = "journal-entry-content";
            content.textContent = entry.content;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Entry";
            deleteButton.className = "journal-delete-btn";

            deleteButton.addEventListener("click", () => {

                if (!confirm("Are you sure you want to delete this entry?")) {
                    return;
                }

                const updatedEntries = getEntries().filter(
                    item => item.id !== entry.id
                );

                saveEntries(updatedEntries);
                renderEntries();
            });

            card.append(title, date, details, content, deleteButton);
            entriesContainer.appendChild(card);
        });
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        const entry = {
            id: crypto.randomUUID(),
            title: document.getElementById("journalTitle").value.trim(),
            category: document.getElementById("journalCategory").value,
            mood: document.getElementById("journalMood").value,
            content: document.getElementById("journalContent").value.trim(),
            date: new Date().toISOString()
        };

        if (!entry.title || !entry.content) {
            alert("Please complete the title and journal entry.");
            return;
        }

        const entries = getEntries();
        entries.push(entry);

        try {
            saveEntries(entries);
            form.reset();
            renderEntries();
            alert("Your journal entry has been saved.");
        } catch {
            alert("Unable to save your entry. Browser storage may be full.");
        }
    });

    renderEntries();
}

window.initJournal = initJournal;
