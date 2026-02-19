# KOICA-실리만대 DX 센터 통합 플랫폼 (SKDP)

## 1. 프로젝트 개요

### 기본 정보
- **프로젝트명**: 필리핀 두마게티 정보통신 기능인력 양성사업 통합 플랫폼 구축
- **영문명**: Silliman-KOICA DX Platform (SKDP)
- **목적**: 교육생 관리, 학습 자료 공유, 포트폴리오 아카이빙, BPO 기업 채용 연계를 통합 지원하여 사업의 성과 확산 및 지속가능성 확보
- **운영 주체**: 
  - 초기: 한남대학교 산학협력단
  - 이양 후: 실리만대학교 경영대학/TEVEC

### 주요 타겟
1. **훈련생**: 
   - 지역 청년 (Track 1)
   - 재학생 (Track 2)
2. **교수진**: 
   - 한남대 파견 교수
   - 현지 양성 강사 (Track 3)
3. **기업**: 
   - 두마게티 지역 BPO 기업 (Inspiro, WrkPod 등)

---

## 2. 웹사이트 메뉴 구조 (Sitemap)

### ① 메인 (Home)
- **비주얼 배너**: DX 센터(BA 313호) 내부 전경 및 교육 활동 사진, 수료식 사진 슬라이드
- **사업 소개**: KOICA 시민사회협력프로그램 소개 및 "양질의 일자리 창출(SDG 8)", "양질의 교육(SDG 4)" 목표 명시
- **현황 대시보드 (Live Stats)**:
  - 누적 수료생 수 (예: 1기 19명 수료)
  - TESDA NC II 자격증 취득률 (예: 100%)
  - 파트너 기업 수 및 취업 성공 수

### ② 교육 프로그램 (Programs)

#### 커리큘럼 소개 (Curriculum)
- **Track 1 (기초)**: 지역 청년 대상
  - AI 기초, 데이터 모델링, 데이터 분석 시각화
  - 124시간
- **Track 2 (심화)**: 대학생 대상
  - 머신러닝, 딥러닝, LLM 응용
  - 120시간
- **Track 3 (교강사)**: 현지 교수 대상
  - 교수법 및 실습 지도
  - 30시간

#### 강사진 소개 (Faculty)
- **강신철 위원**: AI 개론, 프롬프트 엔지니어링, DB 모델링 담당
- **송희석 교수**: 데이터 분석(Pandas), 머신러닝, 시각화 담당
- **현지 강사**: Track 3를 수료하고 인증받은 실리만대 교수진

### ③ 학습 자료실 (LMS & Archives)
- **접근 제어**: 로그인 후 접근 가능 (DB 연동)
- **교재 및 강의자료**:
  - 자체 개발 교재 2식 (AI & DB Modeling / Data Analytics) PDF 뷰어 제공
  - 강의 슬라이드(PPT) 및 실습용 데이터셋(Dataset) 다운로드
- **실습 도구 가이드**: VS Code, Python, Pandas 라이브러리 설치 및 활용법 안내

### ④ 인재 DB 및 포트폴리오 (Talent Pool)
- **수료생 프로필**: 기수(Batch)별 수료생 명단 및 보유 스킬(Python, SQL, Visualization 등) 태그 표시
- **프로젝트 갤러리**: 훈련생들이 수행한 팀 프로젝트 결과물 게시
  - 예시 1: 직원 이직 예측 모델 (Employee Attrition Analysis) - Van Kirk Lumantas 외
  - 예시 2: 학생 취업 가능성 분석 (Student Employability)
- **인증 배지**: KOICA 수료증 및 TESDA NC II(Contact Center Services) 자격 보유 여부 표시

### ⑤ 취업 연계 (Career Center)
- **채용 공고 (Job Board)**: 파트너사(Inspiro, Straive 등) 및 지역 BPO 기업의 채용 정보 게시
- **잡 매칭 신청**: 수료생이 이력서를 등록하면 기업 인사담당자가 열람 후 면접 제의 (SIL 프로그램 및 Job Fair 연계)

---

## 3. 데이터베이스(DB) 설계안

### 주요 테이블 구조

| 테이블명 | 주요 컬럼 (Attributes) | 비고 |
|---------|----------------------|------|
| **Users** | `user_id(PK)`, `password`, `name`, `email`, `role(admin/student/tutor/company)` | 사용자 기본 정보 |
| **Trainees** | `trainee_id(PK)`, `user_id(FK)`, `batch_no(기수)`, `track_type(1/2)`, `major`, `disability_yn(장애여부)`, `gender` | 교육생 상세 정보 |
| **Attendance** | `att_id(PK)`, `trainee_id(FK)`, `date`, `sign_in_time`, `sign_out_time`, `status` | 출석률 80% 자동 체크용 |
| **Certificates** | `cert_id(PK)`, `trainee_id(FK)`, `cert_type(KOICA/TESDA)`, `issue_date`, `cert_no` | 자격증 발급 이력 |
| **Projects** | `project_id(PK)`, `title`, `description`, `file_path`, `team_members(FKs)` | 미니 프로젝트 결과물 |
| **Jobs** | `job_id(PK)`, `company_id(FK)`, `job_title`, `required_skills`, `deadline` | 기업 채용 공고 |
| **Resources** | `res_id(PK)`, `title`, `file_type(pdf/ppt/code)`, `category`, `author` | 교재 및 강의자료 |

---

## 4. 기대 효과 및 운영 전략

### 지속 가능성 (Sustainability)
- 2026년 이후 실리만대학교 자체 운영(Track 3 수료 강사 투입) 시, 이 플랫폼이 LMS(학습관리시스템) 역할을 수행하여 교육 품질을 유지
- 기자재 운영 매뉴얼 및 장비 리스트를 DB화하여 자산 관리 효율성 증대

### 데이터 기반 성과 관리
- 출석률, 수료율, 취업률, 젠더/장애 포용성 지표(여성 40%, 장애인 2명 목표 등)를 실시간으로 모니터링하여 KOICA 성과 보고 간소화

### 산업 연계 강화
- 기업은 검증된 인재(포트폴리오, 자격증 확인)를 플랫폼에서 직접 검색하여 채용 비용 절감
- 'Authentic Learning'의 일환으로 기업이 프로젝트 갤러리에 피드백을 남길 수 있는 기능 구현

---

## 5. 개발 우선순위

### Phase 1: 핵심 기능 (MVP)
1. 메인 페이지 (홈, 대시보드)
2. 교육 프로그램 소개 페이지
3. 기본 사용자 인증 시스템

### Phase 2: 학습 관리
1. 학습 자료실 (LMS)
2. 수료생 프로필 및 인재 DB
3. 프로젝트 갤러리

### Phase 3: 채용 연계
1. 채용 공고 게시판
2. 잡 매칭 시스템
3. 기업 피드백 기능

---

**문서 작성일**: 2026-02-15  
**작성자**: KOICA-실리만대 DX 센터
