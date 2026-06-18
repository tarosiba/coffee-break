extends Camera3D
## Third-person chase camera with slight lag for a classic flight-sim feel.

@export var target_path: NodePath
@export var follow_distance: float = 14.0
@export var follow_height: float = 4.0
@export var look_ahead: float = 8.0
@export var smooth_speed: float = 6.0

var _target: Node3D


func _ready() -> void:
	if target_path != NodePath():
		_target = get_node(target_path)


func _physics_process(delta: float) -> void:
	if _target == null:
		return

	var basis := _target.global_transform.basis
	var desired_pos := _target.global_position
	desired_pos += basis.z * follow_distance
	desired_pos += Vector3.UP * follow_height

	global_position = global_position.lerp(desired_pos, smooth_speed * delta)

	var look_target := _target.global_position + (-basis.z * look_ahead) + Vector3.UP * 1.0
	look_at(look_target, Vector3.UP)
