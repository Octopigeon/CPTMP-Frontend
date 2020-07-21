export class Color {
  /**
   * Convert hsl color to rgb color
   * @param h Hue (0-360)
   * @param s Saturation (0-1) Color<->Grey
   * @param l Lightness (0-1) White<->Black
   * @return [r, g, b] within range 0-1
   */
  public hsl2rgb(h: number, s: number, l: number): [number, number, number] {
    let a = s * Math.min(l, 1 - l);
    let f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)];
  }

  /**
   * Convert 0-1 range rgb color to hex value
   * @param r Red (0-1)
   * @param g Green (0-1)
   * @param b Blue (0-1)
   * @return RGB hex code
   */
  public rgb2hex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert hsl color to hex color
   * @param h Hue (0-360)
   * @param s Saturation (0-1) Color<->Grey
   * @param l Lightness (0-1) White<->Black
   * @return RGB hex code
   */
  public hsl2hex(h: number, s: number, l: number): string {
    return this.rgb2hex(...this.hsl2rgb(h, s, l));
  }
}
