shader_type canvas_item;

// FS4-era CRT post-process: pixel grid, scanlines, vignette, slight curvature.

uniform sampler2D screen_texture : hint_screen_texture, filter_nearest, repeat_disable;
uniform vec2 virtual_resolution = vec2(320.0, 200.0);
uniform float scanline_strength : hint_range(0.0, 1.0) = 0.22;
uniform float vignette_strength : hint_range(0.0, 1.0) = 0.35;
uniform float curvature : hint_range(0.0, 0.1) = 0.025;
uniform float aberration : hint_range(0.0, 0.01) = 0.0025;

vec2 curve_uv(vec2 uv) {
	vec2 centered = uv * 2.0 - 1.0;
	vec2 offset = centered * abs(centered);
	return uv + offset * curvature;
}

void fragment() {
	vec2 uv = curve_uv(SCREEN_UV);

	if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
		COLOR = vec4(0.02, 0.02, 0.03, 1.0);
	} else {
		vec2 pixel_uv = floor(uv * virtual_resolution) / virtual_resolution;
		vec2 px = vec2(aberration, 0.0);

		float r = texture(screen_texture, pixel_uv + px).r;
		float g = texture(screen_texture, pixel_uv).g;
		float b = texture(screen_texture, pixel_uv - px).b;
		vec3 col = vec3(r, g, b);

		float scan = sin(uv.y * virtual_resolution.y * 3.14159265);
		col *= 1.0 - scanline_strength * (0.5 + 0.5 * scan);

		vec2 vig = uv * (1.0 - uv);
		float vignette = vig.x * vig.y * 16.0;
		vignette = pow(clamp(vignette, 0.0, 1.0), 0.22);
		col *= mix(1.0 - vignette_strength, 1.0, vignette);

		COLOR = vec4(col, 1.0);
	}
}
