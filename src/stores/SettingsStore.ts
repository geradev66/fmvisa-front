import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'settings_zoom';
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1;

export const useSettingsStore = defineStore('settings', () => {
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

    return { zoom, setZoom, zoomIn, zoomOut, zoomReset, ZOOM_MIN, ZOOM_MAX, ZOOM_STEP };
});
