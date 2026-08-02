import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

/** Supported theme identifiers. Add new entries here + a matching
 *  partial under `src/styles/themes/` to ship a new theme. */
export type ThemeName = 'dark' | 'light';

const STORAGE_KEY = 'rusty.theme';
const DATA_ATTRIBUTE = 'data-theme';

/** Reads / writes the active theme. Authoritative source of truth for
 *  `<html data-theme="…">`. Persists choice across restarts and honours
 *  the OS `prefers-color-scheme` preference on first run. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<ThemeName>('dark');
  readonly active = this.themeSignal.asReadonly();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.apply(this.resolveInitial());
  }

  set(theme: ThemeName): void {
    this.apply(theme);
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private mode, sandbox) — non-fatal.
    }
  }

  toggle(): void {
    this.set(this.active() === 'dark' ? 'light' : 'dark');
  }

  private apply(theme: ThemeName): void {
    this.document.documentElement.setAttribute(DATA_ATTRIBUTE, theme);
    this.themeSignal.set(theme);
  }

  private resolveInitial(): ThemeName {
    const stored = this.readStored();
    if (stored) return stored;
    const prefersLight =
      this.document.defaultView?.matchMedia?.('(prefers-color-scheme: light)')
        .matches ?? false;
    return prefersLight ? 'light' : 'dark';
  }

  private readStored(): ThemeName | null {
    try {
      const v = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }
}

