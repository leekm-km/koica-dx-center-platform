# 🔐 관리자 계정 정보

## 최고 관리자 (Super Admin)

**이메일:** leekm.inc@gmail.com  
**비밀번호:** `admin2026!`  
**이름:** Kyeongmin Lee (Super Admin)  
**역할:** admin  
**생성일:** 2026-02-15

---

## 로그인 방법

1. **웹사이트 접속**
   - http://localhost:5500/lms.html (Live Server)
   - 또는 브라우저에서 lms.html 열기

2. **로그인 정보 입력**
   - Email: `leekm.inc@gmail.com`
   - Password: `admin2026!`

3. **관리자 권한**
   - ✅ 모든 포트폴리오 삭제 가능
   - ✅ 모든 채용 공고 삭제 가능
   - 🔜 사용자 관리 (Phase 3)
   - 🔜 통계 대시보드 (Phase 3)

---

## 보안 주의사항

⚠️ **중요:** 이 비밀번호는 개발용입니다. 프로덕션 환경에서는 반드시 변경하세요!

**추천 비밀번호 강도:**
- 최소 12자 이상
- 대소문자, 숫자, 특수문자 조합
- 정기적인 변경 (3개월마다)

---

## 비밀번호 변경 방법

추후 프로필 페이지에서 변경하거나, 지금은 SQL로 직접 변경:

```bash
# 1. 새 비밀번호 해시 생성
cd server
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('새비밀번호', 10).then(console.log);"

# 2. 데이터베이스 업데이트
sqlite3 database.sqlite "UPDATE users SET password_hash='새해시값' WHERE email='leekm.inc@gmail.com';"
```
