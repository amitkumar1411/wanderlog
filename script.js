// Wanderlog Week 2: localStorage CRUD for travel trips.

const STORAGE_KEY = "wanderlogTrips";

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const tripForm = document.getElementById("tripForm");
const formHeading = document.getElementById("formHeading");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const formStatus = document.getElementById("formStatus");
const destinationGrid = document.getElementById("destinationGrid");
const emptyState = document.getElementById("emptyState");
const tripCount = document.getElementById("tripCount");

const titleInput = document.getElementById("title");
const destinationInput = document.getElementById("destination");
const dateInput = document.getElementById("date");
const notesInput = document.getElementById("notes");

const titleError = document.getElementById("titleError");
const destinationError = document.getElementById("destinationError");
const dateError = document.getElementById("dateError");

let editingTripId = null;

// Data model used consistently throughout the app.
// coverImageUrl is reserved for future image support and defaults to an empty string.
// { id, title, destination, date, notes, coverImageUrl }

function getTrips() {
    try {
        const savedTrips = localStorage.getItem(STORAGE_KEY);
        if (!savedTrips) return [];

        const parsedTrips = JSON.parse(savedTrips);
        return Array.isArray(parsedTrips) ? parsedTrips : [];
    } catch (error) {
        console.error("Unable to read trips from localStorage:", error);
        return [];
    }
}

function saveTrips(trips) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function createTrip(data) {
    return {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: data.title,
        destination: data.destination,
        date: data.date,
        notes: data.notes,
        coverImageUrl: ""
    };
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;"
    })[character]);
}

function formatDate(dateString) {
    if (!dateString) return "Date not specified";

    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getInitials(title) {
    const initials = title
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return initials || "WL";
}

function renderTrips() {
    const trips = getTrips();

    destinationGrid.innerHTML = "";
    tripCount.textContent = `${trips.length} ${trips.length === 1 ? "trip" : "trips"}`;

    if (trips.length === 0) {
        destinationGrid.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }

    destinationGrid.classList.remove("hidden");
    emptyState.classList.add("hidden");

    trips.forEach((trip, index) => {
        const card = document.createElement("article");
        card.className = "destination-card trip-card";
        card.innerHTML = `
            <div class="trip-card-top">
                <div class="destination-icon">${String(index + 1).padStart(2, "0")}</div>
                <div class="trip-actions">
                    <button type="button" class="icon-button edit-button" data-action="edit" data-id="${escapeHTML(trip.id)}" aria-label="Edit ${escapeHTML(trip.title)}">Edit</button>
                    <button type="button" class="icon-button delete-button" data-action="delete" data-id="${escapeHTML(trip.id)}" aria-label="Delete ${escapeHTML(trip.title)}">Delete</button>
                </div>
            </div>
            <h3>${escapeHTML(trip.title)}</h3>
            <p class="trip-destination">${escapeHTML(trip.destination)}</p>
            <p class="trip-date">${escapeHTML(formatDate(trip.date))}</p>
            ${trip.notes ? `<p class="trip-notes">${escapeHTML(trip.notes)}</p>` : ""}
        `;

        destinationGrid.appendChild(card);
    });
}

function clearErrors() {
    titleError.textContent = "";
    destinationError.textContent = "";
    dateError.textContent = "";
    [titleInput, destinationInput, dateInput].forEach((input) => input.classList.remove("input-error"));
}

function validateForm() {
    clearErrors();
    let isValid = true;

    if (!titleInput.value.trim()) {
        titleError.textContent = "Trip title is required.";
        titleInput.classList.add("input-error");
        isValid = false;
    }

    if (!destinationInput.value.trim()) {
        destinationError.textContent = "Destination is required.";
        destinationInput.classList.add("input-error");
        isValid = false;
    }

    if (!dateInput.value) {
        dateError.textContent = "Date is required.";
        dateInput.classList.add("input-error");
        isValid = false;
    }

    return isValid;
}

function resetForm() {
    tripForm.reset();
    clearErrors();
    editingTripId = null;
    formHeading.textContent = "Add a new trip";
    submitButton.textContent = "Save trip";
    cancelEditButton.classList.add("hidden");
    formStatus.textContent = "";
}

function startEdit(tripId) {
    const trip = getTrips().find((item) => item.id === tripId);
    if (!trip) return;

    editingTripId = trip.id;
    titleInput.value = trip.title || "";
    destinationInput.value = trip.destination || "";
    dateInput.value = trip.date || "";
    notesInput.value = trip.notes || "";

    clearErrors();
    formHeading.textContent = "Edit your trip";
    submitButton.textContent = "Update trip";
    cancelEditButton.classList.remove("hidden");
    formStatus.textContent = "Editing this trip — make your changes and save.";

    document.getElementById("add-trip").scrollIntoView({ behavior: "smooth", block: "start" });
    titleInput.focus();
}

function deleteTrip(tripId) {
    const trips = getTrips();
    const trip = trips.find((item) => item.id === tripId);
    if (!trip) return;

    const confirmed = window.confirm(`Delete “${trip.title}” from your journal? This cannot be undone.`);
    if (!confirmed) return;

    const updatedTrips = trips.filter((item) => item.id !== tripId);
    saveTrips(updatedTrips);

    if (editingTripId === tripId) resetForm();

    renderTrips();
    formStatus.textContent = "Trip deleted successfully.";
}

tripForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        formStatus.textContent = "Please complete the required fields.";
        return;
    }

    const tripData = {
        title: titleInput.value.trim(),
        destination: destinationInput.value.trim(),
        date: dateInput.value,
        notes: notesInput.value.trim()
    };

    const trips = getTrips();

    if (editingTripId) {
        const tripIndex = trips.findIndex((trip) => trip.id === editingTripId);
        if (tripIndex === -1) {
            formStatus.textContent = "This trip could not be found. Please try again.";
            resetForm();
            renderTrips();
            return;
        }

        trips[tripIndex] = {
            ...trips[tripIndex],
            ...tripData
        };

        saveTrips(trips);
        resetForm();
        renderTrips();
        formStatus.textContent = "Trip updated successfully.";
        return;
    }

    const newTrip = createTrip(tripData);
    trips.push(newTrip);
    saveTrips(trips);

    resetForm();
    renderTrips();
    formStatus.textContent = "Trip saved successfully.";
});

cancelEditButton.addEventListener("click", () => {
    resetForm();
});

destinationGrid.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;

    const { action, id } = actionButton.dataset;

    if (action === "edit") startEdit(id);
    if (action === "delete") deleteTrip(id);
});

// Mobile navigation.
menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Read existing trips as soon as the page loads.
renderTrips();
