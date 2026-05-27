(function () {
  const catalog = window.LEARN_CATALOG || { topics: [], presentations: [] };

  function byTopic(topicId) {
    return catalog.presentations.filter((presentation) => presentation.topicId === topicId);
  }

  function uniqueTags() {
    const tags = new Map();
    catalog.presentations.forEach((presentation) => {
      presentation.tags.forEach((tag) => tags.set(tag.slug, tag));
    });
    return Array.from(tags.values()).sort((a, b) => a.label.localeCompare(b.label));
  }

  function presentationTopic(presentation) {
    return catalog.topics.find((topic) => topic.id === presentation.topicId);
  }

  function rootPath() {
    return document.body.dataset.root || "";
  }

  function formatDuration(presentation) {
    return `${presentation.durationMinutes} min / ${presentation.slideCount} slides`;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function tagButton(tag, activeTag) {
    const button = document.createElement("button");
    button.className = `tag-button${activeTag === tag.slug ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.tag = tag.slug;
    button.textContent = tag.label;
    return button;
  }

  function tagChip(tag) {
    const span = document.createElement("span");
    span.className = "tag-chip";
    span.textContent = tag.label;
    return span;
  }

  function presentationCard(presentation) {
    const topic = presentationTopic(presentation);
    const article = document.createElement("article");
    article.className = "presentation-card";
    article.dataset.tags = presentation.tags.map((tag) => tag.slug).join(" ");

    const href = document.createElement("a");
    href.className = "presentation-link";
    href.href = `${rootPath()}${presentation.path}`;
    href.setAttribute("aria-label", `Open ${presentation.title}`);

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = topic ? topic.title : "Presentation";

    const title = document.createElement("h3");
    title.textContent = presentation.title;

    const subtitle = document.createElement("p");
    subtitle.className = "subtitle";
    subtitle.textContent = presentation.subtitle;

    const summary = document.createElement("p");
    summary.className = "summary";
    summary.textContent = presentation.summary;

    const meta = document.createElement("p");
    meta.className = "meta-line";
    meta.textContent = formatDuration(presentation);

    const updated = document.createElement("p");
    updated.className = "updated-line";
    updated.textContent = `Updated ${formatDate(presentation.lastUpdated)}`;

    const intro = document.createElement("div");
    intro.className = "presentation-intro";

    const body = document.createElement("div");
    body.className = "presentation-body";

    const goals = document.createElement("div");
    goals.className = "learning-goals";
    const goalsTitle = document.createElement("strong");
    goalsTitle.textContent = "Learning goals";
    const goalsList = document.createElement("ul");
    presentation.learningGoals.forEach((goal) => {
      const li = document.createElement("li");
      li.textContent = goal;
      goalsList.appendChild(li);
    });
    goals.append(goalsTitle, goalsList);

    const tags = document.createElement("div");
    tags.className = "tag-row";
    presentation.tags.forEach((tag) => tags.appendChild(tagChip(tag)));

    intro.append(eyebrow, title, subtitle, meta, updated);
    body.append(summary, goals);
    href.append(intro, body, tags);
    article.appendChild(href);
    return article;
  }

  function renderTopicCards() {
    const container = document.querySelector("[data-topic-list]");
    if (!container) return;
    container.replaceChildren(
      ...catalog.topics.map((topic) => {
        const card = document.createElement("article");
        card.className = "topic-card";
        const count = byTopic(topic.id).length;
        card.innerHTML = `
          <a href="${rootPath()}topics/${topic.id}/">
            <p class="eyebrow">${count} presentation${count === 1 ? "" : "s"}</p>
            <h3>${topic.title}</h3>
            <p>${topic.summary}</p>
          </a>
        `;
        return card;
      }),
    );
  }

  function renderPresentationList(presentations, selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.replaceChildren(...presentations.map(presentationCard));
  }

  function currentTag() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return params.get("tag") || "";
  }

  function setTag(tag) {
    if (tag) {
      window.location.hash = new URLSearchParams({ tag }).toString();
    } else {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      applyTagFilter();
    }
  }

  function renderTagFilter() {
    const container = document.querySelector("[data-tag-filter]");
    if (!container) return;
    const activeTag = currentTag();
    const all = document.createElement("button");
    all.className = `tag-button${activeTag ? "" : " is-active"}`;
    all.type = "button";
    all.textContent = "All";
    all.dataset.tag = "";
    container.replaceChildren(all, ...uniqueTags().map((tag) => tagButton(tag, activeTag)));
    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tag]");
      if (!button) return;
      setTag(button.dataset.tag);
    });
  }

  function applyTagFilter() {
    const tag = currentTag();
    document.querySelectorAll("[data-presentation-list] .presentation-card").forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.hidden = Boolean(tag) && !tags.includes(tag);
    });
    document.querySelectorAll("[data-tag-filter] .tag-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tag === tag);
    });
    const label = document.querySelector("[data-filter-label]");
    if (label) {
      const match = uniqueTags().find((item) => item.slug === tag);
      label.textContent = match ? `Showing presentations tagged ${match.label}` : "Showing all presentations";
    }
  }

  function renderTopicPage() {
    const page = document.querySelector("[data-topic-id]");
    if (!page) return;
    const topicId = page.dataset.topicId;
    const topic = catalog.topics.find((item) => item.id === topicId);
    if (!topic) return;
    document.querySelectorAll("[data-topic-title]").forEach((node) => {
      node.textContent = topic.title;
    });
    document.querySelectorAll("[data-topic-summary]").forEach((node) => {
      node.textContent = topic.summary;
    });
    renderPresentationList(byTopic(topicId), "[data-topic-presentation-list]");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderTopicCards();
    renderPresentationList(catalog.presentations, "[data-presentation-list]");
    renderTagFilter();
    renderTopicPage();
    applyTagFilter();
    window.addEventListener("hashchange", () => {
      renderTagFilter();
      applyTagFilter();
    });
  });
})();
