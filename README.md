# cse_chaining


메타마스크 문서: https://www.notion.so/KEY-f04dcb08d0974785be4e2085cab4941e



**back-end**


- node01/index.js => 이 파일에 모든 코드를 때려박아두었으니 주석보고 알아서 찢어쓰면 됨


- 기존 프로젝트에 합치되 아래 폴더 및 파일은 반드시 집어넣어야함


./image => 토큰 이미지 폴더

./module => api 연동 폴더

./upload => pinata json 파일 저장하는 곳으로, 굳이 복사할 필요없음 저 이름으로 빈 폴더 하나만 생성해두면 됨

./.env => 개인키나 api키 저장해둔 곳. 수정 필요할 시 기존 변수 삭제하지말고 반드시 아래에 추가하는 방식으로 수정


- 패키지 설치


npm install --save ethereumjs-tx@1.3.7

//버전 반드시 유의해서 설치. 최신버전으로 설치하면 코드 안돌아감

npm install --save alchemy-sdk

npm install --save api

npm install --save fs

npm install --save ipfs-api

npm i dotenv


나머지는 굳이 필요없기도 하고 이미 깔려있을거같아서 뺐는데 패키지 오류뜨면 연락 주면 됨



---------------



**front-end**

- node01/matamask.html < 이 파일만 보면 됨

- 패키지 설치 필요없음
  다만 이게 php 서버를 돌리거나 해서 확인해야 정상적으로 돌아감 그냥 open in default browser로 확인하면 오류 뜸 아마 이 부분은 문제없긴 할듯?
