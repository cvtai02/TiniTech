prj1 = admin

init-prj1:
	@echo "Creating Vite project: $(webui)"
	make viteinit
	make vitepackages
	
init-bff1:

viteinit:
	@echo "Initializing Vite project: $(prj1)"
	npm --yes create vite@latest $(prj1) -- --template react-ts --name=admin

	@echo "Creating common folder structure..."
	cd $(prj1) && mkdir src\components src\pages src\hooks src\utils src\services src\types src\styles

vitepackages:
	@echo "Adding common dependencies to $(prj1)..."
	cd $(prj1) && npm install --save-dev prettier eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin
	cd $(prj1) && npm install react-router-dom
	cd $(prj1) && npm install tailwindcss @tailwindcss/vite

	@echo "Configuring ESLint..."
	cd $(prj1) && echo {"extends": ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "prettier"], "plugins": ["react", "@typescript-eslint"], "parser": "@typescript-eslint/parser", "settings": {"react": {"version": "detect"}}} > .eslintrc.json

	@echo "Configuring Prettier..."
	cd $(prj1) && echo {"semi": true, "singleQuote": true, "tabWidth": 2} > .prettierrc

	@echo "Configuring Tailwind CSS..."
	cd $(prj1) && echo import { defineConfig } from 'vite'; > vite.config.ts
	cd $(prj1) && echo import tailwindcss from '@tailwindcss/vite'; >> vite.config.ts
	cd $(prj1) && echo export default defineConfig({ >> vite.config.ts
	cd $(prj1) && echo   plugins: [tailwindcss()], >> vite.config.ts
	cd $(prj1) && echo }); >> vite.config.ts
	cd $(prj1) && echo @import 'tailwindcss'; > temp_file.txt
	cd $(prj1) && type src\index.css >> temp_file.txt
	cd $(prj1) && move /Y temp_file.txt src\index.css
	
	@echo "add gitignore..."
	cd $(prj1) && curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore

init-uis:
	make init-prj1