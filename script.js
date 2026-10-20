/**
 * MEDINOVA — NextGen Healthcare Dashboard Controller
 */

const doctors = [
  {
    name: "Dr. Aline Carvalho",
    specialty: "Cardiology",
    role: "Senior Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
    address: "Rua São Salvador 57, Braga",
    price: "$25",
    experience: "12 years",
    rating: "4.9",
    reviews: "142"
  },
  {
    name: "Dr. Nicolas Sousa",
    specialty: "Gastroenterology",
    role: "Gastroenterology Specialist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
    address: "Largo Prazeres 120, Castelo",
    price: "$35",
    experience: "10 years",
    rating: "4.8",
    reviews: "98"
  },
  {
    name: "Dr. Emily Cardoso",
    specialty: "Pediatrics",
    role: "Chief Pediatrician",
    image: "https://images.unsplash.com/photo-1594824813583-059dfef89025?auto=format&fit=crop&w=500&q=80",
    address: "R Velhas 92, Viana do Castelo",
    price: "$20",
    experience: "8 years",
    rating: "5.0",
    reviews: "210"
  },
  {
    name: "Dr. Amanda Clara",
    specialty: "Pediatrics",
    role: "Pediatric Specialist",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80",
    address: "Central Medical Centre",
    price: "$30",
    experience: "12 years",
    rating: "4.9",
    reviews: "175"
  },
  {
    name: "Dr. Jason Shatsky",
    specialty: "Surgery",
    role: "General & Laparoscopic Surgeon",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80",
    address: "City Care Hospital",
    price: "$45",
    experience: "14 years",
    rating: "4.9",
    reviews: "320"
  },
  {
    name: "Dr. Jessie Dux",
    specialty: "Gastroenterology",
    role: "Digestive Health Consultant",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=500&q=80",
    address: "Health Point Clinic",
    price: "$25",
    experience: "7 years",
    rating: "4.7",
    reviews: "86"
  }
];

let appointments = JSON.parse(localStorage.getItem("medinovaAppointments") || localStorage.getItem("healthaiAppointments") || "null") || [
  { id: 1, doctor: "Dr. Ashton Cleve", date: "2023-06-14", time: "10:00 AM", duration: "30 min", specialty: "General Medicine" },
  { id: 2, doctor: "Dr. Ashton Cleve", date: "2023-06-15", time: "10:00 AM", duration: "30 min", specialty: "General Medicine" },
  { id: 3, doctor: "Dr. Emily Cardoso", date: "2023-06-17", time: "02:00 PM", duration: "30 min", specialty: "Pediatrics" }
];

let calendarDate = new Date(2023, 5, 1);
const $ = id => document.getElementById(id);
const toast = $("toast");

function showToast(msg) {
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#38bdf8;"></i> <span>${msg}</span>`;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function saveAppointments() {
  localStorage.setItem("medinovaAppointments", JSON.stringify(appointments));
  localStorage.setItem("healthaiAppointments", JSON.stringify(appointments));
  updateNavBadge();
}

function updateNavBadge() {
  const badge = $("navAppointmentsCount");
  if (badge) {
    badge.textContent = appointments.length;
    badge.classList.toggle("hidden", appointments.length === 0);
  }
}

function renderNearby() {
  const q = $("doctorSearch") ? $("doctorSearch").value.trim().toLowerCase() : "";
  const spec = $("specialtyFilter") ? $("specialtyFilter").value : "all";
  const list = doctors.filter(d => (spec === "all" || d.specialty === spec) && (!q || [d.name, d.specialty, d.role, d.address].join(" ").toLowerCase().includes(q)));
  
  const container = $("nearbyGrid");
  if (!container) return;

  container.innerHTML = list.slice(0, 3).map(d => `
    <article class="near-card">
      <div class="photo">
        <img src="${d.image}" alt="${d.name}" loading="lazy">
        <span class="card-badge-floating"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> ${d.rating}</span>
      </div>
      <div class="near-info">
        <h3>${d.name}</h3>
        <span class="near-role">${d.role}</span>
        <p class="near-exp"><i class="fa-solid fa-briefcase" style="color:#0284c7;margin-right:4px;"></i>${d.experience} exp · <b>${d.price}</b></p>
      </div>
      <div class="address">
        <i class="fa-solid fa-location-dot"></i>
        <span>1.2 km · ${d.address}</span>
      </div>
    </article>
  `).join("") || '<div class="empty-state"><p>No doctors found matching your criteria.</p></div>';
}

function renderRecommended() {
  const container = $("recommendedGrid");
  if (!container) return;

  container.innerHTML = doctors.slice(3).map(d => `
    <article class="rec-card">
      <div class="rec-top">
        <div class="rec-top-avatar-wrap">
          <img src="${d.image}" alt="${d.name}" loading="lazy">
          <span class="rec-verified-dot"><i class="fa-solid fa-check"></i></span>
        </div>
        <div class="rec-top-meta">
          <h3>${d.name}</h3>
          <p class="rec-top-sub">${d.role} · ${d.experience}</p>
          <span class="tag">${d.specialty}</span>
        </div>
      </div>
      <div class="rec-meta">
        <div class="meta">
          <i class="fa-regular fa-calendar-check"></i>
          <span><b>Tue, Thu, Sat</b><br><small>10:00 AM - 02:00 PM</small></span>
        </div>
        <div class="meta">
          <i class="fa-solid fa-circle-dollar-to-slot"></i>
          <span><b>${d.price}</b><br><small>Starting fee</small></span>
        </div>
      </div>
      <button class="book" data-doctor="${d.name}">
        <i class="fa-solid fa-calendar-plus"></i>
        <span>Book Appointment</span>
      </button>
    </article>
  `).join("");
}

function renderAppointments() {
  const listContainer = $("appointmentList");
  if (!listContainer) return;

  listContainer.innerHTML = appointments.slice().sort((a, b) => a.date.localeCompare(b.date)).map(a => {
    const d = new Date(a.date + "T12:00:00");
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const num = d.getDate();
    return `
      <div class="appt" data-id="${a.id}" title="Click to view details">
        <div class="date">
          <small>${day}</small>
          <strong>${num}</strong>
        </div>
        <div class="appt-info">
          <h3>${a.doctor}</h3>
          <p>${a.time} · ${a.duration}</p>
          <span class="appt-type-pill">${a.specialty}</span>
        </div>
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    `;
  }).join("");

  if ($("emptyAppointments")) {
    $("emptyAppointments").classList.toggle("hidden", appointments.length > 0);
  }
  updateNavBadge();
}

function openModal(content) {
  $("modal").innerHTML = content;
  $("modalBackdrop").classList.remove("hidden");
}

function closeModal() {
  $("modalBackdrop").classList.add("hidden");
}

$("modalBackdrop").addEventListener("click", e => {
  if (e.target.id === "modalBackdrop") closeModal();
});

function bookDoctor(name) {
  const d = doctors.find(x => x.name === name) || doctors[0];
  const today = new Date().toISOString().slice(0, 10);
  openModal(`
    <div class="modal-head">
      <h3>Book Appointment</h3>
      <button class="close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-doctor">
      <img src="${d.image}" alt="${d.name}">
      <div>
        <h4>${d.name}</h4>
        <p>${d.specialty} · ${d.experience} experience · <b>${d.price}</b></p>
      </div>
    </div>
    <form class="modal-form" id="bookingForm">
      <label>
        Preferred Date
        <input id="bookDate" type="date" min="${today}" required>
      </label>
      <label>
        Available Slot
        <select id="bookTime">
          <option>09:00 AM - 09:30 AM</option>
          <option>10:00 AM - 10:30 AM</option>
          <option>11:30 AM - 12:00 PM</option>
          <option>02:00 PM - 02:30 PM</option>
          <option>04:30 PM - 05:00 PM</option>
        </select>
      </label>
      <label>
        Consultation Mode
        <select id="bookType">
          <option>HD Video Consultation (Recommended)</option>
          <option>Audio Call Consultation</option>
          <option>In-Person Hospital Visit</option>
        </select>
      </label>
      <div class="modal-actions">
        <button type="button" class="secondary-btn" id="cancelModal">Cancel</button>
        <button class="primary-btn" type="submit"><i class="fa-solid fa-check"></i> Confirm Appointment</button>
      </div>
    </form>
  `);

  $("closeModal").onclick = closeModal;
  $("cancelModal").onclick = closeModal;
  $("bookingForm").onsubmit = e => {
    e.preventDefault();
    const date = $("bookDate").value;
    if (!date) return;
    const timeVal = $("bookTime").value.split(" - ")[0];
    appointments.push({
      id: Date.now(),
      doctor: d.name,
      date,
      time: timeVal,
      duration: "30 min",
      specialty: d.specialty
    });
    saveAppointments();
    renderAppointments();
    renderCalendar();
    closeModal();
    showToast(`Appointment confirmed with ${d.name}!`);
  };
}

function appointmentDetails(id) {
  const a = appointments.find(x => x.id === id);
  if (!a) return;
  openModal(`
    <div class="modal-head">
      <h3>Appointment Details</h3>
      <button class="close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div style="background:#f8fafc;padding:16px;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:13px;">
      <div><span style="color:#64748b;font-size:11px;">DOCTOR</span><p style="font-weight:700;margin-top:2px;color:#0f172a;">${a.doctor}</p></div>
      <div><span style="color:#64748b;font-size:11px;">SPECIALTY</span><p style="font-weight:700;margin-top:2px;color:#0284c7;">${a.specialty}</p></div>
      <div><span style="color:#64748b;font-size:11px;">DATE</span><p style="font-weight:700;margin-top:2px;color:#0f172a;">${a.date}</p></div>
      <div><span style="color:#64748b;font-size:11px;">SCHEDULE</span><p style="font-weight:700;margin-top:2px;color:#0f172a;">${a.time} (${a.duration})</p></div>
    </div>
    <div class="modal-actions">
      <button class="secondary-btn" id="closeDetails">Close</button>
      <button class="danger-btn" id="cancelAppointment"><i class="fa-solid fa-trash-can"></i> Cancel Appointment</button>
    </div>
  `);
  $("closeModal").onclick = closeModal;
  $("closeDetails").onclick = closeModal;
  $("cancelAppointment").onclick = () => {
    appointments = appointments.filter(x => x.id !== id);
    saveAppointments();
    renderAppointments();
    renderCalendar();
    closeModal();
    showToast("Appointment successfully cancelled.");
  };
}

function renderCalendar() {
  const y = calendarDate.getFullYear(), m = calendarDate.getMonth();
  if ($("calendarTitle")) {
    $("calendarTitle").textContent = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), prevDays = new Date(y, m, 0).getDate();
  let cells = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(x => `<div class="calendar-cell head">${x}</div>`).join("");
  
  for (let i = 0; i < 42; i++) {
    let n = i - first + 1, day = n, muted = false;
    if (n < 1) { day = prevDays + n; muted = true; }
    else if (n > days) { day = n - days; muted = true; }
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    const events = !muted ? appointments.filter(a => a.date === iso) : [];
    const isToday = !muted && (new Date().toISOString().slice(0, 10) === iso);

    cells += `
      <div class="calendar-cell ${muted ? "muted" : ""} ${isToday ? "today" : ""}">
        <b>${day}</b>
        ${events.map(a => `<span class="calendar-event" data-id="${a.id}" title="${a.doctor}"><i class="fa-solid fa-clock"></i> ${a.time} · ${a.doctor.replace("Dr.", "")}</span>`).join("")}
      </div>
    `;
  }
  if ($("calendarGrid")) {
    $("calendarGrid").innerHTML = cells;
    $("calendarGrid").querySelectorAll(".calendar-event").forEach(e => {
      e.onclick = () => appointmentDetails(Number(e.dataset.id));
    });
  }
}

function showPage(page) {
  ["dashboard", "calendar", "profile", "help"].forEach(p => {
    const el = $(`${p}Page`);
    if (el) el.classList.toggle("hidden", p !== page);
  });
  document.querySelectorAll(".nav-item[data-page]").forEach(x => {
    x.classList.toggle("active", x.dataset.page === page);
  });
  const titles = {
    dashboard: `Welcome Back, ${($("profileName") && $("profileName").value) ? $("profileName").value.split(" ")[0] : "Stevan"}`,
    calendar: "Appointment Calendar",
    profile: "Patient Profile",
    help: "Help & Support Center"
  };
  if ($("pageTitle")) $("pageTitle").textContent = titles[page] || "Medinova";
  if (page === "calendar") renderCalendar();
}

// Navigation Events
document.querySelectorAll(".nav-item[data-page]").forEach(x => {
  x.onclick = () => showPage(x.dataset.page);
});

if ($("profileTop")) $("profileTop").onclick = () => showPage("profile");

// NextGen Collapsible Mini-Sidebar Controller
const sidebar = $("sidebar");
const sidebarToggle = $("sidebarToggle");

function isSidebarCollapsed() {
  return sidebar ? sidebar.classList.contains("collapsed") : false;
}

function setSidebarCollapsed(collapsed) {
  if (!sidebar) return;
  if (collapsed) {
    sidebar.classList.add("collapsed");
    document.body.classList.add("sidebar-collapsed");
    if (sidebarToggle) {
      sidebarToggle.setAttribute("data-tooltip", "Expand Sidebar");
      sidebarToggle.setAttribute("aria-label", "Expand sidebar");
    }
  } else {
    sidebar.classList.remove("collapsed");
    document.body.classList.remove("sidebar-collapsed");
    if (sidebarToggle) {
      sidebarToggle.setAttribute("data-tooltip", "Collapse Sidebar");
      sidebarToggle.setAttribute("aria-label", "Collapse sidebar");
    }
  }
  hideSidebarTooltip(true);
  localStorage.setItem("medinovaSidebarCollapsed", collapsed ? "true" : "false");
}

function toggleSidebar() {
  if (!sidebar) return;
  setSidebarCollapsed(!isSidebarCollapsed());
}

if (sidebarToggle) {
  sidebarToggle.onclick = (e) => {
    e.stopPropagation();
    toggleSidebar();
  };
}

// Restore saved sidebar collapsed state
const savedSidebarState = localStorage.getItem("medinovaSidebarCollapsed");
if (savedSidebarState !== null) {
  setSidebarCollapsed(savedSidebarState === "true");
} else if (window.innerWidth <= 900) {
  setSidebarCollapsed(true);
}

// NextGen Floating Tooltip Engine for Sidebar Icons
const tooltipEl = document.createElement("div");
tooltipEl.className = "sidebar-floating-tooltip";
tooltipEl.id = "sidebarFloatingTooltip";
document.body.appendChild(tooltipEl);

let tooltipTimer = null;

function showSidebarTooltip(el) {
  // If sidebar is expanded on desktop and the element is not the toggle button, skip
  if (!isSidebarCollapsed() && el !== sidebarToggle && window.innerWidth > 900) {
    hideSidebarTooltip(true);
    return;
  }
  
  const text = el.getAttribute("data-tooltip");
  if (!text) return;

  clearTimeout(tooltipTimer);

  // If element has a notification badge (e.g. Calendar), display it cleanly inside tooltip
  const badge = el.querySelector(".nav-badge");
  if (badge && badge.textContent.trim()) {
    tooltipEl.innerHTML = `<span>${text}</span> <span style="background:rgba(56,189,248,0.22);color:#38bdf8;padding:1px 6px;border-radius:99px;font-size:11px;font-weight:700;">${badge.textContent.trim()}</span>`;
  } else {
    tooltipEl.textContent = text;
  }

  const rect = el.getBoundingClientRect();
  const top = rect.top + rect.height / 2;
  const left = rect.right + 12;

  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.left = `${left}px`;
  tooltipEl.classList.add("show");
}

function hideSidebarTooltip(immediate = false) {
  clearTimeout(tooltipTimer);
  if (immediate) {
    tooltipEl.classList.remove("show");
  } else {
    tooltipTimer = setTimeout(() => {
      tooltipEl.classList.remove("show");
    }, 60);
  }
}

// Bind tooltip listeners to all side panel elements with data-tooltip
document.querySelectorAll("#sidebar [data-tooltip]").forEach(el => {
  el.addEventListener("mouseenter", () => showSidebarTooltip(el));
  el.addEventListener("mouseleave", () => hideSidebarTooltip());
  
  // When clicked: briefly display and then gracefully fade away
  el.addEventListener("click", () => {
    showSidebarTooltip(el);
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => hideSidebarTooltip(true), 900);
  });
});

// Search & Filter Events
if ($("searchBtn")) {
  $("searchBtn").onclick = () => {
    renderNearby();
    showPage("dashboard");
    const val = $("doctorSearch").value.trim();
    showToast(val ? `Searching for "${val}"` : "Showing all nearby doctors");
  };
}

if ($("doctorSearch")) $("doctorSearch").addEventListener("input", renderNearby);
if ($("specialtyFilter")) $("specialtyFilter").onchange = renderNearby;
if ($("clearFilters")) {
  $("clearFilters").onclick = () => {
    if ($("doctorSearch")) $("doctorSearch").value = "";
    if ($("specialtyFilter")) $("specialtyFilter").value = "all";
    renderNearby();
    showToast("Filters reset");
  };
}

// Location detection
if ($("locationBtn")) {
  $("locationBtn").onclick = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser");
      return;
    }
    showToast("Detecting current coordinates...");
    navigator.geolocation.getCurrentPosition(
      p => {
        if ($("locationInput")) $("locationInput").value = "New York, NY (Detected)";
        showToast("Location updated to your area");
      },
      () => {
        if ($("locationInput")) $("locationInput").value = "Manhattan, NY";
        showToast("Set default area: Manhattan, NY");
      }
    );
  };
}

if ($("nearbyViewAll")) {
  $("nearbyViewAll").onclick = e => {
    e.preventDefault();
    if ($("specialtyFilter")) $("specialtyFilter").value = "all";
    if ($("doctorSearch")) $("doctorSearch").value = "";
    renderNearby();
    showToast("Displaying all available doctors");
  };
}

if ($("recommendedViewAll")) {
  $("recommendedViewAll").onclick = e => {
    e.preventDefault();
    showPage("dashboard");
    const recEl = document.querySelector(".recommended");
    if (recEl) recEl.scrollIntoView({ behavior: "smooth" });
  };
}

if ($("appointmentsViewAll")) {
  $("appointmentsViewAll").onclick = e => {
    e.preventDefault();
    showPage("calendar");
  };
}

if ($("appointmentList")) {
  $("appointmentList").onclick = e => {
    const item = e.target.closest(".appt");
    if (item) appointmentDetails(Number(item.dataset.id));
  };
}

document.addEventListener("click", e => {
  const b = e.target.closest(".book");
  if (b) bookDoctor(b.dataset.doctor);
});

// Hero Buttons
if ($("heroConsultBtn")) {
  $("heroConsultBtn").onclick = () => bookDoctor("Dr. Aline Carvalho");
}

if ($("heroFindBtn")) {
  $("heroFindBtn").onclick = () => {
    const s = $("doctorSearch");
    if (s) {
      s.focus();
      s.scrollIntoView({ behavior: "smooth" });
    }
  };
}

if ($("emptyBookBtn")) {
  $("emptyBookBtn").onclick = () => bookDoctor("Dr. Amanda Clara");
}

// Month Navigation
if ($("prevMonth")) $("prevMonth").onclick = () => showToast("Switched to previous period");
if ($("nextMonth")) $("nextMonth").onclick = () => showToast("Switched to next period");

// Calendar Controls
if ($("calPrev")) {
  $("calPrev").onclick = () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  };
}
if ($("calNext")) {
  $("calNext").onclick = () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  };
}
if ($("calToday")) {
  $("calToday").onclick = () => {
    calendarDate = new Date();
    renderCalendar();
  };
}
if ($("calendarBookBtn")) {
  $("calendarBookBtn").onclick = () => bookDoctor("Dr. Amanda Clara");
}

// Profile Save
if ($("saveProfile")) {
  $("saveProfile").onclick = () => {
    const name = $("profileName").value;
    const email = $("profileEmail").value;
    const phone = $("profilePhone").value;
    const location = $("profileLocation").value;

    localStorage.setItem("medinovaProfile", JSON.stringify({ name, email, phone, location }));
    if ($("topbarUserName")) $("topbarUserName").textContent = name;
    showToast("Profile details saved successfully!");
  };
}

// Support Form
if ($("supportForm")) {
  $("supportForm").onsubmit = e => {
    e.preventDefault();
    e.target.reset();
    showToast("Support ticket submitted. A health agent will reply shortly.");
  };
}

// Topbar Actions
if ($("notificationBtn")) {
  $("notificationBtn").onclick = () => {
    showToast(appointments.length ? `You have ${appointments.length} active consultation${appointments.length > 1 ? "s" : ""}` : "No unread notifications");
  };
}

if ($("languageBtn")) {
  $("languageBtn").onclick = () => showToast("Language: English (US)");
}

// Native Fullscreen API Toggle
const fsBtn = $("fullscreenBtn");
if (fsBtn) {
  fsBtn.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast("Fullscreen mode could not be opened"));
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };
  document.addEventListener("fullscreenchange", () => {
    const isFs = !!document.fullscreenElement;
    fsBtn.innerHTML = isFs ? '<i class="fa-solid fa-compress"></i>' : '<i class="fa-solid fa-expand"></i>';
    fsBtn.title = isFs ? "Exit Fullscreen" : "Toggle Fullscreen";
    showToast(isFs ? "Entered Fullscreen mode" : "Exited Fullscreen mode");
  });
}

// Pro Modal
function openProModal() {
  openModal(`
    <div class="modal-head">
      <h3>Medinova Pro Health Plan</h3>
      <button class="close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div style="text-align:center;padding:12px 0 20px;">
      <div style="width:58px;height:58px;background:linear-gradient(135deg,#0284c7,#06b6d4);color:#fff;border-radius:16px;display:grid;place-items:center;font-size:26px;margin:0 auto 14px;box-shadow:0 8px 20px rgba(2,132,199,0.3);">
        <i class="fa-solid fa-bolt"></i>
      </div>
      <h4 style="font-size:18px;font-weight:800;color:#0f172a;">Upgrade to Medinova AI+</h4>
      <p style="font-size:13px;line-height:1.6;color:#64748b;margin-top:6px;max-width:380px;margin-left:auto;margin-right:auto;">
        Get 24/7 priority access to world-class doctors, automated AI lab reports triage, and unlimited video consultations.
      </p>
    </div>
    <div class="modal-actions" style="justify-content:center;">
      <button class="primary-btn" id="upgradeBtn" style="width:100%;"><i class="fa-solid fa-crown"></i> Activate Pro Trial (Free 30 Days)</button>
    </div>
  `);
  $("closeModal").onclick = closeModal;
  $("upgradeBtn").onclick = () => {
    closeModal();
    showToast("Medinova Pro trial activated!");
  };
}

if ($("proBtn")) $("proBtn").onclick = openProModal;
if ($("proMiniBtn")) {
  $("proMiniBtn").onclick = (e) => {
    e.stopPropagation();
    openProModal();
  };
}
if ($("proCard")) {
  $("proCard").onclick = (e) => {
    if (isSidebarCollapsed()) {
      e.stopPropagation();
      openProModal();
    }
  };
}

// Logout Modal
if ($("logoutBtn")) {
  $("logoutBtn").onclick = () => {
    openModal(`
      <div class="modal-head">
        <h3>Sign out of Medinova?</h3>
        <button class="close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p style="font-size:13px;color:#64748b;line-height:1.6;">Are you sure you want to end your current Medinova session?</p>
      <div class="modal-actions">
        <button class="secondary-btn" id="closeLogout">Cancel</button>
        <button class="danger-btn" id="confirmLogout">Sign Out</button>
      </div>
    `);
    $("closeModal").onclick = closeModal;
    $("closeLogout").onclick = closeModal;
    $("confirmLogout").onclick = () => {
      closeModal();
      showToast("Signed out of Medinova demo");
    };
  };
}

// Initial profile load
const savedProfile = JSON.parse(localStorage.getItem("medinovaProfile") || localStorage.getItem("healthaiProfile") || "null");
if (savedProfile) {
  if ($("profileName")) $("profileName").value = savedProfile.name || $("profileName").value;
  if ($("profileEmail")) $("profileEmail").value = savedProfile.email || $("profileEmail").value;
  if ($("profilePhone")) $("profilePhone").value = savedProfile.phone || $("profilePhone").value;
  if ($("profileLocation")) $("profileLocation").value = savedProfile.location || $("profileLocation").value;
  if ($("topbarUserName") && savedProfile.name) $("topbarUserName").textContent = savedProfile.name;
}

// Initial Rendering
renderNearby();
renderRecommended();
renderAppointments();
renderCalendar();
updateNavBadge();