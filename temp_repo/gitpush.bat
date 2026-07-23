@echo off
cd /d "c:\Users\aawm8\Downloads\web lan cuoi\temp_repo"
git rm --cached "frontend/js/ADMIN.JS"
git rm --cached "frontend/css/ADMIN.CSS"
git add -A
git commit -m "fix: rename ADMIN.JS to admin.js, ADMIN.CSS to admin.css (case-sensitive)"
git push --force