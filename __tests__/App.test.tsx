/**
 * @format
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App.tsx';
import Sound from 'react-native-nitro-sound';

jest.mock('react-native-nitro-sound');

describe('Audio Recorder App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    const { getByText } = render(<App />);
    expect(getByText('Elapsed: 00:00:00')).toBeTruthy();
    expect(getByText('Start Recording')).toBeTruthy();
  });

  it('starts recording when Start button is pressed', async () => {
    const { getByText } = render(<App />);
    const startButton = getByText('Start Recording');

    fireEvent.press(startButton);

    await waitFor(() => {
      expect(Sound.startRecorder).toHaveBeenCalled();
    });
  });

  it('pauses recording when Pause is pressed', async () => {
    const { getByText, rerender } = render(<App />);
    // simulate recording
    fireEvent.press(getByText('Start Recording'));
    await waitFor(() => expect(Sound.startRecorder).toHaveBeenCalled());

    // re-render so button text updates
    rerender(<App />);
    const pauseButton = getByText('Pause');
    fireEvent.press(pauseButton);

    await waitFor(() => {
      expect(Sound.pauseRecorder).toHaveBeenCalled();
    });
  });

  it('stops recording and sets audio path', async () => {
    const { getByText } = render(<App />);
    fireEvent.press(getByText('Start Recording'));
    await waitFor(() => expect(Sound.startRecorder).toHaveBeenCalled());

    const stopButton = getByText('Stop');
    fireEvent.press(stopButton);

    await waitFor(() => {
      expect(Sound.stopRecorder).toHaveBeenCalled();
    });

    // Play button should now be visible
    expect(getByText('Play Recording')).toBeTruthy();
  });

  it('resumes recording when Resume is pressed', async () => {
    const { getByText } = render(<App />);

    // start + stop to create audioPath
    fireEvent.press(getByText('Start Recording'));
    await waitFor(() => expect(Sound.startRecorder).toHaveBeenCalled());

    fireEvent.press(getByText('Stop'));
    await waitFor(() => expect(Sound.stopRecorder).toHaveBeenCalled());

    const resumeButton = getByText('Resume');
    fireEvent.press(resumeButton);

    await waitFor(() => {
      expect(Sound.resumeRecorder).toHaveBeenCalled();
    });
  });

  it('plays audio when Play Recording is pressed', async () => {
    const { getByText } = render(<App />);

    // Start + Stop to have an audioPath
    fireEvent.press(getByText('Start Recording'));
    await waitFor(() => expect(Sound.startRecorder).toHaveBeenCalled());
    fireEvent.press(getByText('Stop'));
    await waitFor(() => expect(Sound.stopRecorder).toHaveBeenCalled());

    const playButton = getByText('Play Recording');
    fireEvent.press(playButton);

    await waitFor(() => {
      expect(Sound.startPlayer).toHaveBeenCalledWith('/mock/path.m4a');
    });
  });
});
