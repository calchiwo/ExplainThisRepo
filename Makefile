.PHONY: install dev test build publish clean

install:
	pip install -r requirements.txt

dev:
	pip install -e .

test:
	python -m explain_this_repo --version

build:
	python -m build

publish:
	twine upload dist/*

clean:
	rm -rf dist build *.egg-info