# Edu've: RAG 기반 AI 챗봇 서비스

Edu've는 RAG(Retrieval-Augmented Generation) 기반의 AI 챗봇 학습 지원 서비스로, 강사와 수강생 문서 기반 질문 응답을 지원합니다. 학습자료 아카이빙, 개인 맞춤형 챗봇, 실시간 질의응답 기능을 포함하며, Spring Boot와 Flask로 백엔드를 구성하고 React 기반 웹 인터페이스를 제공합니다. 학습 환경에서의 커뮤니케이션과 정보 접근성을 향상시키는 것을 목표로 합니다.


<br>
<br>

## 📦 프로젝트 구성 레포지토리

본 프로젝트는 다음 세 개의 레포지토리로 구성되어 있습니다:

| 이름         | 설명                           | GitHub 주소 |
|--------------|--------------------------------|--------------|
| **springboot** | 백엔드 주요 로직 (API, DB, STT, JWT 등)  | [Eduve Spring Boot](https://github.com/TriCode-Ewha/eduve-backend-springboot) |
| **flask**     | AI 모델 기반 RAG  서버 (LangChain, 임베딩, 유사도 검색)     | [Eduve Flask AI](https://github.com/TriCode-Ewha/eduve-backend-flask) |
| **front**     | 프론트엔드 클라이언트 (웹 인터페이스, React) | [Eduve Front](https://github.com/TriCode-Ewha/eduve-frontend) |


<br>
<br>


## React (eduve-front)

Eduve Front는 Eduve 플랫폼의 사용자 인터페이스(UI)를 담당하는 React 기반 웹 애플리케이션입니다.  
챗봇 대화, 문서 업로드, 사용자 캐릭터 설정, 히스토리 조회 등 기능을 제공하며, Spring Boot와 Flask 백엔드 API와 통신합니다.


<br>


## 🧾 Source Code 설명

| 경로                  | 설명                                                                 |
|-----------------------|----------------------------------------------------------------------|
| `src/api/`            | 백엔드 API 요청을 담당하는 axios 모듈 (ex. 로그인, 챗봇, 파일 업로드 등) |
| `src/pages/`          | 주요 화면 구성 (로그인, 챗봇 페이지, 회원가입, 대시보드 등 구성)       |
| `src/components/`     | 공통 UI 컴포넌트 관리용 디렉토리                                      |
| `App.js`              | React 최상위 컴포넌트                                                |
| `index.js`            | 앱 엔트리포인트                                                       |
| `.env`                | API 서버 주소 등 환경변수 정의 설정                                       |
| `App.test.js`         | 테스트 코드                                                           |
| `vercel.json`         | Vercel 배포 설정 파일  설정                                     |

<br>

## 🧾 주요 화면 및 기능 설명

| 페이지/컴포넌트                                      | 설명                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `ChatPage.js` / `ChatArea.js`                 | 챗봇 대화 인터페이스. 실시간 메시지 송수신, 마크다운 처리, 좋아요 반영, PDF 미리보기, 그래프/URL 분석 기능 |
| `CharacterPage.js`                            | 사용자 캐릭터의 말투(Tone)와 설명 수준 설정 (FRIENDLY, FORMAL 등)                        |
| `Login.js` / `Signup.js`                      | 사용자 인증: 로그인 및 회원가입                                                    |
| `ArchivePage.js`                              | 학습 문서 업로드 및 관리                                                        |
| `Sidebar.js`, `MainPage.js`                   | 전체 레이아웃 및 네비게이션 구조 제공                                                 |


<br>

## 📦 How to Install

#### 1. 환경 요구사항

- **Node.js**: 18+
- **npm**: 9+

#### 2. 설치 절차

```bash
# 저장소 클론
git clone https://github.com/TriCode-Ewha/eduve-frontend.git
cd eduve-frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

***.env 예시:***
```
VITE_API_BASE_URL=http://localhost:8080      # Spring Boot
VITE_AI_SERVER_URL=http://localhost:5000     # Flask
```

<br>

## 🛠 How to Build

```bash
npm run build
```
- Vercel 또는 Nginx로 배포 가능

<br>

## 🚀 How to Run

***개발 모드로 실행:***

```bash
# 개발 서버 실행
npm start
```
- 기본 포트는 3000입니다. 실행 후 http://localhost:3000 에서 서버가 동작합니다.



<br>
<br>

## 📚 사용된 오픈소스 목록

| 기술/라이브러리              | 용도                                 |
|-----------------------------|--------------------------------------|
| **React 18**                | 사용자 인터페이스(UI) 구성             |
| **React Router DOM**        | 클라이언트 사이드 라우팅               |
| **Axios**                   | 백엔드 API 통신                       |
| **Vite**                    | 빠른 개발 서버 및 빌드 도구            |
| **Vercel**                  | 정적 웹사이트 배포 플랫폼              |
| **jwt-decode**             | JWT 토큰 디코딩                       |
| **react-markdown**         | 마크다운 렌더링                       |
| **react-pdf**              | PDF 미리보기 기능 구현                |



