# 데이터베이스 관리 가이드

SQLite 데이터베이스를 조회하고 관리하는 여러 방법을 안내합니다.

## 📁 데이터베이스 파일 위치

```
server/database.sqlite
```

---

## 방법 1: 제공된 스크립트 사용 (가장 쉬움) ⭐

### 모든 사용자 조회
```bash
cd server/db-scripts
./view-users.sh
```

### 대화형 SQLite 셸 열기
```bash
cd server/db-scripts
./interactive.sh
```

대화형 셸에서 사용 가능한 명령어:
- `.tables` - 모든 테이블 목록 보기
- `.schema users` - users 테이블 구조 보기
- `SELECT * FROM users;` - 모든 사용자 조회
- `SELECT * FROM users WHERE role='student';` - 학생만 조회
- `.quit` - 종료

### 특정 사용자 삭제
```bash
cd server/db-scripts
./delete-user.sh test@example.com
```

### 데이터베이스 초기화 (모든 데이터 삭제)
```bash
cd server/db-scripts
./reset-database.sh
```

---

## 방법 2: 직접 SQLite 명령 실행

### 모든 사용자 조회
```bash
cd server
sqlite3 database.sqlite "SELECT * FROM users;"
```

### 특정 필드만 조회
```bash
sqlite3 database.sqlite "SELECT id, email, full_name, role FROM users;"
```

### 학생만 조회
```bash
sqlite3 database.sqlite "SELECT * FROM users WHERE role='student';"
```

### 사용자 수 확인
```bash
sqlite3 database.sqlite "SELECT COUNT(*) FROM users;"
```

### 최근 가입한 사용자 5명
```bash
sqlite3 database.sqlite "SELECT email, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

---

## 방법 3: GUI 도구 사용

### DB Browser for SQLite (추천)

1. **설치:**
   ```bash
   brew install --cask db-browser-for-sqlite
   ```

2. **실행:**
   - DB Browser 앱 실행
   - "Open Database" 클릭
   - `server/database.sqlite` 파일 선택

**장점:**
- 시각적으로 데이터 확인
- 테이블 구조 쉽게 파악
- SQL 쿼리 에디터 제공
- 데이터 수정/삭제 GUI로 가능

---

## 방법 4: Node.js 스크립트 사용

간단한 관리 스크립트를 만들 수도 있습니다:

```javascript
// server/db-scripts/view-all-users.js
const db = require('../database');

async function viewAllUsers() {
    await db.connect();
    const users = await db.all('SELECT id, email, full_name, role, track, batch, created_at FROM users');
    console.table(users);
    await db.close();
}

viewAllUsers();
```

실행:
```bash
cd server
node db-scripts/view-all-users.js
```

---

## 유용한 SQL 쿼리 모음

### 1. 역할별 사용자 수
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### 2. 트랙별 학생 수
```sql
SELECT track, COUNT(*) as count 
FROM users 
WHERE role='student' 
GROUP BY track;
```

### 3. 최근 로그인한 사용자
```sql
SELECT email, full_name, last_login 
FROM users 
WHERE last_login IS NOT NULL 
ORDER BY last_login DESC 
LIMIT 10;
```

### 4. 특정 사용자 정보 업데이트
```sql
UPDATE users 
SET full_name='New Name', track=2 
WHERE email='user@example.com';
```

### 5. 비활성 계정으로 변경
```sql
UPDATE users 
SET status='inactive' 
WHERE email='user@example.com';
```

---

## 주의사항 ⚠️

1. **데이터베이스 백업**
   ```bash
   cp server/database.sqlite server/database.backup.sqlite
   ```

2. **서버 실행 중 주의**
   - 서버가 실행 중일 때 데이터베이스를 직접 수정하면 문제가 발생할 수 있습니다
   - 중요한 작업 전에는 서버를 중지하세요

3. **SQL Injection 방지**
   - 사용자 입력을 직접 SQL에 넣지 마세요
   - 항상 prepared statements 사용

---

## 빠른 예제

### 현재 데이터베이스 상태 확인
```bash
cd server
echo "=== 테이블 목록 ==="
sqlite3 database.sqlite ".tables"

echo -e "\n=== Users 테이블 구조 ==="
sqlite3 database.sqlite ".schema users"

echo -e "\n=== 전체 사용자 수 ==="
sqlite3 database.sqlite "SELECT COUNT(*) FROM users;"

echo -e "\n=== 최근 5명 사용자 ==="
sqlite3 database.sqlite "SELECT email, full_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```
