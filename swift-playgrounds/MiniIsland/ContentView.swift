import SwiftUI

/// Coffee Break 超ミニ島 — Swift Playgrounds 用 v2
/// 5×5 の島。畑（最大3）→ 小麦12でパン屋解放（1つ置ける）
struct ContentView: View {
    private let gridSize = 5
    private let maxFields = 3
    private let wheatForBakery = 12

    @State private var tiles: [[TileKind]] = MiniIslandMap.make()
    @State private var wheat = 0
    @State private var bread = 0
    @State private var fieldCount = 0
    @State private var hasBakery = false
    @State private var bakeryUnlocked = false
    @State private var message = "☕ 平地をタップして畑を作ろう"

    var body: some View {
        VStack(spacing: 14) {
            header
            if bakeryUnlocked {
                bakeryBanner
            }
            islandGrid
            footer
        }
        .padding()
        .onReceive(Timer.publish(every: 2, on: .main, in: .common).autoconnect()) { _ in
            tick()
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Text("超ミニ島")
                .font(.largeTitle.bold())
            Text("Coffee Break × Swift Playgrounds")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            HStack(spacing: 20) {
                Label("\(wheat)", systemImage: "leaf.fill")
                    .font(.title2.bold())
                if hasBakery {
                    Label("\(bread)", systemImage: "fork.knife")
                        .font(.title2.bold())
                        .foregroundStyle(.orange)
                }
                Label("\(fieldCount)/\(maxFields)", systemImage: "square.grid.3x3.fill")
                    .font(.title3)
            }
            Text(message)
                .font(.callout)
                .multilineTextAlignment(.center)
                .foregroundStyle(.brown)
                .padding(.horizontal)
        }
    }

    private var bakeryBanner: some View {
        Group {
            if hasBakery {
                Text("🍞 パン屋オープン！ 2秒ごとにパン+1")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .padding(.vertical, 10)
                    .frame(maxWidth: .infinity)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color.orange))
            } else {
                Text("🍞 パン屋解放！ もう一度平地をタップ")
                    .font(.headline)
                    .foregroundStyle(.white)
                    .padding(.vertical, 10)
                    .frame(maxWidth: .infinity)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color.orange))
            }
        }
        .padding(.horizontal, 4)
    }

    private var islandGrid: some View {
        VStack(spacing: 4) {
            ForEach(0..<gridSize, id: \.self) { row in
                HStack(spacing: 4) {
                    ForEach(0..<gridSize, id: \.self) { col in
                        tileButton(row: row, col: col)
                    }
                }
            }
        }
        .padding(8)
        .background(RoundedRectangle(cornerRadius: 16).fill(Color.brown.opacity(0.08)))
    }

    private func tileButton(row: Int, col: Int) -> some View {
        let tile = tiles[row][col]
        return Button {
            tapTile(row: row, col: col)
        } label: {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(tile.backgroundColor)
                    .frame(width: 52, height: 52)
                Text(tile.emoji)
                    .font(.title2)
            }
        }
        .buttonStyle(.plain)
        .disabled(tile == .sea)
    }

    private var footer: some View {
        VStack(spacing: 10) {
            Text("左下は海｜小麦\(wheatForBakery)でパン屋解放")
                .font(.caption)
                .foregroundStyle(.secondary)
            Button("最初から") {
                resetIsland()
            }
            .buttonStyle(.bordered)
        }
    }

    private func tapTile(row: Int, col: Int) {
        let tile = tiles[row][col]

        if tile == .sea {
            message = "🌊 海には建てられません"
            return
        }

        if tile == .grass {
            if bakeryUnlocked && !hasBakery {
                tiles[row][col] = .bakery
                hasBakery = true
                message = "🍞 パン屋を建てた！ パンが増え始めます"
                return
            }
            if fieldCount < maxFields {
                tiles[row][col] = .field
                fieldCount += 1
                message = "🌾 畑 \(fieldCount)/\(maxFields) … 2秒ごとに小麦+1"
                return
            }
            if bakeryUnlocked {
                message = "🍞 パン屋は1つだけ。あとは小麦を待とう"
            } else {
                message = "畑は \(maxFields) まで。小麦 \(wheatForBakery) でパン屋解放 ☕"
            }
            return
        }

        message = "ここにはもう建物があります"
    }

    private func tick() {
        if fieldCount > 0 {
            wheat += fieldCount
        }

        if !bakeryUnlocked && wheat >= wheatForBakery {
            bakeryUnlocked = true
            message = "🍞 小麦 \(wheat) … パン屋解放！ 平地をタップ"
        } else if bakeryUnlocked && !hasBakery {
            message = "🍞 小麦 \(wheat) … 平地をタップしてパン屋を置こう"
        } else if hasBakery {
            bread += 1
            message = "🍞 パン \(bread) 個 … のんびり増えています ☕"
        } else if fieldCount > 0 {
            let left = max(0, wheatForBakery - wheat)
            message = "🌾 小麦 \(wheat) … パン屋まであと \(left)"
        }
    }

    private func resetIsland() {
        tiles = MiniIslandMap.make()
        wheat = 0
        bread = 0
        fieldCount = 0
        hasBakery = false
        bakeryUnlocked = false
        message = "☕ 平地をタップして畑を作ろう"
    }
}

private enum TileKind {
    case grass
    case sea
    case field
    case bakery

    var emoji: String {
        switch self {
        case .grass: "🟩"
        case .sea: "🌊"
        case .field: "🌾"
        case .bakery: "🍞"
        }
    }

    var backgroundColor: Color {
        switch self {
        case .grass: Color.green.opacity(0.25)
        case .sea: Color.blue.opacity(0.25)
        case .field: Color.yellow.opacity(0.35)
        case .bakery: Color.orange.opacity(0.45)
        }
    }
}

private enum MiniIslandMap {
    static func make() -> [[TileKind]] {
        var grid = Array(repeating: Array(repeating: TileKind.grass, count: 5), count: 5)
        grid[4][0] = .sea
        grid[4][1] = .sea
        grid[3][0] = .sea
        return grid
    }
}

#Preview {
    ContentView()
}
