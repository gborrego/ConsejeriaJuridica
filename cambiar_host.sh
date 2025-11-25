# Cambiar las variables de entorno a _.env
find . -name "\.env" -exec sh -c 'mv "$1" "$(dirname "$1")/_$(basename "$1")"' _ {} \;

# Cambiar las variables de entorno llamdas .docker.env a .env para 
# que funcionen con docker
pwd | xargs -I {} find {} -name "\.docker\.env" | xargs -I {} sh -c 'cp "$0" $(dirname "$0")/.env' {};

echo "Variables de entorno actualizadas para docker con exito";