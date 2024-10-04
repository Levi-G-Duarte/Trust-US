set /p "branch=Branch: "
set /p "msg=Commit: "
git checkout %branch%
git pull origin main
git add .
git commit -m "%msg%"
git status
pause
git push origin %branch%
git checkout main
git merge %branch%
git push origin main
git status
pause
git checkout %branch%
