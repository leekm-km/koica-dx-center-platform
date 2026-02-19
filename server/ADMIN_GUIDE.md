# 관리자 계정 생성 가이드

첫 관리자 계정을 생성하는 여러 방법을 안내합니다.

---

## 방법 1: 대화형 스크립트 사용 (추천) ⭐

가장 쉬운 방법입니다. 스크립트가 필요한 정보를 물어봅니다.

```bash
cd server
node db-scripts/create-admin.js
```

**입력 정보:**
- Admin Email
- Password (최소 8자)
- Full Name

스크립트는 자동으로:
- 이메일 중복 확인
- 비밀번호 해싱
- Admin 역할로 계정 생성

---

## 방법 2: SQL로 직접 생성

데이터베이스에 직접 접근해서 생성합니다.

### Step 1: 비밀번호 해시 생성

먼저 비밀번호를 해싱해야 합니다:

```bash
cd server
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(hash => console.log(hash));"
```

출력된 해시를 복사하세요.

### Step 2: SQL 실행

```bash
sqlite3 database.sqlite
```

```sql
INSERT INTO users (email, password_hash, full_name, role, status) 
VALUES (
    'admin@koica.com',
    '$2b$10$...생성한해시여기붙여넣기...',
    'Administrator',
    'admin',
    'active'
);
```

`.quit`로 종료합니다.

---

## 방법 3: 기존 사용자를 Admin으로 승격

이미 회원가입한 사용자를 관리자로 만들고 싶다면:

```bash
sqlite3 database.sqlite "UPDATE users SET role='admin' WHERE email='user@example.com';"
```

또는 대화형 스크립트를 실행하면 자동으로 승격 옵션이 나타납니다.

---

## 관리자 확인

관리자가 제대로 생성되었는지 확인:

```bash
sqlite3 database.sqlite "SELECT id, email, full_name, role FROM users WHERE role='admin';"
```

---

## 관리자 역할이란?

현재 시스템에서 `admin` 역할은 다음 권한을 가집니다:

### 구현 완료:
- ✅ 모든 포트폴리오 삭제 가능
- ✅ 모든 채용 공고 삭제 가능

### 구현 예정 (Phase 3):
- 📊 사용자 관리 (차단, 삭제)
- 📊 컨텐츠 승인/거부
- 📊 통계 대시보드 접근
- 📊 시스템 설정 변경

---

## 빠른 예제

### 개발용 관리자 계정 생성

```bash
cd server

# 대화형 스크립트 실행
node db-scripts/create-admin.js

# 입력:
# Email: admin@koica.com
# Password: admin123
# Name: System Administrator
```

### 테스트 관리자 - SQL로 직접 (해시 포함)

```bash
# 비밀번호 'admin123'의 해시 생성
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(console.log);"

# 출력된 해시로 admin 생성 (예시)
sqlite3 database.sqlite <<EOF
INSERT INTO users (email, password_hash, full_name, role, status, created_at) 
VALUES ('admin@koica.com', '\$2b\$10\$hashed_password_here', 'Admin', 'admin', 'active', datetime('now'));
EOF
```

---

## 보안 주의사항 ⚠️

1. **강력한 비밀번호 사용**
   - 최소 12자 이상 권장
   - 대소문자, 숫자, 특수문자 조합

2. **관리자 계정 보호**
   - 관리자 이메일을 공개하지 마세요
   - 2단계 인증 고려 (향후 구현)

3. **정기적인 비밀번호 변경**
   - 3개월마다 변경 권장

4. **프로덕션 환경**
   - 기본 admin 계정 비활성화
   - 개인 이메일로 admin 계정 생성

---

## 문제 해결

### "Email already exists" 오류
기존 사용자를 admin으로 승격:
```bash
sqlite3 database.sqlite "UPDATE users SET role='admin' WHERE email='your@email.com';"
```

### 비밀번호를 잊어버렸을 때
새 비밀번호 해시로 재설정:
```bash
# 1. 새 비밀번호 해시 생성
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('new-password', 10).then(console.log);"

# 2. 비밀번호 업데이트
sqlite3 database.sqlite "UPDATE users SET password_hash='새해시' WHERE email='admin@koica.com';"
```

### 모든 admin 계정 삭제됨
스크립트로 새로 생성:
```bash
node db-scripts/create-admin.js
```
