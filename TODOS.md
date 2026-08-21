# TODOs

## P1 — Integrate native-safe head policy

**What:** Connect the Phase 0 classifier and deterministic inventory to the Phase 1 `HeadPolicy` / `NativeHeadAssets` path, then enable native-safe head assets for `/blog/` behind `PROUDTEK_NATIVE_SHELL`.

**Why:** Phase 0 only inventories donor head assets. Without this follow-up, native pages continue carrying donor shell CSS and the repeated deployment-level style-isolation debugging remains possible.

**Pros:** Removes donor/native cascade coupling, gives new native pages a safe default, and reuses the shared pure classifier instead of creating page-specific filters.

**Cons:** Requires explicit font ownership, native base/content asset validation, dual-build SEO/head contracts, and browser verification before production rollout.

**Context:** Approved design: `~/.gstack/projects/proudrfid-proudtek/zhangping-main-design-20260820-000000.md`. Phase 0 must pass first: deterministic `/blog/` inventory, parser failure matrix, zero-output integration harness, legacy contract equivalence, and cache repeatability. Phase 1 must keep `PROUDTEK_NATIVE_SHELL=0` as a hard legacy-head rollback and must not change the 595 output-path/SEO/machine-route contract.

**Effort:** L human team → M with Claude Code + gstack.

**Priority:** P1.

**Depends on / blocked by:** Phase 0 inventory and all hard-stop gates passing; reviewed Inter/Lora font records; no unresolved unknown assets selected for native-safe output.
