#!/usr/bin/env bash
#
# Starter Neo4j i Docker, venter på at det svarer, og indlæser build/filosofi.cypher.
#
#   ./scripts/load-neo4j.sh
#
# Miljøvariable:
#   NEO4J_USER  (standard: neo4j)
#   NEO4J_PASS  (standard: filosoffer)
#
set -euo pipefail

cd "$(dirname "$0")/.."

NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASS="${NEO4J_PASS:-filosoffer}"

if [ ! -f build/filosofi.cypher ]; then
  echo "build/filosofi.cypher mangler – bygger først …"
  node scripts/build.js
fi

echo "Starter Neo4j …"
docker compose up -d neo4j

echo "Venter på at Neo4j svarer (op til ~3 min) …"
for i in $(seq 1 90); do
  if docker compose exec -T neo4j cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASS" "RETURN 1;" >/dev/null 2>&1; then
    echo "Neo4j er klar efter ${i} forsøg."
    break
  fi
  if [ "$i" -eq 90 ]; then
    echo "Neo4j svarede ikke. Se logs:  docker compose logs neo4j" >&2
    exit 1
  fi
  sleep 2
done

echo "Indlæser graf …"
docker compose exec -T neo4j cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASS" -f /import/filosofi.cypher

echo
echo "Indlæst. Kontrol:"
docker compose exec -T neo4j cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASS" --format plain \
  "MATCH (n) RETURN labels(n)[0] AS label, count(*) AS antal ORDER BY antal DESC;"
docker compose exec -T neo4j cypher-shell -u "$NEO4J_USER" -p "$NEO4J_PASS" --format plain \
  "MATCH ()-[r]->() RETURN type(r) AS type, count(*) AS antal ORDER BY antal DESC;"

echo
echo "Åbn Neo4j Browser på http://localhost:7474  (login: ${NEO4J_USER} / ${NEO4J_PASS})"
