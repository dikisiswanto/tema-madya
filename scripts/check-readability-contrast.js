#!/usr/bin/env node
const pairs = [
    ['muted on white', '#52627a', '#ffffff', 4.5],
    ['muted on alt surface', '#52627a', '#f8fafd', 4.5],
    ['ink on white', '#11244a', '#ffffff', 4.5],
    ['brand on white', '#072a63', '#ffffff', 4.5],
    ['white on brand', '#ffffff', '#072a63', 4.5],
    ['white on deep brand', '#ffffff', '#041c46', 4.5],
    ['accent text on white', '#965b00', '#ffffff', 4.5],
    ['accent text on alt surface', '#965b00', '#f8fafd', 4.5],
];
function channel(v) {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function luminance(hex) {
    const h = hex.replace('#', '');
    const [r, g, b] = [0, 2, 4].map((i) =>
        channel(parseInt(h.slice(i, i + 2), 16)),
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}
let failed = false;
for (const [name, fg, bg, minimum] of pairs) {
    const ratio = contrast(fg, bg);
    const ok = ratio >= minimum;
    console.log(`${ok ? 'OK' : 'FAIL'} ${name}: ${ratio.toFixed(2)}:1`);
    if (!ok) failed = true;
}
if (failed) process.exit(1);
