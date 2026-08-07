extends Node2D

## 創世紀1602風 島開発プロトタイプ — メインシーン
## グリッド配置・資源・簡易生産

const TILE_SIZE := 32
const GRID_W := 22
const GRID_H := 16
const CHIP_PATH := "res://assets/sprites/mapchips/"

enum BuildMode { HOUSE, FIELD_WHEAT, FIELD_PLOWED, ERASE }

var build_mode: BuildMode = BuildMode.HOUSE
var textures: Dictionary = {}
var cells: Dictionary = {} # Vector2i -> { kind: String, sprite: Sprite2D }

var wood: int = 20
var wheat: int = 0
var coins: int = 100

@onready var terrain_layer: Node2D = $TerrainLayer
@onready var building_layer: Node2D = $BuildingLayer
@onready var resource_label: Label = $UI/Panel/MarginContainer/VBox/ResourceLabel
@onready var hint_label: Label = $UI/Panel/MarginContainer/VBox/HintLabel

const BUILD_COST := {
	"house": { "wood": 5, "coins": 10 },
	"field_wheat": { "wood": 2, "coins": 5 },
	"field_plowed": { "wood": 1, "coins": 2 },
}

const BUILD_TEXTURE := {
	"house": "house-coffee-shop",
	"field_wheat": "field-wheat",
	"field_plowed": "field-plowed",
}

func _ready() -> void:
	_load_textures()
	_generate_island()
	_update_ui()
	$ProductionTimer.timeout.connect(_on_production_tick)


func _load_textures() -> void:
	var names := [
		"terrain-grass",
		"terrain-water",
		"terrain-dirt-path",
		"house-red-roof",
		"house-coffee-shop",
		"house-blue-roof",
		"field-wheat",
		"field-plowed",
		"field-sprouts",
		"field-fenced-wheat",
	]
	for name in names:
		var path := CHIP_PATH + name + ".png"
		if ResourceLoader.exists(path):
			textures[name] = load(path)


func _generate_island() -> void:
	for y in range(GRID_H):
		for x in range(GRID_W):
			var grid := Vector2i(x, y)
			var chip := "terrain-water" if not _is_land(grid) else "terrain-grass"
			_spawn_tile(terrain_layer, grid, chip)


func _is_land(grid: Vector2i) -> bool:
	if grid.x < 1 or grid.y < 1 or grid.x >= GRID_W - 1 or grid.y >= GRID_H - 1:
		return false
	# 島っぽく角を切る
	if grid.x + grid.y < 4:
		return false
	if grid.x + grid.y > GRID_W + GRID_H - 10:
		return false
	if grid.x - grid.y > 8:
		return false
	if grid.y - grid.x > 6:
		return false
	return true


func _spawn_tile(parent: Node2D, grid: Vector2i, chip_name: String) -> void:
	if not textures.has(chip_name):
		return
	var sprite := Sprite2D.new()
	sprite.texture = textures[chip_name]
	sprite.position = Vector2(grid.x * TILE_SIZE, grid.y * TILE_SIZE)
	sprite.centered = false
	parent.add_child(sprite)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			var grid := _mouse_to_grid()
			if build_mode == BuildMode.ERASE:
				_remove_at(grid)
			else:
				_place_at(grid)


func _mouse_to_grid() -> Vector2i:
	var pos := get_global_mouse_position()
	return Vector2i(int(pos.x) / TILE_SIZE, int(pos.y) / TILE_SIZE)


func _place_at(grid: Vector2i) -> void:
	if not _is_land(grid):
		hint_label.text = "ここは海です 🌊"
		return
	if cells.has(grid):
		hint_label.text = "すでに建物があります"
		return

	var kind := ""
	match build_mode:
		BuildMode.HOUSE:
			kind = "house"
		BuildMode.FIELD_WHEAT:
			kind = "field_wheat"
		BuildMode.FIELD_PLOWED:
			kind = "field_plowed"

	if not _pay_cost(kind):
		hint_label.text = "資源が足りません（木材・コイン）"
		return

	var chip := BUILD_TEXTURE[kind]
	if not textures.has(chip):
		return

	var sprite := Sprite2D.new()
	sprite.texture = textures[chip]
	sprite.position = Vector2(grid.x * TILE_SIZE, grid.y * TILE_SIZE)
	sprite.centered = false
	building_layer.add_child(sprite)
	cells[grid] = { "kind": kind, "sprite": sprite }
	hint_label.text = "配置しました ✓"
	_update_ui()


func _remove_at(grid: Vector2i) -> void:
	if not cells.has(grid):
		hint_label.text = "何もありません"
		return
	var entry: Dictionary = cells[grid]
	var sprite: Sprite2D = entry["sprite"]
	sprite.queue_free()
	cells.erase(grid)
	wood += 1
	hint_label.text = "撤去しました（木材+1）"
	_update_ui()


func _pay_cost(kind: String) -> bool:
	var cost: Dictionary = BUILD_COST.get(kind, {})
	if wood < cost.get("wood", 0) or coins < cost.get("coins", 0):
		return false
	wood -= cost.get("wood", 0)
	coins -= cost.get("coins", 0)
	return true


func _on_production_tick() -> void:
	var produced := 0
	for entry in cells.values():
		if entry["kind"] == "field_wheat":
			produced += 1
	wheat += produced
	if produced > 0:
		coins += produced
	_update_ui()


func _update_ui() -> void:
	resource_label.text = (
		"🪵 木材 %d　🌾 小麦 %d　💰 コイン %d" % [wood, wheat, coins]
	)


func _on_house_pressed() -> void:
	build_mode = BuildMode.HOUSE
	hint_label.text = "モード: コーヒー小屋（木材5・コイン10）"


func _on_wheat_pressed() -> void:
	build_mode = BuildMode.FIELD_WHEAT
	hint_label.text = "モード: 小麦畑（木材2・コイン5）— 2秒ごとに小麦+1"


func _on_plowed_pressed() -> void:
	build_mode = BuildMode.FIELD_PLOWED
	hint_label.text = "モード: 耕起畑（木材1・コイン2）"


func _on_erase_pressed() -> void:
	build_mode = BuildMode.ERASE
	hint_label.text = "モード: 撤去（クリックで削除・木材+1）"
