export const vertexShader = `#define PI 3.14159265359

uniform float u_time;
uniform float u_pointsize;
uniform float u_noise_amp_1;
uniform float u_noise_freq_1;
uniform float u_spd_modifier_1;
uniform float u_noise_amp_2;
uniform float u_noise_freq_2;
uniform float u_spd_modifier_2;

float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

mat2 rotate2d(float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  gl_PointSize = u_pointsize;

  vec3 pos = position;
  pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
  
  pos.z += noise(rotate2d(PI / 4.) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;

  vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvm;
}`;

export const fragmentShader = `#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(vec3(0.0, st), 1.0);
}`;
