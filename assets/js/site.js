(function () {
  const catalog = window.LEARN_CATALOG || { topics: [], presentations: [] };
  const DEFAULT_SORT = "updated-desc";
  const DEFAULT_PAGE_SIZE = 20;

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

  function parseCatalogDate(value) {
    const time = new Date(`${value || ""}T00:00:00`).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function normalized(value) {
    return String(value || "").toLowerCase();
  }

  function stateFromHash() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return {
      tag: params.get("tag") || "",
      query: params.get("q") || "",
      sort: params.get("sort") || DEFAULT_SORT,
      page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
      pageSize: Math.max(1, Number.parseInt(params.get("perPage") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
    };
  }

  function writeState(next) {
    const state = { ...stateFromHash(), ...next };
    const params = new URLSearchParams();
    if (state.tag) params.set("tag", state.tag);
    if (state.query) params.set("q", state.query);
    if (state.sort && state.sort !== DEFAULT_SORT) params.set("sort", state.sort);
    if (state.page > 1) params.set("page", String(state.page));
    if (state.pageSize !== DEFAULT_PAGE_SIZE) params.set("perPage", String(state.pageSize));
    const hash = params.toString();
    if (hash) {
      if (window.location.hash.replace(/^#/, "") === hash) {
        renderCatalogViews();
      } else {
        window.location.hash = hash;
      }
    } else {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      renderCatalogViews();
    }
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

  function presentationSearchText(presentation) {
    const topic = presentationTopic(presentation);
    return normalized(
      [
        presentation.title,
        presentation.subtitle,
        presentation.summary,
        topic?.title,
        ...(presentation.covers || []),
        ...(presentation.learningGoals || []),
        ...(presentation.tags || []).flatMap((tag) => [tag.slug, tag.label]),
      ].join(" "),
    );
  }

  function matchesQuery(presentation, query) {
    if (!query) return true;
    return query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .every((term) => presentationSearchText(presentation).includes(term));
  }

  function sortPresentations(presentations, sort) {
    const sorted = [...presentations];
    sorted.sort((a, b) => {
      if (sort === "updated-asc") {
        return parseCatalogDate(a.lastUpdated) - parseCatalogDate(b.lastUpdated) || a.title.localeCompare(b.title);
      }
      if (sort === "title-asc") {
        return a.title.localeCompare(b.title) || parseCatalogDate(b.lastUpdated) - parseCatalogDate(a.lastUpdated);
      }
      if (sort === "topic-asc") {
        const topicCompare = (presentationTopic(a)?.title || "").localeCompare(presentationTopic(b)?.title || "");
        return topicCompare || a.title.localeCompare(b.title);
      }
      if (sort === "duration-desc") {
        return (b.durationMinutes || 0) - (a.durationMinutes || 0) || a.title.localeCompare(b.title);
      }
      return parseCatalogDate(b.lastUpdated) - parseCatalogDate(a.lastUpdated) || a.title.localeCompare(b.title);
    });
    return sorted;
  }

  function pageItems(items, page, pageSize) {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const activePage = Math.min(page, totalPages);
    const start = (activePage - 1) * pageSize;
    return {
      activePage,
      totalPages,
      items: items.slice(start, start + pageSize),
    };
  }

  function syncControls(container, state) {
    if (!container) return;
    const search = container.querySelector("[data-catalog-search]");
    const sort = container.querySelector("[data-catalog-sort]");
    const pageSize = container.querySelector("[data-catalog-page-size]");
    if (search && search.value !== state.query) search.value = state.query;
    if (sort && sort.value !== state.sort) sort.value = state.sort;
    if (pageSize && pageSize.value !== String(state.pageSize)) pageSize.value = String(state.pageSize);
  }

  function renderPagination(container, activePage, totalPages) {
    if (!container) return;
    if (totalPages <= 1) {
      container.replaceChildren();
      return;
    }
    const makeButton = (label, page, options = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `page-button${options.active ? " is-active" : ""}`;
      button.dataset.page = String(page);
      button.textContent = label;
      if (options.disabled) button.disabled = true;
      if (options.label) button.setAttribute("aria-label", options.label);
      return button;
    };
    const buttons = [
      makeButton("Previous", Math.max(1, activePage - 1), {
        disabled: activePage === 1,
        label: "Previous page",
      }),
    ];
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - activePage) <= 1) {
        buttons.push(makeButton(String(page), page, { active: page === activePage, label: `Page ${page}` }));
      } else if (buttons[buttons.length - 1]?.textContent !== "...") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "page-ellipsis";
        ellipsis.textContent = "...";
        buttons.push(ellipsis);
      }
    }
    buttons.push(
      makeButton("Next", Math.min(totalPages, activePage + 1), {
        disabled: activePage === totalPages,
        label: "Next page",
      }),
    );
    container.replaceChildren(...buttons);
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
    if (!presentations.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No presentations match the current filters.";
      container.replaceChildren(empty);
      return;
    }
    container.replaceChildren(...presentations.map(presentationCard));
  }

  function currentTag() {
    return stateFromHash().tag;
  }

  function setTag(tag) {
    writeState({ tag, page: 1 });
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
  }

  function updateTagFilterState() {
    const tag = currentTag();
    document.querySelectorAll("[data-tag-filter] .tag-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tag === tag);
    });
  }

  function labelText(total, filtered, activePage, totalPages, state, tagLabel, baseLabel) {
    const pieces = [`${filtered} of ${total} ${filtered === 1 ? "presentation" : "presentations"}`];
    if (state.query) pieces.push(`matching "${state.query}"`);
    if (tagLabel) pieces.push(`tagged ${tagLabel}`);
    if (filtered > state.pageSize) pieces.push(`page ${activePage} of ${totalPages}`);
    return `${baseLabel}: ${pieces.join(", ")}`;
  }

  function renderCatalogList(config) {
    const state = stateFromHash();
    const source = config.presentations();
    const tagLabel = config.enableTags ? uniqueTags().find((item) => item.slug === state.tag)?.label || "" : "";
    const filtered = sortPresentations(
      source.filter((presentation) => {
        const tagMatch = !config.enableTags || !state.tag || presentation.tags.some((tag) => tag.slug === state.tag);
        return tagMatch && matchesQuery(presentation, state.query);
      }),
      state.sort,
    );
    const page = pageItems(filtered, state.page, state.pageSize);
    syncControls(document.querySelector(config.controlsSelector), state);
    renderPresentationList(page.items, config.listSelector);
    renderPagination(document.querySelector(config.paginationSelector), page.activePage, page.totalPages);
    const label = document.querySelector(config.labelSelector);
    if (label) {
      label.textContent = labelText(source.length, filtered.length, page.activePage, page.totalPages, state, tagLabel, config.label);
    }
  }

  function renderCatalogViews() {
    renderTagFilter();
    updateTagFilterState();
    renderCatalogList({
      presentations: () => catalog.presentations,
      listSelector: "[data-presentation-list]",
      controlsSelector: "[data-catalog-controls]",
      paginationSelector: "[data-pagination]",
      labelSelector: "[data-filter-label]",
      label: "Showing",
      enableTags: true,
    });

    const topicPage = document.querySelector("[data-topic-id]");
    if (topicPage) {
      const topicId = topicPage.dataset.topicId;
      renderCatalogList({
        presentations: () => byTopic(topicId),
        listSelector: "[data-topic-presentation-list]",
        controlsSelector: "[data-topic-catalog-controls]",
        paginationSelector: "[data-topic-pagination]",
        labelSelector: "[data-topic-filter-label]",
        label: "Topic decks",
        enableTags: false,
      });
    }
  }

  function wireCatalogControls(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    const search = container.querySelector("[data-catalog-search]");
    const sort = container.querySelector("[data-catalog-sort]");
    const pageSize = container.querySelector("[data-catalog-page-size]");
    if (search) {
      search.addEventListener("input", () => writeState({ query: search.value.trim(), page: 1 }));
    }
    if (sort) {
      sort.addEventListener("change", () => writeState({ sort: sort.value, page: 1 }));
    }
    if (pageSize) {
      pageSize.addEventListener("change", () => writeState({ pageSize: Number.parseInt(pageSize.value, 10), page: 1 }));
    }
  }

  function wirePagination(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button || button.disabled) return;
      writeState({ page: Number.parseInt(button.dataset.page, 10) || 1 });
    });
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
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderTopicCards();
    renderTopicPage();
    wireCatalogControls("[data-catalog-controls]");
    wireCatalogControls("[data-topic-catalog-controls]");
    wirePagination("[data-pagination]");
    wirePagination("[data-topic-pagination]");
    const tagFilter = document.querySelector("[data-tag-filter]");
    if (tagFilter) {
      tagFilter.addEventListener("click", (event) => {
        const button = event.target.closest("[data-tag]");
        if (!button) return;
        setTag(button.dataset.tag);
      });
    }
    renderCatalogViews();
    window.addEventListener("hashchange", () => {
      renderCatalogViews();
    });
  });
})();
