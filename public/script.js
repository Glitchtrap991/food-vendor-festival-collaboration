import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const form = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");
const searchInput = document.getElementById("searchInput");
const vendorBtn = document.getElementById("vendorBtn");
const vendorResults = document.getElementById("vendorResults");
const festivalSelect = document.getElementById("festival");
const festivalFilter = document.getElementById("festivalFilter");

const foodCollection = collection(db, "foods");
let foodData = [];
let map, markerLayer;
let customLat = null, customLng = null;

// 🔁 Load all foods on page load
async function loadFoods() {
  const snapshot = await getDocs(foodCollection);
  foodData = [];
  snapshot.forEach(doc => foodData.push(doc.data()));
  applyFilters();
}

// 🎯 Filter foods based on search and festival
function applyFilters() {
  const term = searchInput.value.toLowerCase();
  const fest = festivalFilter.value;

  const filtered = foodData.filter(f =>
    f.name.toLowerCase().includes(term) &&
    (fest === "" || f.festival === fest)
  );

  renderFoods(filtered);
  renderMap(filtered);
}

// 🗺️ Show filtered pins on the map
function renderMap(data) {
  if (!map) {
    map = L.map("map").setView([13.0827, 80.2707], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    // Map click sets custom location for new dish
    map.on("click", function (e) {
      customLat = e.latlng.lat;
      customLng = e.latlng.lng;
      alert(`📍 Location set for new dish: ${customLat.toFixed(4)}, ${customLng.toFixed(4)}`);
    });
  }

  if (markerLayer) markerLayer.clearLayers();
  markerLayer = L.layerGroup().addTo(map);

  data.forEach(f => {
    if (f.lat && f.lng) {
      const marker = L.marker([f.lat, f.lng]).addTo(markerLayer);
      marker.bindPopup(`<strong>${f.name}</strong><br>${f.description}<br><em>🎊 ${f.festival}</em>`);
    }
  });
}

// 🧾 Render food cards
function renderFoods(data) {
  foodList.innerHTML = "";
  data.forEach(f => {
    const div = document.createElement("div");
    div.className = "col-md-6";
    div.innerHTML = `
      <div class="card card-food">
        <div class="card-body">
          <h5 class="card-title">${f.name} ${f.isVeg ? "🟢" : "🔴"}</h5>
          <p class="card-text">${f.description}<br><small class="text-muted">🎊 ${f.festival}</small></p>
        </div>
      </div>`;
    foodList.appendChild(div);
  });
}

// 📍 Vendors Nearby — Filtered only
vendorBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      const term = searchInput.value.toLowerCase();
      const fest = festivalFilter.value;

      // Use current filters
      const filtered = foodData.filter(f =>
        f.name.toLowerCase().includes(term) &&
        (fest === "" || f.festival === fest)
      );

      // Generate fake vendor pins for filtered items
      const sampleVendors = filtered.slice(0, 3).map(f => ({
        ...f,
        lat: latitude + (Math.random() - 0.5) * 0.01,
        lng: longitude + (Math.random() - 0.5) * 0.01
      }));

      renderVendorResults(sampleVendors);
      renderMap(sampleVendors);
    }, () => {
      alert("Geolocation access denied.");
    });
  } else {
    alert("Geolocation not supported.");
  }
});

// 📋 Show vendor cards
function renderVendorResults(data) {
  vendorResults.innerHTML = "<h5>Vendors Nearby:</h5>";
  data.forEach(v => {
    vendorResults.innerHTML += `<div class="alert alert-info mb-2">
      <strong>${v.name}</strong><br>${v.description}<br><em>Popular during ${v.festival}</em>
    </div>`;
  });
}

// 🧑‍🍳 Add new food to Firestore
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("foodName").value;
  const description = document.getElementById("description").value;
  const festival = festivalSelect.value;
  const isVeg = document.getElementById("isVeg").checked;

  try {
    const newFood = {
      name,
      description,
      festival,
      isVeg,
      lat: customLat ?? 13.0827 + Math.random() * 0.01,
      lng: customLng ?? 80.2707 + Math.random() * 0.01,
      timestamp: Date.now()
    };

    await addDoc(foodCollection, newFood);
    alert("✅ Food added successfully!");

    // Reset form + location
    form.reset();
    customLat = null;
    customLng = null;

    // Sync filter with form festival
    festivalFilter.value = festival;

    // Reload display
    loadFoods();
  } catch (err) {
    alert("Failed to add food: " + err.message);
  }
});

// 🔍 Live filtering
searchInput?.addEventListener("input", applyFilters);
festivalFilter?.addEventListener("change", applyFilters);

// 🟢 Initial load
loadFoods();
