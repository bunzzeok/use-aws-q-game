# 스도쿠 게임 (Sudoku Game)

<div align="center">
  
![Sudoku](https://img.shields.io/badge/Game-Sudoku-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![License](https://img.shields.io/badge/License-MIT-green)
![CI](https://github.com/bunzzeok/use-aws-q-game/actions/workflows/ci.yml/badge.svg)
![AI-Managed](https://img.shields.io/badge/AI-Managed-purple)

</div>

React와 TypeScript로 개발된 스도쿠 게임입니다. 다양한 난이도의 퍼즐을 풀고 실력을 향상시켜보세요!

A Sudoku game developed with React and TypeScript. Solve puzzles of various difficulties and improve your skills!

> 🤖 **AI 관리 프로젝트**: 이 프로젝트는 Amazon Q AI가 자동으로 관리, 개선 및 개발하는 실험적 프로젝트입니다.  
> 🤖 **AI-Managed Project**: This is an experimental project that is automatically managed, improved, and developed by Amazon Q AI.

## 📋 목차 (Table of Contents)

- [게임 특징](#-게임-특징-game-features)
- [실행 방법](#-실행-방법-how-to-run)
- [게임 방법](#-게임-방법-how-to-play)
- [기술 스택](#️-기술-스택-tech-stack)
- [테스트](#-테스트-testing)
- [라이선스](#-라이선스-license)
- [감사의 말](#-감사의-말-acknowledgements)

## 🎮 게임 특징 (Game Features)

- **3가지 난이도** (3 Difficulty Levels)
  - 쉬움, 중간, 어려움 중에서 선택할 수 있습니다.
  - Choose from Easy, Medium, or Hard.

- **힌트 시스템** (Hint System)
  - 난이도에 따라 제한된 힌트를 사용할 수 있습니다.
  - Use limited hints based on difficulty level.

- **메모 기능** (Note-taking)
  - 각 셀에 메모를 남겨 가능한 숫자를 기록할 수 있습니다.
  - Take notes in each cell to record possible numbers.

- **오답 제한** (Error Limit)
  - 5번 이상 틀리면 게임이 종료됩니다.
  - Game ends after 5 incorrect entries.

- **타이머** (Timer)
  - 게임 완료 시간을 측정합니다.
  - Measures completion time.

- **검증된 퍼즐** (Verified Puzzles)
  - 모든 퍼즐은 유일한 해결책을 가지도록 검증됩니다.
  - All puzzles are verified to have a unique solution.

- **다크 모드** (Dark Mode)
  - 눈의 피로를 줄이는 다크 모드를 지원합니다.
  - Supports dark mode to reduce eye strain.

## 🚀 실행 방법 (How to Run)

1. **저장소 클론** (Clone the repository)
   ```bash
   git clone https://github.com/bunzzeok/use-aws-q-game.git
   cd use-aws-q-game
   ```

2. **의존성 설치** (Install dependencies)
   ```bash
   npm install
   ```

3. **개발 서버 실행** (Run development server)
   ```bash
   npm start
   ```

4. **브라우저에서 열기** (Open in browser)
   ```
   http://localhost:3000
   ```

## 🎯 게임 방법 (How to Play)

1. 시작 화면에서 난이도를 선택합니다.
   - Select difficulty level from the start screen.

2. 빈 셀을 클릭하고 숫자를 입력합니다.
   - Click on empty cells and enter numbers.

3. 메모 모드를 활성화하려면 "메모" 버튼을 클릭합니다.
   - Click the "Notes" button to activate note-taking mode.

4. 잘못 입력한 숫자는 "지우기" 버튼으로 삭제할 수 있습니다.
   - Use the "Erase" button to delete incorrect entries.

5. 어려운 셀은 "힌트" 버튼을 사용하여 정답을 확인할 수 있습니다 (제한된 횟수).
   - Use the "Hint" button for difficult cells (limited uses).

6. 5번 이상 틀리면 게임이 종료됩니다.
   - Game ends after 5 incorrect entries.

7. 모든 셀을 올바르게 채우면 게임이 완료됩니다.
   - Complete the game by correctly filling all cells.

## 🛠️ 기술 스택 (Tech Stack)

- **React** - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **TypeScript** - 정적 타입 지원을 위한 JavaScript 확장
- **CSS** - 스타일링 및 레이아웃
- **Jest & React Testing Library** - 테스트 프레임워크

## 🧪 테스트 (Testing)

이 프로젝트는 다음과 같은 테스트 전략을 사용합니다:

1. **유닛 테스트** - 개별 컴포넌트 및 유틸리티 함수 테스트
2. **통합 테스트** - 스도쿠 퍼즐 생성 및 풀이 검증
3. **CI/CD** - GitHub Actions를 통한 자동화된 테스트 및 배포

테스트 실행 방법:
```bash
# 모든 테스트 실행
npm test

# 개발 중 테스트 감시 모드
npm run test:watch

# 스도쿠 퍼즐 검증
npm run verify-puzzles
```

## 📝 라이선스 (License)

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 🙏 감사의 말 (Acknowledgements)

이 프로젝트는 Amazon Q를 활용하여 개발되었습니다.

This project was developed using Amazon Q.
