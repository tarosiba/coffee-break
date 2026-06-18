extends Control
class_name AnalogGauge
## Retro-style analog gauge drawn with _draw().

@export var gauge_label: String = "SPD"
@export var unit_label: String = "km/h"
@export var min_value: float = 0.0
@export var max_value: float = 200.0
@export var start_angle_deg: float = 135.0
@export var end_angle_deg: float = 405.0
@export var major_step: float = 20.0
@export var minor_ticks: int = 4

var value: float = 0.0

const _FACE := Color(0.1, 0.11, 0.13, 1.0)
const _BEZEL := Color(0.28, 0.3, 0.34, 1.0)
const _TICK := Color(0.82, 0.86, 0.82, 1.0)
const _NEEDLE := Color(0.96, 0.72, 0.18, 1.0)
const _TEXT := Color(0.78, 0.84, 0.78, 1.0)


func set_value(new_value: float) -> void:
	value = clampf(new_value, min_value, max_value)
	queue_redraw()


func _ready() -> void:
	queue_redraw()


func _draw() -> void:
	var center := size * 0.5
	var radius := minf(size.x, size.y) * 0.42

	draw_circle(center, radius + 8.0, _BEZEL)
	draw_circle(center, radius, _FACE)

	_draw_ticks(center, radius)
	_draw_needle(center, radius * 0.82)
	_draw_labels(center, radius)


func _draw_ticks(center: Vector2, radius: float) -> void:
	var major_count := int((max_value - min_value) / major_step)
	for i in range(major_count + 1):
		var t := float(i) / float(major_count)
		var tick_value := lerpf(min_value, max_value, t)
		var angle := deg_to_rad(_value_to_angle(tick_value))
		var dir := Vector2(cos(angle), sin(angle))
		draw_line(center + dir * (radius - 14.0), center + dir * (radius - 2.0), _TICK, 2.0)

		if i < major_count:
			for j in range(1, minor_ticks):
				var minor_t := t + (float(j) / float(minor_ticks)) / float(major_count)
				if minor_t > 1.0:
					continue
				var minor_angle := deg_to_rad(lerpf(start_angle_deg, end_angle_deg, minor_t))
				var minor_dir := Vector2(cos(minor_angle), sin(minor_angle))
				draw_line(
					center + minor_dir * (radius - 8.0),
					center + minor_dir * (radius - 2.0),
					_TICK.darkened(0.35),
					1.0,
				)

		var label_pos := center + dir * (radius - 24.0)
		var label := str(int(round(tick_value)))
		draw_string(
			ThemeDB.fallback_font,
			label_pos - Vector2(8, -4),
			label,
			HORIZONTAL_ALIGNMENT_LEFT,
			-1,
			11,
			_TEXT,
		)


func _draw_needle(center: Vector2, length: float) -> void:
	var angle := deg_to_rad(_value_to_angle(value))
	var tip := center + Vector2(cos(angle), sin(angle)) * length
	draw_line(center, tip, _NEEDLE, 3.0)
	draw_circle(center, 5.0, _NEEDLE.darkened(0.2))


func _draw_labels(center: Vector2, radius: float) -> void:
	draw_string(
		ThemeDB.fallback_font,
		Vector2(center.x - 18.0, 18.0),
		gauge_label,
		HORIZONTAL_ALIGNMENT_LEFT,
		-1,
		14,
		_TEXT,
	)
	draw_string(
		ThemeDB.fallback_font,
		Vector2(center.x - 28.0, size.y - 10.0),
		"%d %s" % [int(round(value)), unit_label],
		HORIZONTAL_ALIGNMENT_LEFT,
		-1,
		13,
		_NEEDLE,
	)


func _value_to_angle(v: float) -> float:
	var t := inverse_lerp(min_value, max_value, v)
	return lerpf(start_angle_deg, end_angle_deg, t)
