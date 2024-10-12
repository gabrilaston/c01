// pane参数
export const panePara =
  [
    {
      type: "local", //定义方式
      name: "location",
      label: "中心位置",
      picker: 'inline',
      expanded: true,
      x: { min: -100, max: 100 },
      y: { min: -100, max: 100, inverted: true },
      default: { x: 0, y: 0 },
    },
  ]


// pic 参数
export const algo_pic = [
  {
    value: "demo",
    label: "演示模型",
    para: "{ 'CF': 'demo' }"
  },
  {
    value: "license",
    label: "车牌辨识",
    para: "{ 'CF': 'license' }"
  },
  {
    value: "insulator",
    label: "绝缘子故障识别",
  },
];

// doc模型参数
export const algo_doc = [
  {
    value: "demo",
    label: "演示模型",
    para: "{ 'CF': 'demo' }"
  },
  {
    value: "license",
    label: "车牌辨识",
    para: "{ 'CF': 'license' }"
  },
  {
    value: "insulator",
    label: "绝缘子故障识别",
  },
];

// 文件格式
export const fileFormat = {
  kof: ["kof"]
}