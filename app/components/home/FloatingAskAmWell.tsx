import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  PanResponder,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech"; 
import { Audio } from "expo-av"; 
import * as FileSystem from "expo-file-system/legacy"; 
import { SafeAreaView } from "react-native-safe-area-context";

// ----------------------
// Responsive sizing helpers
// ----------------------
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scaleFont = (size: number) => Math.round(size * (SCREEN_WIDTH / 375));
const scaleHeight = (size: number) => Math.round(size * (SCREEN_HEIGHT / 667));

const FloatingAskAmWell = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey 👋, I’m PlanAmWell. How can I help today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false); 
  const [isBotThinking, setIsBotThinking] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);

  // Floating button animation
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 100, y: SCREEN_HEIGHT - 180 })).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;

  const API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(pan, {
          toValue: { x: gesture.moveX - 50, y: gesture.moveY - 50 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // ----------------------
  // Effects
  // ----------------------
  useEffect(() => {
    // Request Microphone Permission
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Microphone access is needed for voice chat.");
      }
    })();

    // Floating button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(labelOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(labelOpacity, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  // ----------------------
  // Audio Recording Logic
  // ----------------------
  const startRecording = async () => {
    Speech.stop(); 
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = newRecording;
      setIsRecording(true);
      setInput("Recording...");
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Failed to start microphone.");
      setIsRecording(false);
      setInput("");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setInput("Transcribing...");
    
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    const uri = currentRecording.getURI();
    let transcribedText = "";

    try {
      await currentRecording.stopAndUnloadAsync();
      if (!uri) throw new Error("Recording URI is null.");

      const base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

      // ⭐ Placeholder for cloud transcription
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      transcribedText = "This is a mocked transcription result.";

      setInput(transcribedText);
      if (transcribedText.trim()) {
        await sendMessage(transcribedText);
      } else {
        setInput("");
      }

    } catch (err: any) {
      console.error("Transcription Error:", err);
      Alert.alert("Transcription Failed", err.message || "Could not process audio file.");
      setInput("");
    } finally {
      if (uri) await FileSystem.deleteAsync(uri, { idempotent: true });
      recordingRef.current = null;
    }
  };

  const handleMicPress = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // ----------------------
  // Send Message + TTS
  // ----------------------
  const sendMessage = async (voiceInput: string | null = null) => {
    const messageContent = voiceInput || input;
    if (!messageContent.trim()) return;

    const userMessage = { id: Date.now().toString(), text: messageContent, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    if (!voiceInput) setInput("");

    setIsBotThinking(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              ...messages.slice(-5).map(msg => ({ role: msg.sender === "user" ? "user" : "assistant", content: msg.text })),
              { role: "user", content: messageContent },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error(`API failed: ${response.status} ${response.statusText}`);

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Sorry, I cannot respond right now.";

      setMessages(prev => [...prev, { id: Date.now().toString(), text: botReply, sender: "bot" }]);
      Speech.stop();
      Speech.speak(botReply, { language: "en", rate: 1.0, pitch: 1.0 });

    } catch (err: any) {
      console.error("API Error:", err);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: `Error: ${err.message}`, sender: "bot" }]);
    } finally {
      setIsBotThinking(false);
      setInput("");
    }
  };

  const MicIcon = isRecording ? "mic-off-sharp" : "mic-outline";
  const MicColor = isRecording ? "#f00" : "#6366f1";

  // ----------------------
  // Render
  // ----------------------
  return (
    <>

    <Animated.View 
  {...panResponder.panHandlers} 
  style={[pan.getLayout(), { position: "absolute", zIndex: 100, alignItems: "center" }]}
>
  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
    <TouchableOpacity onPress={() => setVisible(true)}>
      <LinearGradient colors={["#8b5cf6", "#6366f1"]} style={styles.floatingButton}>
        <Ionicons name="chatbubbles-outline" size={26} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
  <Animated.Text style={[styles.breathLabel, { opacity: labelOpacity }]}>💬 Chat / Messages</Animated.Text>
</Animated.View>


     
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" }}>
        <Modal visible={visible} animationType="slide" transparent>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
          >
            <View style={styles.modalContainer}>
              <View style={styles.chatBox}>

                <View style={styles.chatHeader}>
                  <View style={styles.expandHandle} />
                  <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>AskAmWell Assistant</Text>
                    <TouchableOpacity onPress={() => { Speech.stop(); setVisible(false); }} style={{ marginLeft: "auto" }}>
                      <Ionicons name="close-outline" size={22} color="#333" />
                    </TouchableOpacity>
                  </View>
                  {isRecording && <Text style={styles.recordingIndicator}>🔴 Recording... Tap Mic to stop</Text>}
                </View>

                <FlatList
                  data={messages}
                  keyExtractor={item => item.id}
                  style={{ flex: 1, paddingHorizontal: SCREEN_WIDTH * 0.035 }}
                  renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                      <Text style={{ color: item.sender === "user" ? "#fff" : "#111", fontSize: scaleFont(14) }}>{item.text}</Text>
                    </View>
                  )}
                />

                {isBotThinking && (
                  <View style={[styles.messageBubble, styles.botBubble, { flexDirection: "row", alignItems: "center" }]}>
                    <ActivityIndicator size="small" color="#111" style={{ marginRight: 8 }} />
                    <Text>Bot is thinking...</Text>
                  </View>
                )}

                <View style={{ paddingBottom: scaleHeight(10) }}>
                  <View style={[styles.inputRow, { paddingHorizontal: SCREEN_WIDTH * 0.04, paddingVertical: scaleHeight(6) }]}>
                    <TouchableOpacity onPress={handleMicPress} disabled={isBotThinking} style={styles.micButtonContainer}>
                      <Ionicons name={MicIcon} size={24} color={MicColor} />
                    </TouchableOpacity>

                    <TextInput
                      placeholder={isRecording ? "Listening..." : "Type a message..."}
                      style={[styles.input, { paddingVertical: scaleHeight(10), fontSize: scaleFont(14) }]}
                      value={input}
                      onChangeText={setInput}
                      editable={!isRecording} 
                    />

                    <TouchableOpacity onPress={() => sendMessage(null)} disabled={isRecording || isBotThinking || !input.trim()}>
                      <Ionicons name="send" size={22} color="#6366f1" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default FloatingAskAmWell;

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  floatingButton: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5 },
  breathLabel: { color: "#555", fontSize: 12, marginTop: 4, fontWeight: "500" },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  chatBox: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" },
  chatHeader: { alignItems: "center", paddingTop: scaleHeight(10), paddingBottom: scaleHeight(14), borderBottomWidth: 1, borderColor: "#eee" },
  expandHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#ccc", marginBottom: 8 },
  headerContent: { flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center", paddingHorizontal: SCREEN_WIDTH * 0.04 },
  headerTitle: { fontWeight: "700", fontSize: scaleFont(15), color: "#111" },
  messageBubble: { padding: scaleHeight(10), borderRadius: 12, marginVertical: 4, maxWidth: "75%" },
  botBubble: { backgroundColor: "#f1f5f9", alignSelf: "flex-start" },
  userBubble: { backgroundColor: "#6366f1", alignSelf: "flex-end" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9fafb" },
  micButtonContainer: { paddingRight: 10, paddingLeft: 5 },
  input: { flex: 1, backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 14, marginRight: 8, borderWidth: 1, borderColor: "#e5e7eb", minHeight: scaleHeight(44) },
  recordingIndicator: { fontSize: scaleFont(12), color: "red", marginTop: 4, fontWeight: "bold" },
});
