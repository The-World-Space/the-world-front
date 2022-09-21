
@REM set PROTOC_GEN_TS_PATH=./node_modules/.bin/protoc-gen-ts.cmd
@REM set OUT_DIR=./generated

@REM protoc ^
@REM     --plugin="protoc-gen-ts=%PROTOC_GEN_TS_PATH%" ^
@REM     --js_out="import_style=commonjs,binary:%OUT_DIR%" ^
@REM     --ts_out="%OUT_DIR%" ^
@REM     --proto_path="../the-world-new-server" ^
@REM     ../the-world-new-server/proto/the_world.proto

protoc -I=../the-world-new-server/proto --ts_out=src/proto ../the-world-new-server/proto/the_world.proto

(echo // @ts-nocheck)>./src/proto/the_world.ts.new
type ".\src\proto\the_world.ts" >> ".\src\proto\the_world.ts.new"
move /y ".\src\proto\the_world.ts.new" ".\src\proto\the_world.ts"