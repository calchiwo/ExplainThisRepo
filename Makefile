.PHONY: setup install dev test build publish clean lint format doctor

setup: install dev

install:
	pip install -r requirements.txt

dev:
	pip install -r requirements-dev.txt
	pip install -e .

test:
	python -m explain_this_repo --version

lint:
	python -m pyflakes explain_this_repo

format:
	python -m black explain_this_repo

build: clean
	python -m build

publish: build
	twine upload dist/*

doctor:
	python -m explain_this_repo --doctor

clean:
	rm -rf dist build *.egg-info
