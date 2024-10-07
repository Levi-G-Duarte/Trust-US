set /p "branch=Branch: "
set /p "msg=Commit: "
git checkout %branch%
git pull origin main
git add .
git commit -m "%msg%"
git push origin %branch%
git checkout main
git pull origin main
git merge %branch%
git push origin main
git checkout %branch%
