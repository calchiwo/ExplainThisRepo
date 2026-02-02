.PHONY: setup install dev test build publish clean lint format doctor build-node run-node doctor-node

setup: install dev

install:
	pip install -r requirements.txt

dev:
	pip install -r requirements-dev.txt
	pip install -e .

test:
	pytest

lint:
	python -m pyflakes explain_this_repo

format:
	python -m black explain_this_repo
	python -m isort explain_this_repo

build: clean
	python -m build

publish: build
	twine upload dist/*

doctor:
	python -m explain_this_repo --doctor

# Node targets
build-node:
	cd node_version && npm install && npm run build

run-node:
	node node_version/dist/cli.js facebook/react

doctor-node:
	node node_version/dist/cli.js --doctor

clean:
	rm -rf dist build *.egg-info
	rm -rf node_version/dist node_version/node_modules