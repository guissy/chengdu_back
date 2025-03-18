import { ResponseFactory } from '@/lib/api/response_stream';
import { MyProtoMessage } from '@/app/stream/protoUtils';

// 延迟函数，帮助代码更简洁😎
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 异步生成器：流式发送数据时带上有趣的文本和 emoji✨
 */
async function* generateData() {
  // 第一批数据 🚀
  yield { id: 1, name: "🌟 Item 1 - 开启奇妙旅程！" };
  yield { id: 2, name: "🚀 Item 2 - 起飞啦！" };
  await delay(1000);

  // 第二批数据 🎉
  yield { id: 3, name: "💫 Item 3 - 魔法时刻到！" };
  yield { id: 4, name: "🎉 Item 4 - 派对开始！" };
  yield { id: 5, name: "🔥 Item 5 - 热力全开！" };
  await delay(1000);

  // 第三批数据 🌈
  yield { id: 6, name: "🌈 Item 6 - 彩虹降临！" };
  yield { id: 7, name: "💎 Item 7 - 闪耀夺目！" };
  await delay(1000);

  // 第四批数据 🎊
  yield { id: 8, name: "🎈 Item 8 - 像气球般轻盈！" };
  yield { id: 9, name: "🎊 Item 9 - 终极惊喜！" };
  await delay(1000);

  // 流式数据结束 🏁
}

export async function GET() {
  return ResponseFactory.streamSuccess(generateData, MyProtoMessage);
}
