import SwiftUI

/// Coffee Break 超ミニ島 — Swift Playgrounds 用
/// 5×5 の島。平地をタップして畑（最大3）。2秒ごとに小麦+1。
struct ContentView: View {
    private let gridSize = 5
    private let maxFields = 3
    private let tickSeconds = 2.0

    @State private var tiles: [[TileKind]] = MiniIslandMap.make()
    @State private var wheat = 0
    @State private var fieldCount = 0
    @State private var message = "☕ 平地をタップして畑を作ろう"
    @State private var timer = Timer.publish(every: 2, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 16) {
            header
            islandGrid
            footer
        }
        .padding()
        .onReceive(timer) { _ in
            harvestWheat()
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Text("超ミニ島")
                .font(.largeTitle.bold())
            Text("Coffee Break × Swift Playgrounds")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            HStack(spacing: 24) {
                Label("\(wheat)", systemImage: "leaf.fill")
                    .font(.title2.bold())
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
        .disabled(!tile.isTappable && tile != .field)
    }

    private var footer: some View {
        VStack(spacing: 10) {
            Text("左下は海（建てられません）")
                .font(.caption)
                .foregroundStyle(.secondary)
            Button("最初から") {
                resetIsland()
            }
            .buttonStyle(.bordered)
        }
    }

    private func tapTile(row: Int, col: Int) {
        guard tiles[row][col] == .grass else {
            if tiles[row][col] == .sea {
                message = "🌊 海には建てられません"
            }
            return
        }
        guard fieldCount < maxFields else {
            message = "畑は \(maxFields) まで。小麦を増やそう ☕"
            return
        }
        tiles[row][col] = .field
        fieldCount += 1
        message = "🌾 畑を作った！ \(Int(tickSeconds)) 秒ごとに小麦+1"
    }

    private func harvestWheat() {
        guard fieldCount > 0 else { return }
        wheat += fieldCount
        if wheat >= 12 {
            message = "🍞 小麦 \(wheat) … anno_proto のパン屋まで、あと少し！"
        } else {
            message = "🌾 小麦 \(wheat) … のんびり増えています"
        }
    }

    private func resetIsland() {
        tiles = MiniIslandMap.make()
        wheat = 0
        fieldCount = 0
        message = "☕ 平地をタップして畑を作ろう"
    }
}

private enum TileKind {
    case grass
    case sea
    case field

    var emoji: String {
        switch self {
        case .grass: "🟩"
        case .sea: "🌊"
        case .field: "🌾"
        }
    }

    var backgroundColor: Color {
        switch self {
        case .grass: Color.green.opacity(0.25)
        case .sea: Color.blue.opacity(0.25)
        case .field: Color.yellow.opacity(0.35)
        }
    }

    var isTappable: Bool {
        self == .grass
    }
}

private enum MiniIslandMap {
    static func make() -> [[TileKind]] {
        var grid = Array(repeating: Array(repeating: TileKind.grass, count: 5), count: 5)
        // 左下の海（anno_proto と同じイメージ）
        grid[4][0] = .sea
        grid[4][1] = .sea
        grid[3][0] = .sea
        return grid
    }
}

#Preview {
    ContentView()
}
