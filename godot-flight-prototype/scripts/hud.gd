extends CanvasLayer

@onready var _speed_label: Label = $Panel/Margin/VBox/Speed
@onready var _altitude_label: Label = $Panel/Margin/VBox/Altitude
@onready var _throttle_label: Label = $Panel/Margin/VBox/Throttle
@onready var _help_label: Label = $HelpLabel


func _ready() -> void:
	var airplane := get_tree().get_first_node_in_group("airplane")
	if airplane and airplane.has_signal("stats_changed"):
		airplane.stats_changed.connect(_on_stats_changed)


func _on_stats_changed(speed_kmh: float, altitude_m: float, throttle_pct: float) -> void:
	_speed_label.text = "SPD  %4.0f km/h" % speed_kmh
	_altitude_label.text = "ALT  %4.0f m" % altitude_m
	_throttle_label.text = "THR  %3.0f %%" % throttle_pct
