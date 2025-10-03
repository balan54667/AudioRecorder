/**
 * Audio Recorder React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, Alert, useColorScheme, StatusBar, 
  StyleSheet, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native';
import Sound from 'react-native-nitro-sound';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [audioPath, setAudioPath] = useState<string | null>(null);


  const requestPermissions = async() => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  const onStartRecord = async () => {
    setIsLoading(true);
    try {
      const ok = await requestPermissions();
      console.log(ok);
      
      if (!ok) return;

      await Sound.startRecorder();
      Sound.addRecordBackListener(e =>
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)))
      );
      setIsRecording(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const onPauseRecord = async () => {
    setIsLoading(true);
    try {
      await Sound.pauseRecorder();
      setIsRecording(false);
    } catch (e: any) {
      Alert.alert('Pause failed', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const onResumeRecord = async () => {
    setIsLoading(true);
    try {
      await Sound.resumeRecorder();
      setIsRecording(true);
    } catch (e: any) {
      Alert.alert('Resume failed', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const onStopRecord = async () => {
    setIsLoading(true);
    try {
      const path = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setAudioPath(path);
      setIsRecording(false);
      setRecordTime('00:00:00');
    } catch (e: any) {
      Alert.alert('Stop failed', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const onPlay = async () => {
    if (!audioPath) return;
    setIsLoading(true);
    try {
      await Sound.startPlayer(audioPath);
    } catch (e: any) {
      Alert.alert('Playback failed', e?.message ?? String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SafeAreaView>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Elapsed: {recordTime}</Text>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled
              ]}
              onPress={isRecording ? onPauseRecord : onStartRecord}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isRecording ? "Pause" : "Start Recording"}
              </Text>
            </TouchableOpacity>
            {!isRecording && audioPath && 
            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled
              ]}
              onPress={onResumeRecord}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {"Resume"}
              </Text>
            </TouchableOpacity>}
            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled
              ]}
              onPress={onStopRecord}
              activeOpacity={0.7}
              disabled={!isRecording && !audioPath}
            >
              <Text style={styles.buttonText}>
                {"Stop"}
              </Text>
            </TouchableOpacity>
            {audioPath && <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled
              ]}
              onPress={onPlay}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>
                {"Play Recording"}
              </Text>
            </TouchableOpacity>}
          </View>
          {isLoading && <ActivityIndicator />}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    minWidth: 180,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0', 
  },
});

export default App;
