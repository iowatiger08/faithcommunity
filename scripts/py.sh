#!/bin/sh
# Run Python from the project venv when `npm run setup:py` has created it,
# otherwise fall back to the system python3.
if [ -x .venv/bin/python ]; then
  exec .venv/bin/python "$@"
fi
exec python3 "$@"
