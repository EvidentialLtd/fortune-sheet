var ZOOM_STEP = 0.1;
export var MAX_ZOOM_RATIO = 4;
export var MIN_ZOOM_RATIO = 0.1;
export function handleKeydownForZoom(ev, currentZoom) {
    if (!ev.ctrlKey) {
        return currentZoom;
    }
    var handled = false;
    var zoom = currentZoom || 1;
    if (ev.key === "-" || ev.which === 189) {
        zoom -= ZOOM_STEP;
        handled = true;
    }
    else if (ev.key === "+" || ev.which === 187) {
        zoom += ZOOM_STEP;
        handled = true;
    }
    else if (ev.key === "0" || ev.which === 48) {
        zoom = 1;
        handled = true;
    }
    if (handled) {
        ev.preventDefault();
        if (zoom >= MAX_ZOOM_RATIO) {
            zoom = MAX_ZOOM_RATIO;
        }
        else if (zoom < MIN_ZOOM_RATIO) {
            zoom = MIN_ZOOM_RATIO;
        }
    }
    return parseFloat(zoom.toFixed(1));
}
