# 프로젝트 설명
### 실행 방법
`
$ npm run start
`

### PORT 번호
`9000`


# API 명세
## 로그인 API

### Request

```http
POST /members/login
```

**[Body]**
- id : 계정 (string)
- password : 비밀번호 (string)


## 회원가입 API

### Request

```http
POST /members/sign-up
```

**[Body]**
- id : 계정 (string)
- name : 이름 (string)
- password : 비밀번호 (string)
- account : 계좌번호 (string)
- privateKey : 개인키 (string)

### Response

```javascript
{
  "success": true,
    "data": {
    "transactionCount": 0,
      "_id": "64f954a2908c93344b007603",
      "name": "이름",
      "id": "아이디",
      "password": "비밀번호",
      "myAccount": "계좌",
      "privateKey": "개인키",
      "__v": 0
  }
}
```

## Refresh Token API

### Request

```http
POST /members/refresh
```

**[Body]**
- id : 계정 (string)
- accessToken : Access Token (string)
- refrshToken : Refresh Token (string)


### Response

```javascript
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6InRlc3RpZDEiLCJtZW1iZXJOYW1lIjoi7ZmN6ri464-ZIiwiaWF0IjoxNjkzMTU4NzE2LCJleHAiOjE3MDg3MTA3MTZ9.lLsIJMNwqQi0wdcClj4_DGDsI7zuOckVgAR6z1H594s"
}
```

## 사용자 정보 조회

### Request

```http
GET /members/me
```

**[Header]**
- Access-Token : JWT Access Token (String)

### Response

```javascript
{
  "success": true,
  "data": {
    "_id": "64f4a052cd16f6ce68c10e11",
    "id": "testid1",
    "password": "testpwd1",
    "name": "홍길동",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6InRlc3RpZDEiLCJpYXQiOjE2OTQwNTk1NDAsImV4cCI6MTcwOTYxMTU0MH0.IrQGzD-8HBbMZGXItsNt061oq6FUEFmipLBkFjhQNdI",
      "transactionCount": 2,
      "__v": 0
  }
}
```


## 사용자 정보 수정

### Request

```http
PUT /members
```

**[Header]**
- Access-Token : JWT Access Token (String)

**[Body]**
- id: 계정 (string, Optional)
- password: 비밀번호 (string, Optional)
- name: 이름 (string, Optional) 


### Response

```javascript
{
  "success": true
}
```

## 게시글 전체 조회 API

### Request

```http
GET /boards
```



### Response

```javascript
{
  
}
```


## 특정 게시글 조회 API

### Request

```http
GET /boards/:no
```

[path params]
- no : 게시글 번호 (number)

[body]
- subject : 제목 (string)
- content : 내용 (string)


### Response

```javascript
{
  
}
```

## 게시글 작성 API

### Request

```http
POST /boards
```

**[Header]**
- Access-Token : JWT Access Token (String)

**[body]**
- subject : 제목 (string)
- content : 내용 (string)
- imageLink : 이미지 링크 (string)


### Response

```javascript
{
  "success": true
}
```

## 특정 게시글 수정 API

### Request

```http
PUT /boards/:no
```

**[Header]**
- Access-Token : JWT Access Token (String)

[path params]
- no : 게시글 번호 (number)

[body]
- subject : 제목 (string)
- content : 내용 (string)
- minPrice : 최소 금액 (number)
- imageLink : 이미지 링크 (string)

### Response

```javascript
{
  "success": true
}
```

## 특정 게시글 삭제 API

### Request

```http
DELETE /boards/:no
```

**[Header]**
- Access-Token : JWT Access Token (String)

[path params]
- no : 게시글 번호 (number)

### Response

```javascript
{
  "success": true
}
```

## 이미지 업로드 API

### Request

```http
POST /upload
```

**[주의]**
- multipart/form-data로 전송해야 함

[form-data]
- photos : 사진 (File[])

### Response

```javascript
{
  "success": boolean,
  "photos": [string]
}
```


## 송금 API

### Request

```http
POST /blockchain/transaction
```

**[Header]**
- Access-Token : JWT Access Token (String)

**[body]**
- sendEth : 송금 금액 (string)
- boardNo : 게시글 no (number)


### Response

```javascript
{
  "success": true,
  "data": {
    "ownedNfts": [
      {
        "title": string,
        "description": string,
        "media": string
      }
    ]
  }
}
```

## NFT 목록 조회 API

### Request

```http
GET /blockchain/nfts
```

**[Header]**
- Access-Token : JWT Access Token (String)

**[body]**



### Response

```javascript
{
  "success": boolean,
    "data": {
      "url": string
    }
}
```

## NFT 발행 API

### Request

```http
POST /blockchain/nfts
```

**[Header]**
- Access-Token : JWT Access Token (String)

**[body]**
- NFTname : NFT 이름 (string)
- description : 설명 (string)
- img : 이미지 (string)


### Response

```javascript
{
  "success": boolean,
    "data": {
      "url": string
    }
}
```



## 결제 내역 조회 API

### Request

```http
GET /transactions
```

**[Header]**
- Access-Token : JWT Access Token (String)


### Response

```javascript
{
  "success": true,
    "data": [
    {
      "_id": "64f964b9627fcb6d3a058168",
      "createdAt": "2023-09-07T05:50:49.116Z",
      "memberId": "testid1",
      "url": "https://sepolia.etherscan.io/tx/0x0c5bbce5733194262e02277144d0257b898d6a3a182e62a8952b6641d8a73331",
      "__v": 0
    }
  ]
}
```


## 기부 순위 조회 API

### Request

```http
GET /transactions/rank
```

**[Header]**


### Response

```javascript
{
  "success": true,
    "data": [
    {
      "member": {
        "_id": "64fa7e5f9a9b789979052898",
        "transactionCount": 22,
        "name": "철수",
        "id": "testRegister2",
        "password": "testRegisterPwd1",
        "myAccount": "0xd3781f83cfFd979a8C8001DbBf6FAf6B4686ee2d",
        "privateKey": "63484d87cbce5803a4fef3b6ac1ae6aaf9c84cef43048ae3dd3fc7bb4af3a3f1",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6InRlc3RSZWdpc3RlcjIiLCJpYXQiOjE2OTQ1MzAyNDEsImV4cCI6MTcxMDA4MjI0MX0.Naj3ONhBhyY690FuSZOcatnpa7J6tP07HjNo6T-AiQE"
      },
      "rank": 1
    },
  ]
}
```
