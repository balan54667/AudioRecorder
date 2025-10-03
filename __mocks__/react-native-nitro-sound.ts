export default {
  startRecorder: jest.fn(),
  pauseRecorder: jest.fn(),
  resumeRecorder: jest.fn(),
  stopRecorder: jest.fn().mockResolvedValue('/mock/path.m4a'),
  startPlayer: jest.fn(),
  addRecordBackListener: jest.fn(),
  removeRecordBackListener: jest.fn(),
  mmssss: (ms: number) => `00:00:${String(ms).padStart(2, '0')}`,
};
