:: Vue Project build
echo "Start building your VUE project"
echo "--------------------------------"
echo "Running Spring boot"
start /d "../vue-backend/build/libs" java -jar vue-backend-0.0.1-SNAPSHOT.jar
echo "Running Vue Sever"
npm run serve