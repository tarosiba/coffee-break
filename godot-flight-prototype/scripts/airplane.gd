extends CharacterBody3D
## Arcade-style airplane controller for the minimal flight prototype.
## FS4 feel: easy to fly, not a full physics sim.

signal stats_changed(speed_kmh: float, altitude_m: float, throttle_pct: float)

@export var min_speed: float = 25.0
@export var max_speed: float = 90.0
@export var acceleration: float = 18.0
@export var pitch_speed: float = 1.4
@export var roll_speed: float = 2.2
@export var yaw_speed: float = 0.9
@export var auto_level_strength: float = 1.8
@export var ground_height: float = 1.2
@export var takeoff_speed: float = 35.0

var speed: float = 0.0
var grounded: bool = true

@onready var _spawn_transform: Transform3D = global_transform


func _ready() -> void:
	speed = 0.0
	_emit_stats()


func _physics_process(delta: float) -> void:
	_handle_reset()
	_handle_throttle(delta)
	_handle_rotation(delta)
	_move(delta)
	_emit_stats()


func _handle_reset() -> void:
	if Input.is_action_just_pressed("reset"):
		global_transform = _spawn_transform
		speed = 0.0
		velocity = Vector3.ZERO
		grounded = true


func _handle_throttle(delta: float) -> void:
	if Input.is_action_pressed("throttle_up"):
		speed = minf(speed + acceleration * delta, max_speed)
	if Input.is_action_pressed("throttle_down"):
		speed = maxf(speed - acceleration * delta, 0.0)


func _handle_rotation(delta: float) -> void:
	var pitch_input := Input.get_axis("pitch_down", "pitch_up")
	var roll_input := Input.get_axis("roll_left", "roll_right")
	var yaw_input := Input.get_axis("yaw_left", "yaw_right")

	if grounded:
		# On the ground: no banking, limited pitch for takeoff run.
		rotation.z = lerpf(rotation.z, 0.0, auto_level_strength * delta)
		if speed >= takeoff_speed:
			rotation.x += pitch_input * pitch_speed * 0.35 * delta
		else:
			rotation.x = lerpf(rotation.x, 0.0, auto_level_strength * delta)
		rotation.y += yaw_input * yaw_speed * delta
	else:
		rotation.x += pitch_input * pitch_speed * delta
		rotation.z += roll_input * roll_speed * delta
		rotation.y += yaw_input * yaw_speed * delta

		# Gentle auto-level when no roll input (FS4-like assist).
		if is_zero_approx(roll_input):
			rotation.z = lerpf(rotation.z, 0.0, auto_level_strength * 0.5 * delta)

	rotation.x = clampf(rotation.x, deg_to_rad(-55.0), deg_to_rad(55.0))
	rotation.z = clampf(rotation.z, deg_to_rad(-70.0), deg_to_rad(70.0))


func _move(delta: float) -> void:
	var forward := -global_transform.basis.z
	velocity = forward * speed
	move_and_slide()

	grounded = global_position.y <= ground_height + 0.05

	if grounded:
		global_position.y = ground_height
		if speed < takeoff_speed * 0.5:
			rotation.x = lerpf(rotation.x, 0.0, 4.0 * delta)


func _emit_stats() -> void:
	var altitude := maxf(global_position.y - ground_height, 0.0)
	var throttle_pct := inverse_lerp(0.0, max_speed, speed) * 100.0
	stats_changed.emit(speed * 3.6, altitude, throttle_pct)
