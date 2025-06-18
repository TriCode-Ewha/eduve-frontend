# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>



# Eduve: RAG 기반 AI 챗봇 서비스

Eduve는 음성 인식(STT), OCR 문자 추출, 채팅 메시지 저장 등 기능을 제공하는 Spring Boot 기반의 교육 지원 백엔드 서버입니다. 이 프로젝트는 JWT 인증과 RESTful API를 기반으로 하며, 학생과 교사 간 커뮤니케이션을 지원합니다.

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

> ✅ pages 디렉토리 내 주요 화면 구성:
> - `Login.js` / `Signup.js` : 로그인 및 회원가입  
> - `ChatPage.js`, `ChatArea.js` : 챗봇 대화  
> - `MainPage.js`, `Sidebar.js` : 메인 홈 및 UI 틀  
> - `StudentDashboard.js`, `TeacherDashboard.js` : 사용자별 대시보드  
> - `CharacterPage.js` : 캐릭터 설정
> - `ArchivePage.js` : 학습자료 아카이빙


<br>

## 📦 How to Install

#### 1. 환경 요구사항

- Node.js 18+
- npm 9+

#### 2. 설치 절차

```bash
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



## 

<br>
<br>


## ✅ How to Test
이 프로젝트는 

#### 테스트 실행
```bash
./gradlew test
```






<br>
<br>

## 📊 샘플 데이터 설명
프로젝트에는 API 테스트용 샘플 데이터가 포함되어 있습니다.

#### 1. 사용자 데이터 (users.csv)
- 위치: src/main/resources/sample/users.csv
- 형식: CSV
```csv
id,username,password,role
1,teacher01,password123,ROLE_TEACHER
2,student01,password456,ROLE_STUDENT
```


```

<br>
<br>


## 🗄 Database 사용 정보
- DBMS: MySQL

```
- JPA 기반으로 자동 테이블 생성 (ddl-auto: update)
- 테스트/운영 환경별 DB 분리 가능



<br>
<br>

## 📚 사용된 오픈소스 목록
| 라이브러리        | 설명                   | 라이선스     | 
|------------------|------------------------|--------------|
| Spring Boot      | 백엔드 프레임워크       | Apache 2.0   |
| Spring Security  | 인증/인가 처리         | Apache 2.0    | 
| jjwt             | JWT 토큰 처리           | Apache 2.0   |
| Lombok           | 보일러플레이트 코드 제거 | MIT          |
| Gradle           | 빌드 도구               | Apache 2.0   |
| AWS CodeDeploy   | 배포 자동화             | -            | 


