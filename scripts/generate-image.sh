#!/usr/bin/env bash
# Reusable FLUX (BFL API) generation + poll + download.
#
# For flux-pro-1.1-ultra: dimspec is an aspect ratio, e.g. "4:3" (uses raw=true for candid feel)
# For other models (e.g. flux-pro-1.1): dimspec is "WIDTHxHEIGHT", e.g. "1024x1280"
#
# Usage: ./generate-image.sh <model-path> <dimspec> <output-file> <prompt-file>
set -euo pipefail

if [ $# -ne 4 ]; then
  echo "Usage: $0 <model-path> <dimspec> <output-file> <prompt-file>" >&2
  exit 1
fi

MODEL_PATH="$1"
DIMSPEC="$2"
OUTPUT="$3"
PROMPT="$(cat "$4")"

if [ -z "${BFL_API_KEY:-}" ]; then
  echo "ERROR: BFL_API_KEY is not set" >&2
  exit 1
fi

if [[ "$MODEL_PATH" == *ultra* ]]; then
  BODY=$(jq -n --arg p "$PROMPT" --arg ar "$DIMSPEC" '{prompt: $p, aspect_ratio: $ar, raw: true}')
else
  WIDTH="${DIMSPEC%x*}"
  HEIGHT="${DIMSPEC#*x}"
  BODY=$(jq -n --arg p "$PROMPT" --argjson w "$WIDTH" --argjson h "$HEIGHT" '{prompt: $p, width: $w, height: $h}')
fi

RESP=$(curl -s -X POST "https://api.bfl.ai/v1/${MODEL_PATH}" \
  -H "x-key: $BFL_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$BODY")

POLL_URL=$(echo "$RESP" | jq -r '.polling_url // empty')
if [ -z "$POLL_URL" ]; then
  echo "ERROR starting generation: $RESP" >&2
  exit 1
fi

for i in $(seq 1 60); do
  RESULT=$(curl -s "$POLL_URL" -H "x-key: $BFL_API_KEY")
  STATUS=$(echo "$RESULT" | jq -r '.status // empty')
  if [ "$STATUS" = "Ready" ]; then
    IMG_URL=$(echo "$RESULT" | jq -r '.result.sample')
    mkdir -p "$(dirname "$OUTPUT")"
    curl -s -o "$OUTPUT" "$IMG_URL"
    echo "Saved: $OUTPUT"
    exit 0
  elif [ "$STATUS" = "Error" ] || [ "$STATUS" = "Failed" ]; then
    echo "ERROR generating image: $RESULT" >&2
    exit 1
  fi
  sleep 2
done

echo "TIMEOUT waiting for $OUTPUT" >&2
exit 1
