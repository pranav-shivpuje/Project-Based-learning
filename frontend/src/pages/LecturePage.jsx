import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

// ── Flashcard (flip card) ──────────────────────────────────────────────────
function FlashCard({ card, index, total, onPrev, onNext }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [index]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">Card {index + 1} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-indigo-600' : 'w-1.5 bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div
        onClick={() => setFlipped(!flipped)}
        className={`rounded-2xl p-8 min-h-52 flex flex-col items-center justify-center cursor-pointer transition-all shadow-md select-none ${
          flipped ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' : 'bg-white border border-gray-100 hover:shadow-lg'
        }`}
      >
        <span className={`text-xs font-semibold uppercase tracking-widest mb-4 ${flipped ? 'text-indigo-200' : 'text-indigo-400'}`}>
          {flipped ? 'Answer' : 'Question'}
        </span>
        <p className="text-lg text-center leading-relaxed font-medium">
          {flipped ? card.answer : card.question}
        </p>
        <p className={`text-xs mt-6 ${flipped ? 'text-indigo-300' : 'text-gray-400'}`}>
          tap to {flipped ? 'see question' : 'reveal answer'}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={onPrev} disabled={index === 0}
          className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-30 transition">
          ← Prev
        </button>
        <button onClick={onNext} disabled={index === total - 1}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-30 transition">
          Next →
        </button>
      </div>
    </div>
  );
}

// ── MCQ Quiz card ──────────────────────────────────────────────────────────
function QuizCard({ card, index, total, onPrev, onNext }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setSelected(null); setRevealed(false); }, [index]);

  let mcq = null;
  try { mcq = JSON.parse(card.answer); } catch { mcq = null; }
  const valid = mcq && mcq.type === 'mcq' && mcq.options && mcq.correct;

  const handleSelect = (label) => {
    if (revealed) return;
    setSelected(label);
    setRevealed(true);
  };

  const optionStyle = (label) => {
    if (!revealed) return 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer';
    if (label === mcq.correct) return 'border-emerald-400 bg-emerald-50 text-emerald-800';
    if (label === selected) return 'border-red-400 bg-red-50 text-red-700';
    return 'border-gray-200 opacity-40';
  };

  if (!valid) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
      <p>This lecture was processed before MCQ support was added.</p>
      <p className="text-sm mt-1">Re-upload the lecture to get MCQ questions.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">Question {index + 1} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-violet-600' : 'w-1.5 bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{card.question}</p>
          {mcq?.difficulty && (
            <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
              DIFF_STYLE[mcq.difficulty]?.badge || 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {mcq.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {OPTION_LABELS.map(label => (
          <button key={label} onClick={() => handleSelect(label)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${optionStyle(label)}`}
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              revealed && label === mcq.correct ? 'bg-emerald-500 text-white' :
              revealed && label === selected ? 'bg-red-500 text-white' :
              'bg-gray-100 text-gray-600'
            }`}>{label}</span>
            <span className="text-sm">{mcq.options[label]}</span>
            {revealed && label === mcq.correct && <span className="ml-auto text-emerald-600">✓</span>}
            {revealed && label === selected && label !== mcq.correct && <span className="ml-auto text-red-500">✗</span>}
          </button>
        ))}
      </div>

      {revealed && mcq.explanation && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Explanation</p>
          <p className="text-sm text-indigo-900 leading-relaxed">{mcq.explanation}</p>
        </div>
      )}

      {!revealed && (
        <p className="text-center text-xs text-gray-400 mb-4">Select an option to reveal the answer</p>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onPrev} disabled={index === 0}
          className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-30 transition">
          ← Prev
        </button>
        <button onClick={onNext} disabled={index === total - 1}
          className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 disabled:opacity-30 transition">
          Next →
        </button>
      </div>
    </div>
  );
}

// ── MCQ Section with difficulty filter ────────────────────────────────────
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];
const DIFF_STYLE = {
  easy:   { badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', btn: 'bg-emerald-500 text-white' },
  medium: { badge: 'bg-amber-100 text-amber-700 border-amber-300',       btn: 'bg-amber-500 text-white' },
  hard:   { badge: 'bg-red-100 text-red-700 border-red-300',             btn: 'bg-red-500 text-white' },
};

function MCQSection({ mcqs }) {
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState(0);

  const filtered = filter === 'all' ? mcqs : mcqs.filter(c => {
    try { return JSON.parse(c.answer)?.difficulty === filter; } catch { return false; }
  });

  // Reset index when filter changes
  useEffect(() => setIndex(0), [filter]);

  if (mcqs.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
      <p>No MCQ questions yet.</p>
      <p className="text-sm mt-1">Re-upload this lecture to generate MCQ questions.</p>
    </div>
  );

  return (
    <div>
      {/* Difficulty filter */}
      <div className="flex gap-2 mb-5">
        {DIFFICULTIES.map(d => {
          const isActive = filter === d;
          const style = d !== 'all' ? DIFF_STYLE[d] : null;
          return (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${
                isActive
                  ? d === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : `${style.btn} border-transparent`
                  : d === 'all' ? 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400' : `${style.badge} border`
              }`}
            >
              {d === 'all' ? `All (${mcqs.length})` : `${d.charAt(0).toUpperCase() + d.slice(1)} (${mcqs.filter(c => { try { return JSON.parse(c.answer)?.difficulty === d; } catch { return false; } }).length})`}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          <p>No {filter} questions available.</p>
        </div>
      ) : (
        <QuizCard
          card={filtered[index]}
          index={index}
          total={filtered.length}
          onPrev={() => setIndex(i => Math.max(0, i - 1))}
          onNext={() => setIndex(i => Math.min(filtered.length - 1, i + 1))}
        />
      )}
    </div>
  );
}

// ── Lecture Chatbot ────────────────────────────────────────────────────────
function LectureChat({ lectureId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'ve read this lecture. Ask me anything about it and I\'ll answer based only on what was taught. 📚' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post(`/chat/${lectureId}`, {
        message: userMsg.content,
        history: messages.slice(-6),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm flex flex-col" style={{ height: '500px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm flex-shrink-0">🤖</div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Lecture Tutor</p>
          <p className="text-xs text-gray-400">Answers based only on this lecture</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Ask about this lecture..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function LecturePage() {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [tab, setTab] = useState('notes');
  const [fcIndex, setFcIndex] = useState(0);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [glossary, setGlossary] = useState([]);
  const [glossaryLoaded, setGlossaryLoaded] = useState(false);

  const fetchLecture = useCallback(() => {
    api.get(`/lectures/${id}`).then(({ data }) => setLecture(data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    fetchLecture();
    const interval = setInterval(() => {
      setLecture(prev => {
        if (prev?.status === 'ready' || prev?.status === 'failed') { clearInterval(interval); return prev; }
        fetchLecture();
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchLecture]);

  const downloadNotes = () => {
    if (!lecture?.notes) return;
    const blob = new Blob([lecture.notes.content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${lecture.title}-notes.txt`;
    a.click();
  };

  if (!lecture) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center text-gray-400">
        <div className="text-5xl mb-3 animate-pulse">🎓</div>
        <p>Loading lecture...</p>
      </div>
    </div>
  );

  // Split cards: plain Q&A vs MCQ
  const allCards = lecture.flashcards || [];
  const flashcards = allCards.filter(c => { try { return JSON.parse(c.answer)?.type !== 'mcq'; } catch { return true; } });
  const mcqs = allCards.filter(c => { try { return JSON.parse(c.answer)?.type === 'mcq'; } catch { return false; } });

  const tabs = [
    { key: 'notes',       label: '📝 Notes' },
    { key: 'flashcards',  label: '🃏 Flashcards', count: flashcards.length },
    { key: 'mcq',         label: '🧠 MCQ Quiz',   count: mcqs.length },
    { key: 'glossary',    label: '📖 Glossary' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link to="/library" className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-6">
        ← Back to Library
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{lecture.title}</h1>
            <span className="inline-block mt-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
              {lecture.subject?.split(' ')[0]}
            </span>
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${
            lecture.status === 'ready'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            lecture.status === 'failed' ? 'bg-red-50 text-red-600 border-red-200' :
            'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {lecture.status === 'ready' ? '✓ Ready' : lecture.status === 'failed' ? '✗ Failed' : '⏳ Processing'}
          </span>
        </div>
      </div>

      {/* Processing */}
      {lecture.status !== 'ready' && lecture.status !== 'failed' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">⚙️</div>
          <p className="font-semibold text-amber-800">Processing your lecture...</p>
          <p className="text-sm text-amber-600 mt-1">Transcribing and generating content. Takes ~30–60 seconds.</p>
          <div className="mt-4 flex justify-center gap-1">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
          </div>
        </div>
      )}

      {lecture.status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">❌</div>
          <p className="font-semibold text-red-800">Processing failed</p>
          <p className="text-sm text-red-500 mt-1">Please try uploading again.</p>
        </div>
      )}

      {/* Content */}
      {lecture.status === 'ready' && (
        <div>
          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map(t => (
              <button key={t.key} onClick={() => {
                setTab(t.key);
                if (t.key === 'glossary' && !glossaryLoaded) {
                  api.get(`/glossary/${id}`).then(({ data }) => {
                    setGlossary(data.glossary || []);
                    setGlossaryLoaded(true);
                  }).catch(console.error);
                }
              }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
              </button>
            ))}
          </div>

          {/* Flashcards tab */}
          {tab === 'flashcards' && (
            flashcards.length === 0
              ? <p className="text-center text-gray-400 py-10">No flashcards available. Re-upload to generate.</p>
              : <FlashCard card={flashcards[fcIndex]} index={fcIndex} total={flashcards.length}
                  onPrev={() => setFcIndex(i => Math.max(0, i - 1))}
                  onNext={() => setFcIndex(i => Math.min(flashcards.length - 1, i + 1))}
                />
          )}

          {/* MCQ tab */}
          {tab === 'mcq' && (
            <MCQSection mcqs={mcqs} />
          )}

          {/* Notes tab */}
          {tab === 'notes' && (
            <div className="grid gap-6 items-start" style={{ gridTemplateColumns: '70% 30%' }}>
              {/* Notes */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">📝 Lecture Notes</h2>
                {!lecture.notes
                  ? <p className="text-center text-gray-400 py-6">No notes available.</p>
                  : <>
                      <div className="prose prose-indigo max-w-none text-sm
                        prose-headings:font-bold prose-headings:text-gray-900
                        prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                        prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-h3:text-indigo-700
                        prose-p:text-gray-700 prose-p:leading-relaxed
                        prose-li:text-gray-700 prose-li:leading-relaxed
                        prose-strong:text-gray-900 prose-strong:font-semibold
                      ">
                        <ReactMarkdown>{lecture.notes.content}</ReactMarkdown>
                      </div>
                      <button onClick={downloadNotes}
                        className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                        ⬇️ Download as .txt
                      </button>
                    </>
                }
              </div>

              {/* Chat */}
              <div className="sticky top-24">
                <LectureChat lectureId={id} />
              </div>
            </div>
          )}
          {/* Glossary tab */}
          {tab === 'glossary' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">📖 Key Terms & Glossary</h2>
              {!glossaryLoaded ? (
                <p className="text-center text-gray-400 py-6">Loading glossary...</p>
              ) : glossary.length === 0 ? (
                <p className="text-center text-gray-400 py-6">No glossary available. Re-upload this lecture to generate one.</p>
              ) : (
                <div className="space-y-3">
                  {glossary.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {item.term?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.term}</p>
                        <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{item.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
