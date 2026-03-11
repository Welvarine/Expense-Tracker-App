/**
 * renderer.js
 * Converts FLOWS data into interactive HTML nodes inside each section's
 * .flow-container div. Handles: screens, decisions, errors, successes,
 * toasts, actions, connectors, phase-separators, and nested branches.
 */

/* ─────────────────────────────────────────────────────────────── */
/*  Helpers                                                        */
/* ─────────────────────────────────────────────────────────────── */

function makeCard(node) {
  const wrap = document.createElement('div');
  wrap.className = 'flow-node';

  const card = document.createElement('div');
  card.className = `node-card ${node.type}`;
  if (node.id) card.id = node.id;

  if (node.type === 'decision') {
    // Diamond — only label inside
    card.innerHTML = `<span class="node-label">${node.icon ? node.icon + ' ' : ''}${node.label}</span>`;
  } else {
    card.innerHTML =
      `<span class="node-label">${node.icon ? `<span class="node-icon">${node.icon}</span>` : ''}${node.label}</span>` +
      (node.sub ? `<div class="node-sub">${node.sub}</div>` : '');
  }

  wrap.appendChild(card);
  return wrap;
}

function makeConnector(opts = {}) {
  const div = document.createElement('div');
  div.className = 'connector';
  div.style.width = '100%';

  const top = document.createElement('div');
  top.className = 'connector-line';
  top.style.minHeight = '12px';
  div.appendChild(top);

  if (opts.label) {
    const lbl = document.createElement('span');
    lbl.className = `connector-label${opts.style ? ' ' + opts.style : ''}`;
    lbl.textContent = opts.label;
    div.appendChild(lbl);
    const bot = document.createElement('div');
    bot.className = 'connector-line';
    bot.style.minHeight = '12px';
    div.appendChild(bot);
  }

  const arrow = document.createElement('div');
  arrow.className = 'connector-arrow';
  div.appendChild(arrow);

  return div;
}

function makePhase(label) {
  const div = document.createElement('div');
  div.className = 'phase-label';
  div.innerHTML = `<span>${label}</span>`;
  return div;
}

/* ─────────────────────────────────────────────────────────────── */
/*  Recursive renderer                                             */
/* ─────────────────────────────────────────────────────────────── */

function renderNodes(nodes, container) {
  for (const node of nodes) {
    /* Phase label */
    if (node.phase) {
      container.appendChild(makePhase(node.phase));
      continue;
    }

    /* Connector */
    if (node.connector) {
      container.appendChild(makeConnector({ label: node.label, style: node.style }));
      continue;
    }

    /* Branch (two columns) */
    if (node.branch) {
      const block = document.createElement('div');
      block.className = 'branch-block';
      block.style.width = '100%';

      ['yes', 'no'].forEach(side => {
        const col = document.createElement('div');
        col.className = 'branch-col';

        const hdr = document.createElement('div');
        hdr.className = `branch-header ${side}`;
        hdr.textContent = side === 'yes' ? '✅ Yes' : '❌ No';
        col.appendChild(hdr);

        renderNodes(node[side], col);
        block.appendChild(col);
      });

      container.appendChild(block);
      continue;
    }

    /* Regular card */
    container.appendChild(makeCard(node));

    /* If this is a decision node, add a small connector arrow below
       so visually the diamond leads into the branch-block */
    if (node.type === 'decision') {
      container.appendChild(makeConnector());
    }
  }
}

/* ─────────────────────────────────────────────────────────────── */
/*  Bootstrap                                                      */
/* ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* Render flows */
  const targets = {
    'onboarding-flow':       window.FLOWS.onboarding,
    'add-transaction-flow':  window.FLOWS.addTransaction,
    'management-flow':       window.FLOWS.management,
  };

  for (const [id, nodes] of Object.entries(targets)) {
    const container = document.getElementById(id);
    if (container) renderNodes(nodes, container);
  }

  /* Tab switching */
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.diagram-section');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabs.forEach(t => {
        t.classList.toggle('active', t === btn);
        t.setAttribute('aria-selected', t === btn ? 'true' : 'false');
      });

      sections.forEach(s => {
        s.classList.toggle('active', s.id === target);
      });
    });
  });
});
