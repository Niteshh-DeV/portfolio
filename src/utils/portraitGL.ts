/**
 * WebGL layer for the hero portrait. It draws the monochrome photo and lets the
 * colour one bleed through a blob around the pointer: the edge of the blob
 * wobbles and bends the image like liquid. Plain WebGL, no library.
 */

const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMono;
uniform sampler2D uColour;
uniform vec2 uPointer;   // 0..1, origin top-left
uniform float uRadius;   // in units of canvas height
uniform float uTime;
uniform float uCanvasAspect;
uniform float uImageAspect;

// simplex noise, Ian McEwan / Ashima Arts (MIT)
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// same crop as CSS object-fit: cover with object-position 50% 40%
vec2 cover(vec2 uv) {
  vec2 scale = vec2(min(uCanvasAspect / uImageAspect, 1.0), min(uImageAspect / uCanvasAspect, 1.0));
  return vec2(0.5, 0.4) + (uv - vec2(0.5, 0.4)) * scale;
}

void main() {
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 toPointer = (uv - uPointer) * vec2(uCanvasAspect, 1.0);
  float dist = length(toPointer);

  float wobble = snoise(uv * 3.2 + uTime * 0.35) * 0.5 + snoise(uv * 7.0 - uTime * 0.5) * 0.25;
  float edge = uRadius * (1.0 + wobble * 0.32);
  float inside = smoothstep(edge, edge - 0.018 - uRadius * 0.06, dist);

  // bend the picture where it meets the edge of the blob
  float rim = smoothstep(edge + 0.14, edge, dist) * (1.0 - inside) * step(0.001, uRadius);
  vec2 push = normalize(toPointer + 0.0001) * rim * 0.035;

  vec3 mono = texture2D(uMono, cover(uv - push)).rgb;
  mono = (mono - 0.5) * 1.08 + 0.5;
  mono *= 0.74;
  vec3 colour = texture2D(uColour, cover(uv + push * 0.6)).rgb;

  gl_FragColor = vec4(mix(mono, colour, inside), 1.0);
}`;

export interface PortraitGL {
  /** x, y in CSS pixels from the canvas' top-left; radius in CSS pixels. */
  render: (x: number, y: number, radius: number, time: number) => void;
  dispose: () => void;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/** Resolves to null when WebGL is unavailable; the caller keeps its CSS fallback. */
export async function createPortraitGL(canvas: HTMLCanvasElement, monoSrc: string, colourSrc: string): Promise<PortraitGL | null> {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  let images: HTMLImageElement[];
  try {
    images = await Promise.all([loadImage(monoSrc), loadImage(colourSrc)]);
  } catch {
    return null;
  }

  const textures = images.map((image, unit) => {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  });

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform('uMono'), 0);
  gl.uniform1i(uniform('uColour'), 1);
  gl.uniform1f(uniform('uImageAspect'), images[0].naturalWidth / images[0].naturalHeight);
  const uPointer = uniform('uPointer');
  const uRadius = uniform('uRadius');
  const uTime = uniform('uTime');
  const uCanvasAspect = uniform('uCanvasAspect');

  return {
    render(x, y, radius, time) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * ratio);
      const pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        gl.viewport(0, 0, pixelWidth, pixelHeight);
      }

      gl.uniform2f(uPointer, x / width, y / height);
      gl.uniform1f(uRadius, radius / height);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uCanvasAspect, width / height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
