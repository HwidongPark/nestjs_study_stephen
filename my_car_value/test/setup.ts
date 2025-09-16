// global beforeEach정의
// jest-e2e.json의 "setupFilesAfterEnv": ["<rootDir>/setup.ts"]로 이 파일에서 global before each

import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, "..", "test.sqlite"));
  } catch(err) {
    
  }
})