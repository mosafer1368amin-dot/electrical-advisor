import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { 
  Send, Bot, User, Sparkles, AlertCircle, RefreshCw, Zap, X,
  Mic, MicOff, Camera, Trash2, Play, Square, Pause, Volume2, Image, Video, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  sender: "user" | "bot";
  text?: string;
  time: string;
  image?: { data: string; mimeType: string };
  audio?: { data: string; mimeType: string; blobUrl?: string };
  video?: { data: string; mimeType: string; blobUrl?: string };
}

const SUGGESTED_QUESTIONS = [
  "چرا فیوز مینیاتوری برای جلوگیری از برق‌گرفتگی کافی نیست؟",
  "نقشه سیم‌کشی کلید تبدیل (راه‌پله) چطور است؟",
  "سایز کابل استاندارد برای نصب کولر گازی چقدر است؟",
  "علت پریدن مداوم کلید محافظ جان (RCD) چیست؟"
];

interface AiAdvisorProps {
  initialMessageText?: string;
  isFloating?: boolean;
  onClose?: () => void;
}

export default function AiAdvisor({ initialMessageText, isFloating = false, onClose }: AiAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "سلام همکار گرامی! من دستیار هوشمند و استاد برقکار ساختمان هستم. هر سوال سیم‌کشی، نقشه‌کشی، استانداردهای مبحث ۱۳ یا عیب‌بابی دارید بپرسید. همچنین می‌توانید برای من تصویر نقشه یا تجهیز معیوب بفرستید، یا صدای خود را ضبط کرده و ارسال کنید تا تحلیل کنم.",
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Voice, Image & Video Attachment States
  const [attachedImage, setAttachedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [attachedAudio, setAttachedAudio] = useState<{ data: string; mimeType: string; blobUrl?: string } | null>(null);
  const [attachedVideo, setAttachedVideo] = useState<{ data: string; mimeType: string; blobUrl?: string } | null>(null);
  
  // Speech Recognition (Speech-to-Text) States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Direct Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Camera Capture States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Text-To-Speech (TTS) Playing State
  const [playingMessageIdx, setPlayingMessageIdx] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const processedInitialMsg = useRef<string | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, attachedImage, attachedAudio, attachedVideo, isRecording]);

  // Handle initial message triggering
  useEffect(() => {
    if (initialMessageText && initialMessageText.trim() && processedInitialMsg.current !== initialMessageText) {
      processedInitialMsg.current = initialMessageText;
      sendMessage(initialMessageText);
    }
  }, [initialMessageText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Text-To-Speech (TTS) Read Aloud function
  const speakMessage = (text: string, index: number) => {
    if (playingMessageIdx === index) {
      window.speechSynthesis.cancel();
      setPlayingMessageIdx(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text from symbols or code block markdowns
    const cleanText = text
      .replace(/[*#`_\-]/g, "")
      .replace(/[\w\d]+:\/\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]+/g, ""); // strip links

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fa-IR";

    // Detect if we can set a Persian/Farsi voice
    const voices = window.speechSynthesis.getVoices();
    const faVoice = voices.find(v => v.lang.includes("fa") || v.name.toLowerCase().includes("persian") || v.name.toLowerCase().includes("farsi"));
    if (faVoice) {
      utterance.voice = faVoice;
    }

    utterance.rate = 1.0;

    utterance.onend = () => {
      setPlayingMessageIdx(null);
    };

    utterance.onerror = () => {
      setPlayingMessageIdx(null);
    };

    setPlayingMessageIdx(index);
    window.speechSynthesis.speak(utterance);
  };

  // --- 1. Speech Recognition (STT) functions ---
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از قابلیت تشخیص گفتار و تایپ صوتی پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "fa-IR";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${text}` : text);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // --- 2. Direct Audio Recorder functions ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(",")[1];
          setAttachedAudio({
            data: base64Data,
            mimeType: "audio/webm",
            blobUrl: URL.createObjectURL(audioBlob)
          });
        };
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 45) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
              clearInterval(timerRef.current);
            }
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("دسترسی به میکروفون امکان‌پذیر نیست. لطفاً دسترسی به میکروفون را فعال کنید.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- 3. Image Handlers & Live Camera functions ---
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Set maximum dimension to 1024px to preserve high detail but keep payload extremely lightweight
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.75 quality - results in ~100KB-150KB file
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          const base64Data = dataUrl.split(",")[1];
          setAttachedImage({
            data: base64Data,
            mimeType: "image/jpeg"
          });
        } else {
          // Fallback if canvas context fails
          const base64Data = (event.target?.result as string).split(",")[1];
          setAttachedImage({
            data: base64Data,
            mimeType: file.type || "image/jpeg"
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 15MB for optimal API performance and to prevent out of memory issues
    if (file.size > 15 * 1024 * 1024) {
      alert("حجم فایل ویدیو نباید بیشتر از ۱۵ مگابایت باشد تا با سرعت بالا پردازش شود.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      setAttachedVideo({
        data: base64Data,
        mimeType: file.type || "video/mp4",
        blobUrl: URL.createObjectURL(file)
      });
    };
  };

  const startCamera = async () => {
    try {
      setIsCameraModalOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      cameraStreamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("امکان دسترسی به دوربین وجود ندارد. لطفاً مجوز دسترسی را بررسی نمایید.");
      setIsCameraModalOpen(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraModalOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      // Set optimized resolution to keep payload lightweight
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const base64Data = dataUrl.split(",")[1];
        setAttachedImage({
          data: base64Data,
          mimeType: "image/jpeg"
        });
      }
      stopCamera();
    }
  };

  // --- 4. Sending Messages with Multi-modal Support ---
  const sendMessage = async (textToSend: string) => {
    const hasText = !!textToSend.trim();
    const hasImage = !!attachedImage;
    const hasAudio = !!attachedAudio;
    const hasVideo = !!attachedVideo;
    
    if ((!hasText && !hasImage && !hasAudio && !hasVideo) || isLoading) return;

    setErrorMsg(null);
    const userTime = new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    
    const newMsg: Message = { 
      sender: "user", 
      text: textToSend, 
      time: userTime,
      image: attachedImage ? { ...attachedImage } : undefined,
      audio: attachedAudio ? { ...attachedAudio } : undefined,
      video: attachedVideo ? { ...attachedVideo } : undefined
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    // Capture state variables to send
    const currentImage = attachedImage;
    const currentAudio = attachedAudio;
    const currentVideo = attachedVideo;
    
    // Reset inputs
    setAttachedImage(null);
    setAttachedAudio(null);
    setAttachedVideo(null);
    setIsLoading(true);

    try {
      // Map history for context-awareness (only pass texts with short indicators to save bandwidth)
      const apiHistory = messages.map(msg => {
        let textVal = msg.text || "";
        if (msg.image) textVal += " [تصویر الصاق شده]";
        if (msg.audio) textVal += " [پیام صوتی ضبط شده]";
        if (msg.video) textVal += " [ویدیو الصاق شده]";
        return {
          sender: msg.sender,
          text: textVal
        };
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend, 
          history: apiHistory,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined,
          audio: currentAudio ? { data: currentAudio.data, mimeType: currentAudio.mimeType } : undefined,
          video: currentVideo ? { data: currentVideo.data, mimeType: currentVideo.mimeType } : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطایی رخ داد");
      }

      const botTime = new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { sender: "bot", text: data.text, time: botTime }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "خطا در اتصال به دستیار هوشمند. لطفاً چند لحظه دیگر امتحان کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  return (
    <div 
      id="ai-advisor-section" 
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col ${
        isFloating ? "h-[500px] shadow-2xl" : "h-[550px]"
      }`} 
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
            <Bot className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              {isFloating ? "استادکار هوشمند همراه (مولتی‌مدیا)" : "استادکار و مشاور هوشمند صوتی و تصویری"}
              <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="h-2 w-2 animate-pulse" />
                صدا و تصویر
              </span>
            </h3>
            <p className="text-[9px] text-slate-400">
              مجهز به ضبط صوت، تایپ صوتی، دوربین و پردازش نقشه و تجهیزات
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/download-zip"
            download="electrical-advisor-source.zip"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[10px] font-black transition-all hover:scale-105 shadow-md shadow-amber-500/10 cursor-pointer"
            title="دانلود کل کدهای پروژه به صورت فایل ZIP"
          >
            <Download className="h-3.5 w-3.5" />
            <span>دانلود ZIP کدهای برنامه</span>
          </a>
          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto pr-1 pl-1 space-y-4 mb-3 scrollbar-thin scrollbar-thumb-slate-800 text-right">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse text-right" : "flex-row text-right"}`}
          >
            {/* Avatar */}
            <div className={`p-1.5 rounded-lg shrink-0 ${
              msg.sender === "user" 
                ? "bg-slate-800 border border-slate-700 text-slate-300" 
                : "bg-amber-500/10 border border-amber-500/20 text-amber-500"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[80%] ${msg.sender === "user" ? "items-start" : "items-end"}`}>
              <div className={`rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                msg.sender === "user"
                  ? "bg-amber-500 text-slate-950 font-medium rounded-tr-none"
                  : "bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none"
              }`}>
                {/* Embedded Image Attachment */}
                {msg.image && (
                  <div className="rounded-xl overflow-hidden max-w-full border border-slate-700/50 bg-slate-900/50 max-h-48 flex items-center justify-center">
                    <img 
                      src={`data:${msg.image.mimeType};base64,${msg.image.data}`} 
                      alt="تصویر ارسالی کاربر" 
                      className="max-h-48 object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* Embedded Video Attachment */}
                {msg.video && (
                  <div className="rounded-xl overflow-hidden max-w-full border border-slate-700/50 bg-slate-900/50 max-h-48 flex items-center justify-center">
                    <video 
                      src={msg.video.blobUrl || `data:${msg.video.mimeType};base64,${msg.video.data}`} 
                      controls 
                      className="max-h-48 rounded-xl"
                    />
                  </div>
                )}

                {/* Embedded Audio Attachment */}
                {msg.audio && (
                  <div className={`p-2 rounded-xl flex items-center gap-2 ${msg.sender === "user" ? "bg-amber-600/30 text-slate-900 border border-amber-600/40" : "bg-slate-900 border border-slate-800 text-slate-300"}`}>
                    <Volume2 className="h-3.5 w-3.5 shrink-0" />
                    <audio 
                      src={msg.audio.blobUrl || `data:${msg.audio.mimeType};base64,${msg.audio.data}`} 
                      controls 
                      className="h-8 max-w-[190px] text-xs"
                    />
                  </div>
                )}

                {msg.text && <p className="whitespace-pre-line text-[11px] md:text-xs">{msg.text}</p>}

                {/* Read Aloud Play Button for Bot Responses */}
                {msg.sender === "bot" && msg.text && (
                  <div className="flex justify-end pt-1 border-t border-slate-800/40 mt-1">
                    <button
                      onClick={() => speakMessage(msg.text || "", idx)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        playingMessageIdx === idx
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                      }`}
                      title={playingMessageIdx === idx ? "توقف پخش صوتی" : "پخش صوتی پاسخ استادکار"}
                    >
                      {playingMessageIdx === idx ? (
                        <>
                          <Square className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>توقف خوانش</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3 text-amber-500" />
                          <span>خوانش صوتی پاسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-1.5 rounded-lg shrink-0">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl rounded-tl-none p-3 text-[11px] text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>استادکار هوشمند در حال تحلیل و پردازش پاسخ صوتی/تصویری...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">خطا در پردازش پیام</p>
              <p className="text-[11px] opacity-90 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions (only show when not loading & empty chat basically) */}
      {!isLoading && messages.length < 3 && !attachedImage && !attachedAudio && !isRecording && (
        <div className="mb-3 shrink-0 text-right">
          <span className="text-[9px] text-slate-500 font-semibold block mb-1.5 flex items-center gap-1 justify-start">
            <Zap className="h-3 w-3 text-amber-500 animate-pulse" />
            سوالات کارآموزان برق ساختمان:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="text-[9px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 text-right transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Preview Area (above input form) */}
      {(attachedImage || attachedAudio || attachedVideo || isRecording) && (
        <div className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl mb-2 flex items-center justify-between gap-2 shrink-0 animate-fadeIn">
          {isRecording ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-bold">در حال ضبط صدا... {formatTime(recordingTime)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={stopRecording}
                  className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Square className="h-2.5 w-2.5 fill-white" />
                  اتمام ضبط
                </button>
                <button
                  onClick={() => {
                    if (mediaRecorderRef.current && isRecording) {
                      mediaRecorderRef.current.onstop = null;
                      mediaRecorderRef.current.stop();
                    }
                    setIsRecording(false);
                    clearInterval(timerRef.current);
                    setAttachedAudio(null);
                  }}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[9px] transition-colors"
                >
                  لغو
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              {attachedImage && (
                <div className="relative rounded-lg border border-slate-800 bg-slate-900 p-1 flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded overflow-hidden bg-slate-950">
                    <img 
                      src={`data:${attachedImage.mimeType};base64,${attachedImage.data}`} 
                      alt="Attachment Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-[9px] text-slate-400">تصویر پیوست شد</span>
                  <button 
                    onClick={() => setAttachedImage(null)}
                    className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {attachedVideo && (
                <div className="relative rounded-lg border border-slate-800 bg-slate-900 p-1 flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded overflow-hidden bg-slate-950 flex items-center justify-center bg-slate-950/80">
                    <Video className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-[9px] text-slate-400">ویدیو پیوست شد</span>
                  <button 
                    onClick={() => setAttachedVideo(null)}
                    className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {attachedAudio && (
                <div className="relative rounded-lg border border-slate-800 bg-slate-900 p-1 flex items-center gap-1.5">
                  <div className="p-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded">
                    <Volume2 className="h-3 w-3" />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold">صوت ضبط شد</span>
                  <button 
                    onClick={() => setAttachedAudio(null)}
                    className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <div className="flex flex-col gap-2 mt-auto shrink-0 pt-2 border-t border-slate-800/60">
        
        {/* Helper Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-1">
            {/* Gallery Upload */}
            <label className="cursor-pointer p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-all flex items-center gap-1" title="پیوست تصویر از گالری">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <Image className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[8px] md:text-[9px] font-bold">گالری عکس</span>
            </label>

            {/* Camera Capture */}
            <button
              onClick={startCamera}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-all flex items-center gap-1"
              title="گرفتن عکس با دوربین"
            >
              <Camera className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[8px] md:text-[9px] font-bold">عکس با دوربین</span>
            </button>

            {/* Video Upload */}
            <label className="cursor-pointer p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg transition-all flex items-center gap-1" title="پیوست فیلم یا ویدیو برای تحلیل">
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleVideoUpload} 
                className="hidden" 
              />
              <Video className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[8px] md:text-[9px] font-bold">فیلم / ویدیو</span>
            </label>

            {/* Direct Voice recording */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-1.5 border rounded-lg transition-all flex items-center gap-1 ${
                isRecording 
                  ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse" 
                  : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="ضبط پیام صوتی مستقیم"
            >
              <Mic className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span className="text-[8px] md:text-[9px] font-bold">{isRecording ? "ضبط..." : "ضبط صدا"}</span>
            </button>
          </div>

          {/* Speech-to-Text Typing */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-1.5 border rounded-lg transition-all flex items-center gap-1 ${
              isListening 
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400 animate-pulse" 
                : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="تایپ صوتی (گفتار به متن)"
          >
            {isListening ? (
              <>
                <MicOff className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                <span className="text-[8px] md:text-[9px] font-bold text-purple-400">شنود...</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-[8px] md:text-[9px] font-bold">تایپ صوتی</span>
              </>
            )}
          </button>
        </div>

        {/* Text Input Row */}
        <div className="flex items-center gap-2 mt-0.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isRecording}
            placeholder={isRecording ? "در حال ضبط پیام صوتی هستید..." : "سوال سیم‌کشی یا عیب‌بابی برق دارید بپرسید..."}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={(!input.trim() && !attachedImage && !attachedAudio && !attachedVideo) || isLoading}
            className={`p-2 rounded-xl transition-all ${
              (input.trim() || attachedImage || attachedAudio || attachedVideo) && !isLoading
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 hover:scale-105"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Send className="h-3.5 w-3.5 transform rotate-180" />
          </button>
        </div>
      </div>

      {/* Live Camera Capture Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="bg-[#12141c] border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-amber-500 animate-pulse" />
                تصویربرداری از نقشه یا قطعه معیوب
              </span>
              <button 
                onClick={stopCamera}
                className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-500/20 m-4 rounded-lg"></div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={stopCamera}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                لغو
              </button>
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-1.5 animate-pulse"
              >
                <Camera className="h-4 w-4" />
                ثبت و الصاق تصویر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
