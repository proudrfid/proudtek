/**
 * Shared drawer-toggle script body for HubRail / GroupedHubRail.
 *
 * Both rail variants emit the same inline IIFE so the rail panel can open/close
 * on mobile. Keeping the script body as a literal string (and emitting via
 * `<script is:inline set:html={RAIL_DRAWER_SCRIPT}>`) preserves byte parity
 * with the TS template-literal renderers (which inline the exact same body).
 *
 * Format note: leading whitespace and newlines are intentional — they match
 * the TS source's indentation so parity normalization holds without extra
 * collapse rules.
 */
export const RAIL_DRAWER_SCRIPT = `
    (function(){
      var rail = document.getElementById('codex-catalog-rail-panel');
      var toggle = document.querySelector('.codex-catalog-rail-toggle');
      var backdrop = document.querySelector('.codex-catalog-rail-backdrop');
      var closeBtn = rail ? rail.querySelector('.codex-catalog-rail__close') : null;
      if (!rail) return;

      function openRail(){
        rail.classList.add('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.hidden = false;
        document.body.classList.add('codex-catalog-rail-locked');
      }
      function closeRail(){
        rail.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.hidden = true;
        document.body.classList.remove('codex-catalog-rail-locked');
      }
      if (toggle) toggle.addEventListener('click', function(){
        if (rail.classList.contains('is-open')) closeRail(); else openRail();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRail);
      if (backdrop) backdrop.addEventListener('click', closeRail);
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && rail.classList.contains('is-open')) closeRail();
      });
    })();
    `;
