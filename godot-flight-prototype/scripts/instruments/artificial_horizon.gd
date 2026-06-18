extends Control
class_name ArtificialHorizon
## Attitude indicator: pitch + roll with a fixed aircraft symbol.

var pitch_deg: float = 0.0
var roll_deg: float = 0.0

const _BEZEL := Color(0.28, 0.3, 0.34, 1.0)
const _FACE := Color(0.08, 0.09, 0.11, 1.0)
const _SKY := Color(0.28, 0.48, 0.82, 1.0)
const _GROUND := Color(0.42, 0.3, 0.16, 1.0)
const _HORIZON := Color(0.92, 0.94, 0.96, 1.0)
const _LADDER := Color(0.92, 0.94, 0.96, 0.85)
const _WINGS := Color(0.98, 0.78, 0.16, 1.0)
const _TITLE := Color(0.78, 0.84, 0.78, 1.0)


func set_attitude(new_pitch_deg: float, new_roll_deg: float) -> void:
	pitch_deg = clampf(new_pitch_deg, -55.0, 55.0)
	roll_deg = clampf(new_roll_deg, -70.0, 70.0)
	queue_redraw()


func _ready() -> void:
	queue_redraw()


func _draw() -> void:
	var center := size * 0.5
	var radius := minf(size.x, size.y) * 0.42

	draw_circle(center, radius + 8.0, _BEZEL)
	draw_circle(center, radius, _FACE)

	_draw_horizon_ball(center, radius)
	_draw_aircraft_symbol(center)
	_draw_title()


func _draw_horizon_ball(center: Vector2, radius: float) -> void:
	var pitch_offset := pitch_deg * 1.6
	var roll_rad := deg_to_rad(roll_deg)

	draw_set_transform(center, roll_rad, Vector2.ONE)

	var span := radius * 2.4
	var top := -span + pitch_offset
	draw_rect(Rect2(-span, top, span * 2.0, span), _SKY)
	draw_rect(Rect2(-span, pitch_offset, span * 2.0, span), _GROUND)
	draw_line(Vector2(-span, pitch_offset), Vector2(span, pitch_offset), _HORIZON, 2.0)

	for mark in [-20, -10, 10, 20]:
		var y := pitch_offset - mark * 1.6
		var half_width := 18.0 if abs(mark) == 10 else 28.0
		draw_line(Vector2(-half_width, y), Vector2(half_width, y), _LADDER, 1.0)
		draw_string(
			ThemeDB.fallback_font,
			Vector2(half_width + 4.0, y + 4.0),
			str(abs(mark)),
			HORIZONTAL_ALIGNMENT_LEFT,
			-1,
			10,
			_LADDER,
		)

	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
	draw_arc(center, radius - 1.0, 0.0, TAU, 72, _BEZEL, 10.0, true)


func _draw_aircraft_symbol(center: Vector2) -> void:
	draw_line(center + Vector2(-34.0, 0.0), center + Vector2(34.0, 0.0), _WINGS, 4.0)
	draw_line(center + Vector2(0.0, -8.0), center + Vector2(0.0, 8.0), _WINGS, 3.0)
	draw_circle(center, 4.0, _WINGS)


func _draw_title() -> void:
	draw_string(
		ThemeDB.fallback_font,
		Vector2(12.0, 18.0),
		"ATT",
		HORIZONTAL_ALIGNMENT_LEFT,
		-1,
		14,
		_TITLE,
	)
