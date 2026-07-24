extends Node3D
## Procedural low-poly FS4-style terrain with vertex colors (no textures).

@export var grid_size: int = 96
@export var world_size: float = 2400.0
@export var max_height: float = 55.0
@export var runway_flat_half_width: float = 28.0
@export var runway_flat_half_length: float = 230.0
@export var lake_level: float = -2.5

@onready var _mesh_instance: MeshInstance3D = $MeshInstance3D


func _ready() -> void:
	_build_terrain()


func _build_terrain() -> void:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)

	var step: float = world_size / float(grid_size)
	var half: float = world_size * 0.5
	var heights: PackedFloat32Array = PackedFloat32Array()
	heights.resize((grid_size + 1) * (grid_size + 1))

	for z_idx in range(grid_size + 1):
		for x_idx in range(grid_size + 1):
			var x: float = -half + float(x_idx) * step
			var z: float = -half + float(z_idx) * step
			var h: float = _height_at(x, z)
			heights[z_idx * (grid_size + 1) + x_idx] = h

	for z_idx in range(grid_size):
		for x_idx in range(grid_size):
			var i00: int = z_idx * (grid_size + 1) + x_idx
			var i10: int = i00 + 1
			var i01: int = i00 + (grid_size + 1)
			var i11: int = i01 + 1

			var x0: float = -half + float(x_idx) * step
			var z0: float = -half + float(z_idx) * step
			var x1: float = x0 + step
			var z1: float = z0 + step

			_add_triangle(st, Vector3(x0, heights[i00], z0), Vector3(x1, heights[i10], z0), Vector3(x0, heights[i01], z1))
			_add_triangle(st, Vector3(x1, heights[i10], z0), Vector3(x1, heights[i11], z1), Vector3(x0, heights[i01], z1))

	var mesh: ArrayMesh = st.commit()
	_mesh_instance.mesh = mesh

	var mat := StandardMaterial3D.new()
	mat.vertex_color_use_as_albedo = true
	mat.roughness = 0.95
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_PER_PIXEL
	_mesh_instance.material_override = mat

	_spawn_landmarks()


func _height_at(x: float, z: float) -> float:
	if absf(x) <= runway_flat_half_width and absf(z) <= runway_flat_half_length:
		return 0.0

	var dist: float = Vector2(x * 0.55, z * 0.35).length() / (world_size * 0.42)
	var rise: float = smoothstep(0.08, 0.75, dist)

	var h: float = sin(x * 0.011) * cos(z * 0.009) * max_height * 0.55
	h += sin(x * 0.004 + z * 0.003) * max_height * 0.35
	h += cos(x * 0.002 - z * 0.005) * max_height * 0.2
	h *= rise

	# Lake bowl west of airport.
	var lake_center := Vector2(-420.0, -120.0)
	var lake_dist: float = Vector2(x, z).distance_to(lake_center)
	if lake_dist < 180.0:
		var bowl: float = 1.0 - lake_dist / 180.0
		h = minf(h, lake_level * bowl * bowl)

	return h


func _vertex_color(height: float) -> Color:
	if height <= lake_level + 0.5:
		return Color(0.18, 0.38, 0.62)
	if height < 2.0:
		return Color(0.24, 0.52, 0.22)
	if height < 18.0:
		return Color(0.32, 0.58, 0.26)
	if height < 32.0:
		return Color(0.42, 0.48, 0.28)
	return Color(0.45, 0.4, 0.34)


func _add_triangle(st: SurfaceTool, a: Vector3, b: Vector3, c: Vector3) -> void:
	var normal: Vector3 = (b - a).cross(c - a).normalized()
	st.set_normal(normal)
	st.set_color(_vertex_color(a.y))
	st.add_vertex(a)
	st.set_normal(normal)
	st.set_color(_vertex_color(b.y))
	st.add_vertex(b)
	st.set_normal(normal)
	st.set_color(_vertex_color(c.y))
	st.add_vertex(c)


func _spawn_landmarks() -> void:
	var brown := _make_solid_material(Color(0.42, 0.38, 0.32))
	var green := _make_solid_material(Color(0.28, 0.5, 0.24))

	_add_block(Vector3(-620.0, 35.0, -520.0), Vector3(180.0, 70.0, 120.0), brown)
	_add_block(Vector3(580.0, 27.5, -480.0), Vector3(140.0, 55.0, 100.0), brown)
	_add_block(Vector3(-500.0, 24.0, 520.0), Vector3(160.0, 48.0, 110.0), green)
	_add_block(Vector3(650.0, 40.0, 420.0), Vector3(200.0, 80.0, 130.0), brown)
	_add_block(Vector3(0.0, 47.5, -780.0), Vector3(320.0, 95.0, 80.0), brown)


func _make_solid_material(color: Color) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.95
	return mat


func _add_block(center: Vector3, size: Vector3, material: StandardMaterial3D) -> void:
	var body := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = size
	body.mesh = box
	body.material_override = material
	body.position = center
	add_child(body)

