"use client";

import type { AnimationEvent, CSSProperties, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { audioManager } from "@/lib/audioManager";

type NodeQuestion = {
  title: string;
  options: [string, string, string, string];
  prompt?: string;
  inputPlaceholder?: string;
};

function createQuestion(
  title: string,
  options: [string, string, string, string],
  prompt?: string,
  inputPlaceholder?: string
): NodeQuestion {
  return {
    title,
    options,
    ...(prompt ? { prompt } : {}),
    ...(inputPlaceholder ? { inputPlaceholder } : {}),
  };
}

const cards = [
  {
    id: "faraway",
    short: "远方",
    subtitle: "没去的地方",
    title: "没去的地方",
    desc: "你曾经差一点出发。",
    startCopy: "你曾经想去的地方，\n也许还在等一个没有发生的出发。",
    question: "如果那天你真的出发了，你最想抵达哪里？",
    hint: "可以是一个城市、一条路、一个房间，也可以只是一个没能靠近的人。",
    questions: [
      createQuestion("你想到“远方”时，最先出现的是什么？", [
        "A. 一个具体的城市",
        "B. 一条一直延伸的路",
        "C. 一个没有见到的人",
        "D. 一种完全不同的生活状态",
      ]),
      createQuestion("你没有抵达那个地方，最接近的原因是？", [
        "A. 当时没有条件",
        "B. 后来慢慢不敢去了",
        "C. 被现实里的事情拖住了",
        "D. 已经分不清自己还想不想去",
      ]),
      createQuestion("如果你真的到了那里，你最怕发现什么？", [
        "A. 它没有想象中重要",
        "B. 你已经不是当时的你",
        "C. 没有人在那里等你",
        "D. 你还是会想离开",
      ]),
      createQuestion("你更像哪一种人？", [
        "A. 一直想走，但总是留下",
        "B. 走出去以后，又开始想回头",
        "C. 不太说想去哪，但心里一直有方向",
        "D. 站在原地，看过很多次远方",
      ]),
      createQuestion("你对远方最深的感觉，更接近哪一个？", [
        "A. 向往",
        "B. 逃离",
        "C. 想确认自己还活着",
        "D. 想证明自己可以换一种生活",
      ]),
      createQuestion(
        "这张远方照片最终显影完成时，你希望它告诉你什么？",
        [
          "A. 原来我还可以出发",
          "B. 原来我已经走了很远",
          "C. 原来没抵达也不是失败",
          "D. 原来我一直在等自己允许自己走",
        ],
        "你也可以写下它真正想告诉你的那句话：",
        "写给那张远方照片的一句话……"
      ),
    ],
    frontImage: "/images/card-front.jpg",
    backImage: "/images/node-faraway.jpg",
    resultPaper: "/images/result-faraway-paper.png",
    stack: { left: "74%", top: "84%", rotate: "-8deg" },
    open: { x: "-92px", y: "-210px", rotate: "-8deg" },
  },
  {
    id: "oldname",
    short: "旧名",
    subtitle: "没成为的人",
    title: "没成为的人",
    desc: "有个名字曾经离你很近。",
    startCopy: "那个差一点成为的你，\n也许一直站在镜子另一边。",
    question: "你曾经差一点成为谁？",
    hint: "那个版本的你，可能学了另一件事，去了另一座城市，或者保留了另一种性格。",
    questions: [
      createQuestion("你想到“旧名”时，它更像什么？", [
        "A. 一个曾经想成为的人",
        "B. 一个被你放下的身份",
        "C. 一个没人再叫的名字",
        "D. 一个你不确定是否属于自己的自己",
      ]),
      createQuestion("如果旧名是一间房间，里面最可能有什么？", [
        "A. 一面镜子",
        "B. 一张空椅子",
        "C. 一件没穿上的衣服",
        "D. 一本很久没翻开的本子",
      ]),
      createQuestion("你没有成为那个自己，最接近哪一种情况？", [
        "A. 当时没有继续下去",
        "B. 后来觉得不现实",
        "C. 被别人期待的路带走了",
        "D. 不是不想，是没再有机会",
      ]),
      createQuestion("你现在回看那个旧名，会觉得？", [
        "A. 有点可惜",
        "B. 有点陌生",
        "C. 其实还挺亲近",
        "D. 不知道该怎么面对",
      ]),
      createQuestion("你对那个没成为的自己，最说不清的是？", [
        "A. 我是不是真的想成为它",
        "B. 我是不是真的放下了它",
        "C. 如果继续下去会怎样",
        "D. 它到底算不算我的一部分",
      ]),
      createQuestion(
        "如果旧名终于显影，你希望它把哪个自己还给你？",
        [
          "A. 那个还敢开始的自己",
          "B. 那个没有被打断的自己",
          "C. 那个不需要解释的自己",
          "D. 那个已经被我忘了很久的自己",
        ],
        "你也可以写下那个旧名真正代表的自己：",
        "写给那个旧名的一句话……"
      ),
    ],
    frontImage: "/images/card-front.jpg",
    backImage: "/images/node-oldname.jpg",
    resultPaper: "/images/result-oldname-paper.png",
    stack: { left: "77%", top: "83%", rotate: "5deg" },
    open: { x: "66px", y: "-178px", rotate: "7deg" },
  },
  {
    id: "unsent",
    short: "未寄出",
    subtitle: "没说出口的话",
    title: "没说出口的话",
    desc: "它停在唇边，也停在纸上。",
    startCopy: "有些话没有消失，\n只是停在了还没送出的路上。",
    question: "有一句话，如果现在还能送出去，你想写给谁？",
    hint: "不用完整，也不用正确，只写你最想留下的那一句。",
    questions: [
      createQuestion("那封“未寄出”的东西，更像是给谁的？", [
        "A. 曾经很重要的人",
        "B. 现在还在身边的人",
        "C. 过去的自己",
        "D. 一个已经不需要收到的人",
      ]),
      createQuestion("你没有寄出它，最接近的原因是？", [
        "A. 怕打扰对方",
        "B. 怕说出来也没用",
        "C. 怕关系变得更尴尬",
        "D. 一直在等一个更好的时机",
      ]),
      createQuestion("那句话如果真的说出口，最可能改变什么？", [
        "A. 一段关系",
        "B. 我对自己的看法",
        "C. 当时的结局",
        "D. 也许什么都不会改变",
      ]),
      createQuestion("这封未寄出的东西，现在更像是？", [
        "A. 一封信",
        "B. 一通没拨出去的电话",
        "C. 一个停在输入框里的句子",
        "D. 一张没有署名的照片",
      ]),
      createQuestion("你最常把什么留在心里？", [
        "A. 道歉",
        "B. 喜欢",
        "C. 解释",
        "D. 告别",
      ]),
      createQuestion(
        "如果那封未寄出的东西终于被看见，你希望它停在哪句话上？",
        [
          "A. 其实我一直都记得",
          "B. 那时候我没有说清楚",
          "C. 我只是想让你知道",
          "D. 不用回信，看到就好",
        ],
        "你也可以写下那句真正没有寄出的话：",
        "写下那句没有寄出的话……"
      ),
    ],
    frontImage: "/images/card-front.jpg",
    backImage: "/images/node-unsent.jpg",
    resultPaper: "/images/result-unsent-paper.png",
    stack: { left: "75%", top: "86%", rotate: "-2deg" },
    open: { x: "-118px", y: "-82px", rotate: "4deg" },
  },
  {
    id: "fork",
    short: "岔路",
    subtitle: "没选择的路",
    title: "没选择的路",
    desc: "另一个你仍站在分岔处。",
    startCopy: "没选择的路并没有关闭，\n它只是安静地分向另一束光。",
    question: "如果可以回到某个岔路口，你想重新选择哪一次？",
    hint: "可以是一件小事，也可以是一次很久以前的决定。",
    questions: [
      createQuestion("你想到“岔路”时，更像是哪一刻？", [
        "A. 必须做决定的那一刻",
        "B. 做完决定以后回头看的那一刻",
        "C. 明明还有机会，却没有转身的那一刻",
        "D. 根本不知道自己选了哪条路的那一刻",
      ]),
      createQuestion("如果可以回到那个岔路口，你会？", [
        "A. 选另一条路",
        "B. 还是选现在这条路",
        "C. 先停久一点再选",
        "D. 不再让别人替我选",
      ]),
      createQuestion("你觉得没选的那条路，现在最像什么？", [
        "A. 一条还亮着灯的路",
        "B. 一条已经被水淹没的路",
        "C. 一条看不清尽头的路",
        "D. 一条其实从来没有真正存在过的路",
      ]),
      createQuestion("当时让你做出选择的，更多是？", [
        "A. 害怕",
        "B. 责任",
        "C. 习惯",
        "D. 一时的冲动",
      ]),
      createQuestion("你现在回看那个选择，会觉得？", [
        "A. 当时只能那样",
        "B. 也许可以换一种方式",
        "C. 我还没完全接受它",
        "D. 它已经变成我身上的一部分",
      ]),
      createQuestion(
        "如果没走的那条路也显影出来，你希望它证明什么？",
        [
          "A. 我不是只有一种可能",
          "B. 当时的我已经尽力了",
          "C. 另一条路也不一定更好",
          "D. 我还可以重新选择下一段路",
        ],
        "你也可以写下想对那个岔路口说的话：",
        "写给那个选择的一句话……"
      ),
    ],
    frontImage: "/images/card-front.jpg",
    backImage: "/images/node-fork.jpg",
    resultPaper: "/images/result-fork-paper.png",
    stack: { left: "78%", top: "85%", rotate: "9deg" },
    open: { x: "82px", y: "-42px", rotate: "-10deg" },
  },
];

const revealPieceIndexes = [1, 2, 3, 4, 5] as const;
const ARCHIVE_STORAGE_KEY = "parallel-life-archives";

type ProofCardStyle = CSSProperties & {
  "--stack-left": string;
  "--stack-top": string;
  "--stack-rotate": string;
  "--emit-left": string;
  "--emit-top": string;
  "--open-x": string;
  "--open-y": string;
  "--open-rotate": string;
  "--drop-delay": string;
  "--card-z": number;
};

type NodeView =
  | "start"
  | "question"
  | "developing"
  | "result"
  | "share"
  | "history"
  | "archiveDetail";
type NodeAnswer = {
  choice: string;
  note: string;
};
type ArchiveRecord = {
  id: string;
  createdAt: string;
  nodeId: string;
  nodeTitle: string;
  answers: NodeAnswer[];
  openAnswer: string;
  resultText: string;
  summary: string;
  shareText: string;
};
type PageStyle = CSSProperties & {
  "--page-bg": string;
  "--node-photo": string;
};

type ArchiveInsight = {
  analysis: string;
  keywords: [string, string, string];
  finalLine: string;
};

function getCardById(nodeId: string) {
  const normalizedId =
    nodeId === "person" ? "oldname" : nodeId === "self" ? "fork" : nodeId;

  return cards.find((card) => card.id === normalizedId) ?? cards[0];
}

function getArchiveSummary(card: (typeof cards)[number]) {
  const summaries: Record<string, string> = {
    faraway: "这张照片保留了一次没有出发的方向，也保留了你仍会回头看的远方。",
    oldname: "这张照片记录了一个被放回镜子里的旧名，和它仍在轻轻敲门的声音。",
    person: "这张照片记录了一个被放回镜子里的旧名，和它仍在轻轻敲门的声音。",
    unsent: "这张照片留下了一句没有寄出的内容，它没有消失，只是还在等纸面干透。",
    fork: "这张照片指向一条没走完的岔路，那里站着另一个仍未合上的选择。",
    self: "这张照片指向一条没走完的岔路，那里站着另一个仍未合上的选择。",
  };

  return summaries[card.id] ?? "这张照片保存了一条没有完全消失的人生线。";
}

function stripChoiceLabel(choice: string) {
  return choice.replace(/^[A-D]\.\s*/, "");
}

function archiveHasAny(archive: ArchiveRecord, words: string[]) {
  const content = archive.answers
    .map((answer) => `${answer.choice} ${answer.note}`)
    .join(" ");

  return words.some((word) => content.includes(word));
}

function getArchiveInsight(archive: ArchiveRecord): ArchiveInsight {
  const card = getCardById(archive.nodeId);

  if (card.id === "faraway") {
    if (archiveHasAny(archive, ["逃离", "换一种生活", "还是会想离开"])) {
      return {
        analysis:
          "这张远方照片里，地点并不是最重要的部分。你想抵达的不是某个坐标，而是一种终于可以离开原地的许可。你并不确定那里会不会更好，只是现在的生活曾经太久地要求你留下。",
        keywords: ["迟到的出发", "逃离感", "另一种生活"],
        finalLine: "远方没有消失，它只是一直在等你重新辨认方向。",
      };
    }

    if (archiveHasAny(archive, ["没抵达也不是失败", "已经走了很远"])) {
      return {
        analysis:
          "这张照片没有把远方拍成一个答案。它更像一份迟到的证明：有些地方没有抵达，也不等于那段向往失败了。你已经在很多看不见的地方移动过，只是还没有把它称作出发。",
        keywords: ["未抵达", "已在路上", "自我许可"],
        finalLine: "没去成的地方，也可能保存着你走过的痕迹。",
      };
    }

    return {
      analysis:
        "这张照片保留了一次没有发生的出发。你想看的不是那个地方究竟有多好，而是如果当时真的走过去，你会不会更早认出一个不同的自己。",
      keywords: ["远方", "迟到", "可能性"],
      finalLine: "有些远方没有抵达，但它仍然改变过你。",
    };
  }

  if (card.id === "oldname") {
    if (archiveHasAny(archive, ["陌生", "不知道该怎么面对", "不确定是否属于"])) {
      return {
        analysis:
          "旧名不是一个简单的过去。它像一间灯没有完全关上的房间，你知道里面有个自己曾经住过，却不确定现在是否还能推门进去。你不是忘了它，只是还没找到一种不尴尬的方式承认它仍属于你。",
        keywords: ["旧名", "陌生感", "未完成的自己"],
        finalLine: "那个名字没有消失，它只是很久没有被你叫出口。",
      };
    }

    if (archiveHasAny(archive, ["还敢开始", "没有被打断", "不需要解释"])) {
      return {
        analysis:
          "这张照片显影出的不是另一个更成功的你，而是一个没有被中途打断的你。那个旧名留下的，是开始之前的勇气，是还不急着解释自己的清澈。",
        keywords: ["曾经的自己", "开始", "未被打断"],
        finalLine: "旧名把一个很久以前的自己，轻轻放回你手里。",
      };
    }

    return {
      analysis:
        "这张照片记录了一个没有成为的人。它不一定比现在更好，却让你看见：你曾经认真靠近过另一种身份，只是后来把它收进了更安静的地方。",
      keywords: ["旧名", "身份", "另一种自己"],
      finalLine: "没成为的那个人，也曾真实地经过你。",
    };
  }

  if (card.id === "unsent") {
    if (archiveHasAny(archive, ["怕打扰", "不用回信", "已经不需要收到", "告别"])) {
      return {
        analysis:
          "你留下的不是一句没有说出口的话，而是一种把关系停在原地的方式。你不是没有想过靠近，只是你更害怕一句话说出口后，连现在保留的距离也失去。",
        keywords: ["沉默", "不再打扰", "保留"],
        finalLine: "有些话没有寄出，是因为你也在保护剩下的距离。",
      };
    }

    if (archiveHasAny(archive, ["也许什么都不会改变", "看到就好", "过去的自己"])) {
      return {
        analysis:
          "这张照片里没有寄出的内容，最后变成了一种轻轻放下。你没有把所有话都交给对方，也没有再强迫自己等一个回音。它更像写给自己的回执：我曾经在意过，这件事已经足够。",
        keywords: ["释怀", "回音", "写给自己"],
        finalLine: "没寄出的那句话，最后被你自己收到了。",
      };
    }

    return {
      analysis:
        "这张照片留下了一句没有寄出的内容。它没有消失，只是还在等纸面干透。你曾经想把它交出去，后来又把它留在了自己这里。",
      keywords: ["未寄出", "关系", "纸面未干"],
      finalLine: "有些沉默不是空白，是被折起来保存的证词。",
    };
  }

  if (card.id === "fork") {
    if (archiveHasAny(archive, ["不再让别人替我选", "不是只有一种可能", "重新选择"])) {
      return {
        analysis:
          "岔路显影以后，重点不在于推翻过去。它更像一份迟来的权限：你开始意识到，人生不是只能沿着已经发生的那条线继续服从下去。下一段路，仍然可以由你重新握住方向。",
        keywords: ["重新选择", "分叉", "权限"],
        finalLine: "没走的路提醒你：下一次，可以更像自己地选择。",
      };
    }

    if (archiveHasAny(archive, ["当时只能那样", "已经尽力", "另一条路也不一定更好"])) {
      return {
        analysis:
          "这张岔路照片没有责怪过去的你。它只是把另一条路显影出来，让你看见：当时的选择也许不完美，但那时的你已经用手里有限的光，照过能看见的地方。",
        keywords: ["当时如此", "尽力", "和解"],
        finalLine: "另一条路存在，不代表现在这条路就该被否定。",
      };
    }

    return {
      analysis:
        "这张照片停在一个没有完全结束的岔路口。你回看的不是一个简单的对错，而是那些被选择牵动过的关系、责任和害怕。没走的路仍然亮着一点光，但它不催你回头，只提醒你还有选择的能力。",
      keywords: ["岔路", "没选择的路", "回看"],
      finalLine: "人生的分叉没有消失，它只是换成了下一次选择。",
    };
  }

  return {
    analysis: archive.summary || getArchiveSummary(card),
    keywords: ["未显影", "档案", "回声"],
    finalLine: archive.summary || "这份档案保存了一条没有完全消失的人生线。",
  };
}

function formatArchiveTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "时间未记录";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [finalTitle, setFinalTitle] = useState<(typeof cards)[number] | null>(
    null
  );
  const [introDone, setIntroDone] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);
  const [hasInteractedWithStack, setHasInteractedWithStack] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nodeView, setNodeView] = useState<NodeView>("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [nodeAnswers, setNodeAnswers] = useState<NodeAnswer[]>([]);
  const [questionWarning, setQuestionWarning] = useState(false);
  const [introVideoEnded, setIntroVideoEnded] = useState(false);
  const [isFinalDeveloping, setIsFinalDeveloping] = useState(false);
  const [archives, setArchives] = useState<ArchiveRecord[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = window.localStorage.getItem(ARCHIVE_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [currentArchive, setCurrentArchive] = useState<ArchiveRecord | null>(
    null
  );
  const [viewingArchive, setViewingArchive] = useState<ArchiveRecord | null>(
    null
  );
  const [shareReturnView, setShareReturnView] = useState<
    "result" | "archiveDetail"
  >("result");
  const [copyStatus, setCopyStatus] = useState("");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const morphRef = useRef<HTMLDivElement | null>(null);
  const morphImageRef = useRef<HTMLImageElement | null>(null);
  const finalTextRef = useRef<HTMLElement | null>(null);
  const archiveSavedRef = useRef(false);

  const currentAnswer = nodeAnswers[questionIndex] ?? { choice: "", note: "" };
  const currentQuestion = finalTitle?.questions[questionIndex];
  const currentBackdrop = finalTitle?.backImage ?? "/images/room-sea.jpg";
  const activeArchive = viewingArchive ?? currentArchive;
  const shareArchive = viewingArchive ?? currentArchive;
  const canCopy =
    typeof navigator !== "undefined" && Boolean(navigator.clipboard);
  const developedLevel = finalTitle
    ? nodeView === "question"
      ? questionIndex
      : nodeView === "start"
        ? 0
        : finalTitle.questions.length
    : 0;
  const pageStyle: PageStyle = {
    "--page-bg": `url("${currentBackdrop}")`,
    "--node-photo": `url("${currentBackdrop}")`,
  };

  const stageClassName = [
    "phone-stage",
    introDone && isStackOpen && !finalTitle ? "is-proof-open" : "",
    finalTitle ? "is-node-active" : "",
    isTransitioning ? "is-flowing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const proofAreaClassName = [
    "proof-area",
    isStackOpen ? "is-open" : "is-stacked",
    selectedId ? "has-selection" : "",
    hasInteractedWithStack ? "has-interacted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, []);

  function startExperience(enableSound: boolean) {
    flushSync(() => {
      setSoundEnabled(enableSound);
      setHasStarted(true);
      setIntroDone(false);
      setIntroVideoEnded(false);
      setIsStackOpen(false);
      setHasInteractedWithStack(false);
      setSelectedId(null);
      setIsTransitioning(false);
      setFinalTitle(null);
      setNodeView("start");
      setQuestionIndex(0);
      setNodeAnswers([]);
      setQuestionWarning(false);
      setCurrentArchive(null);
      setViewingArchive(null);
      setCopyStatus("");
      archiveSavedRef.current = false;
    });

    audioManager.startIntroAudio(enableSound);
  }

  function persistArchives(nextArchives: ArchiveRecord[]) {
    window.localStorage.setItem(
      ARCHIVE_STORAGE_KEY,
      JSON.stringify(nextArchives)
    );
  }

  function buildArchiveRecord() {
    if (!finalTitle) return null;

    const answers = finalTitle.questions.map((_, index) => {
      const answer = nodeAnswers[index];
      return {
        choice: answer?.choice || "未选择",
        note: answer?.note || "",
      };
    });
    const openAnswer =
      answers[answers.length - 1]?.note.trim() || "未填写";
    const record: ArchiveRecord = {
      id: `${Date.now()}-${finalTitle.id}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      nodeId: finalTitle.id,
      nodeTitle: finalTitle.short,
      answers,
      openAnswer,
      resultText: "",
      summary: "",
      shareText: "",
    };
    const insight = getArchiveInsight(record);

    record.resultText = insight.analysis;
    record.summary = insight.finalLine;
    record.shareText = [
      "你的未显影档案",
      finalTitle.short,
      insight.analysis,
      insight.finalLine,
      `开放题：${openAnswer}`,
    ].join("\n");

    return record;
  }

  function finishArchive() {
    if (archiveSavedRef.current && currentArchive) {
      setViewingArchive(currentArchive);
      setNodeView("result");
      return;
    }

    const record = buildArchiveRecord();
    if (!record) return;

    archiveSavedRef.current = true;
    setArchives((current) => {
      const next = [record, ...current];
      persistArchives(next);
      return next;
    });
    setCurrentArchive(record);
    setViewingArchive(record);
    setCopyStatus("");
    setNodeView("result");
  }

  function openShareCard(
    archive: ArchiveRecord | null,
    returnView: "result" | "archiveDetail"
  ) {
    if (!archive) return;

    setViewingArchive(archive);
    setShareReturnView(returnView);
    setCopyStatus("");
    setNodeView("share");
  }

  async function copyArchiveText(archive: ArchiveRecord | null) {
    if (!archive || !canCopy) return;

    try {
      await navigator.clipboard.writeText(archive.shareText);
      setCopyStatus("已复制");
    } catch {
      setCopyStatus("复制失败");
    }
  }

  function renderArchiveAnswers(archive: ArchiveRecord) {
    const archiveCard = getCardById(archive.nodeId);

    return (
      <details className="result-trace">
        <summary>你的选择痕迹</summary>
        <div className="result-inputs">
          {archiveCard.questions.map((question, index) => {
            const answer = archive.answers[index];
            const isLastQuestion = index === archiveCard.questions.length - 1;

            return (
              <p key={`${archive.id}-${question.title}`}>
                <span>
                  {index + 1}. {question.title}
                </span>
                <strong>{stripChoiceLabel(answer?.choice || "未选择")}</strong>
                {isLastQuestion && <em>{archive.openAnswer || "未填写"}</em>}
              </p>
            );
          })}
        </div>
      </details>
    );
  }

  function renderArchiveResultBody(archive: ArchiveRecord) {
    const card = getCardById(archive.nodeId);
    const insight = getArchiveInsight(archive);

    return (
      <>
        <div className="result-photo-box">
          <img src={card.resultPaper} alt={`${archive.nodeTitle}最终显影相纸`} />
        </div>
        <p className="result-copy">{insight.analysis}</p>
        <div className="result-tags" aria-label="档案关键词">
          {insight.keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
        <p className="result-final-line">{insight.finalLine}</p>
        {renderArchiveAnswers(archive)}
      </>
    );
  }

  function enterPhotoStackFromIntro() {
    if (isFinalDeveloping) return;

    setIntroDone(true);
    setIntroVideoEnded(false);
    setHasInteractedWithStack(true);
    setIsStackOpen(false);
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsStackOpen(true);
      });
    });
  }

  function handleStageClick() {
    if (isFinalDeveloping) return;
    if (!introDone || isTransitioning) return;

    if (selectedId) {
      setSelectedId(null);
      setIsStackOpen(false);
      return;
    }

    if (isStackOpen) {
      setIsStackOpen(false);
    }
  }

  function handleCardClick(card: (typeof cards)[number]) {
    if (isFinalDeveloping) return;
    if (!introDone || isTransitioning) return;

    if (!isStackOpen) {
      setHasInteractedWithStack(true);
      setIsStackOpen(true);
      setSelectedId(null);
      return;
    }

    if (selectedId !== card.id) {
      setSelectedId(card.id);
      return;
    }

    enterPhoto(card);
  }

  function enterPhoto(card: (typeof cards)[number]) {
    if (isFinalDeveloping) return;

    const stageEl = stageRef.current;
    const clickedEl = cardRefs.current[card.id];
    const morphEl = morphRef.current;
    const morphImg = morphImageRef.current;

    if (!stageEl || !clickedEl || !morphEl || !morphImg) return;

    audioManager.enterQuizAudio();
    setIsTransitioning(true);
    setFinalTitle(null);
    setNodeView("start");
    setQuestionIndex(0);
    setNodeAnswers([]);
    setQuestionWarning(false);
    setIsFinalDeveloping(false);
    setCurrentArchive(null);
    setViewingArchive(null);
    setCopyStatus("");
    archiveSavedRef.current = false;

    const stageRect = stageEl.getBoundingClientRect();
    const cardRect = clickedEl.getBoundingClientRect();
    const cardWidth = clickedEl.offsetWidth;
    const cardHeight = clickedEl.offsetHeight;

    const startLeft =
      cardRect.left - stageRect.left + cardRect.width / 2 - cardWidth / 2;
    const startTop =
      cardRect.top - stageRect.top + cardRect.height / 2 - cardHeight / 2;

    const otherImages = cards
      .filter((item) => item.id !== card.id)
      .map((item) => item.backImage);

    const allFlowImages = [...otherImages, card.backImage];

    gsap.set(morphEl, {
      display: "block",
      left: startLeft,
      top: startTop,
      width: cardWidth,
      height: cardHeight,
      borderRadius: 12,
      rotateY: 0,
      opacity: 1,
      zIndex: 20,
    });

    gsap.set(morphImg, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px) saturate(0.9) contrast(0.96) brightness(0.96)",
    });

    morphImg.src = card.frontImage;

    const tl = gsap.timeline();

    tl.to(clickedEl, {
      scale: 1.08,
      duration: 0.22,
      ease: "power2.out",
    });

    tl.to(
      ".proof-card:not(.is-selected)",
      {
        scale: 1.04,
        opacity: 0.55,
        stagger: 0.08,
        duration: 0.18,
        ease: "power2.out",
      },
      "-=0.08"
    );

    tl.to(morphEl, {
      rotateY: 90,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        morphImg.src = card.backImage;
        gsap.set(morphImg, {
          filter: "blur(7px) saturate(0.68) contrast(0.78) brightness(0.72)",
        });
      },
    });

    tl.to(morphEl, {
      rotateY: 0,
      duration: 0.34,
      ease: "power2.out",
    });

    tl.to(morphEl, {
      left: "5%",
      top: "14%",
      width: "90%",
      height: "58%",
      borderRadius: 22,
      duration: 0.65,
      ease: "power3.inOut",
    });

    allFlowImages.forEach((src, index) => {
      tl.to(morphImg, {
        opacity: 0,
        duration: 0.08,
        onComplete: () => {
          morphImg.src = src;
        },
      });

      tl.to(morphImg, {
        opacity: 1,
        scale: index === allFlowImages.length - 1 ? 1 : 1.035,
        duration: 0.2,
        ease: "power1.out",
      });
    });

    tl.to(morphEl, {
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      borderRadius: 0,
      duration: 0.7,
      ease: "power3.inOut",
    });

    tl.to(morphImg, {
      scale: 1.06,
      filter: "blur(8px) saturate(0.66) contrast(0.76) brightness(0.7)",
      duration: 1.2,
      ease: "power1.out",
    });

    tl.call(() => {
      setNodeView("start");
      setFinalTitle(card);
    });

    tl.fromTo(
      finalTextRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
      }
    );
  }

  function resetScene() {
    if (isFinalDeveloping) return;
    if (!morphRef.current) return;

    audioManager.returnSelectionAudio();

    gsap.set(morphRef.current, {
      display: "none",
      opacity: 0,
    });

    if (morphImageRef.current) {
      gsap.set(morphImageRef.current, {
        filter: "blur(0px) saturate(0.9) contrast(0.96) brightness(0.96)",
      });
    }

    gsap.set(".proof-card", {
      scale: 1,
      opacity: 1,
    });

    if (finalTextRef.current) {
      gsap.set(finalTextRef.current, {
        opacity: 0,
        y: 16,
      });
    }

    setSelectedId(null);
    setIsStackOpen(true);
    setHasInteractedWithStack(true);
    setFinalTitle(null);
    setNodeView("start");
    setQuestionIndex(0);
    setNodeAnswers([]);
    setQuestionWarning(false);
    setIsTransitioning(false);
    setIsFinalDeveloping(false);
    setCurrentArchive(null);
    setViewingArchive(null);
    setCopyStatus("");
    archiveSavedRef.current = false;
  }

  function returnToPhotoPile(nextSelectedId: string | null = null) {
    resetScene();
    setSelectedId(nextSelectedId);
  }

  function updateCurrentAnswer(patch: Partial<NodeAnswer>) {
    setNodeAnswers((current) => {
      const next = [...current];
      const previous = next[questionIndex] ?? { choice: "", note: "" };
      next[questionIndex] = { ...previous, ...patch };
      return next;
    });
  }

  function handleQuestionContinue() {
    if (isFinalDeveloping) return;
    if (!finalTitle) return;

    if (!currentAnswer.choice) {
      setQuestionWarning(true);
      return;
    }

    if (questionIndex < finalTitle.questions.length - 1) {
      setQuestionWarning(false);
      setQuestionIndex((current) => current + 1);
      return;
    }

    setQuestionWarning(false);
    setIsFinalDeveloping(true);
    setNodeView("developing");
  }

  function blockFinalDevelopingEvent(event: SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleFinalDevelopingEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.animationName !== "developingPhotoRise") return;
    setIsFinalDeveloping(false);
  }

  return (
    <main
      className={`page ${!hasStarted || !introDone ? "is-intro-video" : ""}`}
      style={pageStyle}
      data-sound={soundEnabled ? "on" : "off"}
    >
      <div className={stageClassName} ref={stageRef} onClick={handleStageClick}>
        <img className="background" src="/images/room-sea.jpg" alt="" />

        <div className="mist" />
        <div className="water-glow" />

        {!hasStarted && (
          <section className="entry-screen" onClick={(e) => e.stopPropagation()}>
            <img
              className="entry-cover-bg"
              src="/images/home-cover-handdrawn.png"
              alt=""
            />
            <div className="entry-cover">
              <img
                className="entry-cover-main"
                src="/images/home-cover-handdrawn.png"
                alt=""
              />
              <button
                className="entry-hotspot entry-hotspot-sound"
                type="button"
                aria-label="开启声音并进入"
                onClick={() => startExperience(true)}
              />
              <button
                className="entry-hotspot entry-hotspot-muted"
                type="button"
                aria-label="静音进入"
                onClick={() => startExperience(false)}
              />
            </div>
          </section>
        )}

        {hasStarted && !introDone && (
          <div
            className={`intro-sequence ${
              introVideoEnded ? "is-video-ended" : ""
            }`}
          >
            <video
              className="intro-video"
              src="/videos/intro-photo-drop.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={(event) => {
                event.currentTarget.pause();
                audioManager.returnSelectionAudio();
                setIntroVideoEnded(true);
              }}
            />
            {introVideoEnded && (
              <button
                className="intro-photo-hotspot"
                aria-label="进入相纸选择"
                onClick={(event) => {
                  event.stopPropagation();
                  enterPhotoStackFromIntro();
                }}
                type="button"
              >
                <span>点击照片显影</span>
              </button>
            )}
          </div>
        )}

        {introDone && !finalTitle && (
          <section className={proofAreaClassName}>
            <div className="proof-sheet">
              {cards.map((card, index) => {
                const cardStyle: ProofCardStyle = {
                  "--stack-left": card.stack.left,
                  "--stack-top": card.stack.top,
                  "--stack-rotate": card.stack.rotate,
                  "--emit-left": "50%",
                  "--emit-top": "72%",
                  "--open-x": card.open.x,
                  "--open-y": card.open.y,
                  "--open-rotate": card.open.rotate,
                  "--drop-delay": `${index * 0.25}s`,
                  "--card-z": index + 3,
                };

                return (
                  <button
                    key={card.id}
                    ref={(el) => {
                      cardRefs.current[card.id] = el;
                    }}
                    className={`proof-card ${
                      selectedId === card.id ? "is-selected" : ""
                    }`}
                    style={cardStyle}
                    aria-label={`${card.short}，${card.subtitle}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card);
                    }}
                  >
                    <img src={card.frontImage} alt="" />
                    <span className="photo-caption">
                      <span>{card.short}</span>
                      <span>{card.subtitle}</span>
                    </span>
                    <span className="selected-hint">再次点击进入</span>
                  </button>
                );
              })}
            </div>
            <p className="proof-pile-hint">点击照片显影</p>
          </section>
        )}

        <div className="morph-card" ref={morphRef}>
          <img ref={morphImageRef} src="/images/card-front.jpg" alt="" />
        </div>

        <section
          className={`node-screen ${
            currentAnswer.note.trim() ? "is-writing" : ""
          } is-${nodeView} is-developed-${developedLevel}`}
          ref={finalTextRef}
        >
          {finalTitle && (
            <>
              <div className="node-photo-develop" aria-hidden="true">
                <span className="node-photo-base" />
                <span className="node-photo-paper" />
                {revealPieceIndexes.map((piece) => (
                  <span
                    key={piece}
                    className={`node-photo-piece node-photo-piece-${piece}`}
                  />
                ))}
                <span className="node-photo-final" />
              </div>

              {nodeView !== "history" && (
                <button
                  className="node-back"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetScene();
                  }}
                >
                  ← 返回列表
                </button>
              )}

              {nodeView === "start" && (
                <div className="node-start">
                  <p className="node-kicker">{finalTitle.subtitle}</p>
                  <h1>{finalTitle.short}</h1>
                  <p>{finalTitle.startCopy}</p>
                  <button
                    className="node-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodeView("question");
                    }}
                  >
                    让它显影
                  </button>
                </div>
              )}

              {nodeView === "question" && (
                <div className="node-question">
                  <p className="node-kicker">
                    {finalTitle.short} / {finalTitle.subtitle}
                  </p>
                  <h1>{finalTitle.short}</h1>
                  <p className="node-explain">{finalTitle.desc}</p>
                  <p className="node-step">
                    {String(questionIndex + 1).padStart(2, "0")} /{" "}
                    {String(finalTitle.questions.length).padStart(2, "0")}
                  </p>
                  {currentQuestion && (
                    <>
                      <p className="node-prompt">{currentQuestion.title}</p>
                      {currentQuestion.prompt &&
                        questionIndex !== finalTitle.questions.length - 1 && (
                          <p className="node-hint-text">
                            {currentQuestion.prompt}
                          </p>
                        )}
                      <div className="choice-list">
                        {currentQuestion.options.map((option) => (
                          <button
                            key={option}
                            className={`choice-item ${
                              currentAnswer.choice === option ? "is-picked" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCurrentAnswer({ choice: option });
                              setQuestionWarning(false);
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {questionWarning && (
                        <p className="question-warning">请选择一张继续显影</p>
                      )}
                    </>
                  )}
                  {questionIndex === finalTitle.questions.length - 1 && (
                    <>
                      {currentQuestion?.prompt && (
                        <p className="node-hint-text">
                          {currentQuestion.prompt}
                        </p>
                      )}
                      <label className="water-input">
                        <textarea
                          value={currentAnswer.note}
                          placeholder={
                            currentQuestion?.inputPlaceholder ??
                            "如果还有一句话想留下，可以写在这里"
                          }
                          onChange={(e) =>
                            updateCurrentAnswer({ note: e.target.value })
                          }
                        />
                      </label>
                    </>
                  )}
                  <button
                    className="node-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestionContinue();
                    }}
                  >
                    {questionIndex === finalTitle.questions.length - 1
                      ? "显影结束"
                      : "继续显影"}
                  </button>
                </div>
              )}

              {nodeView === "developing" && (
                <div className="node-developing">
                  <div
                    className="developing-photo"
                    onAnimationEnd={handleFinalDevelopingEnd}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>{finalTitle.short}</span>
                    <strong>
                      {isFinalDeveloping ? "正在显影" : "显影完成"}
                    </strong>
                    <em>
                      {isFinalDeveloping
                        ? "请等待照片自己浮现"
                        : "这张照片留下了记录"}
                    </em>
                    {!isFinalDeveloping && (
                      <button
                        className="node-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          finishArchive();
                        }}
                      >
                        继续
                      </button>
                    )}
                  </div>
                </div>
              )}

              {nodeView === "result" && (
                <div className="result-placeholder">
                  <p className="node-kicker">{finalTitle.subtitle}</p>
                  <h1 className="archive-title">你的未显影档案</h1>
                  {activeArchive ? (
                    renderArchiveResultBody(activeArchive)
                  ) : (
                    <p className="result-copy">{getArchiveSummary(finalTitle)}</p>
                  )}
                  <div className="result-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareCard(activeArchive, "result");
                      }}
                    >
                      生成分享卡片
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNodeView("history");
                      }}
                    >
                      返回档案
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        returnToPhotoPile();
                      }}
                    >
                      返回照片纸
                    </button>
                    {canCopy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void copyArchiveText(activeArchive);
                        }}
                      >
                        {copyStatus || "复制结果文字"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {nodeView === "share" && shareArchive && (
                <div className="share-card-view">
                  <div
                    className="share-card"
                    style={{
                      "--share-bg": `url("${getCardById(shareArchive.nodeId).backImage}")`,
                    } as CSSProperties}
                  >
                    <div className="share-card-inner">
                      <p>你的未显影档案</p>
                      <h1>{shareArchive.nodeTitle}</h1>
                      <strong>{shareArchive.summary}</strong>
                      <span>{shareArchive.openAnswer || "未填写"}</span>
                      <em>平行人生</em>
                    </div>
                  </div>
                  <div className="result-actions share-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNodeView(shareReturnView);
                      }}
                    >
                      返回档案
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        returnToPhotoPile();
                      }}
                    >
                      返回照片纸
                    </button>
                    {canCopy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void copyArchiveText(shareArchive);
                        }}
                      >
                        {copyStatus || "复制结果文字"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {nodeView === "history" && (
                <div className="archive-list-panel">
                  <p className="node-kicker">LOCAL ARCHIVE</p>
                  <h1 className="archive-title">全部未显影档案</h1>
                  <div className="archive-list">
                    {archives.length === 0 && (
                      <p className="archive-empty">还没有保存的档案</p>
                    )}
                    {archives.map((archive) => (
                      <article className="archive-item" key={archive.id}>
                        <span>{archive.nodeTitle}</span>
                        <time>{formatArchiveTime(archive.createdAt)}</time>
                        <p>{archive.summary}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingArchive(archive);
                            setNodeView("archiveDetail");
                          }}
                        >
                          查看
                        </button>
                      </article>
                    ))}
                  </div>
                  <div className="result-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingArchive(currentArchive);
                        setNodeView("result");
                      }}
                    >
                      返回当前档案
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        returnToPhotoPile();
                      }}
                    >
                      返回照片纸
                    </button>
                  </div>
                </div>
              )}

              {nodeView === "archiveDetail" && activeArchive && (
                <div className="result-placeholder">
                  <p className="node-kicker">
                    {activeArchive.nodeTitle} /{" "}
                    {formatArchiveTime(activeArchive.createdAt)}
                  </p>
                  <h1 className="archive-title">你的未显影档案</h1>
                  {renderArchiveResultBody(activeArchive)}
                  <div className="result-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareCard(activeArchive, "archiveDetail");
                      }}
                    >
                      生成分享卡片
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNodeView("history");
                      }}
                    >
                      返回档案
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        returnToPhotoPile();
                      }}
                    >
                      返回照片纸
                    </button>
                    {canCopy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void copyArchiveText(activeArchive);
                        }}
                      >
                        {copyStatus || "复制结果文字"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
        {isFinalDeveloping && (
          <div
            className="final-develop-click-lock"
            aria-hidden="true"
            onClick={blockFinalDevelopingEvent}
            onDoubleClick={blockFinalDevelopingEvent}
            onPointerDown={blockFinalDevelopingEvent}
            onTouchStart={blockFinalDevelopingEvent}
          />
        )}
      </div>
    </main>
  );
}
