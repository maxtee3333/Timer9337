import { CreateTimerInput } from "./types";

export const MAX_TIMERS = 7;

export const DEFAULT_SUGGESTIONS = [
  "完美半熟蛋 (7分钟)",
  "V60 手冲咖啡",
  "番茄工作法",
];

// Happy, Colorful, Girly, Macaron Gradients (Light Mode friendly)
// Note: We use borders and text colors inside components to ensure contrast
export const CARD_THEMES = [
  "bg-gradient-to-br from-pink-200 via-rose-100 to-red-100 ring-1 ring-pink-200",         // Strawberry Milk
  "bg-gradient-to-br from-purple-200 via-fuchsia-100 to-violet-100 ring-1 ring-purple-200", // Taro Milk Tea
  "bg-gradient-to-br from-cyan-200 via-sky-100 to-blue-100 ring-1 ring-cyan-200",        // Sea Salt
  "bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-100 ring-1 ring-orange-200",  // Mango Pudding
  "bg-gradient-to-br from-emerald-200 via-teal-100 to-green-100 ring-1 ring-emerald-200",  // Matcha
  "bg-gradient-to-br from-rose-200 via-orange-100 to-red-100 ring-1 ring-rose-200",       // Peach
  "bg-gradient-to-br from-indigo-200 via-blue-100 to-slate-100 ring-1 ring-indigo-200",    // Blueberry
];

export const PRESET_RECIPES: CreateTimerInput[] = [
  {
    name: "1. 椰香杏仁五白",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 7200, 
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" },
          { name: "茯苓", amount: 10, unit: "g" },
          { name: "莲子", amount: 8, unit: "g" }
        ] 
      }, 
      { 
        name: "第二阶段：加入【山药】", 
        durationSeconds: 1800,
        ingredients: [
          { name: "山药", amount: 8, unit: "g" }
        ]
      },    
      { 
        name: "第三阶段：加入【百合】+【杏仁】", 
        durationSeconds: 1500,
        ingredients: [
          { name: "百合", amount: 10, unit: "g" },
          { name: "南杏仁", amount: 6, unit: "g" }
        ]
      }, 
      { 
        name: "第四阶段", 
        durationSeconds: 300,
        ingredients: [
          { name: "黄冰糖", amount: 10, unit: "g" },
          { name: "椰子粉", amount: 15, unit: "g" }
        ]
      }
    ]
  },
  {
    name: "2. 五红",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 7200,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" },
          { name: "红豆", amount: 20, unit: "g" },
          { name: "红皮花生", amount: 20, unit: "g" }
        ]
      },
      { 
        name: "第二阶段：加入【红枣】", 
        durationSeconds: 3300,
        ingredients: [
           { name: "红枣", amount: 15, unit: "g" }
        ]
      },   
      { 
        name: "第三阶段", 
        durationSeconds: 300,
        ingredients: [
          { name: "红糖", amount: 0.5, unit: "颗" },
          { name: "枸杞", amount: 10, unit: "g" }
        ]
      } 
    ]
  },
  {
    name: "3. 五黑芝麻核桃",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 9900,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" },
          { name: "黑豆", amount: 20, unit: "g" },
          { name: "黑米", amount: 20, unit: "g" }
        ]
      },
      { 
        name: "第二阶段：加入【炒熟黑芝麻】+【核桃】+【冰糖】", 
        durationSeconds: 900,
        ingredients: [
          { name: "黑芝麻", amount: 20, unit: "g" },
          { name: "核桃", amount: 16, unit: "g" },
          { name: "黄冰糖", amount: 10, unit: "g" }
        ]
      },
      { 
        name: "第三阶段：冷却后才加入破壁", 
        durationSeconds: 300,
        ingredients: [
           { name: "桑葚 (冷却至60度)", amount: 10, unit: "g" },
           { name: "黑枸杞 (冷却至60度)", amount: 5, unit: "g" }
        ]
      }
    ]
  },
  {
    name: "4. 黑加仑桑葚",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 10800,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" }
        ]
      },
      { 
        name: "第二阶段：冷却后加入破壁", 
        durationSeconds: 300,
        ingredients: [
          { name: "黄冰糖", amount: 10, unit: "g" },
          { name: "黑加仑", amount: 15, unit: "g" },
          { name: "桑葚", amount: 10, unit: "g" },
          { name: "黑枸杞", amount: 6, unit: "g" },
          { name: "洛神花", amount: 6, unit: "g" },
          { name: "蔓越莓", amount: 10, unit: "g" },
          { name: "蓝莓", amount: 8, unit: "g" }
        ]
      }
    ]
  },
  {
    name: "5. 雪梨陈皮话梅",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 7200,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" }
        ]
      }, 
      { 
        name: "第二阶段：【雪梨】【银耳】【红枣】【百合】", 
        durationSeconds: 3000,
        ingredients: [
          { name: "雪梨", amount: 10, unit: "g" },
          { name: "银耳", amount: 3, unit: "g" },
          { name: "红枣", amount: 5, unit: "g" },
          { name: "百合", amount: 5, unit: "g" }
        ]
      }, 
      { 
        name: "第三阶段：【陈皮】【话梅】", 
        durationSeconds: 300,
        ingredients: [
          { name: "陈皮", amount: 10, unit: "g" },
          { name: "话梅", amount: 10, unit: "g" }
        ]
      }, 
      { 
        name: "第四阶段：加入【冰糖】【枸杞】", 
        durationSeconds: 300,
        ingredients: [
          { name: "黄冰糖", amount: 10, unit: "g" },
          { name: "枸杞", amount: 5, unit: "g" }
        ]
      },
      {
        name: "第五阶段：捞出【陈皮+雪梨！！】",
        durationSeconds: 300,
        ingredients: []
      }
    ]
  },
  {
    name: "6. 玫瑰桑葚桂圆",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 7200,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" }
        ]
      }, 
      { 
        name: "第二阶段：【桂圆+红枣】", 
        durationSeconds: 3300,
        ingredients: [
           { name: "桂圆", amount: 15, unit: "g" },
           { name: "红枣", amount: 10, unit: "g" }
        ]
      }, 
      { 
        name: "第三阶段：【枸杞】", 
        durationSeconds: 300,
        ingredients: [
           { name: "枸杞", amount: 10, unit: "g" }
        ]
      }, 
      { 
        name: "第四阶段：闷泡【玫瑰去芯，要花瓣而已！】", 
        durationSeconds: 300,
        ingredients: [
           { name: "玫瑰 (80度)", amount: 5, unit: "g" },
           { name: "桑葚 (80度)", amount: 15, unit: "g" }
        ]
      } 
    ]
  },
  {
    name: "7. 桂花雪梨银耳",
    phases: [
      { 
        name: "第一阶段：看情况,可提早下一步", 
        durationSeconds: 7200,
        ingredients: [
          { name: "烧水", amount: 800, unit: "ml" },
          { name: "花胶", amount: 30, unit: "g" }
        ]
      }, 
      { 
        name: "第二阶段：加入【雪梨+银耳+红枣】", 
        durationSeconds: 3300,
        ingredients: [
           { name: "雪梨", amount: 16, unit: "g" },
           { name: "银耳", amount: 5, unit: "g" },
           { name: "红枣", amount: 5, unit: "g" }
        ]
      }, 
      { 
        name: "第三阶段：【冰糖+枸杞+桂花】", 
        durationSeconds: 300,
        ingredients: [
           { name: "黄冰糖", amount: 10, unit: "g" },
           { name: "枸杞", amount: 5, unit: "g" },
           { name: "桂花", amount: 3, unit: "g" }
        ]
      },
      {
        name: "第五阶段：捞出【雪梨】",
        durationSeconds: 300,
        ingredients: []
      }
    ]
  }
];