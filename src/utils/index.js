export function getOrientation() {
    const mql = window.matchMedia("(orientation: portrait)")
    return mql.matches ? 'portrait' : 'landscape';
}