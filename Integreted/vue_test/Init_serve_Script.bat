:: Vue Project build
echo "Start building your VUE project"

START /B /WAIT cmd /c npm run build

:: express Run
echo "Start Backend"
cd ../backend-main/backend-main
npm start

exit 0
