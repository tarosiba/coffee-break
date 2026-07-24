extends Node3D
## Procedurally places white runway markings (FS4-style, low-poly).

@export var runway_length: float = 400.0
@export var runway_width: float = 18.0
@export var marking_height: float = 0.08
@export var dash_length: float = 16.0
@export var dash_gap: float = 12.0
@export var dash_width: float = 0.45


func _ready() -> void:
	var white := _make_material(Color(0.96, 0.96, 0.93))
	var yellow := _make_material(Color(0.95, 0.82, 0.15))

	_build_centerline(white)
	_build_thresholds(white)
	_build_aiming_points(white)
	_build_edge_lines(yellow)
	_build_designators()


func _make_material(color: Color) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.95
	return mat


func _add_strip(
	material: StandardMaterial3D,
	size: Vector3,
	position: Vector3,
) -> void:
	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	mesh_instance.mesh = mesh
	mesh_instance.material_override = material
	mesh_instance.position = position
	add_child(mesh_instance)


func _build_centerline(material: StandardMaterial3D) -> void:
	var half_length: float = runway_length * 0.5
	var z: float = -half_length + dash_length * 0.5
	while z < half_length - dash_length:
		_add_strip(
			material,
			Vector3(dash_width, marking_height, dash_length),
			Vector3(0.0, marking_height * 0.5, z),
		)
		z += dash_length + dash_gap


func _build_thresholds(material: StandardMaterial3D) -> void:
	var half_length: float = runway_length * 0.5
	var bar_width: float = runway_width / 10.0
	var bar_depth: float = 1.2

	for end_z: float in [-half_length + 4.0, half_length - 4.0]:
		for i in range(5):
			var x_offset: float = (float(i) - 2.0) * (runway_width / 5.5)
			_add_strip(
				material,
				Vector3(bar_width, marking_height, bar_depth),
				Vector3(x_offset, marking_height * 0.5, end_z),
			)

		var threshold_z: float = end_z + 3.0 if end_z < 0.0 else end_z - 3.0
		_add_strip(
			material,
			Vector3(runway_width - 1.0, marking_height, 0.8),
			Vector3(0.0, marking_height * 0.5, threshold_z),
		)


func _build_aiming_points(material: StandardMaterial3D) -> void:
	var half_length: float = runway_length * 0.5
	for end_z: float in [-half_length + 18.0, half_length - 18.0]:
		for row in range(2):
			for col in range(3):
				var row_offset: float = row * 6.0 if end_z < 0.0 else -row * 6.0
				var z: float = end_z + row_offset
				var x: float = (float(col) - 1.0) * 3.2
				_add_strip(
					material,
					Vector3(2.4, marking_height, 2.4),
					Vector3(x, marking_height * 0.5, z),
				)


func _build_edge_lines(material: StandardMaterial3D) -> void:
	var edge_x: float = runway_width * 0.5 - 0.6
	for x: float in [-edge_x, edge_x]:
		_add_strip(
			material,
			Vector3(0.35, marking_height, runway_length - 20.0),
			Vector3(x, marking_height * 0.5, 0.0),
		)


func _build_designators() -> void:
	var half_length: float = runway_length * 0.5
	_add_designator("09", Vector3(0.0, 0.6, -half_length + 14.0), 0.0)
	_add_designator("27", Vector3(0.0, 0.6, half_length - 14.0), 180.0)


func _add_designator(text: String, position: Vector3, yaw_deg: float) -> void:
	var label := Label3D.new()
	label.text = text
	label.font_size = 72
	label.modulate = Color(0.96, 0.96, 0.93)
	label.outline_modulate = Color(0.1, 0.1, 0.1)
	label.outline_size = 8
	label.billboard = BaseMaterial3D.BILLBOARD_DISABLED
	label.position = position
	label.rotation_degrees = Vector3(-90.0, yaw_deg, 0.0)
	add_child(label)
