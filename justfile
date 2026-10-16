dev:
    echo "This will constantly build and copy executable to ./out/describetime"
    bun run build:watch

build:
    bun run build

ship: build linux-build

linux-build:
    bun build src/index.ts --target=bun --outfile ./out/describetime-linux-x64-modern --compile --minify --sourcemap --bytecode --target=bun-linux-x64-modern
    bun build src/index.ts --target=bun --outfile ./out/describetime-linux-arm64 --compile --minify --sourcemap --bytecode --target=bun-linux-arm64

# linux-dev:
#     bun build --watch src/index.ts --target=bun --outfile ~/Desktop/gg-linux-arm64 --compile --minify --sourcemap --bytecode --target=bun-linux-arm64

check:
    bun check
    
lint: check
    bun run format

format: lint

install:
    bun install

outdated:
    bun outdated

test:
    bun test

release:
    bun run release

upgrade:
    bun update --interactive --minimum-release-age=86400 && bun install

