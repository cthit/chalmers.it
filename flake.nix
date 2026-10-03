{
  description = "This Nix flake creates a development shell that provides a Node.js environment with Prisma and pnpm installed";
  inputs.nixpkgs.url = "nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
          nodejs_24
          pnpm
          openssl
          prisma-engines
        ];
        shellHook = with pkgs; ''
          # Prisma related
          export PRISMA_SCHEMA_ENGINE_BINARY="${prisma-engines}/bin/schema-engine"
          export PATH="$PWD/node_modules/.bin/:$PATH"
        '';
      };
    });
}
