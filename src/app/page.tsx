"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

const cards = [
  {
    id: "faraway",
    short: "远方",
    title: "没抵达的远方",
    desc: "你曾经差一点出发。",
    frontImage: "/images/card-front.jpg",
    backImage: "/images/faraway.jpg",
  },
  {
    id: "beginning",
    short: "开始",
    title: "没开始的那件事",
    desc: "它一直停在第一张纸上。",
    frontImage: "/images/card-front.jpg",
    backImage: "/images/beginning.jpg",
  },
  {
    id: "person",
    short: "留下",
    title: "没走下去的人",
    desc: "有些关系没有结束，只是没有继续。",
    frontImage: "/images/card-front.jpg",
    backImage: "/images/person.jpg",
  },
  {
    id: "self",
    short: "长出",
    title: "没长出来的自己",
    desc: "那个你，仍然在某个地方等你。",
    frontImage: "/images/card-front.jpg",
    backImage: "/images/self.jpg",
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [finalTitle, setFinalTitle] = useState<(typeof cards)[number] | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const morphRef = useRef<HTMLDivElement | null>(null);
  const morphImageRef = useRef<HTMLImageElement | null>(null);
  const finalTextRef = useRef<HTMLElement | null>(null);

  const selectedCard = cards.find((item) => item.id === selectedId);

  function handleStageClick() {
    if (!isTransitioning && selectedId) {
      setSelectedId(null);
    }
  }

  function handleCardClick(card: (typeof cards)[number]) {
    if (isTransitioning) return;

    if (selectedId !== card.id) {
      setSelectedId(card.id);
      return;
    }

    enterPhoto(card);
  }

  function enterPhoto(card: (typeof cards)[number]) {
    const stageEl = stageRef.current;
    const clickedEl = cardRefs.current[card.id];
    const morphEl = morphRef.current;
    const morphImg = morphImageRef.current;

    if (!stageEl || !clickedEl || !morphEl || !morphImg) return;

    setIsTransitioning(true);
    setFinalTitle(null);

    const stageRect = stageEl.getBoundingClientRect();
    const cardRect = clickedEl.getBoundingClientRect();

    const startLeft = cardRect.left - stageRect.left;
    const startTop = cardRect.top - stageRect.top;

    const otherImages = cards
      .filter((item) => item.id !== card.id)
      .map((item) => item.backImage);

    const allFlowImages = [...otherImages, card.backImage];

    gsap.set(morphEl, {
      display: "block",
      left: startLeft,
      top: startTop,
      width: cardRect.width,
      height: cardRect.height,
      borderRadius: 12,
      rotateY: 0,
      opacity: 1,
      zIndex: 20,
    });

    gsap.set(morphImg, {
      opacity: 1,
      scale: 1,
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
      duration: 1.2,
      ease: "power1.out",
    });

    tl.call(() => {
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
    if (!isTransitioning || !morphRef.current) return;

    gsap.set(morphRef.current, {
      display: "none",
      opacity: 0,
    });

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
    setFinalTitle(null);
    setIsTransitioning(false);
  }

  return (
    <main className="page">
      <div className="phone-stage" ref={stageRef} onClick={handleStageClick}>
        <img className="background" src="/images/room-sea.jpg" alt="" />

        <div className="mist" />
        <div className="water-glow" />

        {!isTransitioning && (
          <section className="proof-area">
            <div className="system-text">
              {selectedCard ? (
                <>
                  <p className="selected-title">{selectedCard.title}</p>
                  <p>{selectedCard.desc}</p>
                  <p className="hint">再次轻触，选择进入这张照片</p>
                </>
              ) : (
                <p>轻触一张照片，查看它没有拍下来的那一面</p>
              )}
            </div>

            <div className="proof-sheet">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[card.id] = el;
                  }}
                  className={`proof-card ${
                    selectedId === card.id ? "is-selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card);
                  }}
                >
                  <img src={card.frontImage} alt="" />
                  <span className="card-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="card-title">{card.short}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="morph-card" ref={morphRef}>
          <img ref={morphImageRef} src="/images/card-front.jpg" alt="" />
        </div>

        <section className="final-text" ref={finalTextRef}>
          {finalTitle && (
            <>
              <p className="final-kicker">PHOTO PROOF</p>
              <h1>{finalTitle.title}</h1>
              <p>{finalTitle.desc}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetScene();
                }}
              >
                返回照片纸
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}