extends Control
## Bottom instrument panel: speed, attitude, altitude.

@onready var _speed_gauge: AnalogGauge = $Panel/Margin/HBox/SpeedGauge
@onready var _altitude_gauge: AnalogGauge = $Panel/Margin/HBox/AltitudeGauge
@onready var _horizon: ArtificialHorizon = $Panel/Margin/HBox/Horizon


func _ready() -> void:
	var airplane := get_tree().get_first_node_in_group("airplane")
	if airplane and airplane.has_signal("instruments_updated"):
		airplane.instruments_updated.connect(_on_instruments_updated)


func _on_instruments_updated(
	speed_kmh: float,
	altitude_m: float,
	_throttle_pct: float,
	pitch_deg: float,
	roll_deg: float,
) -> void:
	_speed_gauge.set_value(speed_kmh)
	_altitude_gauge.set_value(altitude_m)
	_horizon.set_attitude(pitch_deg, roll_deg)
