git add .
git commit -m %1
git remote add origin https://github.com/great-anaphylaxis/jhareign-web-app.git
git remote -v
git push -f origin master

firebase deploy --only hosting:jhareign