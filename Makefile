PORT ?= 5173
LOG_FILE := .dev.log
URL := http://localhost:$(PORT)

.PHONY: start stop restart status build install clean

install:
	npm install

# Tracked by the port, not a pidfile: `npx`/`npm exec` spawns vite's actual
# server as a child and doesn't forward signals to it, so killing the
# wrapper's own PID leaves an orphaned server still listening. Killing
# whatever holds the port is what actually frees it.
start: install
	@if lsof -ti:$(PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "Already running at $(URL)"; \
	else \
		nohup npx vite --port $(PORT) > $(LOG_FILE) 2>&1 & \
		echo "Waiting for $(URL) ..."; \
		if timeout 30 bash -c 'until curl -sf $(URL) >/dev/null; do sleep 0.5; done'; then \
			echo "Started at $(URL)"; \
		else \
			echo "Failed to start - see $(LOG_FILE)"; \
			exit 1; \
		fi; \
	fi

stop:
	@pids=$$(lsof -ti:$(PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$pids" ]; then \
		echo $$pids | xargs kill; \
		echo "Stopped"; \
	else \
		echo "Not running"; \
	fi

restart: stop start

status:
	@if lsof -ti:$(PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "Running at $(URL)"; \
	else \
		echo "Not running"; \
	fi

build:
	npx vite build

clean:
	rm -rf dist $(LOG_FILE)
