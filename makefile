project = TiniTech

init-git:
	@echo "Initializing git repository..."
	git init
	git add .
	git commit -m "Init code base"
	gh repo create $(project) --public --source=. --push

init-codebase:
	cd src && make init-codebase

init-project:
	init-codebase init-git