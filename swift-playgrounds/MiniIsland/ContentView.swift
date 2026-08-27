import SwiftUI

/// Coffee Break 超ミニ島 — Swift Playgrounds 用 v3
/// タイマーなし。🌾畑をタップで小麦+1。小麦6でパン屋解放。
struct ContentView: View {
    private let gridSize = 5
    private let maxFields = 3
    private let wheatForBakery = 6

    @State private var tiles: [[TileKind]] = MiniIslandMap.make()
    @State private var wheat = 0
    @State private var bread = 0
    @State private var fieldCount = 0
    @State private var hasBakery = false
    @State private var message = "☕ まず平地をタップ → 畑を作ろう"

    private var bakeryReady: Bool {
        wheat >= wheatForBakery
    }

    var body: some View {
        VStack(spacing: 12) {
            header
            progressBar
            if bakeryReady {
                bakeryBanner
            }
            islandGrid
            footer
        }
        .padding()
    }

    private var header: some View {
        VStack(spacing: 6) {
            Text("超ミニ島")
                .font(.largeTitle.bold())
            HStack(spacing: 20) {
                Text("🌾 \(wheat)")
                    .font(.title2.bold())
                if hasBakery {
                    Text("🍞 \(bread)")
                        .font(.title2.bold())
                        .foregroundStyle(.orange)
                }
                Text("畑 \(fieldCount)/\(maxFields)")
                    .font(.title3)
            }
            Text(message)
                .font(.callout)
                .multilineTextAlignment(.center)
                .foregroundStyle(.brown)
                .padding(.horizontal)
        }
    }

    private var progressBar: some View {
        VStack(spacing: 4) {
            Text("パン屋まで 小麦 \(min(wheat, wheatForBakery)) / \(wheatForBakery)")
                .font(.caption.bold())
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color.gray.opacity(0.2))
                    RoundedRectangle(cornerRadius: 6)
                        .fill(bakeryReady ? Color.orange : Color.green)
                        .frame(width: geo.size.width * CGFloat(min(wheat, wheatForBakery)) / CGFloat(wheatForBakery))
                }
            }
            .frame(height: 14)
        }
        .padding(.horizontal, 4)
    }

    private var bakeryBanner: some View {
        Text(hasBakery ? "🍞 パン屋オープン！ 🍞をタップでパン+1" : "🍞 パン屋解放！ 平地🟩をタップ")
            .font(.headline)
            .foregroundStyle(.white)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity)
            .background(RoundedRectangle(cornerRadius: 12).fill(Color.orange))
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
        VStack(spacing: 8) {
            Text("🌾畑をタップ＝小麦+1 ｜ 左下は海")
                .font(.caption)
                .foregroundStyle(.secondary)
            Button("最初から") { resetIsland() }
                .buttonStyle(.bordered)
        }
    }

    private func tapTile(row: Int, col: Int) {
        switch tiles[row][col] {
        case .sea:
            message = "🌊 海には建てられません"

        case .grass:
            if bakeryReady && !hasBakery {
                tiles[row][col] = .bakery
                hasBakery = true
                message = "🍞 パン屋完成！ 🍞をタップでパン+1"
            } else if fieldCount < maxFields {
                tiles[row][col] = .field
                fieldCount += 1
                message = "🌾 畑を作った！ 畑をタップすると小麦+1"
            } else if bakeryReady {
                message = "🍞 パン屋は1つだけ。🟩をタップ"
            } else {
                message = "畑は\(maxFields)まで。🌾をタップして小麦を集めよう"
            }

        case .field:
            wheat += 1
            if bakeryReady {
                message = "🌾 小麦 \(wheat) … 🟩にパン屋を置こう！"
            } else {
                let left = wheatForBakery - wheat
                message = "🌾 小麦 \(wheat) … あと \(left) でパン屋！"
            }

        case .bakery:
            bread += 1
            message = "🍞 パン \(bread) 個 … おいしい ☕"
        }
    }

    private func resetIsland() {
        tiles = MiniIslandMap.make()
        wheat = 0
        bread = 0
        fieldCount = 0
        hasBakery = false
        message = "☕ まず平地をタップ → 畑を作ろう"
    }
}

private enum TileKind {
    case grass, sea, field, bakery

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
