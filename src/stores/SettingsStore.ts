import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'settings_zoom';
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1;

const THEME_KEY = 'settings_theme';
type Theme = 'system' | 'light' | 'dark';

export const useSettingsStore = defineStore('settings', () => {
    // ── Zoom ──────────────────────────────────────────────
    const storedZoom = parseFloat(localStorage.getItem(STORAGE_KEY) ?? '')
    const zoom = ref<number>(
        !isNaN(storedZoom) && storedZoom >= ZOOM_MIN && storedZoom <= ZOOM_MAX
            ? storedZoom
            : ZOOM_DEFAULT
    );

    const setZoom = (value: number) => {
        zoom.value = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, parseFloat(value.toFixed(2))));
        localStorage.setItem(STORAGE_KEY, String(zoom.value));
    };

    const zoomIn = () => setZoom(zoom.value + ZOOM_STEP);
    const zoomOut = () => setZoom(zoom.value - ZOOM_STEP);
    const zoomReset = () => setZoom(ZOOM_DEFAULT);

    // ── Dark mode ─────────────────────────────────────────
    const storedTheme = (localStorage.getItem(THEME_KEY) ?? 'system') as Theme;
    const theme = ref<Theme>(storedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyThemeClass = () => {
        const dark =
            theme.value === 'dark' ||
            (theme.value === 'system' && mediaQuery.matches);
        document.documentElement.classList.toggle('dark', dark);
    };

    watch(theme, (val) => {
        localStorage.setItem(THEME_KEY, val);
        applyThemeClass();
    }, { immediate: true });

    mediaQuery.addEventListener('change', applyThemeClass);

    const isDark = computed(() =>
        theme.value === 'dark' ||
        (theme.value === 'system' && mediaQuery.matches)
    );

    const toggleDark = () => {
        theme.value = isDark.value ? 'light' : 'dark';
    };

    return {
        zoom, setZoom, zoomIn, zoomOut, zoomReset, ZOOM_MIN, ZOOM_MAX, ZOOM_STEP,
        theme, isDark, toggleDark,
    };
});
