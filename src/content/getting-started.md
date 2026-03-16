# Chapter 1: What Is nAIVE?

nAIVE is an AI-native game engine built in Rust. Instead of clicking through a visual editor, you describe your world in YAML and Lua — and AI can generate, inspect, and modify everything.

**The key idea:** Every part of your game — scenes, materials, shaders, logic — is a human-readable file. That means an AI agent can be your editor, your level designer, and your playtester.

## What makes it different

- **Sub-second hot-reload.** Shaders in <200ms. Scenes in <100ms. Scripts in <50ms.
- **YAML scenes.** No binary formats. No proprietary editors. Just text files.
- **Lua scripting.** Simple, sandboxed, hot-reloadable game logic.
- **SLANG shaders.** Write once, run on Metal, Vulkan, or DX12.
- **AI-native.** MCP server built in — AI agents can control the engine directly.
- **No royalties.** MIT licensed. Build anything, ship it, keep everything.

---

# Chapter 2: Installation

## macOS (Homebrew)

The fastest way to get started:

```bash
brew install poro/tap/naive
```

Verify the install:

```bash
naive --version
```

## From source (all platforms)

Clone the repo and build with Cargo:

```bash
git clone https://github.com/poro/nAIVE.git
cd nAIVE
```

Download the SLANG SDK (required for shader compilation):

```bash
# macOS ARM
curl -L https://github.com/shader-slang/slang/releases/download/v2026.2.1/slang-2026.2.1-macos-aarch64.tar.gz | tar xz -C vendor/

# macOS Intel
curl -L https://github.com/shader-slang/slang/releases/download/v2026.2.1/slang-2026.2.1-macos-x86_64.tar.gz | tar xz -C vendor/
```

Set the environment variable and build:

```bash
export SLANG_DIR=$(pwd)/vendor
cargo build --release
```

The build produces three binaries in `target/release/`:

- **`naive`** — Main CLI for running games
- **`naive-runtime`** — Full engine runtime
- **`naive_mcp`** — MCP JSON-RPC server for AI agent integration

## Requirements

- **Rust 1.75+** (for building from source)
- **macOS 12+** (Metal), **Windows 10+** (Vulkan/DX12), or **Linux** (Vulkan)
- **GPU with WebGPU support**

---

# Chapter 3: Your First Project

Create a new project with one command:

```bash
naive init my-game
cd my-game
```

This generates a complete project scaffold:

```
my-game/
├── naive.yaml               # Project config
├── CLAUDE.md                # AI agent instructions
├── scenes/
│   └── main.yaml            # Default scene
├── logic/
│   └── player.lua           # Starter player script
├── assets/
│   ├── meshes/              # 3D models (.gltf, .glb, .ply)
│   ├── materials/           # PBR material definitions
│   ├── textures/            # Images
│   └── audio/               # Sound files
├── shaders/passes/          # SLANG render passes
├── pipelines/               # Render pipeline DAG
├── input/bindings.yaml      # Input action mappings
├── events/schema.yaml       # Event type definitions
└── tests/                   # Automated test scripts
```

Run it:

```bash
naive run
```

You should see a window with the default scene — a lit ground plane with a player entity. Move around with WASD, look with the mouse.

---

# Chapter 4: Understanding Scenes

Scenes in nAIVE are YAML files. Here's what a simple scene looks like:

```yaml
# scenes/main.yaml
name: "My First Scene"
ambient_light: [0.1, 0.1, 0.15]

camera:
  position: [0.0, 5.0, 10.0]
  look_at: [0.0, 0.0, 0.0]
  fov: 60.0

entities:
  - name: ground
    mesh: primitive://plane
    material: materials/grass.yaml
    transform:
      scale: [20.0, 1.0, 20.0]
    physics:
      body_type: fixed
      collider: trimesh

  - name: player
    mesh: primitive://capsule
    material: materials/player.yaml
    transform:
      position: [0.0, 2.0, 0.0]
    physics:
      body_type: dynamic
      collider: capsule
      mass: 70.0
    scripts:
      - logic/player.lua
    tags: ["player", "controllable"]

  - name: light
    light:
      type: directional
      color: [1.0, 0.95, 0.9]
      intensity: 2.0
      direction: [-0.5, -1.0, -0.3]
      cast_shadows: true
```

### Key concepts

- **Entities** are the building blocks. Each has a name and optional components (mesh, material, physics, scripts, tags).
- **Transforms** set position, rotation, and scale in world space.
- **Physics** uses Rapier 3D — set body type to `dynamic`, `fixed`, or `kinematic`.
- **Scripts** attach Lua files that run per-entity.
- **Tags** let you query entities at runtime with `scene.find_by_tag()`.

### Hot-reload

Save the YAML file and the scene reloads instantly — no restart needed. Add an entity, change a position, swap a material. It all updates live.

---

# Chapter 5: Lua Scripting

Game logic lives in Lua scripts attached to entities. Here's a basic player controller:

```lua
-- logic/player.lua

local speed = 8.0
local jump_force = 12.0
local grounded = false

function init()
    -- Called once when the entity spawns
    print("Player spawned: " .. entity.name)
end

function update(dt)
    local move = vec3(0, 0, 0)

    if input.is_pressed("move_forward") then
        move.z = move.z - 1.0
    end
    if input.is_pressed("move_back") then
        move.z = move.z + 1.0
    end
    if input.is_pressed("move_left") then
        move.x = move.x - 1.0
    end
    if input.is_pressed("move_right") then
        move.x = move.x + 1.0
    end

    -- Normalize and apply speed
    if vec3.length(move) > 0 then
        move = vec3.normalize(move) * speed
    end

    -- Apply movement via physics
    physics.set_velocity(entity.id, move.x, nil, move.z)

    -- Jump
    if input.just_pressed("jump") and grounded then
        physics.apply_impulse(entity.id, 0, jump_force, 0)
        grounded = false
    end
end

function on_collision(other)
    -- Detect landing
    if other.name == "ground" then
        grounded = true
    end
end
```

### The Lua API at a glance

| Category | Functions |
|----------|-----------|
| **Transform** | `transform.get_position()`, `transform.set_position()`, `transform.look_at()` |
| **Physics** | `physics.set_velocity()`, `physics.apply_impulse()`, `physics.raycast()` |
| **Input** | `input.is_pressed()`, `input.just_pressed()`, `input.mouse_delta()` |
| **Audio** | `audio.play()`, `audio.stop()`, `audio.set_volume()` |
| **Scene** | `scene.spawn()`, `scene.destroy()`, `scene.find_by_tag()` |
| **Events** | `events.emit()`, `events.on()` |
| **Entity** | `entity.id`, `entity.name`, `entity.has_tag()`, `entity.pool_acquire()` |
| **UI** | `ui.text()`, `ui.bar()` |

### Lifecycle hooks

Every script can define these functions:

- **`init()`** — Called once when the entity spawns
- **`update(dt)`** — Called every frame with delta time
- **`on_collision(other)`** — Called when physics bodies collide
- **`on_damage(amount, source)`** — Called when the entity takes damage
- **`on_death()`** — Called when health reaches zero
- **`on_reload()`** — Called during hot-reload to migrate state

---

# Chapter 6: Materials & Shaders

## PBR Materials

Materials are YAML files defining physically-based rendering properties:

```yaml
# assets/materials/metal.yaml
name: "Brushed Metal"
albedo: [0.8, 0.8, 0.82]
metallic: 0.95
roughness: 0.3
normal_map: textures/metal_normal.png
```

Properties you can set:

- `albedo` — Base color (RGB or texture path)
- `metallic` — 0.0 (dielectric) to 1.0 (metal)
- `roughness` — 0.0 (mirror) to 1.0 (matte)
- `normal_map` — Normal texture for surface detail
- `emissive` — Self-illumination color and intensity

## Custom Shaders

nAIVE uses SLANG for shaders, which cross-compiles to WGSL for all GPU backends. The render pipeline is defined as a YAML DAG — you can add custom passes without recompiling the engine:

```yaml
# pipelines/default.yaml
passes:
  - name: shadow
    shader: shaders/passes/shadow.slang
  - name: gbuffer
    shader: shaders/passes/gbuffer.slang
  - name: lighting
    shader: shaders/passes/lighting.slang
    inputs: [shadow, gbuffer]
  - name: bloom
    shader: shaders/passes/bloom.slang
    inputs: [lighting]
  - name: tonemap
    shader: shaders/passes/tonemap.slang
    inputs: [bloom]
  - name: fxaa
    shader: shaders/passes/fxaa.slang
    inputs: [tonemap]
```

---

# Chapter 7: Input Bindings

Map physical inputs to game actions in `input/bindings.yaml`:

```yaml
# input/bindings.yaml
actions:
  move_forward:
    keys: [W, Up]
  move_back:
    keys: [S, Down]
  move_left:
    keys: [A, Left]
  move_right:
    keys: [D, Right]
  jump:
    keys: [Space]
  shoot:
    mouse: [Left]
  aim:
    mouse: [Right]
  interact:
    keys: [E, F]
```

Your Lua scripts reference actions by name (`input.is_pressed("jump")`), not raw keys. This means you can remap controls without touching game logic.

---

# Chapter 8: AI Agent Integration

nAIVE includes a built-in MCP (Model Context Protocol) server. This lets AI agents — like Claude via OpenClaw — control the engine programmatically.

## Starting the MCP server

```bash
naive_mcp --project ./my-game
```

The MCP server exposes commands for:

- **Scene manipulation** — Spawn entities, modify transforms, change materials
- **Asset generation** — Text-to-3D pipeline (FLUX.1 → Hunyuan3D → engine)
- **Playtesting** — Run automated test scripts, capture screenshots
- **Pipeline control** — Modify render passes, adjust lighting

## AI as your editor

With the MCP server running, your AI agent can:

1. Read your scene files and understand the game world
2. Generate new entities, scripts, and materials
3. Hot-reload changes and see the results
4. Run tests to verify gameplay

Add a `CLAUDE.md` file to your project root with Lua API docs and project-specific instructions. When an AI agent opens your project, it instantly knows how to work with it.

## Text-to-3D assets

Generate 3D models from text prompts:

```bash
# Set up environment
cp .env.example .env
# Add your HuggingFace token to .env

# Generate an asset
cd tools/game-asset-mcp
node test_generate.js "medieval wooden chest"
```

The pipeline: text prompt → 2D image (FLUX.1) → 3D mesh (Hunyuan3D) → `.glb` file ready for the engine.

---

# Chapter 9: Testing & Debugging

## Headless testing

Run automated tests without opening a window:

```bash
naive test
```

Tests are Lua scripts in the `tests/` directory:

```lua
-- tests/test_player_spawn.lua
function test()
    local player = scene.find_by_tag("player")
    assert(player, "Player entity should exist")

    local pos = transform.get_position(player[1])
    assert(pos.y > 0, "Player should be above ground")

    print("✓ Player spawn test passed")
end
```

## Debugging tips

- **`print()` in Lua** — Output goes to the terminal
- **`naive run --debug`** — Enables physics debug visualization (wireframe colliders)
- **Hot-reload** — Fix bugs without restarting. Save the file and changes apply instantly
- **`events.schema.yaml`** — Define event types to catch typos at load time

---

# Chapter 10: Next Steps

You now have a working nAIVE project. Here's where to go from here:

## Build something

- **A platformer** — Use physics colliders for platforms, the jump system for movement, and tags for collectibles
- **An arena shooter** — Hitscan raycast API for weapons, health/damage system for combat, entity pooling for projectiles
- **A walking sim** — Focus on materials, lighting, and Gaussian splats for photorealistic environments

## Explore the engine

- **Gaussian splatting** — Load `.ply` files for photorealistic 3D captures
- **GPU compute** — Simulate 50,000+ entities with compute shaders
- **Spatial audio** — Positional sound with Kira
- **Custom render passes** — Add post-processing effects to the pipeline DAG

## Join the community

- **GitHub:** [github.com/poro/nAIVE](https://github.com/poro/nAIVE) — Star the repo, open issues, contribute
- **Discord:** [discord.gg/clawd](https://discord.com/invite/clawd) — Chat with other builders
- **Streams:** Watch nAIVE get built live at [gameagent.dev](https://gameagent.dev)

## Read the full docs

- **Lua API Reference** — See `CLAUDE.md` in any nAIVE project for the complete API
- **The Dufus Guide** — [gameagent.dev/guide](/guide) — How to set up an AI agent to build games for you
