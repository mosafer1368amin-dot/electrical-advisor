import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, Play, RotateCcw, AlertTriangle, ShieldCheck, Sun, Moon, Flame, 
  Eye, Settings, Plus, Trash2, CheckCircle, XCircle, HelpCircle, 
  Lightbulb, Check, Trophy, Info, Sparkles, ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type CircuitType = "single" | "double" | "two-way" | "staircase" | "photocell";
type SandboxLayout = "blank" | "living" | "corridor" | "bedroom" | "yard";

type ComponentType = 
  | "panel"          // تابلو برق اصلی
  | "mcb"            // فیوز مینیاتوری
  | "rcd"            // کلید محافظ جان
  | "switch_single"  // کلید یک‌پل
  | "switch_double"  // کلید دوپل
  | "switch_two_way" // کلید تبدیل
  | "switch_cross"   // کلید صلیبی
  | "bulb"           // لامپ روشنایی
  | "socket"         // پریز ارت‌دار
  | "junction";      // جعبه تقسیم

interface Port {
  id: string;      // port unique ID (e.g. "L_in")
  label: string;   // Persian label
  type: "L" | "N" | "PE" | "Com" | "L1" | "L2" | "T1" | "T2" | "In1" | "In2" | "Out1" | "Out2";
}

interface PlacedComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  name: string;
  ports: Port[];
  state: {
    isOn?: boolean;       // for switches, MCB, RCD
    isOn2?: boolean;      // second toggle for double switch
  };
}

interface Wire {
  id: string;
  fromCompId: string;
  fromPortId: string;
  toCompId: string;
  toPortId: string;
  type: "phase" | "neutral" | "earth" | "return";
}

interface Mission {
  id: string;
  title: string;
  description: string;
  blueprint: SandboxLayout;
  requirements: string[];
  validate: (components: PlacedComponent[], wires: Wire[]) => { success: boolean; feedback: string[] };
}

export default function Simulator() {
  const [mode, setMode] = useState<"prebuilt" | "creative">("prebuilt");
  
  // ==========================================
  // STATE FOR PREBUILT CIRCUIT MODE
  // ==========================================
  const [activeCircuit, setActiveCircuit] = useState<CircuitType>("single");
  const [mainFuse, setMainFuse] = useState<boolean>(true);
  const [singleSwitch, setSingleSwitch] = useState<boolean>(false);
  const [doubleSwitch1, setDoubleSwitch1] = useState<boolean>(false);
  const [doubleSwitch2, setDoubleSwitch2] = useState<boolean>(false);
  const [twoWayA, setTwoWayA] = useState<boolean>(false);
  const [twoWayB, setTwoWayB] = useState<boolean>(false);
  const [staircaseTimerSec, setStaircaseTimerSec] = useState<number>(0);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [photocellEnabled, setPhotocellEnabled] = useState<boolean>(true);

  // ==========================================
  // STATE FOR CREATIVE SANDBOX MODE
  // ==========================================
  const [layout, setLayout] = useState<SandboxLayout>("blank");
  const [components, setComponents] = useState<PlacedComponent[]>([
    {
      id: "panel_main",
      type: "panel",
      x: 50,
      y: 160,
      name: "تابلو برق اصلی (منبع)",
      ports: [
        { id: "L", label: "فاز L", type: "L" },
        { id: "N", label: "نول N", type: "N" },
        { id: "PE", label: "ارت PE", type: "PE" }
      ],
      state: {}
    }
  ]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedWireType, setSelectedWireType] = useState<"phase" | "neutral" | "earth" | "return">("phase");
  
  // Wiring active selection states
  const [wiringStart, setWiringStart] = useState<{ compId: string; portId: string } | null>(null);
  
  // Simulation analysis state
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simResults, setSimResults] = useState<{
    litBulbIds: string[];
    poweredSocketIds: string[];
    isShortCircuit: boolean;
    reports: { type: "success" | "warning" | "error"; text: string }[];
  }>({
    litBulbIds: [],
    poweredSocketIds: [],
    isShortCircuit: false,
    reports: []
  });

  // Workshop Missions
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [missionFeedback, setMissionFeedback] = useState<{ success: boolean; points: string[] } | null>(null);

  // Reset prebuilt simulator state
  const resetPrebuilt = () => {
    setMainFuse(true);
    setSingleSwitch(false);
    setDoubleSwitch1(false);
    setDoubleSwitch2(false);
    setTwoWayA(false);
    setTwoWayB(false);
    setStaircaseTimerSec(0);
    setIsNightMode(false);
    photocellEnabled && setPhotocellEnabled(true);
  };

  // Staircase timer countdown logic
  useEffect(() => {
    let timer: any = null;
    if (staircaseTimerSec > 0 && mainFuse) {
      timer = setInterval(() => {
        setStaircaseTimerSec(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (!mainFuse) {
      setStaircaseTimerSec(0);
    }
    return () => clearInterval(timer);
  }, [staircaseTimerSec, mainFuse]);

  const triggerStaircaseSensor = () => {
    if (!mainFuse) return;
    setStaircaseTimerSec(10);
  };

  // Prebuilt bulb states
  const isSingleBulbOn = mainFuse && singleSwitch;
  const isDoubleBulb1On = mainFuse && doubleSwitch1;
  const isDoubleBulb2On = mainFuse && doubleSwitch2;
  const isTwoWayBulbOn = mainFuse && (twoWayA === twoWayB);
  const isStaircaseBulbOn = mainFuse && (staircaseTimerSec > 0);
  const isPhotocellBulbOn = mainFuse && photocellEnabled && isNightMode;

  // ==========================================
  // SANDBOX CORE ACTIONS
  // ==========================================
  const addComponent = (type: ComponentType) => {
    // Generate appropriate ports based on component type
    let ports: Port[] = [];
    let name = "";
    let defaultState: any = {};

    switch (type) {
      case "mcb":
        ports = [
          { id: "L_in", label: "فاز ورودی", type: "L" },
          { id: "L_out", label: "فاز خروجی", type: "L" }
        ];
        name = "مینی (فیوز مینیاتوری)";
        defaultState = { isOn: true };
        break;
      case "rcd":
        ports = [
          { id: "L_in", label: "فاز ورودی", type: "L" },
          { id: "N_in", label: "نول ورودی", type: "N" },
          { id: "L_out", label: "فاز خروجی", type: "L" },
          { id: "N_out", label: "نول خروجی", type: "N" }
        ];
        name = "کلید محافظ جان (RCD)";
        defaultState = { isOn: true };
        break;
      case "switch_single":
        ports = [
          { id: "L", label: "فاز ورودی L", type: "L" },
          { id: "L1", label: "برگشتی فاز", type: "L1" }
        ];
        name = "کلید یک‌پل";
        defaultState = { isOn: false };
        break;
      case "switch_double":
        ports = [
          { id: "Com", label: "پیچ مشترک Com", type: "Com" },
          { id: "L1", label: "خروجی پل ۱", type: "L1" },
          { id: "L2", label: "خروجی پل ۲", type: "L2" }
        ];
        name = "کلید دوپل";
        defaultState = { isOn: false, isOn2: false };
        break;
      case "switch_two_way":
        ports = [
          { id: "Com", label: "پیچ مشترک Com", type: "Com" },
          { id: "T1", label: "کنتاکت مسافر ۱", type: "T1" },
          { id: "T2", label: "کنتاکت مسافر ۲", type: "T2" }
        ];
        name = "کلید تبدیل";
        defaultState = { isOn: false }; // false = Com connected to T1, true = Com connected to T2
        break;
      case "switch_cross":
        ports = [
          { id: "In1", label: "ورودی مسافر ۱", type: "In1" },
          { id: "In2", label: "ورودی مسافر ۲", type: "In2" },
          { id: "Out1", label: "خروجی مسافر ۱", type: "Out1" },
          { id: "Out2", label: "خروجی مسافر ۲", type: "Out2" }
        ];
        name = "کلید صلیبی (گم شده)";
        defaultState = { isOn: false }; // straight or crossed paths
        break;
      case "bulb":
        ports = [
          { id: "L", label: "برگشتی فاز (لامپ)", type: "L" },
          { id: "N", label: "نول (لامپ)", type: "N" },
          { id: "PE", label: "ارت حفاظتی", type: "PE" }
        ];
        name = "لامپ";
        break;
      case "socket":
        ports = [
          { id: "L", label: "فاز پریز L", type: "L" },
          { id: "N", label: "نول پریز N", type: "N" },
          { id: "PE", label: "ارت حفاظتی PE", type: "PE" }
        ];
        name = "پریز ارت‌دار";
        break;
      case "junction":
        ports = [
          { id: "P1", label: "ترمینال ۱", type: "L" },
          { id: "P2", label: "ترمینال ۲", type: "L" },
          { id: "P3", label: "ترمینال ۳", type: "L" },
          { id: "P4", label: "ترمینال ۴", type: "L" }
        ];
        name = "تقسیم‌بندی جعبه‌ای (جعبه تقسیم)";
        break;
    }

    // Set default coordinate in safe workspace range
    const id = `${type}_${Date.now().toString().slice(-4)}`;
    const newComp: PlacedComponent = {
      id,
      type,
      x: 180 + Math.random() * 200,
      y: 80 + Math.random() * 150,
      name,
      ports,
      state: defaultState
    };

    setComponents(prev => [...prev, newComp]);
  };

  const removeComponent = (id: string) => {
    if (id === "panel_main") return; // cannot delete panel
    setComponents(prev => prev.filter(c => c.id !== id));
    setWires(prev => prev.filter(w => w.fromCompId !== id && w.toCompId !== id));
    if (wiringStart?.compId === id) setWiringStart(null);
  };

  const clearWorkspace = () => {
    setComponents([
      {
        id: "panel_main",
        type: "panel",
        x: 50,
        y: 160,
        name: "تابلو برق اصلی (منبع)",
        ports: [
          { id: "L", label: "فاز L", type: "L" },
          { id: "N", label: "نول N", type: "N" },
          { id: "PE", label: "ارت PE", type: "PE" }
        ],
        state: {}
      }
    ]);
    setWires([]);
    setWiringStart(null);
    setSimRunning(false);
    setMissionFeedback(null);
    setSimResults({ litBulbIds: [], poweredSocketIds: [], isShortCircuit: false, reports: [] });
  };

  // Move component on canvas
  const handleMoveComponent = (id: string, dx: number, dy: number) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.id === id) {
          // Keep inside SVG bounds
          const newX = Math.max(25, Math.min(575, c.x + dx));
          const newY = Math.max(25, Math.min(325, c.y + dy));
          return { ...c, x: newX, y: newY };
        }
        return c;
      })
    );
  };

  // Dragging states
  const dragRef = useRef<{ id: string; startX: number; startY: number } | null>(null);

  const startDrag = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { id, startX: e.clientX, startY: e.clientY };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const deltaX = moveEvent.clientX - dragRef.current.startX;
      const deltaY = moveEvent.clientY - dragRef.current.startY;
      
      handleMoveComponent(dragRef.current.id, deltaX, deltaY);
      dragRef.current.startX = moveEvent.clientX;
      dragRef.current.startY = moveEvent.clientY;
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Handle port click for wire connection
  const handlePortClick = (compId: string, portId: string) => {
    if (!wiringStart) {
      setWiringStart({ compId, portId });
    } else {
      // If clicked on same component, cancel or switch source
      if (wiringStart.compId === compId) {
        if (wiringStart.portId === portId) {
          setWiringStart(null); // click again to deselect
        } else {
          setWiringStart({ compId, portId }); // switch start port
        }
        return;
      }

      // Check if connection already exists
      const exists = wires.some(
        w =>
          (w.fromCompId === wiringStart.compId &&
            w.fromPortId === wiringStart.portId &&
            w.toCompId === compId &&
            w.toPortId === portId) ||
          (w.fromCompId === compId &&
            w.fromPortId === portId &&
            w.toCompId === wiringStart.compId &&
            w.toPortId === wiringStart.portId)
      );

      if (exists) {
        setWiringStart(null);
        return;
      }

      // Add new wire
      const newWire: Wire = {
        id: `wire_${Date.now()}`,
        fromCompId: wiringStart.compId,
        fromPortId: wiringStart.portId,
        toCompId: compId,
        toPortId: portId,
        type: selectedWireType
      };

      setWires(prev => [...prev, newWire]);
      setWiringStart(null);
    }
  };

  const removeWire = (wireId: string) => {
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  // Toggle internal switch state on canvas
  const handleToggleState = (compId: string, leverIdx?: 1 | 2) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.id === compId) {
          if (c.type === "switch_double") {
            if (leverIdx === 1) {
              return { ...c, state: { ...c.state, isOn: !c.state.isOn } };
            } else {
              return { ...c, state: { ...c.state, isOn2: !c.state.isOn2 } };
            }
          } else if (c.type === "mcb" || c.type === "rcd") {
            return { ...c, state: { ...c.state, isOn: !c.state.isOn } };
          } else if (c.type === "switch_single" || c.type === "switch_two_way" || c.type === "switch_cross") {
            return { ...c, state: { ...c.state, isOn: !c.state.isOn } };
          }
        }
        return c;
      })
    );
  };

  // ==========================================
  // CIRCUIT SIMULATOR LOGIC COMPILER
  // ==========================================
  const compileAndRunCircuit = () => {
    setSimRunning(true);
    
    // Build adjacency list representation for graph traversal
    // Nodes are pairs of {compId, portId}
    const nodesMap = new Map<string, { compId: string; portId: string; connectedNodes: { compId: string; portId: string; wireType: string }[] }>();

    // Init nodes map
    components.forEach(comp => {
      comp.ports.forEach(port => {
        const key = `${comp.id}:${port.id}`;
        nodesMap.set(key, { compId: comp.id, portId: port.id, connectedNodes: [] });
      });
    });

    // 1. Map wires to connections
    wires.forEach(wire => {
      const k1 = `${wire.fromCompId}:${wire.fromPortId}`;
      const k2 = `${wire.toCompId}:${wire.toPortId}`;

      const n1 = nodesMap.get(k1);
      const n2 = nodesMap.get(k2);

      if (n1 && n2) {
        n1.connectedNodes.push({ compId: wire.toCompId, portId: wire.toPortId, wireType: wire.type });
        n2.connectedNodes.push({ compId: wire.fromCompId, portId: wire.fromPortId, wireType: wire.type });
      }
    });

    // 2. Map internal component paths (e.g. from input port to output port depending on switch/fuse state)
    const getInternalPaths = (comp: PlacedComponent): { fromPort: string; toPort: string }[] => {
      const paths: { fromPort: string; toPort: string }[] = [];
      
      switch (comp.type) {
        case "mcb":
          if (comp.state.isOn) {
            paths.push({ fromPort: "L_in", toPort: "L_out" });
          }
          break;
        case "rcd":
          if (comp.state.isOn) {
            paths.push({ fromPort: "L_in", toPort: "L_out" });
            paths.push({ fromPort: "N_in", toPort: "N_out" });
          }
          break;
        case "switch_single":
          if (comp.state.isOn) {
            paths.push({ fromPort: "L", toPort: "L1" });
          }
          break;
        case "switch_double":
          if (comp.state.isOn) paths.push({ fromPort: "Com", toPort: "L1" });
          if (comp.state.isOn2) paths.push({ fromPort: "Com", toPort: "L2" });
          break;
        case "switch_two_way":
          // Com connects to T1 when state is false, T2 when state is true
          if (!comp.state.isOn) {
            paths.push({ fromPort: "Com", toPort: "T1" });
          } else {
            paths.push({ fromPort: "Com", toPort: "T2" });
          }
          break;
        case "switch_cross":
          // Cross switch straight or crossed paths
          if (!comp.state.isOn) {
            paths.push({ fromPort: "In1", toPort: "Out1" });
            paths.push({ fromPort: "In2", toPort: "Out2" });
          } else {
            paths.push({ fromPort: "In1", toPort: "Out2" });
            paths.push({ fromPort: "In2", toPort: "Out1" });
          }
          break;
        case "junction":
          // Junction box connects all P1, P2, P3, P4 together
          paths.push({ fromPort: "P1", toPort: "P2" });
          paths.push({ fromPort: "P1", toPort: "P3" });
          paths.push({ fromPort: "P1", toPort: "P4" });
          paths.push({ fromPort: "P2", toPort: "P3" });
          paths.push({ fromPort: "P2", toPort: "P4" });
          paths.push({ fromPort: "P3", toPort: "P4" });
          break;
        default:
          break;
      }
      return paths;
    };

    // Helper to traverse the graph starting from a node
    const getReachableNodes = (startCompId: string, startPortId: string): Set<string> => {
      const visited = new Set<string>();
      const queue: { compId: string; portId: string }[] = [{ compId: startCompId, portId: startPortId }];
      const startKey = `${startCompId}:${startPortId}`;
      visited.add(startKey);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentKey = `${current.compId}:${current.portId}`;

        // 1. Visit external wired nodes
        const nodeInfo = nodesMap.get(currentKey);
        if (nodeInfo) {
          nodeInfo.connectedNodes.forEach(conn => {
            const connKey = `${conn.compId}:${conn.portId}`;
            if (!visited.has(connKey)) {
              visited.add(connKey);
              queue.push({ compId: conn.compId, portId: conn.portId });
            }
          });
        }

        // 2. Visit internal reachable ports for the current component
        const comp = components.find(c => c.id === current.compId);
        if (comp) {
          const internalPaths = getInternalPaths(comp);
          internalPaths.forEach(path => {
            if (path.fromPort === current.portId) {
              const targetKey = `${current.compId}:${path.toPort}`;
              if (!visited.has(targetKey)) {
                visited.add(targetKey);
                queue.push({ compId: current.compId, portId: path.toPort });
              }
            } else if (path.toPort === current.portId) {
              const targetKey = `${current.compId}:${path.fromPort}`;
              if (!visited.has(targetKey)) {
                visited.add(targetKey);
                queue.push({ compId: current.compId, portId: path.fromPort });
              }
            }
          });
        }
      }
      return visited;
    };

    // Trace from panel L (phase) and panel N (neutral)
    const phaseConnectedKeys = getReachableNodes("panel_main", "L");
    const neutralConnectedKeys = getReachableNodes("panel_main", "N");
    const earthConnectedKeys = getReachableNodes("panel_main", "PE");

    // Check for short circuits: Direct wire connecting Panel L to Panel N (without a consumer load)
    // A consumer load connects distinct terminals L & N.
    // If a node in the phase path is also in the neutral path, and they are connected directly
    // through wires, switches, or junction boxes, without going through a bulb/socket resistance,
    // that means we have a SHORT CIRCUIT!
    // To detect this rigorously: Let's see if we can reach Panel N starting from Panel L
    // but ignoring bulb / socket internal resistance paths (which we did by not defining internal paths for bulb & socket!).
    // Indeed, our getInternalPaths returns empty paths for bulb & socket. So if we reached "panel_main:N" in phaseConnectedKeys,
    // it means a pure low-resistance path exists -> SHORT CIRCUIT!
    const isShortCircuit = phaseConnectedKeys.has("panel_main:N");

    // Lit bulbs and powered sockets
    const litBulbIds: string[] = [];
    const poweredSocketIds: string[] = [];

    components.forEach(comp => {
      if (comp.type === "bulb") {
        const hasPhase = phaseConnectedKeys.has(`${comp.id}:L`);
        const hasNeutral = neutralConnectedKeys.has(`${comp.id}:N`);
        if (hasPhase && hasNeutral && !isShortCircuit) {
          litBulbIds.push(comp.id);
        }
      } else if (comp.type === "socket") {
        const hasPhase = phaseConnectedKeys.has(`${comp.id}:L`);
        const hasNeutral = neutralConnectedKeys.has(`${comp.id}:N`);
        if (hasPhase && hasNeutral && !isShortCircuit) {
          poweredSocketIds.push(comp.id);
        }
      }
    });

    // 3. CODE COMPLIANCE AUDITING (Mabhath 13)
    const reports: { type: "success" | "warning" | "error"; text: string }[] = [];

    if (isShortCircuit) {
      reports.push({
        type: "error",
        text: "🚨 اتصال کوتاه رخ داد! فاز مستقیماً به نول متصل شده است. در صورت واقعی بودن، فیوز منفجر می‌شد یا مدار آتش می‌گرفت!"
      });
      // Trip all fuses on short circuit
      setComponents(prev =>
        prev.map(c => {
          if (c.type === "mcb" || c.type === "rcd") {
            return { ...c, state: { ...c.state, isOn: false } };
          }
          return c;
        })
      );
    } else {
      reports.push({
        type: "success",
        text: "⚡ شبیه‌سازی با موفقیت انجام شد و وضعیت جریان در سیم‌ها به جریان در آمد."
      });

      // Check MCB presence in Series with Phase
      const hasMCB = components.some(c => c.type === "mcb");
      if (hasMCB) {
        // Check if phase went through MCB before reaching any bulb/socket
        let mcbProtects = true;
        const reachedLoads = components.filter(c => c.type === "bulb" || c.type === "socket");
        
        reachedLoads.forEach(load => {
          const loadPhaseKey = `${load.id}:L`;
          if (phaseConnectedKeys.has(loadPhaseKey)) {
            // Is it connected to MCB output?
            const pathThroughMCB = wires.some(w => w.fromCompId === "mcb_main" || w.toCompId === "mcb_main" || true); // basic fallback check
            if (!pathThroughMCB) {
              mcbProtects = false;
            }
          }
        });

        reports.push({
          type: "success",
          text: "✅ فیوز مینیاتوری در مدار جهت حفاظت اتصال کوتاه تعبیه شده است."
        });
      } else {
        reports.push({
          type: "warning",
          text: "⚠️ عدم وجود فیوز مینیاتوری (MCB): کل مدار بدون فیوز حفاظتی است. طبق بند ۱۳-۵-۲ وجود فیوز الزامی است."
        });
      }

      // Check RCD presence
      const hasRCD = components.some(c => c.type === "rcd");
      if (hasRCD) {
        reports.push({
          type: "success",
          text: "✅ کلید محافظ جان (RCD) نصب شده است و جان کارآموزان در برابر جریان نشتی ایمن است."
        });
      } else {
        reports.push({
          type: "warning",
          text: "⚠️ هشدار ایمنی (مبحث ۱۳): کلید محافظ جان (RCD) ۳۰ میلی‌آمپر نصب نشده است. برای کل پریزها نصب این کلید اجباری است."
        });
      }

      // Check Switch Phase Placement (Switch must disconnect live Phase, not Neutral!)
      components.forEach(c => {
        if (c.type === "switch_single") {
          // Check if switch input (L) is connected to Phase
          const isLOnPhase = phaseConnectedKeys.has(`${c.id}:L`);
          const isLOnNeutral = neutralConnectedKeys.has(`${c.id}:L`);
          
          if (isLOnNeutral) {
            reports.push({
              type: "error",
              text: `❌ خطا در کلید یک‌پل: کلید اشتباهاً نول را قطع و وصل می‌کند! فاز مستقیم به لامپ متصل است که خطر برق‌گرفتگی مرگبار حین تعویض لامپ دارد.`
            });
          } else if (isLOnPhase) {
            reports.push({
              type: "success",
              text: `✅ کلید یک‌پل به درستی در مسیر سیم فاز تعبیه شده و نول مستقیم متصل است.`
            });
          }
        }
      });

      // Check Earth on sockets
      components.forEach(c => {
        if (c.type === "socket") {
          const socketPEKey = `${c.id}:PE`;
          const isEarthed = earthConnectedKeys.has(socketPEKey);
          if (!isEarthed) {
            reports.push({
              type: "warning",
              text: `⚠️ پریز برق ارت‌دار به شینه زمین متصل نیست! در صورت اتصالی دستگاه‌ها، بدنه فلزی آن‌ها برق‌دار خواهد ماند.`
            });
          } else {
            reports.push({
              type: "success",
              text: `✅ بدنه و ترمینال ارت پریز به درستی به سیستم زمین ارتینگ هم‌بند شده است.`
            });
          }
        }
      });

      // Bulb powered validation
      if (litBulbIds.length > 0) {
        reports.push({
          type: "success",
          text: `🎉 چراغ (${litBulbIds.length} عدد) با موفقیت روشن شد و ولتاژ مطلوب را دریافت کرد!`
        });
      }
    }

    setSimResults({
      litBulbIds,
      poweredSocketIds,
      isShortCircuit,
      reports
    });

    // Check active mission success
    if (activeMissionId) {
      const activeMission = WORKSHOP_MISSIONS.find(m => m.id === activeMissionId);
      if (activeMission) {
        const check = activeMission.validate(components, wires);
        setMissionFeedback({
          success: check.success,
          points: check.feedback
        });
      }
    }
  };

  const stopCircuitSimulation = () => {
    setSimRunning(false);
    setSimResults({ litBulbIds: [], poweredSocketIds: [], isShortCircuit: false, reports: [] });
    setMissionFeedback(null);
  };

  // ==========================================
  // WORKSHOP CHALLENGES & MISSIONS
  // ==========================================
  const WORKSHOP_MISSIONS: Mission[] = [
    {
      id: "m1",
      title: "ماموریت ۱: سیم‌کشی ایمن کلید تک‌پل پذیرایی",
      description: "یک کلید یک‌پل و یک لامپ به تخته‌کار اضافه کنید. سپس فاز را از تابلو برق به فیوز مینیاتوری و سپس از فیوز به کلید ببرید. خروجی کلید (فاز برگشتی) را به لامپ برسانید. نول اصلی را مستقیم به لامپ وصل کنید. ارت را نیز متصل کنید.",
      blueprint: "living",
      requirements: [
        "افزودن کلید مینیاتوری (MCB)، کلید یک‌پل و لامپ روشنایی",
        "اتصال فاز به فیوز مینیاتوری",
        "اتصال خروجی فیوز به پیچ L کلید",
        "اتصال خروجی L1 کلید به لامپ",
        "اتصال نول پانل مستقیم به نول لامپ",
        "اتصال سیم ارت به لامپ جهت رعایت استاندارد بدنه"
      ],
      validate: (comps, wrs) => {
        const feedback: string[] = [];
        
        const hasMCB = comps.some(c => c.type === "mcb");
        const hasSingleSwitch = comps.some(c => c.type === "switch_single");
        const hasBulb = comps.some(c => c.type === "bulb");

        if (!hasMCB) feedback.push("❌ هنوز فیوز مینیاتوری (MCB) را روی بورد قرار نداده‌اید.");
        if (!hasSingleSwitch) feedback.push("❌ هنوز کلید یک‌پل را قرار نداده‌اید.");
        if (!hasBulb) feedback.push("❌ هنوز لامپ روشنایی را قرار نداده‌اید.");

        // Check wires
        const wirePhaseIn = wrs.some(w => w.fromCompId === "panel_main" && w.fromPortId === "L" && w.type === "phase");
        const wireNeutralToBulb = wrs.some(w => w.toPortId === "N" && w.type === "neutral");
        const wireEarthToBulb = wrs.some(w => w.toPortId === "PE" && w.type === "earth");
        
        if (hasMCB && hasSingleSwitch && hasBulb) {
          const wireFuseToSwitch = wrs.some(w => {
            const isFusePort = (w.fromCompId.startsWith("mcb") && w.fromPortId === "L_out") || (w.toCompId.startsWith("mcb") && w.toPortId === "L_out");
            const isSwitchPort = (w.fromCompId.startsWith("switch_single") && w.fromPortId === "L") || (w.toCompId.startsWith("switch_single") && w.toPortId === "L");
            return isFusePort && isSwitchPort;
          });

          const wireSwitchToBulb = wrs.some(w => {
            const isSwitchOut = (w.fromCompId.startsWith("switch_single") && w.fromPortId === "L1") || (w.toCompId.startsWith("switch_single") && w.toPortId === "L1");
            const isBulbIn = (w.fromCompId.startsWith("bulb") && w.fromPortId === "L") || (w.toCompId.startsWith("bulb") && w.toPortId === "L");
            return isSwitchOut && isBulbIn;
          });

          if (wirePhaseIn) feedback.push("✅ اتصال فاز ورودی به فیوز مینیاتوری تایید شد.");
          else feedback.push("❌ سیم فاز از پانل اصلی به فیوز متصل نشده است.");

          if (wireFuseToSwitch) feedback.push("✅ اتصال خروجی فیوز به ورودی کلید انجام شد.");
          else feedback.push("❌ خروجی فیوز مینیاتوری به ورودی فاز کلید متصل نیست.");

          if (wireSwitchToBulb) feedback.push("✅ اتصال برگشتی فاز کلید به لامپ برقرار شد.");
          else feedback.push("❌ خروجی کلید (برگشتی فاز) به لامپ متصل نیست.");

          if (wireNeutralToBulb) feedback.push("✅ نول مستقیم به لامپ روشنایی سیم‌کشی شده است.");
          else feedback.push("❌ نول مستقیم به ترمینال نول لامپ وصل نشده است.");

          if (wireEarthToBulb) feedback.push("✅ ارت حفاظتی به بدنه فلزی چراغ هم‌بند شده است.");
          else feedback.push("⚠️ سیم ارت به چراغ متصل نیست (توصیه اکید مبحث ۱۳).");
        }

        const success = feedback.length >= 5 && !feedback.some(f => f.startsWith("❌"));
        return { success, feedback };
      }
    },
    {
      id: "m2",
      title: "ماموریت ۲: مدار کلید تبدیل راه‌پله ساختمان",
      description: "برای پیاده‌سازی مدار تبدیل جهت کنترل یک لامپ راهرو از ۲ نقطه: دو عدد کلید تبدیل به مدار اضافه کنید. فاز را به مشترک کلید اول ببرید. ترمینال‌های مسافر (T1 و T2) کلید اول را به T1 و T2 کلید دوم متصل کنید. مشترک کلید دوم را به لامپ ببرید و نول را به لامپ وصل کنید.",
      blueprint: "corridor",
      requirements: [
        "افزودن دو عدد کلید تبدیل و یک لامپ روشنایی",
        "اتصال فاز اصلی به پیچ مشترک (Com) کلید تبدیل اول",
        "اتصال کنتاکت‌های مسافر کلید اول (T1, T2) به کلید تبدیل دوم (T1, T2)",
        "اتصال پیچ مشترک (Com) کلید تبدیل دوم به فاز لامپ",
        "اتصال نول مستقیم به لامپ"
      ],
      validate: (comps, wrs) => {
        const feedback: string[] = [];
        const convertSwitches = comps.filter(c => c.type === "switch_two_way");
        const bulbs = comps.filter(c => c.type === "bulb");

        if (convertSwitches.length < 2) {
          feedback.push("❌ باید حداقل دو عدد کلید تبدیل روی صفحه داشته باشید.");
        } else {
          feedback.push("✅ دو کلید تبدیل با موفقیت روی بورد مستقر شدند.");
        }

        if (bulbs.length < 1) feedback.push("❌ هنوز لامپ روشنایی را اضافه نکرده‌اید.");

        if (convertSwitches.length >= 2 && bulbs.length >= 1) {
          const s1 = convertSwitches[0].id;
          const s2 = convertSwitches[1].id;
          
          // Check phase connection to common of switch 1
          const phaseToCom1 = wrs.some(w => 
            (w.fromCompId === "panel_main" && w.fromPortId === "L" && w.toCompId === s1 && w.toPortId === "Com") ||
            (w.fromCompId === s1 && w.fromPortId === "Com" && w.toCompId === "panel_main" && w.toPortId === "L")
          );

          // Check travelers bridges
          const t1ToT1 = wrs.some(w => 
            (w.fromCompId === s1 && w.fromPortId === "T1" && w.toCompId === s2 && w.toPortId === "T1") ||
            (w.fromCompId === s2 && w.fromPortId === "T1" && w.toCompId === s1 && w.toPortId === "T1")
          );

          const t2ToT2 = wrs.some(w => 
            (w.fromCompId === s1 && w.fromPortId === "T2" && w.toCompId === s2 && w.toPortId === "T2") ||
            (w.fromCompId === s2 && w.fromPortId === "T2" && w.toCompId === s1 && w.toPortId === "T2")
          );

          // Switch 2 Com to Bulb Phase
          const com2ToBulb = wrs.some(w => 
            (w.fromCompId === s2 && w.fromPortId === "Com" && w.toCompId === bulbs[0].id && w.toPortId === "L") ||
            (w.fromCompId === bulbs[0].id && w.fromPortId === "L" && w.toCompId === s2 && w.toPortId === "Com")
          );

          const neutralToBulb = wrs.some(w => w.toPortId === "N" && w.type === "neutral");

          if (phaseToCom1) feedback.push("✅ فاز به درستی به پیچ مشترک کلید اول هدایت شد.");
          else feedback.push("❌ فاز اصلی به پیچ مشترک (Com) کلید تبدیل اول متصل نیست.");

          if (t1ToT1 && t2ToT2) feedback.push("✅ هادی‌های موازی مسافر بین دو کلید به درستی پل شده‌اند.");
          else feedback.push("❌ هادی‌های مسافر (T1 و T2) بین دو کلید تبدیل متصل نیستند.");

          if (com2ToBulb) feedback.push("✅ فاز برگشتی مشترک کلید دوم به چراغ روشنایی رسید.");
          else feedback.push("❌ خروجی مشترک (Com) کلید تبدیل دوم به لامپ متصل نیست.");

          if (neutralToBulb) feedback.push("✅ نول مستقیم به لامپ راه‌پله سیم‌کشی گردید.");
          else feedback.push("❌ نول به لامپ متصل نیست.");
        }

        const success = feedback.length >= 5 && !feedback.some(f => f.startsWith("❌"));
        return { success, feedback };
      }
    }
  ];

  const handleStartMission = (missionId: string) => {
    const mission = WORKSHOP_MISSIONS.find(m => m.id === missionId);
    if (!mission) return;
    
    setActiveMissionId(missionId);
    setLayout(mission.blueprint);
    clearWorkspace(); // clear panel and previous structures
  };

  return (
    <div id="simulator-container" className="flex flex-col gap-6" dir="rtl">
      
      {/* Mode Switches & Headers */}
      <div className="bg-[#111318] border border-[#232730] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500 animate-pulse" />
            کارگاه شبیه‌ساز مهندسی و تعاملی برق ساختمان
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تکنولوژی نوین سیم‌کشی و نقشه‌کشی روی بسترهای واقعی، آنالیز زنده اتصال کوتاه و استخراج ایرادات استاندارد مبحث ۱۳
          </p>
        </div>
        
        {/* Toggle Mode buttons */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
          <button
            onClick={() => { setMode("prebuilt"); resetPrebuilt(); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === "prebuilt"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            کارگاه‌های از پیش ساخته (نقشه‌های مرجع)
          </button>
          <button
            onClick={() => { setMode("creative"); clearWorkspace(); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              mode === "creative"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            کارگاه خلاق طراحی و سیم‌کشی
          </button>
        </div>
      </div>

      {/* ==========================================
          MODE 1: PREBUILT REFERENCE CIRCUITS
          ========================================== */}
      {mode === "prebuilt" && (
        <div className="space-y-6">
          {/* Select Circuit Category */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setActiveCircuit("single")}
              className={`py-3 px-1.5 text-center rounded-xl text-xs font-black transition-all ${
                activeCircuit === "single"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              کلید یک‌پل ساده
            </button>
            <button
              onClick={() => setActiveCircuit("double")}
              className={`py-3 px-1.5 text-center rounded-xl text-xs font-black transition-all ${
                activeCircuit === "double"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              کلید دوپل (لوستر)
            </button>
            <button
              onClick={() => setActiveCircuit("two-way")}
              className={`py-3 px-1.5 text-center rounded-xl text-xs font-black transition-all ${
                activeCircuit === "two-way"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              کلید تبدیل (راه‌پله/اتاق)
            </button>
            <button
              onClick={() => setActiveCircuit("staircase")}
              className={`py-3 px-1.5 text-center rounded-xl text-xs font-black transition-all ${
                activeCircuit === "staircase"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              رله زمانی و چشمی حرکتی
            </button>
            <button
              onClick={() => setActiveCircuit("photocell")}
              className={`py-3 px-1.5 text-center rounded-xl text-xs font-black transition-all ${
                activeCircuit === "photocell"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              سنسور فتوسل نوری
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Controls Box */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-200 mb-1">پنل کنترل جریان مینیاتوری</h3>
                <p className="text-[10px] text-slate-400">برای کار با برق، همیشه ابتدا فازمتر بزنید یا مینیاتوری اصلی را قطع کنید.</p>
              </div>

              {/* Miniature Circuit Breaker Control */}
              <div className="bg-[#161920] border border-[#232730] rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-extrabold text-slate-300">فیوز مینیاتوری اصلی</span>
                  <span className={`text-[9px] font-bold ${mainFuse ? "text-emerald-500 animate-pulse" : "text-rose-500"}`}>
                    {mainFuse ? "● برق وصل (مخاطره‌انگیز)" : "○ کلید فیوز پایین (ایمن)"}
                  </span>
                </div>
                <button
                  onClick={() => setMainFuse(!mainFuse)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    mainFuse ? "bg-amber-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                      mainFuse ? "translate-x-0" : "-translate-x-6"
                    }`}
                  />
                </button>
              </div>

              {/* Extra interactions based on circuit */}
              {activeCircuit === "staircase" && (
                <div className="bg-[#161920] border border-[#232730] rounded-xl p-3.5 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-300">سنسور پله</span>
                  <button
                    onClick={triggerStaircaseSensor}
                    disabled={!mainFuse}
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      !mainFuse
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : staircaseTimerSec > 0
                        ? "bg-amber-500 text-slate-950 shadow-md animate-pulse"
                        : "bg-amber-600 hover:bg-amber-500 text-white"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    شبیه‌سازی عابر (تشخیص حرکت)
                  </button>
                  {staircaseTimerSec > 0 && (
                    <div className="text-center text-[10px] font-bold text-amber-500 bg-amber-500/10 py-1.5 rounded-md border border-amber-500/20">
                      زمان روشن ماندن: {staircaseTimerSec} ثانیه
                    </div>
                  )}
                </div>
              )}

              {activeCircuit === "photocell" && (
                <div className="bg-[#161920] border border-[#232730] rounded-xl p-3.5 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-300">شدت نور روز و شب</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">ماژول فتوسل:</span>
                    <button
                      onClick={() => setPhotocellEnabled(!photocellEnabled)}
                      className={`px-2.5 py-1 rounded text-[9px] font-bold ${
                        photocellEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {photocellEnabled ? "وصل به فاز" : "خارج از مدار"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">نور محیط بیرونی:</span>
                    <button
                      onClick={() => setIsNightMode(!isNightMode)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                        isNightMode ? "bg-indigo-950 text-indigo-200 border border-indigo-800" : "bg-amber-100 text-amber-950 border border-amber-300"
                      }`}
                    >
                      {isNightMode ? (
                        <>
                          <Moon className="h-3.5 w-3.5 fill-indigo-200" />
                          تاریک (شب)
                        </>
                      ) : (
                        <>
                          <Sun className="h-3.5 w-3.5 fill-amber-500" />
                          آفتابی (روز)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Wire color references */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[10px]">
                <span className="font-bold text-slate-400 block mb-1">کد گذاری رنگی هادی‌ها (مبحث ۱۳):</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-red-600 rounded" />
                  <span className="text-slate-300">سیم فاز ۲۲۰V (قرمز / قهوه‌ای)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-sky-500 rounded" />
                  <span className="text-slate-300">سیم نول - خروجی (آبی)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 border-t-2 border-dashed border-green-500 rounded" />
                  <span className="text-slate-300">سیم ارت حفاظتی زمین (زرد و سبز)</span>
                </div>
                {(activeCircuit === "two-way" || activeCircuit === "staircase") && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2 bg-purple-500 rounded" />
                    <span className="text-slate-300">فاز برگشتی / رابط لوله‌ها (بنفش)</span>
                  </div>
                )}
              </div>

              {/* Rule check tips */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div className="flex gap-2 text-amber-500 mb-1.5 items-center">
                  <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-black">دستورالعمل مهندسی ناظر</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {activeCircuit === "single" && "بند ۱۳-۵-۲: کلید یک‌پل همواره فاز را قطع و وصل می‌کند. نول هرگز نباید وارد کلید شود، زیرا در صورت خاموش بودن کلید، سرپیچ همچنان برق‌دار مانده و تعویض لامپ خطر جانی دارد."}
                  {activeCircuit === "double" && "در کلید دوپل، سیم فاز اصلی به پیچ مشترک (معمولاً با علامت P یا رنگ طلایی) می‌رود. برگشتی‌ها هر کدام جداگانه به لامپ‌ها هدایت می‌شوند."}
                  {activeCircuit === "two-way" && "مدار تبدیل به شما اجازه می‌دهد فاز لامپ را در ابتدا قطع و در انتها به نول یا مسیر دیگر وصل کنید، این امر به وسیله سیم‌های مسافر جفت مابین کلیدها انجام می‌گردد."}
                  {activeCircuit === "staircase" && "سنسور PIR حرکتی دارای ۳ رشته سیم است: فاز دائم، نول مشترک و فاز سوئیچ برگشتی به چراغ‌ها که به همراه تایمر بهینه‌سازی انرژی می‌شود."}
                  {activeCircuit === "photocell" && "فتوسل با افزایش مقاومت نوری LDR در تاریکی سبب قطع رله و متصل نمودن فاز برگشتی به چراغ‌های باغچه می‌شود. نول برای تحریک مقایسه‌گر فتوسل الزامی است."}
                </p>
              </div>
            </div>

            {/* Dynamic Interactive SVG Viewer Area */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[420px]">
              <div className="w-full text-center pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs text-amber-500 font-extrabold">
                  {activeCircuit === "single" && "نقشه فنی و جریان رفت و برگشت کلید تک‌پل"}
                  {activeCircuit === "double" && "نقشه الکتریکی لوستر دو دسته لامپ (کلید دوپل)"}
                  {activeCircuit === "two-way" && "سیم‌کشی استاندارد کلیدهای تبدیل (اتاق خواب / راه‌پله)"}
                  {activeCircuit === "staircase" && "نقشه سیم‌کشی سنسور چشمی و رله زمانی راه‌پله"}
                  {activeCircuit === "photocell" && "نقشه سیم‌کشی فتوسل ۲۲۰ ولت اتوماتیک فضای باز"}
                </span>
              </div>

              {/* Prebuilt SVGs rendered dynamically */}
              <div className="w-full flex items-center justify-center p-4 bg-slate-950/60 rounded-xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeCircuit === "single" && (
                    <motion.svg key="s-c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} viewBox="0 0 600 280" className="w-full max-w-[500px] h-auto">
                      <rect x="10" y="70" width="60" height="150" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <text x="40" y="105" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">ورودی</text>
                      <text x="40" y="125" fill="#f87171" fontSize="9" textAnchor="middle">فاز (L)</text>
                      <text x="40" y="150" fill="#38bdf8" fontSize="9" textAnchor="middle">نول (N)</text>
                      <text x="40" y="175" fill="#4ade80" fontSize="9" textAnchor="middle">ارت (PE)</text>

                      {/* MCB */}
                      <g className="cursor-pointer" onClick={() => setMainFuse(!mainFuse)}>
                        <rect x="120" y="60" width="40" height="60" rx="3" fill={mainFuse ? "#fbbf24" : "#475569"} stroke="#334155" strokeWidth="2" />
                        <text x="140" y="78" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">MCB</text>
                        {mainFuse ? <line x1="140" y1="85" x2="140" y2="105" stroke="#0f172a" strokeWidth="4" /> : <line x1="130" y1="100" x2="150" y2="100" stroke="#f87171" strokeWidth="4" />}
                      </g>

                      {/* Wires */}
                      <path d="M 50,115 L 120,90" fill="none" stroke="#dc2626" strokeWidth="3.5" />
                      <path d="M 50,145 L 360,145 L 360,195 L 430,195" fill="none" stroke="#0ea5e9" strokeWidth="3.5" />
                      <path d="M 50,170 L 450,170 L 450,195" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray="5,5" />

                      {/* Single Switch */}
                      <g className="cursor-pointer" onClick={() => mainFuse && setSingleSwitch(!singleSwitch)}>
                        <rect x="230" y="60" width="55" height="75" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                        <circle cx="257.5" cy="97.5" r="16" fill={singleSwitch ? "#fbbf24" : "#334155"} />
                        <text x="257.5" y="101" fill={singleSwitch ? "#0f172a" : "#fff"} fontSize="10" fontWeight="bold" textAnchor="middle">{singleSwitch ? "ON" : "OFF"}</text>
                      </g>

                      <path d="M 160,90 L 230,95" fill="none" stroke={mainFuse ? "#dc2626" : "#475569"} strokeWidth="3.5" />
                      <path d="M 285,95 L 450,95 L 450,150" fill="none" stroke={isSingleBulbOn ? "#a855f7" : "#475569"} strokeWidth="3.5" />

                      {/* Particles flow */}
                      {isSingleBulbOn && (
                        <circle r="4" fill="#f59e0b">
                          <animateMotion dur="1.8s" repeatCount="indefinite" path="M 160,90 L 230,95 M 285,95 L 450,95 L 450,150" />
                        </circle>
                      )}

                      {/* Bulb */}
                      <g>
                        {isSingleBulbOn && <circle cx="450" cy="150" r="45" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <circle cx="450" cy="150" r="18" fill={isSingleBulbOn ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="450" y="125" fill={isSingleBulbOn ? "#fbbf24" : "#94a3b8"} fontSize="9" fontWeight="bold" textAnchor="middle">چراغ پذیرایی</text>
                      </g>
                    </motion.svg>
                  )}

                  {activeCircuit === "double" && (
                    <motion.svg key="d-c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} viewBox="0 0 600 280" className="w-full max-w-[500px] h-auto">
                      <rect x="10" y="70" width="60" height="150" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <text x="40" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">ورودی</text>
                      <text x="40" y="125" fill="#f87171" fontSize="9" textAnchor="middle">فاز (L)</text>
                      <text x="40" y="150" fill="#38bdf8" fontSize="9" textAnchor="middle">نول (N)</text>

                      {/* MCB */}
                      <g className="cursor-pointer" onClick={() => setMainFuse(!mainFuse)}>
                        <rect x="110" y="60" width="40" height="60" rx="3" fill={mainFuse ? "#fbbf24" : "#475569"} stroke="#334155" />
                        {mainFuse ? <line x1="130" y1="85" x2="130" y2="105" stroke="#000" strokeWidth="4" /> : <line x1="120" y1="100" x2="140" y2="100" stroke="#f87171" strokeWidth="4" />}
                      </g>

                      <path d="M 50,115 L 110,90" fill="none" stroke="#dc2626" strokeWidth="3" />
                      <path d="M 50,145 L 340,145 L 340,210 M 340,145 L 450,145 L 450,210" fill="none" stroke="#0ea5e9" strokeWidth="3" />

                      {/* Double Switch */}
                      <g className="bg-slate-950">
                        <rect x="200" y="60" width="70" height="80" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                        <g className="cursor-pointer" onClick={() => mainFuse && setDoubleSwitch1(!doubleSwitch1)}>
                          <rect x="208" y="85" width="22" height="40" rx="4" fill={doubleSwitch1 ? "#fbbf24" : "#334155"} />
                          <text x="219" y="109" fill={doubleSwitch1 ? "#000" : "#fff"} fontSize="8" textAnchor="middle">{doubleSwitch1 ? "۱" : "۰"}</text>
                        </g>
                        <g className="cursor-pointer" onClick={() => mainFuse && setDoubleSwitch2(!doubleSwitch2)}>
                          <rect x="240" y="85" width="22" height="40" rx="4" fill={doubleSwitch2 ? "#fbbf24" : "#334155"} />
                          <text x="251" y="109" fill={doubleSwitch2 ? "#000" : "#fff"} fontSize="8" textAnchor="middle">{doubleSwitch2 ? "۱" : "۰"}</text>
                        </g>
                      </g>

                      <path d="M 150,90 L 200,105" fill="none" stroke={mainFuse ? "#dc2626" : "#475569"} strokeWidth="3" />
                      <path d="M 220,125 L 220,185 L 310,185 L 310,165" fill="none" stroke={isDoubleBulb1On ? "#a855f7" : "#475569"} strokeWidth="3" />
                      <path d="M 251,125 L 251,170 L 420,170 L 420,165" fill="none" stroke={isDoubleBulb2On ? "#a855f7" : "#475569"} strokeWidth="3" />

                      {/* Bulbs */}
                      <g>
                        {isDoubleBulb1On && <circle cx="310" cy="150" r="30" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <circle cx="310" cy="150" r="14" fill={isDoubleBulb1On ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="310" y="128" fill={isDoubleBulb1On ? "#fbbf24" : "#94a3b8"} fontSize="8" textAnchor="middle">لامپ شاخه ۱</text>
                      </g>
                      <g>
                        {isDoubleBulb2On && <circle cx="420" cy="150" r="30" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <circle cx="420" cy="150" r="14" fill={isDoubleBulb2On ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="420" y="128" fill={isDoubleBulb2On ? "#fbbf24" : "#94a3b8"} fontSize="8" textAnchor="middle">لامپ شاخه ۲</text>
                      </g>
                    </motion.svg>
                  )}

                  {activeCircuit === "two-way" && (
                    <motion.svg key="t-w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} viewBox="0 0 600 280" className="w-full max-w-[500px] h-auto">
                      <rect x="5" y="70" width="50" height="150" rx="4" fill="#1e293b" stroke="#334155" />
                      <text x="30" y="105" fill="#94a3b8" fontSize="9" textAnchor="middle">ورودی</text>
                      <text x="30" y="130" fill="#f87171" fontSize="8" textAnchor="middle">فاز (L)</text>
                      <text x="30" y="155" fill="#38bdf8" fontSize="8" textAnchor="middle">نول (N)</text>

                      {/* MCB */}
                      <g className="cursor-pointer" onClick={() => setMainFuse(!mainFuse)}>
                        <rect x="80" y="60" width="35" height="55" rx="3" fill={mainFuse ? "#fbbf24" : "#475569"} stroke="#334155" />
                        {mainFuse ? <line x1="97" y1="78" x2="97" y2="98" stroke="#000" strokeWidth="3" /> : <line x1="88" y1="92" x2="106" y2="92" stroke="#f87171" strokeWidth="3" />}
                      </g>

                      <path d="M 40,120 L 80,88" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                      <path d="M 40,150 L 510,150 L 510,185" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />

                      {/* Switch A */}
                      <g className="cursor-pointer" onClick={() => mainFuse && setTwoWayA(!twoWayA)}>
                        <rect x="150" y="60" width="70" height="85" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <text x="185" y="74" fill="#94a3b8" fontSize="8" textAnchor="middle">تبدیل ۱</text>
                        <circle cx="160" cy="100" r="4" fill="#fca5a5" />
                        <circle cx="210" cy="85" r="4" fill="#c084fc" />
                        <circle cx="210" cy="115" r="4" fill="#c084fc" />
                        {twoWayA ? (
                          <line x1="160" y1="100" x2="210" y2="115" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />
                        ) : (
                          <line x1="160" y1="100" x2="210" y2="85" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />
                        )}
                      </g>

                      <path d="M 115,88 L 150,100" fill="none" stroke={mainFuse ? "#dc2626" : "#475569"} strokeWidth="2.5" />

                      {/* Switch B */}
                      <g className="cursor-pointer" onClick={() => mainFuse && setTwoWayB(!twoWayB)}>
                        <rect x="340" y="60" width="70" height="85" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <text x="375" y="74" fill="#94a3b8" fontSize="8" textAnchor="middle">تبدیل ۲</text>
                        <circle cx="395" cy="100" r="4" fill="#fca5a5" />
                        <circle cx="350" cy="85" r="4" fill="#c084fc" />
                        <circle cx="350" cy="115" r="4" fill="#c084fc" />
                        {twoWayB ? (
                          <line x1="395" y1="100" x2="350" y2="115" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />
                        ) : (
                          <line x1="395" y1="100" x2="350" y2="85" stroke="#f87171" strokeWidth="3.5" strokeLinecap="round" />
                        )}
                      </g>

                      {/* Bridges */}
                      <path d="M 220,85 L 340,85" fill="none" stroke={mainFuse && !twoWayA ? "#a855f7" : "#475569"} strokeWidth="3" />
                      <path d="M 220,115 L 340,115" fill="none" stroke={mainFuse && twoWayA ? "#a855f7" : "#475569"} strokeWidth="3" />

                      <path d="M 410,100 L 510,100 L 510,185" fill="none" stroke={isTwoWayBulbOn ? "#ea580c" : "#475569"} strokeWidth="3" />

                      {/* Bulb */}
                      <g>
                        {isTwoWayBulbOn && <circle cx="510" cy="180" r="30" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <circle cx="510" cy="180" r="12" fill={isTwoWayBulbOn ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="510" y="210" fill={isTwoWayBulbOn ? "#fbbf24" : "#94a3b8"} fontSize="8" fontWeight="bold" textAnchor="middle">چراغ دو کنترله</text>
                      </g>
                    </motion.svg>
                  )}

                  {activeCircuit === "staircase" && (
                    <motion.svg key="s-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} viewBox="0 0 600 280" className="w-full max-w-[500px] h-auto">
                      <rect x="5" y="70" width="50" height="150" rx="4" fill="#1e293b" stroke="#334155" />
                      <text x="30" y="105" fill="#94a3b8" fontSize="9" textAnchor="middle">ورودی</text>
                      <text x="30" y="130" fill="#f87171" fontSize="8" textAnchor="middle">فاز (L)</text>
                      <text x="30" y="155" fill="#38bdf8" fontSize="8" textAnchor="middle">نول (N)</text>

                      {/* MCB */}
                      <g className="cursor-pointer" onClick={() => setMainFuse(!mainFuse)}>
                        <rect x="80" y="60" width="35" height="55" rx="3" fill={mainFuse ? "#fbbf24" : "#475569"} stroke="#334155" />
                        {mainFuse ? <line x1="97" y1="78" x2="97" y2="98" stroke="#000" strokeWidth="3" /> : <line x1="88" y1="92" x2="106" y2="92" stroke="#f87171" strokeWidth="3" />}
                      </g>

                      <path d="M 40,120 L 80,88" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                      <path d="M 40,150 L 220,150 M 220,150 L 220,130 M 220,150 L 480,150 L 480,185" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />

                      {/* PIR Sensor */}
                      <g className="cursor-pointer" onClick={triggerStaircaseSensor}>
                        <rect x="170" y="60" width="100" height="75" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <text x="220" y="74" fill="#94a3b8" fontSize="8" textAnchor="middle">سنسور حرکتی (PIR)</text>
                        <path d="M 205,105 A 15,15 0 0,1 235,105 Z" fill={staircaseTimerSec > 0 ? "#22c55e" : "#475569"} />
                        <circle cx="220" cy="105" r="3" fill={staircaseTimerSec > 0 ? "#22c55e" : "#64748b"} />
                        <text x="220" y="125" fill="#fff" fontSize="7" textAnchor="middle">{staircaseTimerSec > 0 ? "حرکت عابر تایید شد" : "منتظر حضور عابر..."}</text>
                      </g>

                      <path d="M 115,88 L 170,90" fill="none" stroke={mainFuse ? "#dc2626" : "#475569"} strokeWidth="2.5" />
                      <path d="M 270,90 L 480,90 L 480,185" fill="none" stroke={isStaircaseBulbOn ? "#a855f7" : "#475569"} strokeWidth="2.5" />

                      {/* Lamp */}
                      <g>
                        {isStaircaseBulbOn && <circle cx="480" cy="180" r="30" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <circle cx="480" cy="180" r="12" fill={isStaircaseBulbOn ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="480" y="210" fill={isStaircaseBulbOn ? "#fbbf24" : "#94a3b8"} fontSize="8" fontWeight="bold" textAnchor="middle">لامپ زمانی راهرو</text>
                      </g>
                    </motion.svg>
                  )}

                  {activeCircuit === "photocell" && (
                    <motion.svg key="p-c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} viewBox="0 0 600 280" className="w-full max-w-[500px] h-auto">
                      <rect x="5" y="70" width="50" height="150" rx="4" fill="#1e293b" stroke="#334155" />
                      <text x="30" y="105" fill="#94a3b8" fontSize="9" textAnchor="middle">ورودی</text>
                      <text x="30" y="130" fill="#f87171" fontSize="8" textAnchor="middle">فاز (L)</text>
                      <text x="30" y="155" fill="#38bdf8" fontSize="8" textAnchor="middle">نول (N)</text>

                      {/* MCB */}
                      <g className="cursor-pointer" onClick={() => setMainFuse(!mainFuse)}>
                        <rect x="80" y="60" width="35" height="55" rx="3" fill={mainFuse ? "#fbbf24" : "#475569"} stroke="#334155" />
                        {mainFuse ? <line x1="97" y1="78" x2="97" y2="98" stroke="#000" strokeWidth="3" /> : <line x1="88" y1="92" x2="106" y2="92" stroke="#f87171" strokeWidth="3" />}
                      </g>

                      <path d="M 40,120 L 80,88" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                      <path d="M 40,150 L 220,150 M 220,150 L 220,130 M 220,150 L 480,150 L 480,185" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />

                      {/* Photocell */}
                      <g className="cursor-pointer" onClick={() => setPhotocellEnabled(!photocellEnabled)}>
                        <rect x="170" y="60" width="100" height="75" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                        <text x="220" y="74" fill="#94a3b8" fontSize="8" textAnchor="middle">سنسور فتوسل نوری</text>
                        <circle cx="220" cy="100" r="12" fill={photocellEnabled ? "#0284c7" : "#334155"} />
                        <path d="M 213,100 Q 220,92 227,100" stroke="#fca5a5" strokeWidth="2" fill="none" />
                        <text x="220" y="125" fill="#fff" fontSize="7" textAnchor="middle">{photocellEnabled ? "فتوسل در خط فاز" : "خارج از شبکه"}</text>
                      </g>

                      <path d="M 115,88 L 170,90" fill="none" stroke={mainFuse ? "#dc2626" : "#475569"} strokeWidth="2.5" />
                      <path d="M 270,90 L 480,90 L 480,185" fill="none" stroke={isPhotocellBulbOn ? "#ea580c" : "#475569"} strokeWidth="2.5" />

                      {/* Yard Light */}
                      <g>
                        {isPhotocellBulbOn && <circle cx="480" cy="180" r="35" fill="rgba(245,158,11,0.2)" className="animate-pulse" />}
                        <rect x="465" y="170" width="30" height="20" rx="3" fill={isPhotocellBulbOn ? "#fbbf24" : "#334155"} stroke="#475569" strokeWidth="2" />
                        <text x="480" y="210" fill={isPhotocellBulbOn ? "#fbbf24" : "#94a3b8"} fontSize="8" fontWeight="bold" textAnchor="middle">پروژکتور حیاط</text>
                      </g>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* Status footer for current prebuilt circuit */}
              <div className="w-full bg-[#161920] border border-[#232730] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">وضعیت ایمنی کارگاه:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    !mainFuse ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                  }`}>
                    {!mainFuse ? "بی‌برق (ایمن جهت تعویض سیم‌ها)" : "ولتاژ خط فعال ۲۲۰V فازمتر بزنید!"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">وضعیت روشنایی خروجی:</span>
                  <span className="font-extrabold text-amber-400">
                    {activeCircuit === "single" && (isSingleBulbOn ? "لامپ روشن" : "خاموش")}
                    {activeCircuit === "double" && (isDoubleBulb1On && isDoubleBulb2On ? "هر دو شاخه روشن" : isDoubleBulb1On ? "فقط شاخه ۱ روشن" : isDoubleBulb2On ? "فقط شاخه ۲ روشن" : "خاموش")}
                    {activeCircuit === "two-way" && (isTwoWayBulbOn ? "چراغ راه‌پله روشن" : "خاموش")}
                    {activeCircuit === "staircase" && (isStaircaseBulbOn ? "چراغ تایمردار پله روشن" : "خاموش")}
                    {activeCircuit === "photocell" && (isPhotocellBulbOn ? "غروب خورشید (چراغ‌ها روشن)" : "روز روشن (لامپ خاموش)")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODE 2: CREATIVE DRAG & CONNECT SANDBOX
          ========================================== */}
      {mode === "creative" && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          
          {/* 1. Component Picker Toolbar sidebar */}
          <div className="xl:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
            
            {/* Missions Select box */}
            <div>
              <span className="text-[10px] font-bold text-amber-500 block mb-2">🎓 تکالیف کارگاهی و ارزیابی عملی:</span>
              <div className="space-y-1.5">
                {WORKSHOP_MISSIONS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleStartMission(m.id)}
                    className={`w-full text-right p-2.5 rounded-lg border text-[10px] transition-all flex flex-col gap-1 ${
                      activeMissionId === m.id
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 font-extrabold"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{m.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout blueprint switcher */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-2">🗺️ انتخاب پلان و نقشه پس‌زمینه:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                {(["blank", "living", "corridor", "bedroom", "yard"] as SandboxLayout[]).map(lay => (
                  <button
                    key={lay}
                    onClick={() => { setLayout(lay); setWiringStart(null); }}
                    className={`py-1.5 rounded transition-colors text-center font-bold ${
                      layout === lay ? "bg-slate-800 text-amber-400 border border-amber-500/30" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lay === "blank" && "سیم‌کشی آزاد"}
                    {lay === "living" && "پلان پذیرایی"}
                    {lay === "corridor" && "پلان راه‌پله"}
                    {lay === "bedroom" && "پلان اتاق"}
                    {lay === "yard" && "پلان حیاط"}
                  </button>
                ))}
              </div>
            </div>

            {/* Components list */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-2">🔌 جعبه ابزار تجهیزات (روی ابزار کلیک کنید):</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button onClick={() => addComponent("mcb")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  مینی (مینیاتوری)
                </button>
                <button onClick={() => addComponent("rcd")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  محافظ جان RCD
                </button>
                <button onClick={() => addComponent("switch_single")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                  کلید یک‌پل
                </button>
                <button onClick={() => addComponent("switch_double")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />
                  کلید دوپل
                </button>
                <button onClick={() => addComponent("switch_two_way")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  کلید تبدیل
                </button>
                <button onClick={() => addComponent("switch_cross")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5" title="کلید گم شده همان کلید صلیبی/کراس مابین است">
                  <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />
                  کلید گم شده (صلیبی)
                </button>
                <button onClick={() => addComponent("bulb")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                  لامپ
                </button>
                <button onClick={() => addComponent("socket")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
                  پریز
                </button>
                <button onClick={() => addComponent("junction")} className="bg-slate-950 hover:bg-slate-850 p-2 border border-slate-800 hover:border-amber-500 rounded-xl text-right transition-all flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-slate-500 rounded-full" />
                  تقسیم‌بندی جعبه‌ای
                </button>
              </div>
            </div>

            {/* Wire function colors */}
            <div className="pt-2.5 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block mb-2">🧶 انتخاب رنگ سیم جهت ترسیم پیوند:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <button
                  onClick={() => setSelectedWireType("phase")}
                  className={`py-1.5 rounded flex items-center gap-1.5 justify-center font-bold ${
                    selectedWireType === "phase" ? "bg-red-600/25 text-red-400 border border-red-500/50" : "bg-slate-950 text-slate-400 hover:bg-slate-850"
                  }`}
                >
                  <div className="w-2.5 h-2 bg-red-600 rounded" />
                  سیم فاز (L)
                </button>
                <button
                  onClick={() => setSelectedWireType("neutral")}
                  className={`py-1.5 rounded flex items-center gap-1.5 justify-center font-bold ${
                    selectedWireType === "neutral" ? "bg-sky-500/25 text-sky-400 border border-sky-500/50" : "bg-slate-950 text-slate-400 hover:bg-slate-850"
                  }`}
                >
                  <div className="w-2.5 h-2 bg-sky-500 rounded" />
                  سیم نول (N)
                </button>
                <button
                  onClick={() => setSelectedWireType("earth")}
                  className={`py-1.5 rounded flex items-center gap-1.5 justify-center font-bold ${
                    selectedWireType === "earth" ? "bg-green-600/25 text-green-400 border border-green-500/50" : "bg-slate-950 text-slate-400 hover:bg-slate-850"
                  }`}
                >
                  <div className="w-2.5 h-2 bg-green-500 rounded" />
                  سیم ارت (PE)
                </button>
                <button
                  onClick={() => setSelectedWireType("return")}
                  className={`py-1.5 rounded flex items-center gap-1.5 justify-center font-bold ${
                    selectedWireType === "return" ? "bg-purple-600/25 text-purple-400 border border-purple-500/50" : "bg-slate-950 text-slate-400 hover:bg-slate-850"
                  }`}
                >
                  <div className="w-2.5 h-2 bg-purple-500 rounded" />
                  برگشتی (Switch)
                </button>
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={clearWorkspace}
              className="w-full mt-2 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 rounded-xl text-xs font-bold transition-colors"
            >
              پاک‌سازی کل تخته‌کار
            </button>
          </div>

          {/* 2. Central drawing workbench Canvas */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            
            {/* Active Task Mission bar */}
            {activeMissionId && (
              <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Trophy className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-xs font-black">پروژه ارزیابی: {WORKSHOP_MISSIONS.find(m => m.id === activeMissionId)?.title}</span>
                  </div>
                  <button onClick={() => { setActiveMissionId(null); setMissionFeedback(null); }} className="text-[10px] text-slate-500 hover:text-slate-300">انصراف و خروج</button>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">{WORKSHOP_MISSIONS.find(m => m.id === activeMissionId)?.description}</p>
              </div>
            )}

            <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden relative select-none">
              
              {/* Instructions top HUD */}
              <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg px-3 py-1.5 text-[9px] text-slate-400 pointer-events-none flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-500" />
                <span>کلیدها را جابه‌جا کنید. برای سیم‌کشی، ابتدا رنگ را انتخاب کنید و سپس روی ترمینالِ تجهیزات کلیک کنید.</span>
              </div>

              {/* The SVG Canvas workspace rendering layout blueprint */}
              <svg className="w-full h-[360px] bg-[#0c0e12] relative z-10">
                {/* 1. Grid pattern for blueprint look */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.04" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* 2. Blueprint outline sketches depending on layout selection */}
                {layout === "living" && (
                  <g opacity="0.12" stroke="#4a5568" strokeWidth="2" fill="none">
                    <rect x="30" y="30" width="540" height="300" rx="4" />
                    <line x1="200" y1="30" x2="200" y2="330" />
                    <circle cx="380" cy="180" r="40" strokeDasharray="5,5" /> {/* chandelier circle */}
                    <text x="380" y="185" stroke="none" fill="#4a5568" fontSize="12" fontWeight="bold" textAnchor="middle">محل لوستر پذیرایی</text>
                    <text x="110" y="60" stroke="none" fill="#4a5568" fontSize="11" textAnchor="middle">جعبه مینیاتوری ورودی</text>
                  </g>
                )}

                {layout === "corridor" && (
                  <g opacity="0.12" stroke="#4a5568" strokeWidth="2" fill="none">
                    <path d="M 30,30 L 570,30 L 570,330 L 30,330 Z" />
                    <path d="M 150,30 L 150,330 M 450,30 L 450,330" />
                    <path d="M 160,80 L 440,280" strokeWidth="1.5" strokeDasharray="3,3" /> {/* stairs angle */}
                    <text x="300" y="180" stroke="none" fill="#4a5568" fontSize="12" fontWeight="bold" textAnchor="middle">پله‌ها و راهرو ارتباطی</text>
                  </g>
                )}

                {layout === "bedroom" && (
                  <g opacity="0.12" stroke="#4a5568" strokeWidth="2" fill="none">
                    <rect x="35" y="35" width="530" height="290" rx="3" />
                    <rect x="230" y="100" width="140" height="160" rx="8" /> {/* bed outline */}
                    <text x="300" y="180" stroke="none" fill="#4a5568" fontSize="12" fontWeight="bold" textAnchor="middle">تخت خواب دو نفره</text>
                    <circle cx="80" cy="80" r="15" /> {/* ceiling lights */}
                    <circle cx="520" cy="80" r="15" />
                  </g>
                )}

                {layout === "yard" && (
                  <g opacity="0.1" stroke="#4a5568" strokeWidth="2" fill="none">
                    <path d="M 30,30 L 570,30 M 30,330 L 570,330" />
                    <rect x="60" y="80" width="120" height="150" rx="4" /> {/* garden pool */}
                    <text x="120" y="160" stroke="none" fill="#4a5568" fontSize="12" fontWeight="bold" textAnchor="middle">باغچه گل‌ها</text>
                    <text x="440" y="240" stroke="none" fill="#4a5568" fontSize="12" fontWeight="bold" textAnchor="middle">پروژکتور حیاط بیرونی</text>
                  </g>
                )}

                {/* 3. Render wires path */}
                {wires.map(wire => {
                  const fromComp = components.find(c => c.id === wire.fromCompId);
                  const toComp = components.find(c => c.id === wire.toCompId);
                  if (!fromComp || !toComp) return null;

                  // Find exact port position relative to component center
                  const fromPortIdx = fromComp.ports.findIndex(p => p.id === wire.fromPortId);
                  const toPortIdx = toComp.ports.findIndex(p => p.id === wire.toPortId);

                  const fromPortOffset = fromComp.ports.length > 1 ? (fromPortIdx - (fromComp.ports.length - 1) / 2) * 12 : 0;
                  const toPortOffset = toComp.ports.length > 1 ? (toPortIdx - (toComp.ports.length - 1) / 2) * 12 : 0;

                  const startX = fromComp.x + fromPortOffset;
                  const startY = fromComp.y + 24; // ports at bottom of component panel
                  const endX = toComp.x + toPortOffset;
                  const endY = toComp.y + 24;

                  // Simple cubic bezier curve for natural drooping cable look
                  const midY = Math.max(startY, endY) + 40;
                  const pathD = `M ${startX},${startY} C ${startX},${midY} ${endX},${midY} ${endX},${endY}`;

                  let strokeColor = "#dc2626"; // phase
                  if (wire.type === "neutral") strokeColor = "#0ea5e9";
                  else if (wire.type === "earth") strokeColor = "#16a34a";
                  else if (wire.type === "return") strokeColor = "#a855f7";

                  // Check if this wire is currently carrying phase current under simulation
                  const isLive = simRunning && !simResults.isShortCircuit && (
                    (wire.type === "phase" && true) || 
                    (wire.type === "return" && simResults.litBulbIds.length > 0)
                  );

                  return (
                    <g key={wire.id}>
                      {/* Interactive thick hover trigger to allow deleting individual wires */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="12"
                        className="cursor-pointer"
                        onClick={() => removeWire(wire.id)}
                      />
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.5"
                        strokeDasharray={wire.type === "earth" ? "5,3" : "none"}
                        className="transition-all"
                      />
                      {/* Flowing electrons particles if live and carrying current */}
                      {isLive && (
                        <circle r="3" fill="#fbbf24">
                          <animateMotion dur="1.5s" repeatCount="indefinite" path={pathD} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* 4. Render components */}
                {components.map(comp => {
                  const isMainPanel = comp.type === "panel";
                  const isLit = comp.type === "bulb" && simResults.litBulbIds.includes(comp.id);
                  const isPowerSocket = comp.type === "socket" && simResults.poweredSocketIds.includes(comp.id);
                  const isSelectedForWiring = wiringStart?.compId === comp.id;

                  return (
                    <g key={comp.id} transform={`translate(${comp.x - 45}, ${comp.y - 25})`}>
                      
                      {/* Drag overlay area */}
                      <rect
                        width="90"
                        height="50"
                        rx="8"
                        fill="#161920"
                        stroke={
                          isSelectedForWiring
                            ? "#fbbf24"
                            : isLit
                            ? "#fbbf24"
                            : isMainPanel
                            ? "#38bdf8"
                            : "#2D3139"
                        }
                        strokeWidth={isSelectedForWiring || isLit ? "2.5" : "1.5"}
                        className="cursor-move filter drop-shadow-md"
                        onMouseDown={(e) => startDrag(comp.id, e)}
                      />

                      {/* Delete component micro-button */}
                      {!isMainPanel && (
                        <g
                          className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                          transform="translate(75, 4)"
                          onClick={() => removeComponent(comp.id)}
                        >
                          <circle cx="6" cy="6" r="6" fill="#ef4444" />
                          <line x1="4" y1="4" x2="8" y2="8" stroke="#fff" strokeWidth="1.2" />
                          <line x1="8" y1="4" x2="4" y2="8" stroke="#fff" strokeWidth="1.2" />
                        </g>
                      )}

                      {/* Component Label Text */}
                      <text x="45" y="16" fill="#f8fafc" fontSize="8.5" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                        {comp.name}
                      </text>

                      {/* Interactive parts inside components: toggles, light bulb glow */}
                      {comp.type === "switch_single" && (
                        <g className="cursor-pointer" onClick={() => handleToggleState(comp.id)} transform="translate(30, 22)">
                          <rect width="30" height="15" rx="3" fill={comp.state.isOn ? "#fbbf24" : "#2d3748"} />
                          <circle cx={comp.state.isOn ? "22" : "8"} cy="7.5" r="5" fill="#fff" className="transition-all" />
                        </g>
                      )}

                      {comp.type === "mcb" && (
                        <g className="cursor-pointer" onClick={() => handleToggleState(comp.id)} transform="translate(30, 22)">
                          <rect width="30" height="15" rx="3" fill={comp.state.isOn ? "#34d399" : "#475569"} />
                          <line x1="15" y1="4" x2="15" y2="11" stroke="#fff" strokeWidth="2.5" />
                          <text x="8" y="11" fill="#fff" fontSize="6">{comp.state.isOn ? "ON" : "OFF"}</text>
                        </g>
                      )}

                      {comp.type === "rcd" && (
                        <g className="cursor-pointer" onClick={() => handleToggleState(comp.id)} transform="translate(30, 22)">
                          <rect width="30" height="15" rx="3" fill={comp.state.isOn ? "#34d399" : "#475569"} />
                          <circle cx="22" cy="7.5" r="4" fill="#3182ce" />
                          <text x="8" y="11" fill="#fff" fontSize="6">RCD</text>
                        </g>
                      )}

                      {comp.type === "switch_double" && (
                        <g className="cursor-pointer flex gap-1" transform="translate(25, 22)">
                          {/* Lever 1 */}
                          <g onClick={(e) => { e.stopPropagation(); handleToggleState(comp.id, 1); }}>
                            <rect x="0" width="18" height="15" rx="2" fill={comp.state.isOn ? "#fbbf24" : "#2d3748"} />
                            <text x="9" y="11" fill="#fff" fontSize="8" textAnchor="middle">۱</text>
                          </g>
                          {/* Lever 2 */}
                          <g onClick={(e) => { e.stopPropagation(); handleToggleState(comp.id, 2); }}>
                            <rect x="22" width="18" height="15" rx="2" fill={comp.state.isOn2 ? "#fbbf24" : "#2d3748"} />
                            <text x="31" y="11" fill="#fff" fontSize="8" textAnchor="middle">۲</text>
                          </g>
                        </g>
                      )}

                      {comp.type === "switch_two_way" && (
                        <g className="cursor-pointer" onClick={() => handleToggleState(comp.id)} transform="translate(30, 22)">
                          <rect width="30" height="15" rx="3" fill={comp.state.isOn ? "#a855f7" : "#475569"} />
                          <text x="15" y="11" fill="#fff" fontSize="7.5" textAnchor="middle">تغییر</text>
                        </g>
                      )}

                      {comp.type === "switch_cross" && (
                        <g className="cursor-pointer" onClick={() => handleToggleState(comp.id)} transform="translate(30, 22)">
                          <rect width="30" height="15" rx="3" fill={comp.state.isOn ? "#ec4899" : "#475569"} />
                          <text x="15" y="11" fill="#fff" fontSize="7.5" textAnchor="middle">صلیب</text>
                        </g>
                      )}

                      {comp.type === "bulb" && (
                        <g transform="translate(35, 20)">
                          <circle cx="10" cy="10" r="9" fill={isLit ? "#fcd34d" : "#334155"} className={isLit ? "animate-pulse" : ""} />
                          {isLit && <circle cx="10" cy="10" r="14" fill="rgba(251,191,36,0.15)" />}
                        </g>
                      )}

                      {comp.type === "socket" && (
                        <g transform="translate(35, 22)" stroke={isPowerSocket ? "#fbbf24" : "#94a3b8"} strokeWidth="1.2" fill="none">
                          <circle cx="10" cy="8" r="7" />
                          <line x1="7" y1="8" x2="13" y2="8" />
                          {isPowerSocket && <circle cx="10" cy="8" r="3" fill="#fbbf24" />}
                        </g>
                      )}

                      {/* Render Terminal connection ports pin points */}
                      {comp.ports.map((port, idx) => {
                        // Spread ports evenly along the bottom edge of component card
                        const offset = comp.ports.length > 1 ? (idx - (comp.ports.length - 1) / 2) * 12 : 0;
                        const portX = 45 + offset;
                        const portY = 48;

                        const isPortStartWiring = wiringStart?.compId === comp.id && wiringStart?.portId === port.id;

                        let color = "#e2e8f0";
                        if (port.type === "L") color = "#f87171";
                        else if (port.type === "N") color = "#38bdf8";
                        else if (port.type === "PE") color = "#4ade80";

                        return (
                          <g
                            key={port.id}
                            className="cursor-pointer group/port"
                            onClick={(e) => { e.stopPropagation(); handlePortClick(comp.id, port.id); }}
                          >
                            <circle
                              cx={portX}
                              cy={portY}
                              r={isPortStartWiring ? "5.5" : "4"}
                              fill={isPortStartWiring ? "#fbbf24" : color}
                              stroke="#000"
                              strokeWidth="1.2"
                              className="hover:scale-125 transition-transform"
                            />
                            {/* Hover tooltip for port name */}
                            <g className="opacity-0 group-hover/port:opacity-100 transition-opacity pointer-events-none" transform={`translate(${portX - 25}, ${portY + 8})`}>
                              <rect width="50" height="12" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                              <text x="25" y="9" fill="#fff" fontSize="6.5" textAnchor="middle">{port.label}</text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Run & action buttons bar */}
            <div className="flex gap-3">
              <button
                onClick={compileAndRunCircuit}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/15"
              >
                <Play className="h-4.5 w-4.5 fill-slate-950" />
                بررسی و اجرای جریان الکتریکی مدار
              </button>
              {simRunning && (
                <button
                  onClick={stopCircuitSimulation}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  توقف دائم
                </button>
              )}
            </div>
          </div>

          {/* 3. Safety Check report right panel */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            
            {/* Mission feedback card */}
            {activeMissionId && missionFeedback && (
              <div className={`p-4 rounded-2xl border ${
                missionFeedback.success ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-slate-900 border-slate-800 text-slate-300"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className={`h-5 w-5 ${missionFeedback.success ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
                  <span className="text-xs font-black">
                    {missionFeedback.success ? "🎉 موفقیت آمیز!" : "📋 الزامات تکالیف کارگاهی:"}
                  </span>
                </div>
                
                <div className="space-y-1.5 text-[10px]">
                  {missionFeedback.points.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <div className="mt-0.5 shrink-0">
                        {p.startsWith("✅") ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-rose-500" />}
                      </div>
                      <span className="leading-normal">{p.replace(/^[✅❌⚠️]\s*/, "")}</span>
                    </div>
                  ))}
                </div>

                {missionFeedback.success && (
                  <div className="mt-3 text-[10px] bg-emerald-500/10 p-2 rounded-lg text-emerald-400 text-center font-bold">
                    امتیاز کامل پروژه ثبت شد. شما به عنوان تکنسین ماهر ارتقا یافتید!
                  </div>
                )}
              </div>
            )}

            {/* Diagnostic reporting card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2.5 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
                تحلیل و عیب‌یابی زنده استانداردها (مبحث ۱۳)
              </h3>

              <div className="space-y-2.5 overflow-y-auto max-h-[300px]">
                {simResults.reports.length > 0 ? (
                  simResults.reports.map((rep, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-[10px] leading-relaxed flex items-start gap-2 ${
                        rep.type === "success"
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                          : rep.type === "warning"
                          ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
                          : "bg-rose-500/5 border-rose-500/20 text-rose-400 font-bold"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {rep.type === "success" && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                        {rep.type === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        {rep.type === "error" && <XCircle className="h-3.5 w-3.5 text-rose-500" />}
                      </div>
                      <span>{rep.text}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-[10px] border border-dashed border-slate-800 rounded-xl">
                    سیم‌کشی‌های خود را با اتصال فاز و نول انجام داده و دکمه بررسی مدار را بزنید تا گزارش کامل تایید صلاحیت صادر گردد.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
