.PHONY: all build up firefox bash xquartz hostx11

# Default target
all: up

# Build all services without starting them
build:
	docker build -t x11img .

# Build and start all services
up:
	docker run -it -p 2222:22 x11img

# Run XQuartz
# XQuartz required when running in MacOS
xquartz:
	open -a XQuartz

# Host X11
hostx11:
	xhost +localhost

# Run firefox
firefox:
	ssh -X root@x11img firefox

# Run bash
bash:
	ssh -X root@x11img
