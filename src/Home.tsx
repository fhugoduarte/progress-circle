import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

import { ProgressCircle } from './ProgressCircle';

function generateRandomProgress() {
  return Math.floor(Math.random() * 100);
}

export default function Home() {
  const [progress, setProgress] = useState(() => generateRandomProgress());

  return (
    <View style={styles.container}>      
      <ProgressCircle progress={progress} progressColor="#5352EC" backgroundColor="#272935">
        <Text style={styles.text}>{`${progress}%`}</Text>
      </ProgressCircle>

      <Button title="Random progress" onPress={() => setProgress(generateRandomProgress())} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#1C1B23',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 30
  }
});