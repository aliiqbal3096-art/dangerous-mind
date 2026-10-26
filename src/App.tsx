
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type ModalKind = "login" | "vault" | "case" | null;
type WorldId = "inner" | "abyss" | "archive" | "unknown";

type MindCard = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  years: string;
  field: string;
  text: string;
  lesson: string;
  caution: string;
};

type MindProfile = {
  biography: string;
  context: string;
  keyIdeas: string[];
  works: string[];
  influence: string;
  questions: string[];
  sources: string[];
};

type CaseFile = {
  id: string;
  title: string;
  accent: string;
  eyebrow: string;
  description: string;
  status: string;
  classification: string;
  quote: string;
  reference: string;
};

type World = {
  id: WorldId;
  number: string;
  symbol: string;
  title: string;
  subtitle: string;
  description: string;
  questions: string[];
};

const cases: CaseFile[] = [
  {
    id: "DM-001",
    title: "THE MASK",
    accent: "WEARER",
    eyebrow: "CASE FILE 001 / THE PUBLIC SELF",
    description:
      "Every person carries a version of themselves designed to be seen. The investigation begins when the performance becomes indistinguishable from the person beneath it.",
    status: "OBSERVATION ACTIVE",
    classification: "IDENTITY / SOCIAL MASKING",
    quote:
      "The most convincing mask is the one its wearer forgets they are wearing.",
    reference: "ARCHIVE REF. 001-A",
  },
  {
    id: "DM-002",
    title: "THE SHADOW",
    accent: "WITHIN",
    eyebrow: "CASE FILE 002 / THE HIDDEN SELF",
    description:
      "The traits we refuse to acknowledge rarely disappear. They wait in the margins of our choices, our reactions, and the stories we tell about who we are.",
    status: "PATTERN DETECTED",
    classification: "SHADOW / SELF-DECEPTION",
    quote: "What we refuse to face often finds another way to speak.",
    reference: "ARCHIVE REF. 002-B",
  },
  {
    id: "DM-003",
    title: "THE SILENCE",
    accent: "BETWEEN",
    eyebrow: "CASE FILE 003 / THE UNSPOKEN",
    description:
      "Silence can protect, punish, conceal, or reveal. Its meaning lives in the context—and in the things a person works hardest not to say.",
    status: "UNDER REVIEW",
    classification: "BEHAVIOUR / COMMUNICATION",
    quote:
      "Sometimes the absence of an answer is the most carefully chosen answer of all.",
    reference: "ARCHIVE REF. 003-C",
  },
  {
    id: "DM-004",
    title: "THE CONTROL",
    accent: "ILLUSION",
    eyebrow: "CASE FILE 004 / THE NEED TO KNOW",
    description:
      "Control promises safety in an unpredictable world. But the harder we grip what cannot be controlled, the less room remains for understanding it.",
    status: "EVIDENCE COLLECTED",
    classification: "POWER / UNCERTAINTY",
    quote:
      "The need to control everything can become its own kind of captivity.",
    reference: "ARCHIVE REF. 004-D",
  },
];

const worlds: World[] = [
  {
    id: "inner",
    number: "01",
    symbol: "◈",
    title: "THE INNER ROOM",
    subtitle: "THE SELF YOU KEEP HIDDEN",
    description:
      "A private room for examining identity, contradiction, and the stories you tell yourself when no one is watching.",
    questions: [
      "Which part of yourself do you most often hide from other people?",
      "What truth about yourself feels uncomfortable to admit?",
      "When do you feel most like your unedited self?",
      "Which old belief about yourself may no longer be true?",
    ],
  },
  {
    id: "abyss",
    number: "02",
    symbol: "◉",
    title: "THE ABYSS",
    subtitle: "THE FEAR BENEATH THE SURFACE",
    description:
      "Enter the quieter territory of fear, uncertainty, and the thoughts that grow louder when distraction disappears.",
    questions: [
      "What uncertainty are you spending the most energy trying to avoid?",
      "What would you do differently if embarrassment were impossible?",
      "Which fear has been making decisions on your behalf?",
      "What is one small thing you can face instead of postponing?",
    ],
  },
  {
    id: "archive",
    number: "03",
    symbol: "⌘",
    title: "THE ARCHIVE",
    subtitle: "THE PATTERNS THAT FOLLOW YOU",
    description:
      "Study the repetitions: familiar reactions, old memories, and patterns that may be asking for attention rather than judgement.",
    questions: [
      "Which situation keeps repeating in your life?",
      "What usually happens just before you react in a familiar way?",
      "What did an older version of you learn that you may have outgrown?",
      "What pattern would you like to interrupt this week?",
    ],
  },
  {
    id: "unknown",
    number: "04",
    symbol: "⟡",
    title: "THE UNKNOWN",
    subtitle: "THE PERSON YOU MAY BECOME",
    description:
      "A space for possibility, change, and the uncomfortable freedom of becoming someone your past cannot fully predict.",
    questions: [
      "What possibility have you dismissed before giving it a fair chance?",
      "What would a braver version of your next month look like?",
      "Which expectation are you ready to stop living for?",
      "What is one experiment you can try without demanding perfection?",
    ],
  },
];

const principles = [
  {
    n: "01",
    symbol: "◈",
    title: "SELF-AWARENESS",
    subtitle: "See the pattern before it repeats.",
    text: "Notice your reactions without immediately defending, condemning, or explaining them away.",
  },
  {
    n: "02",
    symbol: "⌁",
    title: "CONTRADICTION",
    subtitle: "Two truths can coexist.",
    text: "Human beings are rarely simple. Curiosity makes room for complexity without excusing harm.",
  },
  {
    n: "03",
    symbol: "◉",
    title: "RESPONSIBILITY",
    subtitle: "Understanding is a beginning.",
    text: "Insight matters when it helps you make more deliberate choices and repair the damage you can.",
  },
  {
    n: "04",
    symbol: "⟡",
    title: "CHANGE",
    subtitle: "A pattern is not a life sentence.",
    text: "You are not required to repeat every lesson you learned in survival mode.",
  },
];

const mindProfiles: Record<string, MindProfile> = {
  "DM-01": {
    biography:
      "Steve Jobs (1955–2011) co-founded Apple and became one of the most visible figures in personal computing, animated by a belief that technology and design should feel integrated rather than separate. His career also included conflict, setbacks, a period away from Apple, and a return that reshaped the company.",
    context:
      "Accounts of Jobs describe an unusually persuasive product storyteller and demanding leader. The phrase “reality distortion field” was used by colleagues to describe his ability to make ambitious outcomes seem possible. It is a descriptive phrase, not a clinical term.",
    keyIdeas: [
      "Start with the experience people will have, not only the technology behind it.",
      "A clear story can align a team around a difficult goal.",
      "High standards can drive craft, but pressure and disrespect can damage people and trust.",
    ],
    works: [
      "Apple Macintosh and later product launches",
      "The NeXT chapter and Pixar leadership",
      "The 2005 Stanford commencement address (public speech)",
    ],
    influence:
      "Jobs influenced product design, consumer technology, brand storytelling, and the expectation that hardware and software should work as a coherent experience. His legacy is mixed: celebrated innovation alongside criticism of his management style.",
    questions: [
      "When does strong conviction become refusal to listen?",
      "Can a great result justify harmful treatment of a team?",
      "What makes a product experience feel simple without being simplistic?",
    ],
    sources: [
      "Walter Isaacson, Steve Jobs (2011)",
      "Stanford University, Steve Jobs commencement address (2005)",
      "Apple, company history and product archives",
    ],
  },
  "DM-02": {
    biography:
      "Sun Tzu is the traditional name associated with The Art of War, a Chinese military treatise concerned with planning, intelligence, positioning, discipline, and the costs of conflict. The date, authorship, and details of his life remain uncertain, so legend and history should not be treated as identical.",
    context:
      "The text is not simply a manual for defeating an enemy. It repeatedly emphasizes understanding conditions, gathering information, adapting to circumstances, and avoiding wasteful conflict where possible.",
    keyIdeas: [
      "Know your own strengths and limitations as carefully as you study the situation around you.",
      "Information and preparation can prevent unnecessary confrontation.",
      "Strategy depends on conditions; a tactic that works once may fail in a different context.",
    ],
    works: [
      "The Art of War",
      "Later commentaries and translations of the classical text",
    ],
    influence:
      "The Art of War has been interpreted in military history, political strategy, business writing, and popular culture. Modern business analogies can be useful, but they should not erase the text's original military and historical setting.",
    questions: [
      "What information am I missing before making a decision?",
      "Is this conflict necessary, or is there a better route?",
      "Which part of my plan must change if conditions change?",
    ],
    sources: [
      "Sun Tzu, The Art of War, translated by Samuel B. Griffith",
      "Ralph D. Sawyer, The Seven Military Classics of Ancient China",
    ],
  },
  "DM-03": {
    biography:
      "Niccolò Machiavelli (1469–1527) was a Florentine diplomat, political thinker, and writer who lived through intense political instability. After the Medici returned to power, he lost his government position and wrote works that later became central to debates about leadership and political power.",
    context:
      "The Prince is often reduced to a slogan about manipulation. Machiavelli's writing is more complicated: it examines the gap between moral ideals and political pressures, and scholars continue to debate the purpose, tone, and intended audience of his work.",
    keyIdeas: [
      "Political power must be studied as it actually operates, not only as people claim it should operate.",
      "Reputation, public perception, institutions, and circumstances shape leadership.",
      "A description of ruthless behaviour is not automatically an endorsement of it.",
    ],
    works: ["The Prince", "Discourses on Livy", "The Art of War"],
    influence:
      "Machiavelli's name became shorthand for political cunning, sometimes obscuring his broader writing on republican government, civic life, and the instability of states.",
    questions: [
      "What incentives are shaping the behaviour I see?",
      "Who benefits from the public story being told?",
      "Am I confusing realism with permission to act without ethics?",
    ],
    sources: [
      "Niccolò Machiavelli, The Prince",
      "Niccolò Machiavelli, Discourses on Livy",
      "Stanford Encyclopedia of Philosophy, “Niccolò Machiavelli”",
    ],
  },
  "DM-04": {
    biography:
      "Viktor Frankl (1905–1997) was an Austrian psychiatrist and Holocaust survivor. After surviving Nazi concentration camps, he became widely known for logotherapy, an approach that places the search for meaning at the centre of human motivation. His life and work must be read with care and historical seriousness.",
    context:
      "Frankl wrote about meaning, responsibility, and the possibility of taking a stance toward some circumstances that cannot be changed. This is not a claim that people can simply think their way out of trauma, nor that suffering is always meaningful or chosen.",
    keyIdeas: [
      "Meaning may be found through work, relationships, values, and how a person responds to unavoidable circumstances.",
      "Freedom and responsibility are connected; choices matter even when options are limited.",
      "Support, material conditions, and care remain important—meaning should never be used to blame people for suffering.",
    ],
    works: [
      "Man’s Search for Meaning",
      "The Doctor and the Soul",
      "The Will to Meaning",
    ],
    influence:
      "Frankl's writing has influenced psychotherapy, existential thought, and public conversations about purpose. His memoir is powerful, but it is one person's account and should not be treated as a universal formula for survival.",
    questions: [
      "What gives my current effort a sense of purpose?",
      "Which part of this situation can I influence, however slightly?",
      "Am I using the idea of resilience to dismiss someone else's pain?",
    ],
    sources: [
      "Viktor E. Frankl, Man’s Search for Meaning",
      "Viktor E. Frankl, The Doctor and the Soul",
      "United States Holocaust Memorial Museum, Holocaust history resources",
    ],
  },
  "DM-05": {
    biography:
      "Hannah Arendt (1906–1975) was a political theorist born in Germany who fled Nazi persecution and later wrote in the United States. Her work examined totalitarianism, political action, authority, freedom, and the responsibilities involved in thinking and judging in public life.",
    context:
      "Arendt's phrase “the banality of evil,” developed in her reporting and analysis of Adolf Eichmann's trial, remains debated. It was not a claim that Nazi crimes were trivial; it raised questions about thoughtlessness, bureaucratic systems, and ordinary participation in extraordinary wrongdoing.",
    keyIdeas: [
      "Political judgement requires thinking beyond slogans and inherited rules.",
      "Bureaucratic systems can make responsibility feel distant or divided.",
      "Plurality—the fact that people share a world while seeing it differently—is central to political life.",
    ],
    works: [
      "The Origins of Totalitarianism",
      "The Human Condition",
      "Eichmann in Jerusalem",
      "Between Past and Future",
    ],
    influence:
      "Arendt remains influential in political philosophy, civic theory, and debates about responsibility under authoritarian systems. Her interpretations, including her account of Eichmann, are still contested and should be approached through primary texts and scholarship.",
    questions: [
      "Am I thinking this through, or repeating what my group expects?",
      "Where does responsibility sit when many people share a task?",
      "How can disagreement exist without denying another person's humanity?",
    ],
    sources: [
      "Hannah Arendt, The Human Condition",
      "Hannah Arendt, Eichmann in Jerusalem",
      "Stanford Encyclopedia of Philosophy, “Hannah Arendt”",
    ],
  },
  "DM-06": {
    biography:
      "Carl Gustav Jung (1875–1961) was a Swiss psychiatrist who developed analytical psychology after an early collaboration with Sigmund Freud. His work explored dreams, symbols, archetypes, psychological types, and the process he called individuation—the development of a more integrated sense of self.",
    context:
      "Jung's concepts remain influential in literature, art, and self-reflection, but many are difficult to test scientifically and are not equivalent to established clinical findings. The “shadow” can be used as a reflective metaphor, not as a diagnosis or a complete explanation of behaviour.",
    keyIdeas: [
      "The shadow names traits or impulses a person may reject or fail to recognise in themselves.",
      "Dreams and symbols can be explored as meaningful personal material, though interpretations are not universal facts.",
      "Self-understanding involves integration and reflection, not pretending to be free of contradiction.",
    ],
    works: [
      "Psychological Types",
      "Modern Man in Search of a Soul",
      "Aion",
      "Man and His Symbols",
    ],
    influence:
      "Jung shaped psychotherapy, cultural criticism, and popular ideas about archetypes and the unconscious. His work is best approached as a historically important and debated framework rather than a universal map of every mind.",
    questions: [
      "Which trait in another person provokes a reaction I should examine?",
      "What evidence supports my interpretation—and what might contradict it?",
      "Can I acknowledge an uncomfortable part of myself without excusing harmful behaviour?",
    ],
    sources: [
      "C. G. Jung, Man and His Symbols",
      "C. G. Jung, Psychological Types",
      "The C. G. Jung Institute / Jungian research and educational resources",
    ],
  },
};

function Arrow() {
  return (
    <svg
      className="dm-arrow"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12h15M13 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="dm-logo"
      onClick={onClick}
      aria-label="Dangerous Mind home"
    >
      <span className="dm-logo-symbol" aria-hidden="true">
        <i />
        <i />
      </span>
      <span className="dm-logo-text">
        DANGEROUS <span>MIND</span>
      </span>
    </button>
  );
}

export default function App() {
  const [activeCase, setActiveCase] = useState(0);
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedCase, setSelectedCase] = useState<CaseFile>(cases[0]);

  // Profile cards are now loaded from the Express API.
  const [minds, setMinds] = useState<MindCard[]>([]);
  const [selectedMind, setSelectedMind] = useState<MindCard | null>(null);
  const [mindsLoading, setMindsLoading] = useState(true);
  const [mindsError, setMindsError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [soundNoteVisible, setSoundNoteVisible] = useState(true);
  const [showThreshold, setShowThreshold] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [worldId, setWorldId] = useState<WorldId | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [savedStatus, setSavedStatus] = useState("");

  const currentCase = cases[activeCase];

  const currentWorld = useMemo(
    () => worlds.find((world) => world.id === worldId) ?? null,
    [worldId],
  );

  // Fetch the profiles from Express, which reads them from MongoDB.
  useEffect(() => {
    const controller = new AbortController();

    async function loadMinds() {
      try {
        setMindsLoading(true);
        setMindsError("");

        const response = await fetch("/api/profiles", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: { profiles: MindCard[] } = await response.json();

        if (!Array.isArray(data.profiles)) {
          throw new Error("The API returned an invalid profiles list.");
        }

        setMinds(data.profiles);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Failed to load profiles:", error);
        setMindsError("Unable to load profiles. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setMindsLoading(false);
        }
      }
    }

    void loadMinds();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (showThreshold || showTransition || worldId) return;

    const timer = window.setInterval(
      () => setActiveCase((index) => (index + 1) % cases.length),
      6500,
    );

    return () => window.clearInterval(timer);
  }, [showThreshold, showTransition, worldId]);

  useEffect(() => {
    if (!modal && !selectedMind) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        setSelectedMind(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, selectedMind]);

  useEffect(() => {
    if (!showTransition) return;

    const timer = window.setTimeout(() => {
      setShowTransition(false);
      setShowThreshold(false);
      setWorldId("inner");
      setQuestionIndex(0);
      setAnswer("");
      setSavedStatus("");
    }, 1250);

    return () => window.clearTimeout(timer);
  }, [showTransition]);

  function goHome() {
    setWorldId(null);
    setShowThreshold(false);
    setShowTransition(false);

    window.setTimeout(
      () => window.scrollTo({ top: 0, behavior: "smooth" }),
      0,
    );
  }

  function openWorlds() {
    setShowThreshold(true);

    window.setTimeout(
      () =>
        document
          .getElementById("dm-threshold")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50,
    );
  }

  function enterWorlds() {
    setShowTransition(true);
  }

  function chooseWorld(id: WorldId) {
    setWorldId(id);
    setQuestionIndex(0);
    setAnswer("");
    setSavedStatus("");
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setLoginError("Enter an email and password to continue.");
      return;
    }

    setLoggedIn(true);
    setLoginError("");
    setModal(null);
    setEmail("");
    setPassword("");
  }

  function saveReflection() {
    if (!answer.trim()) {
      setSavedStatus("WRITE A FEW WORDS BEFORE SAVING YOUR REFLECTION.");
      return;
    }

    try {
      const key = "dangerous-mind-reflections";

      const previous = JSON.parse(
        window.localStorage.getItem(key) || "[]",
      ) as Array<Record<string, string>>;

      previous.push({
        world: currentWorld?.title ?? "Unknown",
        question: currentWorld?.questions[questionIndex] ?? "",
        answer: answer.trim(),
        savedAt: new Date().toISOString(),
      });

      window.localStorage.setItem(key, JSON.stringify(previous));
      setSavedStatus("REFLECTION SAVED ON THIS DEVICE.");
    } catch {
      setSavedStatus(
        "YOUR BROWSER COULD NOT SAVE THIS REFLECTION. COPY IT SOMEWHERE SAFE.",
      );
    }
  }

  const goTo = (id: string) => {
    setWorldId(null);
    setShowThreshold(false);

    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="dm">
      <div className="dm-background" aria-hidden="true">
        {cases.map((item, index) => (
          <div
            key={item.id}
            className={`dm-background-image ${
              index === activeCase ? "active" : ""
            }`}
            style={{
              backgroundImage: `url('/images/horror-${index + 1}.jpg')`,
            }}
          />
        ))}
      </div>

      <div className="dm-vignette" aria-hidden="true" />
      <div className="dm-grain" aria-hidden="true" />
      <div className="dm-grid-overlay" aria-hidden="true" />

      <header className="dm-header" id="home">
        <Logo onClick={goHome} />

        <div className="dm-connection">
          <span className="dm-live-dot" /> HUMAN BEHAVIOUR ARCHIVE{" "}
          <span className="dm-eyebrow-divider">/</span> ONLINE
        </div>

        <div className="dm-header-actions">
          <button
            className={`dm-login-button ${loggedIn ? "dm-logged-in" : ""}`}
            onClick={() => setModal("login")}
          >
            <span aria-hidden="true">♙</span>
            {loggedIn ? "MEMBER ACCESS" : "LOG IN"}
            {loggedIn && <i className="dm-user-indicator" />}
          </button>

          <button
            className="dm-header-button"
            onClick={() => setModal("vault")}
          >
            ENTER THE VAULT{" "}
            <span className="dm-header-button-icon">↗</span>
          </button>
        </div>
      </header>

      <section className="dm-hero" aria-label="Featured investigation">
        <div className="dm-hero-copy">
          <div className="dm-eyebrow">
            <span className="dm-eyebrow-line" /> {currentCase.eyebrow}{" "}
            <span className="dm-eyebrow-divider">/</span> {currentCase.id}
          </div>

          <h1 className="dm-title">
            <span>{currentCase.title}</span>
            <br />
            <span className="dm-title-accent">{currentCase.accent}</span>
          </h1>

          <div className="dm-description-wrap">
            <span className="dm-description-index">
              {String(activeCase + 1).padStart(2, "0")} / 04
            </span>
            <p className="dm-description">{currentCase.description}</p>
          </div>

          <div className="dm-actions">
            <button
              className="dm-primary-button"
              onClick={() => {
                setSelectedCase(currentCase);
                setModal("case");
              }}
            >
              OPEN THE CASE FILE <Arrow />
            </button>

            <button
              className="dm-secondary-button"
              onClick={() => goTo("about")}
            >
              <span className="dm-play-icon">↓</span> EXPLORE THE ARCHIVE
            </button>
          </div>

          <div className="dm-warning">
            <span>!</span>
            <span>
              NOTICE: THIS ARCHIVE EXPLORES HUMAN BEHAVIOUR AND
              SELF-REFLECTION. IT IS NOT A DIAGNOSTIC TOOL OR A SUBSTITUTE FOR
              PROFESSIONAL CARE.
            </span>
          </div>
        </div>

        <aside className="dm-evidence" aria-label="Classified evidence record">
          <div className="dm-evidence-header">
            <span>DM / BEHAVIOURAL UNIT</span>
            <span className="dm-classified-stamp">CLASSIFIED</span>
          </div>

          <div className="dm-emblem" aria-hidden="true">
            <span className="dm-emblem-label dm-label-top">
              OBSERVATION FIELD
            </span>
            <span className="dm-emblem-coordinate dm-coordinate-left">
              51° N
            </span>
            <span className="dm-emblem-coordinate dm-coordinate-right">
              04° E
            </span>
            <i className="dm-emblem-orbit dm-orbit-one" />
            <i className="dm-emblem-orbit dm-orbit-two" />
            <i className="dm-emblem-orbit dm-orbit-three" />
            <i className="dm-emblem-cross dm-cross-x" />
            <i className="dm-emblem-cross dm-cross-y" />
            <span className="dm-emblem-diamond">
              <i className="dm-emblem-eye" />
            </span>
            <span className="dm-emblem-label dm-label-bottom">
              SUBJECT: THE HUMAN MIND
            </span>
          </div>

          <div className="dm-evidence-details">
            <div>
              <span>FILE NUMBER</span>
              <strong>{currentCase.id}</strong>
            </div>
            <div>
              <span>CLASSIFICATION</span>
              <strong>{currentCase.classification}</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong className="dm-status">{currentCase.status}</strong>
            </div>
            <div>
              <span>REFERENCE</span>
              <strong>{currentCase.reference}</strong>
            </div>
          </div>

          <div className="dm-evidence-footer">
            <span className="dm-signal-dot" />
            <span>LIVE SIGNAL</span>
            <span className="dm-evidence-bars">
              {Array.from({ length: 18 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <span>ENCRYPTED</span>
          </div>
        </aside>
      </section>

      <footer className="dm-footer">
        <div className="dm-footer-quote">
          <span className="dm-quote-mark">“</span>
          <span>{currentCase.quote}</span>
        </div>

        <div className="dm-pagination">
          <span className="dm-page-current">
            {String(activeCase + 1).padStart(2, "0")}
          </span>
          <span>/ 04</span>

          <div className="dm-page-track">
            {cases.map((item, index) => (
              <button
                key={item.id}
                className={`dm-page-dot ${
                  index === activeCase ? "selected" : ""
                }`}
                onClick={() => setActiveCase(index)}
                aria-label={`Show case ${index + 1}`}
              />
            ))}
          </div>

          <span className="dm-page-caption">CASE FILES</span>
        </div>

        <button className="dm-scroll-hint" onClick={() => goTo("about")}>
          SCROLL TO INVESTIGATE <span />
        </button>
      </footer>

      <section className="dm-about" id="about">
        <div className="dm-about-topline">
          <span>
            <i className="dm-live-dot" /> THE DANGEROUS MIND PROJECT
          </span>
          <span>FIELD NOTES / VOL. 01 — HUMAN NATURE</span>
        </div>

        <div className="dm-about-intro">
          <div className="dm-about-heading">
            <p className="dm-about-eyebrow">01 / THE PURPOSE OF THIS ARCHIVE</p>
            <h2>
              THE MOST
              <br />
              IMPORTANT
              <br />
              <span>INVESTIGATION</span>
              <br />
              IS WITHIN.
            </h2>
          </div>

          <div className="dm-about-copy">
            <span className="dm-about-index">
              A NOTE FROM THE ARCHIVE — 001
            </span>
            <p className="dm-about-lead">
              The human mind is not a simple place. It is a landscape of
              instinct, memory, contradiction, fear, and possibility.
            </p>
            <p>
              Dangerous Mind is an editorial exploration of behaviour: the
              patterns we repeat, the masks we wear, the stories that shape
              our choices, and the parts of ourselves we have not yet learned
              to understand.
            </p>
            <p>
              This is not about labelling people as good or bad. It is about
              looking more carefully, asking better questions, and making room
              for a more honest relationship with ourselves.
            </p>
            <button
              className="dm-about-link"
              onClick={() => goTo("principles")}
            >
              READ THE PRINCIPLES <Arrow />
            </button>
          </div>
        </div>

        <div className="dm-about-visual">
          <div className="dm-about-image">
            <img
              src="/images/horror-2.jpg"
              alt="A dark, atmospheric archival scene"
            />
            <div className="dm-about-image-overlay" />
            <div className="dm-about-image-stamp">
              <span>ARCHIVE NOTE / 01</span>
              <strong>
                KNOW
                <br />
                THYSELF.
              </strong>
              <span>THE FIRST ACT OF COURAGE IS ATTENTION.</span>
            </div>
            <i className="dm-about-image-corner dm-about-corner-tl" />
            <i className="dm-about-image-corner dm-about-corner-tr" />
            <i className="dm-about-image-corner dm-about-corner-bl" />
            <i className="dm-about-image-corner dm-about-corner-br" />
            <span className="dm-about-image-reference">
              FIG. 001 — THE OBSERVER AND THE OBSERVED
            </span>
          </div>

          <aside className="dm-about-visual-note">
            <span className="dm-about-note-number">FIELD NOTE 01 / 04</span>
            <p>
              “Until we make the unconscious conscious, it will direct our
              lives and we will call it fate.”
            </p>
            <span className="dm-about-note-mark">— ATTRIBUTED TO C. G. JUNG</span>
          </aside>
        </div>

        <div className="dm-about-pillars-heading" id="principles">
          <div>
            <p className="dm-about-eyebrow">02 / THE METHOD</p>
            <h3>
              LOOK CLOSER.
              <br />
              <span>JUDGE SLOWER.</span>
            </h3>
          </div>
          <p>
            Use these principles as a compass—not as a verdict. The aim is
            not to become flawless; it is to become more conscious of what you
            do and why.
          </p>
        </div>

        <div className="dm-about-pillars">
          {principles.map((principle) => (
            <article className="dm-principle-card" key={principle.n}>
              <div className="dm-principle-top">
                <span>PRINCIPLE / {principle.n}</span>
                <span className="dm-principle-symbol">
                  {principle.symbol}
                </span>
              </div>
              <h4>{principle.title}</h4>
              <p className="dm-principle-subtitle">{principle.subtitle}</p>
              <p className="dm-principle-description">{principle.text}</p>
              <div className="dm-principle-bottom">
                <span>FIELD GUIDE / {principle.n}</span>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>

        <div className="dm-about-reflection" id="dangerous-minds">
          <div className="dm-reflection-image">
            <img
              src="/images/horror-3.jpg"
              alt="A shadowed figure in an atmospheric archive"
            />
            <div className="dm-reflection-image-shade" />
            <span className="dm-reflection-image-label">
              CASE SERIES / THE MINDS THAT CHANGED HISTORY
            </span>
          </div>

          <div className="dm-reflection-copy">
            <p className="dm-about-eyebrow">
              03 / DANGEROUS MINDS — PEOPLE, IDEAS, CONSEQUENCES
            </p>
            <h3>
              STUDY THE MIND.
              <br />
              <span>QUESTION THE LEGACY.</span>
            </h3>
            <p>
              Explore influential thinkers, inventors, strategists, and writers
              through the ideas they left behind—and the contradictions in how
              their ideas and actions are understood.
            </p>
            <p>
              These are evidence-informed editorial profiles, not diagnoses or
              simplistic labels. Read critically, consider the historical
              context, and decide what deserves to be learned from each legacy.
            </p>
            <button
              className="dm-about-link"
              onClick={() => goTo("mind-index")}
            >
              EXPLORE THE PEOPLE ARCHIVE <Arrow />
            </button>
          </div>
        </div>

        <div className="dm-about-pillars-heading" id="mind-index">
          <div>
            <p className="dm-about-eyebrow">04 / THE PEOPLE ARCHIVE</p>
            <h3>
              GREAT MINDS.
              <br />
              <span>COMPLICATED LEGACIES.</span>
            </h3>
          </div>
          <p>
            Six starting files on vision, strategy, power, meaning,
            responsibility, and the unconscious. Each includes a central idea,
            a practical takeaway, and historical context to keep the portrait
            nuanced.
          </p>
        </div>

        {/* API loading and error states */}
        {mindsLoading && (
          <p className="dm-person-description" role="status">
            LOADING THE PEOPLE ARCHIVE...
          </p>
        )}

        {!mindsLoading && mindsError && (
          <div role="alert">
            <p className="dm-person-description">{mindsError}</p>
            <button
              className="dm-about-link"
              type="button"
              onClick={() => window.location.reload()}
            >
              RETRY <Arrow />
            </button>
          </div>
        )}

        {!mindsLoading && !mindsError && minds.length === 0 && (
          <p className="dm-person-description" role="status">
            NO PROFILES FOUND.
          </p>
        )}

        {!mindsLoading && !mindsError && minds.length > 0 && (
          <div className="dm-people-grid">
            {minds.map((mind) => (
              <article
                className="dm-person-card"
                key={mind.id}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Open detailed profile for ${mind.name}`}
                onClick={() => setSelectedMind(mind)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedMind(mind);
                  }
                }}
              >
                <div className="dm-person-image-wrap">
                  <img
                    className="dm-person-image"
                    src={mind.image}
                    alt={`Portrait of ${mind.name}`}
                    loading="lazy"
                  />
                  <span className="dm-person-file">
                    CASE FILE / {mind.id}
                  </span>
                  <span className="dm-person-years">{mind.years}</span>
                </div>

                <div className="dm-person-content">
                  <p className="dm-person-field">{mind.field}</p>
                  <h4>{mind.name}</h4>
                  <p className="dm-person-subtitle">{mind.subtitle}</p>
                  <p className="dm-person-description">{mind.text}</p>

                  <div className="dm-person-lesson">
                    <span>THE IDEA TO CONSIDER</span>
                    <p>{mind.lesson}</p>
                  </div>

                  <p className="dm-person-caution">{mind.caution}</p>
                </div>

                <div className="dm-person-footer">
                  <span>OPEN FULL DOSSIER</span>
                  <span>↗</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="dm-about-cta" id="investigations">
          <div className="dm-about-cta-symbol">
            <span />
            <span />
          </div>
          <p className="dm-about-eyebrow">
            THE NEXT FILE IS YOURS TO OPEN
          </p>
          <h3>
            THE SURFACE IS
            <br />
            <span>ONLY THE BEGINNING.</span>
          </h3>
          <p className="dm-about-cta-description">
            Step into a private reflection space, explore the worlds, and
            leave with a question worth carrying into your own life.
          </p>
          <button
            className="dm-primary-button dm-about-cta-button"
            onClick={openWorlds}
          >
            CROSS THE THRESHOLD <Arrow />
          </button>
          <span className="dm-about-cta-footnote">
            NO PROFILE. NO DIAGNOSIS. JUST CURIOSITY.
          </span>
        </div>

        <div className="dm-about-footer">
          <Logo onClick={goHome} />
          <p>
            AN ONGOING STUDY OF HUMAN BEHAVIOUR.
            <br />
            OBSERVE WITH CARE. INTERPRET WITH HUMILITY.
          </p>
          <span>© DANGEROUS MIND / ARCHIVE 001</span>
        </div>
      </section>

      {selectedMind && (
        <div
          className="dm-profile-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMind(null);
            }
          }}
        >
          <article
            className="dm-profile-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-profile-title"
          >
            <button
              className="dm-profile-close"
              onClick={() => setSelectedMind(null)}
              aria-label="Close person profile"
            >
              ×
            </button>

            <div className="dm-profile-hero">
              <img
                src={selectedMind.image}
                alt={`Portrait of ${selectedMind.name}`}
              />
              <div className="dm-profile-hero-shade" />
              <div className="dm-profile-hero-copy">
                <p className="dm-about-eyebrow">
                  DANGEROUS MIND / EXPANDED DOSSIER / {selectedMind.id}
                </p>
                <h2 id="dm-profile-title">{selectedMind.name}</h2>
                <p>{selectedMind.subtitle}</p>
                <span>
                  {selectedMind.years} · {selectedMind.field}
                </span>
              </div>
            </div>

            <div className="dm-profile-body">
              <div className="dm-profile-lead">
                <span>01 / THE PERSON</span>
                <p>{mindProfiles[selectedMind.id]?.biography}</p>
              </div>

              <section className="dm-profile-section">
                <span>02 / HISTORICAL CONTEXT</span>
                <p>{mindProfiles[selectedMind.id]?.context}</p>
              </section>

              <section className="dm-profile-section">
                <span>03 / KEY IDEAS</span>
                <ul>
                  {mindProfiles[selectedMind.id]?.keyIdeas.map((idea) => (
                    <li key={idea}>{idea}</li>
                  ))}
                </ul>
              </section>

              <section className="dm-profile-section">
                <span>04 / WORKS TO EXPLORE</span>
                <ul>
                  {mindProfiles[selectedMind.id]?.works.map((work) => (
                    <li key={work}>{work}</li>
                  ))}
                </ul>
              </section>

              <section className="dm-profile-section">
                <span>05 / INFLUENCE &amp; LEGACY</span>
                <p>{mindProfiles[selectedMind.id]?.influence}</p>
              </section>

              <section className="dm-profile-section dm-profile-questions">
                <span>06 / QUESTIONS FOR THE READER</span>
                {mindProfiles[selectedMind.id]?.questions.map(
                  (question, index) => (
                    <p key={question}>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      {question}
                    </p>
                  ),
                )}
              </section>

              <section className="dm-profile-section dm-profile-sources">
                <span>STARTING POINTS FOR FURTHER READING</span>
                <ul>
                  {mindProfiles[selectedMind.id]?.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
                <p className="dm-profile-disclaimer">
                  EDITORIAL NOTE: This is an introductory profile, not a
                  complete biography. Interpretations may be contested;
                  consult the original works and reliable historical
                  scholarship before treating a claim as settled fact.
                </p>
              </section>

              <div className="dm-profile-bottom">
                <span>END OF DOSSIER / {selectedMind.id}</span>
                <button onClick={() => setSelectedMind(null)}>
                  RETURN TO THE PEOPLE ARCHIVE ↗
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {soundNoteVisible && (
        <button
          className="dm-sound-note"
          onClick={() => setSoundNoteVisible(false)}
          aria-label="Dismiss archive note"
        >
          <span className="dm-live-dot" /> SOUND IS OFF — THIS EXPERIENCE IS
          DESIGNED TO BE EXPLORED SILENTLY{" "}
          <span className="dm-note-close">×</span>
        </button>
      )}

      {showThreshold && !worldId && !showTransition && (
        <section
          className="dm-threshold"
          id="dm-threshold"
          aria-label="The threshold to the worlds"
        >
          <div
            className="dm-threshold-visual"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(5,5,5,.12), rgba(5,5,5,.8)), url('/images/threshold.jpg')",
            }}
          >
            <div className="dm-threshold-particles" aria-hidden="true" />
          </div>

          <div className="dm-threshold-content">
            <p className="dm-about-eyebrow">
              A MOMENT BETWEEN THE KNOWN AND THE UNKNOWN
            </p>
            <h2>
              YOU HAVE REACHED
              <br />
              <span>THE THRESHOLD.</span>
            </h2>
            <p>
              Beyond this point, there are no answers waiting to be handed to
              you. There are only rooms, questions, and the patterns you choose
              to notice.
            </p>
            <button
              className="dm-primary-button dm-choose-world-button"
              onClick={enterWorlds}
            >
              CHOOSE YOUR WORLD <Arrow />
            </button>
            <button
              className="dm-secondary-button"
              onClick={() => setShowThreshold(false)}
            >
              RETURN TO THE ARCHIVE
            </button>
          </div>
        </section>
      )}

      {showTransition && (
        <div
          className="dm-world-transition is-entering"
          role="status"
          aria-live="polite"
        >
          <div className="dm-transition-orbit" />
          <div className="dm-transition-core">DM</div>
          <p>PREPARING THE ARCHIVE</p>
          <span>THE NEXT ROOM IS YOURS TO ENTER</span>
        </div>
      )}

      {worldId && currentWorld && (
        <section
          className={`dm-world-experience world-${worldId}`}
          aria-label="Immersive reflection worlds"
        >
          <div className="dm-world-background">
            <i className="dm-world-light dm-world-light-one" />
            <i className="dm-world-light dm-world-light-two" />
            <i className="dm-world-grid" />
            <i className="dm-world-noise" />
          </div>

          <header className="dm-world-header">
            <button
              className="dm-world-brand"
              onClick={() => {
                setWorldId(null);
                setShowThreshold(true);
              }}
            >
              <span className="dm-world-brand-mark">DM</span>
              <span>
                DANGEROUS <strong>MIND</strong>
                <br />
                REFLECTION ARCHIVE
              </span>
            </button>

            <div className="dm-world-live">
              <i /> PRIVATE REFLECTION SPACE
            </div>

            <button
              className="dm-world-exit"
              onClick={() => {
                setWorldId(null);
                setShowThreshold(false);
                goTo("about");
              }}
            >
              <span>×</span> EXIT EXPERIENCE
            </button>
          </header>

          <div className="dm-world-detail">
            <button
              className="dm-world-back"
              onClick={() => setWorldId(null)}
            >
              ← ALL WORLDS
            </button>

            <div className="dm-world-detail-layout">
              <div className="dm-world-detail-copy">
                <div className="dm-world-kicker">
                  <span>WORLD {currentWorld.number}</span>
                  <span> / REFLECTION SPACE</span>
                </div>

                <div className="dm-world-detail-symbol">
                  {currentWorld.symbol}
                </div>

                <h1>{currentWorld.title}</h1>
                <p className="dm-world-detail-subtitle">
                  {currentWorld.subtitle}
                </p>
                <p className="dm-world-detail-description">
                  {currentWorld.description}
                </p>

                <div className="dm-world-detail-meta">
                  <span>NO SCORES</span>
                  <span>NO DIAGNOSES</span>
                  <span>YOUR OWN PACE</span>
                </div>

                <div className="dm-world-detail-footer">
                  <button
                    onClick={() =>
                      chooseWorld(
                        worlds[
                          (worlds.findIndex(
                            (world) => world.id === worldId,
                          ) +
                            worlds.length -
                            1) %
                            worlds.length
                        ].id,
                      )
                    }
                  >
                    ← PREVIOUS WORLD
                  </button>

                  <button
                    onClick={() =>
                      chooseWorld(
                        worlds[
                          (worlds.findIndex(
                            (world) => world.id === worldId,
                          ) +
                            1) %
                            worlds.length
                        ].id,
                      )
                    }
                  >
                    NEXT WORLD →
                  </button>
                </div>
              </div>

              <div className="dm-world-journal">
                <div className="dm-world-kicker">
                  <span>
                    REFLECTION LOG /{" "}
                    {String(questionIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2>ASK YOURSELF.</h2>

                <p className="dm-world-journal-intro">
                  There is no correct answer. Take a breath and write what
                  feels honest—not what sounds impressive.
                </p>

                <div className="dm-world-questions">
                  {currentWorld.questions.map((question, index) => (
                    <button
                      key={question}
                      className={`dm-world-question ${
                        questionIndex === index ? "is-selected" : ""
                      }`}
                      onClick={() => {
                        setQuestionIndex(index);
                        setSavedStatus("");
                      }}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{question}</span>
                      <span>↗</span>
                    </button>
                  ))}
                </div>

                <label
                  className="dm-world-answer-label"
                  htmlFor="dm-reflection-answer"
                >
                  YOUR REFLECTION
                </label>

                <textarea
                  id="dm-reflection-answer"
                  className="dm-world-answer"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    setSavedStatus("");
                  }}
                  placeholder="Begin with what you notice…"
                  rows={5}
                />

                <div className="dm-world-journal-actions">
                  <button
                    className="dm-world-action-primary"
                    onClick={saveReflection}
                  >
                    SAVE REFLECTION ↗
                  </button>
                  <button
                    className="dm-world-action-secondary"
                    onClick={() => {
                      setAnswer("");
                      setSavedStatus("");
                    }}
                  >
                    CLEAR
                  </button>
                </div>

                {savedStatus && (
                  <p className="dm-world-saved-status" role="status">
                    {savedStatus}
                  </p>
                )}
              </div>
            </div>
          </div>

          <footer className="dm-world-lobby-footer">
            <span>REFLECTION IS NOT A DIAGNOSIS.</span>
            <button
              onClick={() => {
                setWorldId(null);
                setShowThreshold(false);
                goTo("about");
              }}
            >
              RETURN TO THE MAIN ARCHIVE ↗
            </button>
          </footer>
        </section>
      )}

      {modal && (
        <div
          className="dm-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
        >
          <section
            className={
              modal === "login"
                ? "dm-login-modal"
                : modal === "vault"
                  ? "dm-vault-modal"
                  : "dm-modal"
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-modal-title"
          >
            <button
              className="dm-modal-close"
              onClick={() => setModal(null)}
              aria-label="Close dialog"
            >
              ×
            </button>

            {modal === "case" && (
              <>
                <div className="dm-modal-kicker">
                  {selectedCase.eyebrow} / {selectedCase.id}
                </div>
                <span className="dm-modal-stamp">CASE OPENED</span>
                <h2 id="dm-modal-title">
                  {selectedCase.title}
                  <br />
                  <span>{selectedCase.accent}</span>
                </h2>
                <p>{selectedCase.description}</p>
                <div className="dm-modal-record">
                  <span>
                    CLASSIFICATION: {selectedCase.classification}
                  </span>
                  <span>STATUS: {selectedCase.status}</span>
                  <span>
                    NOTE: A behavioural lens is not a diagnosis. Context
                    matters.
                  </span>
                </div>
                <button
                  className="dm-modal-next"
                  onClick={() => {
                    setModal(null);
                    goTo("about");
                  }}
                >
                  CONTINUE INVESTIGATION <Arrow />
                </button>
              </>
            )}

            {modal === "login" && (
              <>
                <div className="dm-modal-kicker">
                  MEMBER ACCESS / SECURE ENTRY
                </div>
                <div className="dm-login-symbol">⌑</div>
                <h2 id="dm-modal-title">
                  ENTER THE
                  <br />
                  <span>ARCHIVE.</span>
                </h2>
                <p className="dm-login-description">
                  This front-end demo uses a local interface only. No account
                  is created and no credentials are sent to a server.
                </p>

                <form className="dm-login-form" onSubmit={submitLogin}>
                  <label htmlFor="dm-email">EMAIL ADDRESS</label>
                  <input
                    id="dm-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                  <label htmlFor="dm-password">PASSWORD</label>
                  <input
                    id="dm-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter any demo password"
                    autoComplete="current-password"
                    required
                  />

                  {loginError && (
                    <p className="dm-login-error">{loginError}</p>
                  )}

                  <button className="dm-login-submit" type="submit">
                    {loggedIn ? "RE-ENTER ARCHIVE" : "CONTINUE AS DEMO MEMBER"}{" "}
                    <Arrow />
                  </button>
                </form>

                <div className="dm-login-footnote">
                  <span className="dm-live-dot" /> LOCAL DEMO ONLY — NO SERVER
                  CONNECTION
                </div>
              </>
            )}

            {modal === "vault" && (
              <>
                <div className="dm-modal-kicker">
                  RESTRICTED ACCESS / ARCHIVE GATE
                </div>

                <div className="dm-vault-open-status">
                  <span className="dm-live-dot" /> ACCESS GATE IS OPEN FOR
                  EXPLORATION
                </div>

                <div className="dm-vault-reveal-symbol">⌘</div>

                <h2 id="dm-modal-title">
                  THE VAULT
                  <br />
                  <span>IS NOT A SECRET.</span>
                </h2>

                <p>
                  It is a collection of questions you might not usually stop
                  to ask. Open a case, read the field notes, or enter one of
                  the reflection worlds.
                </p>

                <div className="dm-secret-file">
                  <span>AVAILABLE COLLECTION / 001</span>
                  <strong>The Human Pattern</strong>
                  <p>
                    Observations on identity, fear, influence, memory, and the
                    small decisions that become habits.
                  </p>
                  <span className="dm-secret-warning">
                    NO PERSONAL DATA IS REQUIRED TO EXPLORE THIS DEMO.
                  </span>
                </div>

                <button
                  className="dm-modal-next"
                  onClick={() => {
                    setModal(null);
                    openWorlds();
                  }}
                >
                  OPEN THE REFLECTION WORLDS <Arrow />
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
