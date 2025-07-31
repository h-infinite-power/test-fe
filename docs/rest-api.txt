* 모든 table row 생성시에 id는 시계열에 따른 id를 얻어내는 전역 static 메서드를 통해 생성한다.(중복이 최대한 되지 않도록, 시계열 생성이므로 아이디의 순차적인 오름차순은 유지됨)

---

## 1️⃣ Test Members API

### 1. 구성원 등록

**POST** `/test-api/test-members`

#### Request

```json
{
  "testMemberName": "홍길동"
}
```

#### Response

✅ **201 Created**

```json
{
  "testMemberId": 1
}
```

---

### 2. 구성원 전체 조회

**GET** `/test-api/test-members`

#### Response

✅ **200 OK**

```json
[
  {
    "testMemberId": 1,
    "testMemberName": "홍길동"
  },
  {
    "testMemberId": 2,
    "testMemberName": "김철수"
  }
]
```

---

### 3. 구성원 상세 조회

**GET** `/test-api/test-members/{testMemberId}`

#### Response

✅ **200 OK**

```json
{
  "testMemberId": 1,
  "testMemberName": "홍길동"
}
```

❌ **400 Bad Request**

```json
{
  "error": "Member not found"
}
```

```json
{
  "error": "동일한 이름의 멤버가 존재합니다. -> 동명이인은 무시됩니다."
}
```

---

### 4. 구성원 수정

**PUT** `/test-api/test-members/{testMemberId}`

#### Request

```json
{
  "testMemberName": "홍길동 수정",
}
```

#### Response

✅ **200 OK**

```json
{
  "testMemberId": 1,
  "testMemberName": "홍길동 수정",
}
```

❌ **400 Bad Request**

```json
{
  "error": "Member not found"
}
```

---

### 5. 구성원 삭제

**DELETE** `/test-api/test-members/{testMemberId}`

#### Response

✅ **204 No Content**

❌ **400 Bad Request**

```json
{
  "error": "Member not found"
}
```

---

## 2️⃣ Test Attendance API

### 1. 출석 체크 등록

**POST** `/test-api/test-attendances`
-- 날짜는 요청 당일 날짜로 만들어짐 

#### Request

```json
{
  "testMemberId": 1 
}
```

#### Response

✅ **201 Created**

```json
{
  "testMemberId": 10
}
```

---

### 2. 출석 체크 조회

2-1. 출석 체크 전체 조회

**GET** `/test-api/test-attendances`

#### Response

✅ **200 OK**

```json
[
    {
        "testAttendanceId": 10,
        "testMemberId": 1,
        "testAttendanceDate": "2025-07-29",
        "testLikesCount": 2, /* testAttendanceId에 해당하는 TestLikes 개수 반환 */
        "testCommentsCount": 3 /* testAttendanceId에 해당하는 TestCommnts 개수 반환 */
    }, ...
]
```

2-2. 출석 체크 상세 조회
**GET** `/test-api/test-attendances/{testAttendanceId}`

#### Response

✅ **200 OK**

```json
{
    "testAttendanceId": 10,
    "testMemberId": 1,
    "testAttendanceDate": "2025-07-29",
    "testLikes": [ /* testLikesCount는 List Size로 확인 */
        {
            "testLikeId": 1,
            "testMemberId": 2,
            "testMemberName" : "홍길동"
        }
    ], 
    "testComments": [ /* testLikesCount는 List Size로 확인 */
        {
            "testCommenId": 1,
            "testMemberId": 2,
            "testMemberName" : "홍길동",
            "testComment": "수고하셨습니다!"
        }
    ]
}, ...
```

❌ **400 Bad Request**

```json
{
  "error": "Attendance not found"
}
```

---

### 3. 출석 체크 수정
* 존재하지 않음 출석체크는 단순히 해당일자에 해당 멤버의 데이터가 존재하면 출석한걸로 인정함
* 지각여부등은 체크하지 않음

---

### 4. 출석 체크 삭제

**DELETE** `/test-api/test-attendances/{testAttendaceId}`

#### Response

✅ **204 No Content**

❌ **400 Bad Request**

```json
{
  "error": "Attendance not found"
}
```

---

### 5. 출석 체크 좋아요 추가

**POST** `/test-api/test-attendances/{testAttendaceId}/test-likes`

#### Request
```json
{
  "testMemberId": 10, /* 좋아요 누른 memberId */
}
```

#### Response

✅ **201 Created**

```json
{
  "testLikeId": 10
}
```

❌ **400 Bad Request**

```json
{
  "error": "Attendance not found"
}
```

---

### 6. 출석 체크 좋아요 취소

**DELETE** `/test-likes/{testLikeId}` 
/* 
    삭제후에는 다시 **GET** `/test-api/test-attendances/{testAttendanceId}` 상세조회를 통해 좋아요 수 및 좋아요 누른사람 데이터 reset 
 */

#### Response

✅ **204 No Content**

❌ **400 Bad Request**

```json
{
  "error": "Attendance not found"
}
```

---

### 7. 댓글 등록
POST /test-api/test-attendances/{testAttendaceId}/test-comments

#### Request
``` json
{ 
  "testMemberId": 2,
  "testComment": "오늘도 수고하셨습니다!"
}
```

#### Response
✅ 201 Created

``` json
{
  "testCommentId": 1
}
```



### 8. 댓글 수정
PUT /test-api/test-comments/{testCommentId}

#### Request
``` json
{
  "testComment": "정말 고생 많으셨습니다!"
}
```
#### Response
✅ 200 OK

``` json
{
  "testCommentId": 1,
}
```

### 9. 댓글 삭제
DELETE /test-api/test-comments/{testCommentId}
/* 
    삭제후에는 다시 **GET** `/test-api/test-attendances/{testAttendanceId}` 상세조회를 통해 댓글 수 및 댓글내용 reset 
 */

#### Response
✅ **204 No Content**