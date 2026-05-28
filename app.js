/**
 * @typedef {Object} Team
 * @property {string} name
 * @property {number|null} score - null cuando el partido aún no empezó.
 *
 * @typedef {Object} Match
 * @property {string} sport
 * @property {"live"|"final"|"upcoming"} status
 * @property {string} league
 * @property {string} time - Minuto en vivo, "Final" o la hora de inicio.
 * @property {Team} home
 * @property {Team} away
 */

/** @type {Match[]} */
const matches = [
  {
    sport: "Fútbol",
    status: "live",
    league: "Liga Profesional",
    time: "65'",
    home: { name: "River Plate", score: 2 },
    away: { name: "Boca Juniors", score: 1 },
  },
  {
    sport: "Fútbol",
    status: "final",
    league: "LaLiga",
    time: "Final",
    home: { name: "Real Madrid", score: 3 },
    away: { name: "Barcelona", score: 3 },
  },
  {
    sport: "Fútbol",
    status: "upcoming",
    league: "Premier League",
    time: "21:00",
    home: { name: "Liverpool", score: null },
    away: { name: "Manchester City", score: null },
  },
  {
    sport: "Básquet",
    status: "live",
    league: "NBA",
    time: "3er cuarto",
    home: { name: "Lakers", score: 88 },
    away: { name: "Celtics", score: 91 },
  },
  {
    sport: "Básquet",
    status: "final",
    league: "NBA",
    time: "Final",
    home: { name: "Warriors", score: 102 },
    away: { name: "Bulls", score: 97 },
  },
  {
    sport: "Tenis",
    status: "live",
    league: "ATP Masters",
    time: "Set 3",
    home: { name: "Djokovic", score: 2 },
    away: { name: "Alcaraz", score: 1 },
  },
  {
    sport: "Tenis",
    status: "final",
    league: "ATP Masters",
    time: "Final",
    home: { name: "Sinner", score: 3 },
    away: { name: "Medvedev", score: 0 },
  },
  {
    sport: "Tenis",
    status: "upcoming",
    league: "Roland Garros",
    time: "16:30",
    home: { name: "Zverev", score: null },
    away: { name: "Ruud", score: null },
  },
];

const grid = document.getElementById("scores-grid");
const lastUpdated = document.getElementById("last-updated");
const navButtons = document.querySelectorAll(".nav__btn");

let currentFilter = "all";

/**
 * Cuántos puntos suma un equipo en una jugada según el deporte.
 * @param {string} sport
 * @returns {number}
 */
function pointsForSport(sport) {
  if (sport === "Básquet") return Math.random() < 0.5 ? 2 : 3;
  return 1;
}

/**
 * @param {Match[]} list
 */
function renderStats(list) {
  const total = list.length;
  const live = list.filter((m) => m.status === "live").length;
  const points = list.reduce(
    (sum, m) => sum + (m.home.score ?? 0) + (m.away.score ?? 0),
    0
  );

  document.getElementById("stat-matches").textContent = total;
  document.getElementById("stat-live").textContent = live;
  document.getElementById("stat-goals").textContent = points;
}

/**
 * @param {Team} team
 * @param {boolean} isWinner
 */
function teamRow(team, isWinner) {
  const score = team.score === null ? "—" : team.score;
  return `
    <div class="team ${isWinner ? "is-winner" : ""}">
      <span class="team__name">${team.name}</span>
      <span class="team__score">${score}</span>
    </div>`;
}

/**
 * @param {Match} match
 */
function matchCard(match) {
  const hasScores = match.home.score !== null && match.away.score !== null;
  const homeWins = hasScores && match.home.score > match.away.score;
  const awayWins = hasScores && match.away.score > match.home.score;
  const isLive = match.status === "live";

  return `
    <article class="match-card">
      <div class="match-card__top">
        <span class="match-card__sport">${match.sport}</span>
        <span class="match-card__status ${isLive ? "is-live" : ""}">${match.time}</span>
      </div>
      <span class="match-card__league">${match.league}</span>
      ${teamRow(match.home, homeWins)}
      <div class="match-card__divider"></div>
      ${teamRow(match.away, awayWins)}
    </article>`;
}

/**
 * Texto "Actualizado hh:mm:ss".
 */
function renderTimestamp() {
  const now = new Date();
  lastUpdated.textContent = `Actualizado ${now.toLocaleTimeString("es-ES")}`;
}

/**
 * @param {string} [filter]
 */
function render(filter = currentFilter) {
  currentFilter = filter;
  const list =
    filter === "all" ? matches : matches.filter((m) => m.sport === filter);

  if (list.length === 0) {
    grid.innerHTML = `<p class="scores__empty">No hay partidos para este deporte.</p>`;
  } else {
    grid.innerHTML = list.map(matchCard).join("");
  }

  renderStats(list);
  renderTimestamp();
}

/**
 * Simula el avance de los partidos en vivo: suma puntos a uno al azar.
 */
function tickLiveMatches() {
  const liveMatches = matches.filter((m) => m.status === "live");
  if (liveMatches.length === 0) return;

  const match = liveMatches[Math.floor(Math.random() * liveMatches.length)];
  const side = Math.random() < 0.5 ? match.home : match.away;
  side.score += pointsForSport(match.sport);

  render();
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    render(btn.dataset.sport);
  });
});

render();
setInterval(tickLiveMatches, 5000);
